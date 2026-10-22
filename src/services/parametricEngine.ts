// Motor de Modelado Paramétrico y Cinemática Inversa para DerivLab
// Proporciona evaluación analítica viva, generación de LaTeX y cálculo inverso desde la geometría cartesiana
// Compatible con el banco de 20 problemas empresariales (Nivel I a IV)

export interface ParametricCoefficients {
  a: number
  b: number
  c: number
}

export interface ParametricMeta {
  aLabel: string
  aUnit: string
  aMin: number
  aMax: number
  aStep: number
  
  bLabel: string
  bUnit: string
  bMin: number
  bMax: number
  bStep: number

  cLabel: string
  cUnit: string
  cMin: number
  cMax: number
  cStep: number
}

export interface DynamicAnalysis {
  functionLatex: string
  derivativeLatex: string
  secondDerivativeLatex: string
  criticalPoint: number
  optimalValue: number
  isMaximum: boolean
  economicDescription: string
  termsBreakdown: {
    term: string
    derivative: string
    justification: string
  }[]
  equationSolvingLatex: string
}

/**
 * Evalúa numéricamente f(x) dados los coeficientes paramétricos para los 20 problemas
 */
export function evaluateParametricFunction(
  problemNumber: number,
  x: number,
  coeffs: ParametricCoefficients
): number {
  const { a, b, c } = coeffs

  // P1: Constante C(q) = c
  if (problemNumber === 1) {
    return c
  }

  // P2, P3: Lineal f(x) = b·x + c
  if (problemNumber === 2 || problemNumber === 3) {
    return b * x + c
  }

  // P4..P13: Cuadráticas f(x) = a·x² + b·x + c
  if (problemNumber >= 4 && problemNumber <= 13) {
    return a * Math.pow(x, 2) + b * x + c
  }

  // P14: Cúbica P(x) = a·x³ + b·x² + c·x
  if (problemNumber === 14) {
    return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x
  }

  // P15: Cúbica de Costo C(q) = (a/3)·q³ + b·q² + c·q + 12
  if (problemNumber === 15) {
    return (a / 3) * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + 12
  }

  // P16: Cúbica de Ventas V(t) = a·t³ + b·t² + c
  if (problemNumber === 16) {
    return a * Math.pow(x, 3) + b * Math.pow(x, 2) + c
  }

  // P17, P18: EOQ Logístico C(x) = a·x + b/x + c
  if (problemNumber === 17 || problemNumber === 18) {
    if (Math.abs(x) < 0.0001) return Infinity
    return a * x + b / x + c
  }

  // P19: Costo Medio C̄(q) = a·q + b + c/q
  if (problemNumber === 19) {
    if (Math.abs(x) < 0.0001) return Infinity
    return a * x + b + c / x
  }

  // P20: Capitalización Continua V(t) = a·e^(b·t) + c
  if (problemNumber === 20) {
    return a * Math.exp(b * x) + c
  }

  // Por defecto (modelo cuadrático estándar)
  return a * Math.pow(x, 2) + b * x + c
}

/**
 * Evalúa numéricamente la derivada f'(x)
 */
