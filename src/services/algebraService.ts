import * as math from 'mathjs'
import type { BusinessProblem } from '../types/problem'

export interface DerivativeValidationResult {
  isValid: boolean
  feedback: string
  parsedLatex?: string
  isEquivalent: boolean
  specificError?: 'exponent_not_reduced' | 'constant_not_zero' | 'eoq_wrong_sign' | 'chain_rule_missing_k' | 'syntax_error'
}

/**
 * Normaliza la entrada del estudiante reemplazando símbolos especiales, superíndices
 * y normalizando la variable del problema (ej. q o t a x si fuese necesario o viceversa).
 */
export function sanitizeMathInput(input: string, variableSymbol: string): string {
  let cleaned = input.trim()

  // Reemplazar signos menos tipográficos y espacios invisibles
  cleaned = cleaned.replace(/−/g, '-').replace(/–/g, '-').replace(/×/g, '*').replace(/·/g, '*')
  
  // Reemplazar superíndices comunes
  cleaned = cleaned
    .replace(/⁻²/g, '^-2')
    .replace(/⁻¹/g, '^-1')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')

  // Manejo de e^(...) o e^kt
  cleaned = cleaned.replace(/e\^/g, 'e^')

  // Asegurar que si el alumno usa la variable genérica 'x' en un problema de 'q' o 't', se interprete correctamente
  if (variableSymbol !== 'x' && !cleaned.includes(variableSymbol) && cleaned.includes('x')) {
    cleaned = cleaned.replace(/x/g, variableSymbol)
  }

  return cleaned
}

import type { ParametricCoefficients } from './parametricEngine'
import { evaluateParametricDerivative } from './parametricEngine'

/**
 * Validador simbólico y numérico con mathjs en 5 puntos de control
 * con diagnóstico de errores pedagógicos específicos.
 */
