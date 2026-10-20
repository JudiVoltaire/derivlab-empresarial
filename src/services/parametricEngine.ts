// Motor de Modelado Paramétrico y Cinemática Inversa para DerivLab
// Proporciona evaluación analítica viva, generación de LaTeX y cálculo inverso desde la geometría cartesiana

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
 * Evalúa numéricamente f(x) dados los coeficientes paramétricos
 */
export function evaluateParametricFunction(
  problemNumber: number,
  x: number,
  coeffs: ParametricCoefficients
): number {
  const { a, b, c } = coeffs
  switch (problemNumber) {
    case 1:
    case 2:
      // Polinomio Cuadrático: a·x² + b·x + c
      return a * Math.pow(x, 2) + b * x + c
    case 3:
      // Modelo EOQ: a·x + b·x⁻¹ + c
      if (Math.abs(x) < 0.0001) return Infinity
      return a * x + b / x + c
    case 4:
      // Capitalización Continua: a·e^(b·t) + c
      return a * Math.exp(b * x) + c
    default:
      return 0
  }
}

/**
 * Evalúa numéricamente la derivada f'(x)
 */
export function evaluateParametricDerivative(
  problemNumber: number,
  x: number,
  coeffs: ParametricCoefficients
): number {
  const { a, b } = coeffs
  switch (problemNumber) {
    case 1:
    case 2:
      // Derivada Cuadrática: 2a·x + b
      return 2 * a * x + b
    case 3:
      // Derivada EOQ: a - b·x⁻²
      if (Math.abs(x) < 0.0001) return -Infinity
      return a - b / Math.pow(x, 2)
    case 4:
      // Derivada Exponencial: a·b·e^(b·t)
      return a * b * Math.exp(b * x)
    default:
      return 0
  }
}

/**
 * Evalúa numéricamente la segunda derivada f''(x)
 */
export function evaluateParametricSecondDerivative(
  problemNumber: number,
  x: number,
  coeffs: ParametricCoefficients
): number {
  const { a, b } = coeffs
  switch (problemNumber) {
    case 1:
    case 2:
      return 2 * a
    case 3:
      if (Math.abs(x) < 0.0001) return Infinity
      return (2 * b) / Math.pow(x, 3)
    case 4:
      return a * Math.pow(b, 2) * Math.exp(b * x)
    default:
      return 0
  }
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

  if (problemNumber === 1 || problemNumber === 2) {
    // Parabólico: f(v) = a·v² + b·v + c
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
        : `Punto de costo mínimo en ${v}* = ${xStar} certificado por concavidad hacia arriba (${f}'' = ${2 * a} > 0).`,
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
          justification: `Regla de la Constante (Costo Fijo): \\frac{d}{d${v}}[${c}] = 0 (invariante a la producción marginal)`
        }
      ],
      equationSolvingLatex: solvingLatex
    }
  }

  if (problemNumber === 3) {
    // EOQ Harris: C(x) = a·x + b·x⁻¹ + c
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

  // Problema 4: FinTech V(t) = a·e^(b·t) + c
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
 * Cuando el alumno arrastra el vértice/punto crítico V*(x*, y*) en el plano cartesiano,
 * resuelve en tiempo real los coeficientes (a, b, c) exactos.
 */
export function solveInverseKinematics(
  problemNumber: number,
  targetXStar: number,
  targetYStar: number,
  currentCoeffs: ParametricCoefficients
): ParametricCoefficients {
  const { a } = currentCoeffs

  if (problemNumber === 1 || problemNumber === 2) {
    // Para parábolas con curvatura 'a' fija:
    // x* = -b / (2a) => b = -2 * a * x*
    // y* = a*(x*)^2 + b*(x*) + c = -a*(x*)^2 + c => c = y* + a*(x*)^2
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

  if (problemNumber === 3) {
    // Para EOQ: C(x) = a·x + b/x + c con 'a' fija (costo de almacén)
    // x* = sqrt(b/a) => b = a * (x*)^2
    // y* = 2*a*x* + c => c = y* - 2*a*x*
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

  if (problemNumber === 4) {
    // Para Exponencial V(t) = a·e^(b·t) + c
    // Si se arrastra el punto de origen (0, y0): y0 = a + c
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