export function evaluateParametricDerivative(
  problemNumber: number,
  x: number,
  coeffs: ParametricCoefficients
): number {
  const { a, b, c } = coeffs

  // P1: Constante -> Derivada 0
  if (problemNumber === 1) {
    return 0
  }

  // P2, P3: Lineal -> Derivada b
  if (problemNumber === 2 || problemNumber === 3) {
    return b
  }

  // P4..P13: Cuadráticas -> 2a·x + b
  if (problemNumber >= 4 && problemNumber <= 13) {
    return 2 * a * x + b
  }

  // P14: Cúbica -> 3a·x² + 2b·x + c
  if (problemNumber === 14) {
    return 3 * a * Math.pow(x, 2) + 2 * b * x + c
  }

  // P15: Cúbica de Costo -> a·x² + 2b·x + c
  if (problemNumber === 15) {
    return a * Math.pow(x, 2) + 2 * b * x + c
  }

  // P16: Cúbica de Ventas -> 3a·t² + 2b·t
  if (problemNumber === 16) {
    return 3 * a * Math.pow(x, 2) + 2 * b * x
  }

  // P17, P18: EOQ -> a - b/x²
  if (problemNumber === 17 || problemNumber === 18) {
    if (Math.abs(x) < 0.0001) return -Infinity
    return a - b / Math.pow(x, 2)
  }

  // P19: Costo Medio -> a - c/q²
  if (problemNumber === 19) {
    if (Math.abs(x) < 0.0001) return -Infinity
    return a - c / Math.pow(x, 2)
  }

  // P20: Exponencial -> a·b·e^(b·t)
  if (problemNumber === 20) {
    return a * b * Math.exp(b * x)
  }

  return 2 * a * x + b
}

/**
 * Evalúa numéricamente la segunda derivada f''(x)
 */
export function evaluateParametricSecondDerivative(
  problemNumber: number,
  x: number,
  coeffs: ParametricCoefficients
): number {
  const { a, b, c } = coeffs

  if (problemNumber === 1 || problemNumber === 2 || problemNumber === 3) {
    return 0
  }

  if (problemNumber >= 4 && problemNumber <= 13) {
    return 2 * a
  }

  if (problemNumber === 14) {
    return 6 * a * x + 2 * b
  }

  if (problemNumber === 15) {
    return 2 * a * x + 2 * b
  }

  if (problemNumber === 16) {
    return 6 * a * x + 2 * b
  }

  if (problemNumber === 17 || problemNumber === 18) {
    if (Math.abs(x) < 0.0001) return Infinity
    return (2 * b) / Math.pow(x, 3)
  }

  if (problemNumber === 19) {
    if (Math.abs(x) < 0.0001) return Infinity
    return (2 * c) / Math.pow(x, 3)
  }

  if (problemNumber === 20) {
    return a * Math.pow(b, 2) * Math.exp(b * x)
  }

  return 2 * a
}

/**
 * Genera el análisis dinámico completo en KaTeX y punto crítico
 */