export function validateDerivativeExpression(
  userInput: string,
  problem: BusinessProblem,
  activeCoeffs?: ParametricCoefficients
): DerivativeValidationResult {
  if (!userInput.trim()) {
    return {
      isValid: false,
      feedback: 'Por favor, escribe la expresión de la derivada f\'(' + problem.variableSymbol + ').',
      isEquivalent: false
    }
  }

  const v = problem.variableSymbol
  const sanitized = sanitizeMathInput(userInput, v)

  let userCompiledNode: math.EvalFunction
  try {
    const parsedNode = math.parse(sanitized)
    userCompiledNode = parsedNode.compile()
  } catch {
    return {
      isValid: false,
      feedback: 'Sintaxis no reconocida. Revisa paréntesis, signos y exponentes (ej: -4' + v + ' + 24).',
      isEquivalent: false,
      specificError: 'syntax_error'
    }
  }

  // 1. Puntos de control en el dominio seguro del problema
  const [dMin, dMax] = problem.domain
  const span = dMax - dMin
  const samplePoints: number[] = []
  for (let i = 1; i <= 5; i++) {
    const pt = dMin + (span * i) / 6
    samplePoints.push(Math.round(pt * 100) / 100)
  }

  // 2. Comprobar equivalencia numérica general contra la derivada activa
  let isEquivalent = true
  for (const pt of samplePoints) {
    try {
      const scope: Record<string, number> = { [v]: pt, e: Math.E }
      const userVal = Number(userCompiledNode.evaluate(scope))
      const expectedVal = activeCoeffs 
        ? evaluateParametricDerivative(problem.problemNumber, pt, activeCoeffs)
        : problem.evaluateDerivative(pt)

      if (isNaN(userVal) || !isFinite(userVal) || Math.abs(userVal - expectedVal) > 0.05) {
        isEquivalent = false
        break
      }
    } catch {
      isEquivalent = false
      break
    }
  }

  if (isEquivalent) {
    return {
      isValid: true,
      feedback: '¡Excelente! Tu derivada es algebraicamente exacta.',
      isEquivalent: true
    }
  }

  // 3. DIAGNÓSTICO DE ERRORES PEDAGÓGICOS EXACTOS

  // a) Diagnóstico Problema 3 (EOQ): Signo positivo al derivar x^-1
  if (problem.problemNumber === 3) {
    // Si derivó como 2 + 32/x^2
    try {
      let isPositiveError = true
      for (const pt of samplePoints) {
        const scope: Record<string, number> = { [v]: pt, e: Math.E }
        const userVal = Number(userCompiledNode.evaluate(scope))
        const wrongVal = 2 + 32 / Math.pow(pt, 2)
        if (Math.abs(userVal - wrongVal) > 0.1) {
          isPositiveError = false
          break
        }
      }
      if (isPositiveError || sanitized.includes('+32') || sanitized.includes('+ 32')) {
        return {
          isValid: false,
          feedback: '¡Cuidado con el signo! Al bajar el exponente -1 a multiplicar, el signo del término se vuelve negativo: d/dx(32x⁻¹) = -32x⁻² = -32/x².',
          isEquivalent: false,
          specificError: 'eoq_wrong_sign'
        }
      }
    } catch {}
  }

  // b) Diagnóstico Problema 4 (Exponencial): Olvidó la regla de la cadena (multiplicar por k)
  if (problem.problemNumber === 4) {
    try {
      let forgotK = true
      // Si derivó como 10*e^(0.5t)
      for (const pt of samplePoints) {
        const scope: Record<string, number> = { [v]: pt, e: Math.E }
        const userVal = Number(userCompiledNode.evaluate(scope))
        const unchainedVal = 10 * Math.exp(0.5 * pt)
        if (Math.abs(userVal - unchainedVal) > 0.1) {
          forgotK = false
          break
        }
      }
      if (forgotK) {
        return {
          isValid: false,
          feedback: 'Aplicaste la exponencial, pero olvidaste la Regla de la Cadena: debes multiplicar por la derivada interna del exponente k = 0.5: d/dt[10·e^(0.5t)] = 10·(0.5)·e^(0.5t) = 5·e^(0.5t).',
          isEquivalent: false,
          specificError: 'chain_rule_missing_k'
        }
      }
    } catch {}
  }

  // c) Diagnóstico: Olvidó anular el término constante (costo fijo)
  // En problema 2, si dejó el -27 o +27 en la derivada
  if (sanitized.includes('27') || sanitized.includes('10')) {
    return {
      isValid: false,
      feedback: 'El término independiente representa el costo fijo; como no cambia al variar la producción, su tasa marginal es 0: d/d' + v + '[c] = 0.',
      isEquivalent: false,
      specificError: 'constant_not_zero'
    }
  }

  // d) Diagnóstico: Olvidó restar 1 al exponente (mantuvo el grado 2)
  if (sanitized.includes('^2') || sanitized.includes('²')) {
    if (problem.problemNumber === 1 || problem.problemNumber === 2) {
      return {
        isValid: false,
        feedback: 'Multiplicaste bien por el exponente, pero recuerda restar 1 al grado: d/dx(a·xⁿ) = a·n·xⁿ⁻¹. Una función cuadrática debe derivar en una expresión lineal de primer grado.',
        isEquivalent: false,
        specificError: 'exponent_not_reduced'
      }
    }
  }

  return {
    isValid: false,
    feedback: 'La derivada no coincide con la tasa de cambio esperada. Revisa los coeficientes y las reglas de cada término.',
    isEquivalent: false
  }
}

/**
 * Validador del Paso 3: Punto Crítico x* (y segunda derivada si aplica)
 */
