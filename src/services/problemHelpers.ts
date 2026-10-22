import type { BusinessProblem } from '../types/problem'

/**
 * Obtiene la expresión matemática compatible con mathjs para la función total f(x)
 */
export function getMathjsFormula(problem: BusinessProblem): string {
  const pNum = problem.problemNumber

  switch (pNum) {
    case 1:
      return `${problem.baseCoefficients.c || 150}`
    case 2:
      return `${problem.baseCoefficients.b || 25}*x + ${problem.baseCoefficients.c || 100}`
    case 3:
      return `${problem.baseCoefficients.b || 12}*q + ${problem.baseCoefficients.c || 45}`
    case 4:
      return `${problem.baseCoefficients.a || 3}*t^2`
    case 5:
      return `${problem.baseCoefficients.c || 80} - ${Math.abs(problem.baseCoefficients.a || 2)}*t^2`
    case 6:
      return `-2*x^2 + 24*x`
    case 7:
      return `-3*q^2 + 30*q - 27`
    case 8:
      return `q^2 - 10*q + 40`
    case 9:
      return `-0.5*x^2 + 8*x + 10`
    case 10:
      return `-4*t^2 + 32*t`
    case 11:
      return `-5*p^2 + 50*p - 45`
    case 12:
      return `-2*q^2 + 32*q - 30`
    case 13:
      return `-2*q^2 + 32*q - 20`
    case 14:
      return `-x^3 + 6*x^2 + 15*x`
    case 15:
      return `(1/3)*q^3 - 3*q^2 + 10*q + 12`
    case 16:
      return `-t^3 + 9*t^2`
    case 17:
      return `2*x + 32/x + 10`
    case 18:
      return `3*x + 27/x + 15`
    case 19:
      return `2*q + 8 + 32/q`
    case 20:
      return `10*exp(0.5*t) + 5`
    default: {
      // Extracción automática desde functionLatex si es función personalizada
      if (problem.functionLatex.includes('=')) {
        let raw = problem.functionLatex.split('=')[1].trim()
        raw = raw.replace(/\\tfrac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
        raw = raw.replace(/\\frac\{(\d+)\}\{([a-zA-Z\d^]+)\}/g, '($1/$2)')
        raw = raw.replace(/e\^\{([^}]+)\}/g, 'exp($1)')
        raw = raw.replace(/(\d)([a-zA-Z])/g, '$1*$2')
        return raw
      }
      return 'x'
    }
  }
}

/**
 * Obtiene el punto de tangencia de prueba x₀ adecuado y representativo para cada problema
 */
export function getDefaultTangentPoint(problem: BusinessProblem): number {
  const pNum = problem.problemNumber
  const [minD, maxD] = problem.domain

  switch (pNum) {
    case 1:
      return 5
    case 2:
      return 4
    case 3:
      return 5
    case 4:
      return 3
    case 5:
      return 2
    case 6:
      return 3
    case 7:
      return 2
    case 8:
      return 2
    case 9:
      return 4
    case 10:
      return 2
    case 11:
      return 2.5
    case 12:
      return 4
    case 13:
      return 4
    case 14:
      return 2
    case 15:
      return 2
    case 16:
      return 3
    case 17:
      return 2
    case 18:
      return 1.5
    case 19:
      return 2
    case 20:
      return 2
    default: {
      if (problem.criticalPoint > minD && problem.criticalPoint < maxD) {
        return Math.round((minD + problem.criticalPoint) / 2 * 2) / 2 || 2
      }
      return Math.round((minD + (maxD - minD) * 0.3) * 2) / 2 || 2
    }
  }
}

/**
 * Calcula los límites de cámara cartesianos [minX, maxX, minY, maxY]
 * para que la curva aparezca siempre perfectamente encuadrada y centrada
 */
export function getOptimalCameraBounds(problem: BusinessProblem): {
  minX: number
  maxX: number
  minY: number
  maxY: number
} {
  const [minD, maxD] = problem.domain
  const spanX = maxD - minD
  const marginX = Math.max(1, spanX * 0.1)

  const minX = Math.floor(minD - marginX)
  const maxX = Math.ceil(maxD + marginX)

  // Muestrear valores de y sobre el dominio
  const samples: number[] = []
  const step = spanX / 40
  for (let x = minD; x <= maxD; x += step) {
    const y = problem.evaluate(x)
    if (!isNaN(y) && isFinite(y)) {
      samples.push(y)
    }
  }

  if (samples.length === 0) {
    return { minX, maxX, minY: -10, maxY: 100 }
  }

  let yMin = Math.min(...samples)
  let yMax = Math.max(...samples)

  // Si es función constante (ej. P1 = 150)
  if (Math.abs(yMax - yMin) < 0.001) {
    return {
      minX,
      maxX,
      minY: Math.floor(Math.min(0, yMin - 30)),
      maxY: Math.ceil(yMax + 50)
    }
  }

  const spanY = yMax - yMin
  const marginY = Math.max(5, spanY * 0.2)

  return {
    minX,
    maxX,
    minY: Math.floor(Math.min(0, yMin - marginY)),
    maxY: Math.ceil(yMax + marginY)
  }
}