export function analyzeParametricModel(
  problemNumber: number,
  coeffs: ParametricCoefficients,
  variableSymbol: string,
  functionSymbol: string
): DynamicAnalysis {
  const { a, b, c } = coeffs
  const v = variableSymbol
  const f = functionSymbol

  const formatSign = (val: number, isFirst: boolean = false): string => {
    if (isFirst) {
      if (val === 1) return ''
      if (val === -1) return '-'
      return `${val}`
    }
    if (val > 0) return `+ ${val === 1 ? '' : val}`
    if (val < 0) return `- ${Math.abs(val) === 1 ? '' : Math.abs(val)}`
    return '+ 0'
  }

  // P1: Costo Fijo Constante
  if (problemNumber === 1) {
    return {
      functionLatex: `${f}(${v}) = ${c}`,
      derivativeLatex: `${f}'(${v}) = 0`,
      secondDerivativeLatex: `${f}''(${v}) = 0`,
      criticalPoint: 0,
      optimalValue: c,
      isMaximum: false,
      economicDescription: `La función es constante con valor ${c}. Su derivada es idénticamente 0 en todo el dominio: ningún cambio en ${v} altera el costo fijo.`,
      termsBreakdown: [
        {
          term: `${c}`,
          derivative: '0',
          justification: `Regla de la Constante: \\frac{d}{d${v}}[${c}] = 0 (invarianza al volumen)`
        }
      ],
      equationSolvingLatex: `${f}'(${v}) = 0 \\quad \\forall ${v}`
    }
  }

  // P2, P3: Lineal
  if (problemNumber === 2 || problemNumber === 3) {
    const cStr = c !== 0 ? formatSign(c) : ''
    return {
      functionLatex: `${f}(${v}) = ${b}${v} ${cStr}`.trim(),
      derivativeLatex: `${f}'(${v}) = ${b}`,
      secondDerivativeLatex: `${f}''(${v}) = 0`,
      criticalPoint: 0,
      optimalValue: c,
      isMaximum: false,
      economicDescription: `Función lineal con tasa de variación constante ${b}. Cada unidad adicional de ${v} genera exactamente ${b} unidades de cambio marginal.`,
      termsBreakdown: [
        {
          term: `${b}${v}`,
          derivative: `${b}`,
          justification: `Derivada Lineal: \\frac{d}{d${v}}[${b}${v}] = ${b}`
        },
        {
          term: `${c}`,
          derivative: '0',
          justification: `Regla de la Constante: \\frac{d}{d${v}}[${c}] = 0`
        }
      ],
      equationSolvingLatex: `${f}'(${v}) = ${b} \\text{ (constante)}`
    }
  }

  // P4..P13: Cuadráticas
  if (problemNumber >= 4 && problemNumber <= 13) {
    const xStar = a !== 0 ? Math.round((-b / (2 * a)) * 100) / 100 : 0
    const yStar = Math.round((a * Math.pow(xStar, 2) + b * xStar + c) * 100) / 100
    const isMax = a < 0

    const aStr = a === 1 ? '' : a === -1 ? '-' : `${a}`
    const bStr = b !== 0 ? `${formatSign(b)} ${v}` : ''
    const cStr = c !== 0 ? `${formatSign(c)}` : ''
    const funcLatex = `${f}(${v}) = ${aStr}${v}^2 ${bStr} ${cStr}`.trim()

    const derivA = 2 * a
    const derivAStr = derivA === 1 ? '' : derivA === -1 ? '-' : `${derivA}`
    const derivBStr = b !== 0 ? `${formatSign(b)}` : ''
    const derivLatex = `${f}'(${v}) = ${derivAStr}${v} ${derivBStr}`.trim()
    const secondDerivLatex = `${f}''(${v}) = ${2 * a}`

    const solvingLatex = `${f}'(${v}^*) = 0 \\implies ${derivA}${v}^* ${formatSign(b)} = 0 \\implies ${v}^* = -\\frac{${b}}{${2 * a}} = ${xStar}`

    return {
      functionLatex: funcLatex,
      derivativeLatex: derivLatex,
      secondDerivativeLatex: secondDerivLatex,
      criticalPoint: xStar,
      optimalValue: yStar,
      isMaximum: isMax,
      economicDescription: isMax
        ? `Condición de Primer Orden verificada en ${v}* = ${xStar}. Por el Criterio de la Segunda Derivada (${f}'' = ${2 * a} < 0), la concavidad estricta hacia abajo certifica un Óptimo Global de ${yStar} unidades monetarias.`
        : `Punto de costo o gasto mínimo en ${v}* = ${xStar} certificado por concavidad hacia arriba (${f}'' = ${2 * a} > 0) con valor ${yStar}.`,
      termsBreakdown: [
        {
          term: `${aStr}${v}^2`,
          derivative: `${derivAStr}${v}`,
          justification: `Regla de la Potencia: \\frac{d}{d${v}}[${a}${v}^2] = ${a} \\cdot 2${v} = ${derivA}${v}`
        },
        {
          term: `${bStr || '0'}`,
          derivative: `${b}`,
          justification: `Derivada Lineal: \\frac{d}{d${v}}[${b}${v}] = ${b}`
        },
        {
          term: `${cStr || '0'}`,
          derivative: '0',
          justification: `Regla de la Constante: \\frac{d}{d${v}}[${c}] = 0 (invariante a la producción marginal)`
        }
      ],
      equationSolvingLatex: solvingLatex
    }
  }

  // P14, P15, P16: Cúbicas
  if (problemNumber === 14 || problemNumber === 15 || problemNumber === 16) {
    if (problemNumber === 14) {
      // P(x) = -x³ + 6x² + 15x
      const xStar = 5
      const yStar = 100
      return {
        functionLatex: `${f}(${v}) = -${v}^3 + 6${v}^2 + 15${v}`,
        derivativeLatex: `${f}'(${v}) = -3${v}^2 + 12${v} + 15`,
        secondDerivativeLatex: `${f}''(${v}) = -6${v} + 12`,
        criticalPoint: xStar,
        optimalValue: yStar,
        isMaximum: true,
        economicDescription: `Máximo relativo de beneficio en ${v}* = 5 con ${yStar} k u.m. Verificación por concavidad: ${f}''(5) = -18 < 0.`,
        termsBreakdown: [
          { term: `-${v}^3`, derivative: `-3${v}^2`, justification: `Regla de la Potencia: \\frac{d}{d${v}}[-${v}^3] = -3${v}^2` },
          { term: `6${v}^2`, derivative: `12${v}`, justification: `Regla de la Potencia: \\frac{d}{d${v}}[6${v}^2] = 12${v}` },
          { term: `15${v}`, derivative: `15`, justification: `Derivada Lineal: \\frac{d}{d${v}}[15${v}] = 15` }
        ],
        equationSolvingLatex: `-3${v}^2 + 12${v} + 15 = 0 \\implies (${v}-5)(${v}+1) = 0 \\implies ${v}^* = 5`
      }
    }

    if (problemNumber === 15) {
      // C(q) = (1/3)q³ - 3q² + 10q + 12
      return {
        functionLatex: `${f}(${v}) = \\tfrac{1}{3}${v}^3 - 3${v}^2 + 10${v} + 12`,
        derivativeLatex: `${f}'(${v}) = ${v}^2 - 6${v} + 10`,
        secondDerivativeLatex: `${f}''(${v}) = 2${v} - 6`,
        criticalPoint: 3,
        optimalValue: 21,
        isMaximum: false,
        economicDescription: `Mínimo de costo marginal en ${v} = 3 con ${f}'(3) = 1 k u.m./lote. En este punto la aceleración de costos se anula (${f}'' = 0).`,
        termsBreakdown: [
          { term: `\\tfrac{1}{3}${v}^3`, derivative: `${v}^2`, justification: `Regla de la Potencia: \\frac{d}{d${v}}[\\tfrac{1}{3}${v}^3] = ${v}^2` },
          { term: `-3${v}^2`, derivative: `-6${v}`, justification: `Regla de la Potencia: \\frac{d}{d${v}}[-3${v}^2] = -6${v}` },
          { term: `10${v}`, derivative: `10`, justification: `Derivada Lineal: \\frac{d}{d${v}}[10${v}] = 10` }
        ],
        equationSolvingLatex: `${f}''(${v}) = 2${v} - 6 = 0 \\implies ${v} = 3`
      }
    }

    // P16: V(t) = -t³ + 9t²
    return {
      functionLatex: `${f}(${v}) = -${v}^3 + 9${v}^2`,
      derivativeLatex: `${f}'(${v}) = -3${v}^2 + 18${v}`,
      secondDerivativeLatex: `${f}''(${v}) = -6${v} + 18`,
      criticalPoint: 6,
      optimalValue: 108,
      isMaximum: true,
      economicDescription: `Pico de ventas en ${v}* = 6 con 108 M u.m. Punto de inflexión y aceleración máxima en ${v} = 3 con ${f}'(3) = 27 M/trim.`,
      termsBreakdown: [
        { term: `-${v}^3`, derivative: `-3${v}^2`, justification: `Regla de la Potencia: \\frac{d}{d${v}}[-${v}^3] = -3${v}^2` },
        { term: `9${v}^2`, derivative: `18${v}`, justification: `Regla de la Potencia: \\frac{d}{d${v}}[9${v}^2] = 18${v}` }
      ],
      equationSolvingLatex: `-3${v}^2 + 18${v} = 0 \\implies -3${v}(${v} - 6) = 0 \\implies ${v}^* = 6`
    }
  }

  // P17, P18: EOQ
  if (problemNumber === 17 || problemNumber === 18) {
    const xStar = a > 0 && b > 0 ? Math.round(Math.sqrt(b / a) * 100) / 100 : 1
    const yStar = Math.round((a * xStar + b / xStar + c) * 100) / 100

    const aStr = a === 1 ? '' : `${a}`
    const funcLatex = `${f}(${v}) = ${aStr}${v} + \\frac{${b}}{${v}} ${c !== 0 ? formatSign(c) : ''}`
    const derivLatex = `${f}'(${v}) = ${a} - \\frac{${b}}{${v}^2}`
    const secondDerivLatex = `${f}''(${v}) = \\frac{${2 * b}}{${v}^3} > 0`
    const solvingLatex = `${f}'(${v}^*) = 0 \\implies ${a} - \\frac{${b}}{(${v}^*)^2} = 0 \\implies (${v}^*)^2 = \\frac{${b}}{${a}} \\implies ${v}^* = ${xStar}`

    return {
      functionLatex: funcLatex,
      derivativeLatex: derivLatex,
      secondDerivativeLatex: secondDerivLatex,
      criticalPoint: xStar,
      optimalValue: yStar,
      isMaximum: false,
      economicDescription: `Equilibrio del Lote Económico en ${v}* = ${xStar}. En este punto exacto, el costo unitario de transporte iguala al costo unitario de almacenamiento, minimizando el costo logístico total a $${yStar}k.`,
      termsBreakdown: [
        {
          term: `${aStr}${v}`,
          derivative: `${a}`,
          justification: `Costo directo de almacenamiento: \\frac{d}{d${v}}[${a}${v}] = ${a}`
        },
        {
          term: `${b}${v}^{-1}`,
          derivative: `-${b}${v}^{-2}`,
          justification: `Potencias Negativas: \\frac{d}{d${v}}[${b}${v}^{-1}] = ${b} \\cdot (-1)${v}^{-2} = -\\frac{${b}}{${v}^2}`
        },
        {
          term: `${c}`,
          derivative: '0',
          justification: `Gastos fijos administrativos: \\frac{d}{d${v}}[${c}] = 0`
        }
      ],
      equationSolvingLatex: solvingLatex
    }
  }

  // P19: Costo Medio
  if (problemNumber === 19) {
    const qStar = a > 0 && c > 0 ? Math.round(Math.sqrt(c / a) * 100) / 100 : 4
    const yStar = Math.round((a * qStar + b + c / qStar) * 100) / 100
    return {
      functionLatex: `\\bar{${f}}(${v}) = ${a}${v} + ${b} + \\frac{${c}}{${v}}`,
      derivativeLatex: `\\bar{${f}}'(${v}) = ${a} - \\frac{${c}}{${v}^2}`,
      secondDerivativeLatex: `\\bar{${f}}''(${v}) = \\frac{${2 * c}}{${v}^3} > 0`,
      criticalPoint: qStar,
      optimalValue: yStar,
      isMaximum: false,
      economicDescription: `El Costo Medio se minimiza en ${v}* = ${qStar} con valor ${yStar} u.m./u. En este punto coincide exactamente con el Costo Marginal: C̄(${qStar}) = CMg(${qStar}).`,
      termsBreakdown: [
        { term: `${a}${v}`, derivative: `${a}`, justification: `Derivada lineal: \\frac{d}{d${v}}[${a}${v}] = ${a}` },
        { term: `${b}`, derivative: '0', justification: `Constante: \\frac{d}{d${v}}[${b}] = 0` },
        { term: `${c}${v}^{-1}`, derivative: `-${c}${v}^{-2}`, justification: `Potencia negativa: \\frac{d}{d${v}}[${c}${v}^{-1}] = -\\frac{${c}}{${v}^2}` }
      ],
      equationSolvingLatex: `\\bar{${f}}'(${v}^*) = 0 \\implies ${a} = \\frac{${c}}{(${v}^*)^2} \\implies ${v}^* = \\sqrt{\\frac{${c}}{${a}}} = ${qStar}`
    }
  }

  // P20: Capitalización Continua
  const rateAtZero = Math.round(a * b * 100) / 100
  const yZero = Math.round((a + c) * 100) / 100
  const funcLatex = `${f}(${v}) = ${a} e^{${b}${v}} ${c !== 0 ? formatSign(c) : ''}`
  const derivLatex = `${f}'(${v}) = ${rateAtZero} e^{${b}${v}}`
  const secondDerivLatex = `${f}''(${v}) = ${Math.round(rateAtZero * b * 100) / 100} e^{${b}${v}} > 0`
  const solvingLatex = `${f}'(0) = ${a} \\cdot (${b}) e^{0} = ${rateAtZero} \\text{ M\\$/año}`

  return {
    functionLatex: funcLatex,
    derivativeLatex: derivLatex,
    secondDerivativeLatex: secondDerivLatex,
    criticalPoint: 0,
    optimalValue: yZero,
    isMaximum: false,
    economicDescription: `En el instante de origen ${v} = 0, la velocidad instantánea de creación de valor es ${rateAtZero} M$/año sobre un capital base de $${yZero}M. La convexidad estricta (${f}'' > 0) certifica aceleración de rendimientos continuos.`,
    termsBreakdown: [
      {
        term: `${a} e^{${b}${v}}`,
        derivative: `${rateAtZero} e^{${b}${v}}`,
        justification: `Regla de la Cadena Exponencial: \\frac{d}{d${v}}[a e^{k${v}}] = a \\cdot k e^{k${v}} = ${a} \\cdot ${b} e^{${b}${v}} = ${rateAtZero} e^{${b}${v}}`
      },
      {
        term: `${c !== 0 ? c : '0'}`,
        derivative: '0',
        justification: `Término de capital autónomo fijo: \\frac{d}{d${v}}[c] = 0`
      }
    ],
    equationSolvingLatex: solvingLatex
  }
}