export function validateCriticalDecision(
  inputPoint: number,
  problem: BusinessProblem,
  inputSecondDerivative?: number,
  activeCriticalPoint?: number,
  activeSecondDeriv?: number
): { isValid: boolean; feedback: string } {
  if (isNaN(inputPoint)) {
    return {
      isValid: false,
      feedback: 'Ingresa un valor numérico para el punto óptimo ' + problem.variableSymbol + '*.'
    }
  }

  const targetPoint = activeCriticalPoint !== undefined ? activeCriticalPoint : problem.criticalPoint
  const isPointCorrect = Math.abs(inputPoint - targetPoint) <= 0.05

  if (!isPointCorrect) {
    return {
      isValid: false,
      feedback: `El valor ${inputPoint} no anula la derivada f'(${problem.variableSymbol}). Plantea la ecuación f'(${problem.variableSymbol}*) = 0 y despeja el punto crítico.`
    }
  }

  // En el Problema 2 se exige comprobar la segunda derivada para concavidad
  if (problem.problemNumber === 2) {
    if (inputSecondDerivative === undefined || isNaN(inputSecondDerivative)) {
      return {
        isValid: false,
        feedback: 'En el Problema 2 debes ingresar también el valor de la Segunda Derivada U\'\'(q) para demostrar que la concavidad es negativa (máximo de utilidad).'
      }
    }
    const expectedSecond = activeSecondDeriv !== undefined 
      ? activeSecondDeriv 
      : (problem.evaluateSecondDerivative ? problem.evaluateSecondDerivative(problem.criticalPoint) : -6)

    if (Math.abs(inputSecondDerivative - expectedSecond) > 0.1) {
      return {
        isValid: false,
        feedback: `La segunda derivada U''(q) = ${expectedSecond}. Recuerda que al ser negativa confirma concavidad hacia abajo (máximo estricto).`
      }
    }
  }

  return {
    isValid: true,
    feedback: `¡Punto crítico confirmado! ${problem.optimalInterpretation}`
  }
}

/**
 * 🎲 Generador Dinámico de Problemas Empresariales
 * Crea una nueva variación con números enteros o decimales limpios
 * preservando la misma pedagogía histórica.
 */