/**
 * CINEMÁTICA INVERSA (Del Gráfico al Parámetro):
 */
export function solveInverseKinematics(
  problemNumber: number,
  targetXStar: number,
  targetYStar: number,
  currentCoeffs: ParametricCoefficients
): ParametricCoefficients {
  const { a } = currentCoeffs

  if (problemNumber >= 4 && problemNumber <= 13) {
    const cleanX = Math.round(targetXStar * 2) / 2
    const cleanY = Math.round(targetYStar)
    const newB = Math.round(-2 * a * cleanX)
    const newC = Math.round(cleanY + a * Math.pow(cleanX, 2))

    return {
      a,
      b: newB,
      c: newC
    }
  }

  if (problemNumber === 17 || problemNumber === 18) {
    const cleanX = Math.max(1, Math.round(targetXStar * 2) / 2)
    const cleanY = Math.round(targetYStar)
    const newB = Math.round(a * Math.pow(cleanX, 2))
    const newC = Math.round(cleanY - 2 * a * cleanX)

    return {
      a,
      b: Math.max(1, newB),
      c: newC
    }
  }

  if (problemNumber === 19) {
    const cleanX = Math.max(1, Math.round(targetXStar * 2) / 2)
    const cleanY = Math.round(targetYStar)
    const newC = Math.round(a * Math.pow(cleanX, 2))
    const newB = Math.round(cleanY - 2 * a * cleanX)
    return {
      a,
      b: newB,
      c: Math.max(1, newC)
    }
  }

  if (problemNumber === 20) {
    const cleanY = Math.round(targetYStar)
    const newA = Math.max(1, cleanY - currentCoeffs.c)
    return {
      a: newA,
      b: currentCoeffs.b,
      c: currentCoeffs.c
    }
  }

  return currentCoeffs
}