export function generateDynamicVariation(baseProblem: BusinessProblem): BusinessProblem {
  const num = baseProblem.problemNumber

  if (num === 1) {
    // Fermat: I(x) = -a*x^2 + b*x con x* = b / (2a) entero
    const possibleX = [4, 5, 6, 7, 8, 9]
    const possibleA = [1, 2, 3]
    const xStar = possibleX[Math.floor(Math.random() * possibleX.length)]
    const a = possibleA[Math.floor(Math.random() * possibleA.length)]
    const b = 2 * a * xStar
    const maxRevenue = a * xStar * xStar

    return {
      ...baseProblem,
      functionLatex: `I(x) = -${a === 1 ? '' : a}x^2 + ${b}x`,
      derivativeLatex: `I'(x) = -${2 * a}x + ${b}`,
      secondDerivativeLatex: `I''(x) = -${2 * a}`,
      criticalPoint: xStar,
      optimalValue: maxRevenue,
      domain: [0, xStar * 2],
      optimalInterpretation: `Fijar el precio en ${xStar} ${baseProblem.variableUnit} genera el Ingreso Total Máximo de ${maxRevenue} ${baseProblem.functionUnit}.`,
      evaluate: (x: number) => -a * Math.pow(x, 2) + b * x,
      evaluateDerivative: (x: number) => -2 * a * x + b,
      evaluateSecondDerivative: () => -2 * a,
      candadoSteps: {
        ...baseProblem.candadoSteps,
        step2: {
          ...baseProblem.candadoSteps.step2,
          terms: [
            { original: `-${a === 1 ? '' : a}x^2`, derivative: `-${2 * a}x`, ruleUsed: `Regla de la potencia: -${a} · 2x = -${2 * a}x` },
            { original: `+${b}x`, derivative: `+${b}`, ruleUsed: `Derivada lineal: ${b} · 1 = ${b}` }
          ],
          expectedDerivativeLatex: `I'(x) = -${2 * a}x + ${b}`
        },
        step3: {
          equationLatex: `I'(x) = 0 \\implies -${2 * a}x + ${b} = 0 \\implies x^* = ${xStar}`,
          criticalPoint: xStar,
          explanation: `Despejando: ${2 * a}x = ${b} ⟹ x* = ${b} / ${2 * a} = ${xStar} ${baseProblem.variableUnit}.`,
          economicResult: `En x* = ${xStar}, el Ingreso Marginal es 0 y el Ingreso Total alcanza ${maxRevenue} ${baseProblem.functionUnit}.`
        }
      }
    }
  }

  if (num === 2) {
    // Cournot: U(q) = -a*q^2 + b*q - c con q* = b / (2a)
    const possibleQ = [3, 4, 5, 6, 7]
    const possibleA = [2, 3, 4]
    const qStar = possibleQ[Math.floor(Math.random() * possibleQ.length)]
    const a = possibleA[Math.floor(Math.random() * possibleA.length)]
    const b = 2 * a * qStar
    const fixedCost = Math.max(10, Math.floor(a * qStar * qStar * 0.4))
    const maxProfit = a * qStar * qStar - fixedCost

    return {
      ...baseProblem,
      functionLatex: `U(q) = -${a}q^2 + ${b}q - ${fixedCost}`,
      derivativeLatex: `U'(q) = -${2 * a}q + ${b}`,
      secondDerivativeLatex: `U''(q) = -${2 * a} < 0`,
      criticalPoint: qStar,
      optimalValue: maxProfit,
      domain: [0, qStar * 2],
      optimalInterpretation: `Producir exactamente ${qStar} ${baseProblem.variableUnit} maximiza la Utilidad Neta en ${maxProfit} ${baseProblem.functionUnit}.`,
      evaluate: (q: number) => -a * Math.pow(q, 2) + b * q - fixedCost,
      evaluateDerivative: (q: number) => -2 * a * q + b,
      evaluateSecondDerivative: () => -2 * a,
      candadoSteps: {
        ...baseProblem.candadoSteps,
        step2: {
          ...baseProblem.candadoSteps.step2,
          terms: [
            { original: `-${a}q^2`, derivative: `-${2 * a}q`, ruleUsed: `Regla de la potencia: -${a} · 2q = -${2 * a}q` },
            { original: `+${b}q`, derivative: `+${b}`, ruleUsed: `Derivada lineal: ${b}` },
            { original: `-${fixedCost}`, derivative: '0', ruleUsed: 'Costo fijo independiente: d/dq[c] = 0' }
          ],
          expectedDerivativeLatex: `U'(q) = -${2 * a}q + ${b}`
        },
        step3: {
          equationLatex: `U'(q) = 0 \\implies -${2 * a}q + ${b} = 0 \\quad \\text{y} \\quad U''(q) = -${2 * a} < 0`,
          criticalPoint: qStar,
          explanation: `Despejando: ${2 * a}q = ${b} ⟹ q* = ${qStar}. Segunda derivada U''(q) = -${2 * a} < 0 confirma el máximo por concavidad.`,
          economicResult: `En q* = ${qStar} ${baseProblem.variableUnit}, la Utilidad Máxima es ${maxProfit} ${baseProblem.functionUnit}.`
        }
      }
    }
  }

  if (num === 3) {
    // EOQ: C(x) = h*x + S*x^-1 + F con x* = sqrt(S/h)
    const possibleX = [3, 4, 5, 6]
    const possibleH = [1, 2, 3]
    const xStar = possibleX[Math.floor(Math.random() * possibleX.length)]
    const h = possibleH[Math.floor(Math.random() * possibleH.length)]
    const s = h * xStar * xStar
    const f = 10 + Math.floor(Math.random() * 5) * 2
    const minCost = 2 * h * xStar + f

    return {
      ...baseProblem,
      functionLatex: `C(x) = ${h === 1 ? '' : h}x + ${s}x^{-1} + ${f}`,
      derivativeLatex: `C'(x) = ${h} - \\frac{${s}}{x^2}`,
      secondDerivativeLatex: `C''(x) = \\frac{${2 * s}}{x^3} > 0`,
      criticalPoint: xStar,
      optimalValue: minCost,
      optimalInterpretation: `Pedir lotes de ${xStar * 100} unidades minimiza el costo logístico a $${minCost},000.`,
      evaluate: (x: number) => h * x + s / x + f,
      evaluateDerivative: (x: number) => h - s / Math.pow(x, 2),
      evaluateSecondDerivative: (x: number) => (2 * s) / Math.pow(x, 3),
      candadoSteps: {
        ...baseProblem.candadoSteps,
        step2: {
          ...baseProblem.candadoSteps.step2,
          terms: [
            { original: `${h === 1 ? '' : h}x`, derivative: `${h}`, ruleUsed: 'Derivada lineal' },
            { original: `${s}x^{-1}`, derivative: `-${s}x^{-2}`, ruleUsed: `Potencia negativa: ${s} · (-1)x⁻² = -${s}x⁻²` },
            { original: `${f}`, derivative: '0', ruleUsed: 'Costo fijo administrativo: d/dx[c] = 0' }
          ],
          expectedDerivativeLatex: `C'(x) = ${h} - \\frac{${s}}{x^2}`
        },
        step3: {
          equationLatex: `C'(x) = 0 \\implies ${h} - \\frac{${s}}{x^2} = 0 \\implies x^2 = \\frac{${s}}{${h}} = ${xStar * xStar} \\implies x^* = ${xStar}`,
          criticalPoint: xStar,
          explanation: `Despejando: x² = ${s}/${h} = ${xStar * xStar} ⟹ x* = ${xStar} (cientos de unidades).`,
          economicResult: `En x* = ${xStar}, el Costo Logístico Total se reduce a su mínimo de $${minCost},000.`
        }
      }
    }
  }

  if (num === 4) {
    // Exponencial: V(t) = P * e^(k*t) con P*k exacto
    const possibleP = [10, 20, 40, 50]
    const possibleK = [0.2, 0.25, 0.5]
    const p = possibleP[Math.floor(Math.random() * possibleP.length)]
    const k = possibleK[Math.floor(Math.random() * possibleK.length)]
    const rateAtZero = Math.round(p * k * 100) / 100

    return {
      ...baseProblem,
      functionLatex: `V(t) = ${p} e^{${k}t}`,
      derivativeLatex: `V'(t) = ${rateAtZero} e^{${k}t}`,
      secondDerivativeLatex: `V''(t) = ${Math.round(rateAtZero * k * 100) / 100} e^{${k}t} > 0`,
      criticalPoint: 0,
      optimalValue: rateAtZero,
      optimalInterpretation: `En t = 0, la tasa instantánea de rendimiento es V'(0) = ${rateAtZero} millones de dólares/año.`,
      evaluate: (t: number) => p * Math.exp(k * t),
      evaluateDerivative: (t: number) => rateAtZero * Math.exp(k * t),
      evaluateSecondDerivative: (t: number) => rateAtZero * k * Math.exp(k * t),
      candadoSteps: {
        ...baseProblem.candadoSteps,
        step2: {
          ...baseProblem.candadoSteps.step2,
          terms: [
            { original: `${p} e^{${k}t}`, derivative: `${p} · (${k}) e^{${k}t} = ${rateAtZero} e^{${k}t}`, ruleUsed: `Regla de la cadena: P · k · e^{kt}` }
          ],
          expectedDerivativeLatex: `V'(t) = ${rateAtZero} e^{${k}t}`
        },
        step3: {
          equationLatex: `V'(0) = ${rateAtZero} e^{${k}(0)} = ${rateAtZero} \\cdot 1 = ${rateAtZero}`,
          criticalPoint: 0,
          explanation: `Evaluando en t = 0: e⁰ = 1, la tasa inicial es exactamente ${rateAtZero} millones de dólares/año.`,
          economicResult: `Aceleración continua del capital a una tasa de crecimiento instantáneo inicial de ${rateAtZero} M$/año.`
        }
      }
    }
  }

  return baseProblem
}
