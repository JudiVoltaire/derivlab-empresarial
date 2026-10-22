// Banco de 20 Problemas Empresariales — DerivLab Empresarial
// Organizados en 4 niveles de dificultad, con contexto exclusivamente de empresa:
// finanzas, costos, ingresos, logística, producción y microeconomía.

import type { BusinessProblem } from '../types/problem'

// ============================================================
// NIVEL I — MUY SIMPLES (Constantes, Lineales, Potencia Básica)
// ============================================================

const P1: BusinessProblem = {
  id: 'p1',
  problemNumber: 1,
  romanNumeral: 'I',
  title: 'P1 · Alquiler Corporativo Fijo',
  era: 'Microeconomía Básica',
  year: 'Nivel I',
  protagonist: 'División de Facilities',
  story: 'Una empresa de consultoría alquila una oficina corporativa por un costo mensual completamente fijo de 150 u.m., independientemente del número de consultores q activos ese mes. La dirección financiera solicita el análisis diferencial de esta estructura de costos para entender por qué el costo marginal es nulo.',
  economicConcept: 'Derivada de una función constante — Costo Fijo',
  difficulty: 'Nivel I',
  level: 'I',
  variableSymbol: 'q',
  variableLabel: 'Número de Consultores Activos',
  variableUnit: 'consultores',
  functionSymbol: 'C',
  functionName: 'Función de Costo Fijo',
  functionUnit: 'u.m.',
  baseCoefficients: { a: 0, b: 0, c: 150 },
  parametricMeta: {
    aLabel: 'Coeficiente Cuadrático',
    aUnit: '', aMin: 0, aMax: 0, aStep: 1,
    bLabel: 'Coeficiente Lineal',
    bUnit: '', bMin: 0, bMax: 0, bStep: 1,
    cLabel: 'Costo Fijo Mensual (c)',
    cUnit: 'u.m.', cMin: 50, cMax: 300, cStep: 10,
  },
  functionLatex: "C(q) = 150",
  derivativeLatex: "C'(q) = 0",
  criticalPoint: 0,
  optimalValue: 150,
  optimalInterpretation: 'El costo marginal C\'(q) = 0 confirma que ningún consultor adicional incrementa el alquiler: la función es constante sobre todo el dominio.',
  domain: [0, 20],
  evaluate: () => 150,
  evaluateDerivative: () => 0,
  evaluateSecondDerivative: () => 0,
  candadoSteps: {
    step1: {
      question: 'Para derivar C(q) = 150, ¿qué axioma de diferenciación aplica directamente?',
      options: [
        { id: 'const', label: 'Regla de la Constante: d/dq[c] = 0 para todo valor fijo c', latex: '\\frac{d}{dq}[c] = 0', isCorrect: true, explanation: 'Correcto. El costo fijo no varía con la producción; su derivada es idénticamente cero.' },
        { id: 'pot', label: 'Regla de la Potencia con exponente 1', latex: '\\frac{d}{dq}[q] = 1', isCorrect: false, explanation: 'Incorrecto. No existe ninguna variable q en la expresión; la función es constante.' },
        { id: 'lin', label: 'Derivada del término lineal bq', latex: 'b', isCorrect: false, explanation: 'Incorrecto. No hay un término lineal; la función solo contiene el escalar 150.' }
      ],
      hint: 'Una constante nunca cambia: su tasa de variación instantánea siempre es cero.'
    },
    step2: {
      prompt: 'Diferencia el único término de C(q) = 150:',
      terms: [{ original: '150', derivative: '0', ruleUsed: 'Regla de la Constante: d/dq[c] = 0' }],
      expectedDerivativeLatex: "C'(q) = 0",
      hint: "C'(q) = 0 — el costo marginal del alquiler fijo es siempre cero."
    },
    step3: {
      equationLatex: "C'(q) = 0 \\text{ (identidad: válida para todo } q \\text{)}",
      criticalPoint: 0,
      explanation: 'La derivada es cero en todo el dominio. La curva C(q) = 150 es una recta horizontal paralela al eje q.',
      economicResult: 'Interpretación empresarial: contratar un consultor adicional no incrementa el alquiler. El costo marginal del espacio físico es nulo.'
    }
  },
  poeHypothesis: {
    id: 'poe-p1',
    question: 'Si el gerente duplica el alquiler mensual a c = 300 u.m., ¿qué ocurre con el costo marginal C\'(q)?',
    context: 'Variación del parámetro de costo fijo en una función constante.',
    targetParameter: 'c',
    options: [
      { id: 'a', label: 'El costo marginal C\'(q) también se duplica y pasa a 2.', isCorrect: false, explanation: 'Incorrecto. La derivada de cualquier constante, sea 150 o 300, sigue siendo cero.' },
      { id: 'b', label: "C'(q) permanece igual a 0, pues la derivada de toda constante es cero.", isCorrect: true, explanation: 'Exacto. d/dq[300] = 0. El nivel absoluto del costo fijo no altera su derivada.' },
      { id: 'c', label: 'C\'(q) se hace negativa porque el gasto es mayor.', isCorrect: false, explanation: 'Incorrecto. El signo de la derivada depende de la tasa de variación, no del nivel de la función.' }
    ],
    observePrompt: 'Ajusta el deslizador c y observa cómo la recta horizontal sube, pero su derivada (recta sobre el eje) permanece en y = 0.',
    scientificExplanation: 'Invarianza de la derivada respecto al nivel: d/dq[c + k] = d/dq[c] para toda constante k. Los costos fijos son irrelevantes en la decisión marginal.'
  }
}

const P2: BusinessProblem = {
  id: 'p2',
  problemNumber: 2,
  romanNumeral: 'II',
  title: 'P2 · Suscripciones SaaS B2B',
  era: 'Economía Digital',
  year: 'Nivel I',
  protagonist: 'Startup de Software Empresarial',
  story: 'Una startup SaaS cobra a sus clientes corporativos I(x) = 25x + 100 unidades monetarias por período, donde x es el número de módulos contratados y 100 u.m. representa la cuota de acceso a la plataforma base. El área de ventas necesita determinar el ingreso marginal por cada módulo adicional para fijar la política de descuentos por volumen.',
  economicConcept: 'Derivada Lineal — Ingreso Marginal Constante',
  difficulty: 'Nivel I',
  level: 'I',
  variableSymbol: 'x',
  variableLabel: 'Módulos SaaS Contratados',
  variableUnit: 'módulos',
  functionSymbol: 'I',
  functionName: 'Función de Ingreso por Suscripción',
  functionUnit: 'u.m./período',
  baseCoefficients: { a: 0, b: 25, c: 100 },
  parametricMeta: {
    aLabel: 'Coeficiente Cuadrático',
    aUnit: '', aMin: 0, aMax: 0, aStep: 1,
    bLabel: 'Precio por Módulo (b)',
    bUnit: 'u.m./módulo', bMin: 10, bMax: 50, bStep: 5,
    cLabel: 'Cuota de Acceso Base (c)',
    cUnit: 'u.m.', cMin: 0, cMax: 200, cStep: 10,
  },
  functionLatex: "I(x) = 25x + 100",
  derivativeLatex: "I'(x) = 25",
  criticalPoint: 0,
  optimalValue: 100,
  optimalInterpretation: "I'(x) = 25 u.m./módulo: cada módulo adicional genera exactamente 25 u.m. de ingreso marginal constante.",
  domain: [0, 20],
  evaluate: (x: number) => 25 * x + 100,
  evaluateDerivative: () => 25,
  evaluateSecondDerivative: () => 0,
  candadoSteps: {
    step1: {
      question: 'Para I(x) = bx + c, ¿qué regla de diferenciación aplica al término lineal bx?',
      options: [
        { id: 'lin', label: 'Derivada del término lineal: d/dx[bx] = b (constante)', latex: '\\frac{d}{dx}[bx] = b', isCorrect: true, explanation: 'Correcto. La pendiente de una función lineal es constante e igual al coeficiente b.' },
        { id: 'pot2', label: 'Regla de la Potencia con n=2: 2bx', isCorrect: false, explanation: 'Incorrecto. El exponente de x es 1, no 2. La derivada de x¹ es 1·x⁰ = 1.' },
        { id: 'zero', label: 'La derivada es cero porque la función crece linealmente.', isCorrect: false, explanation: 'Incorrecto. La derivada de cero corresponde solo a funciones constantes, no a funciones lineales no nulas.' }
      ],
      hint: 'd/dx[bx] = b. La pendiente de una recta es siempre constante.'
    },
    step2: {
      prompt: 'Diferencia término a término I(x) = 25x + 100:',
      terms: [
        { original: '25x', derivative: '25', ruleUsed: 'Derivada lineal: d/dx[25x] = 25' },
        { original: '100', derivative: '0', ruleUsed: 'Regla de la constante: d/dx[100] = 0' }
      ],
      expectedDerivativeLatex: "I'(x) = 25",
      hint: "Suma las derivadas de cada término: 25 + 0 = 25."
    },
    step3: {
      equationLatex: "I'(x) = 25 \\text{ (pendiente constante para todo } x)",
      criticalPoint: 0,
      explanation: 'La función de ingreso es lineal; su derivada es la constante 25 en todo el dominio. No existe punto crítico interior.',
      economicResult: 'Cada módulo SaaS adicional aporta exactamente 25 u.m. de ingreso marginal. La política de precios es neutral al volumen.'
    }
  },
  poeHypothesis: {
    id: 'poe-p2',
    question: '¿Qué cambio en los parámetros alterará el ingreso marginal I\'(x)?',
    context: 'Análisis de sensibilidad paramétrica en una función de ingreso lineal.',
    targetParameter: 'b',
    options: [
      { id: 'a', label: 'Aumentar la cuota base c de 100 a 150 u.m.', isCorrect: false, explanation: 'Incorrecto. La cuota base c es un término constante; su derivada es cero y no afecta el ingreso marginal.' },
      { id: 'b', label: 'Incrementar el precio por módulo b de 25 a 35 u.m.', isCorrect: true, explanation: 'Correcto. I\'(x) = b. Modificar b cambia directamente la pendiente y, por tanto, el ingreso marginal.' },
      { id: 'c', label: 'Ningún cambio afecta el ingreso marginal de una función lineal.', isCorrect: false, explanation: 'Incorrecto. Cambiar b sí modifica la derivada.' }
    ],
    observePrompt: 'Mueve el deslizador b y observa cómo la línea de ingreso cambia de pendiente, mientras que mover c solo desplaza la recta verticalmente sin cambiar su inclinación.',
    scientificExplanation: 'En una función lineal I(x) = bx + c, solo el coeficiente directriz b determina el ingreso marginal. El término independiente c (costo de entrada) no contribuye a la tasa de variación.'
  }
}

const P3: BusinessProblem = {
  id: 'p3',
  problemNumber: 3,
  romanNumeral: 'III',
  title: 'P3 · Costo de Producción Lineal (Manufactura)',
  era: 'Economía Industrial',
  year: 'Nivel I',
  protagonist: 'Gerencia de Producción',
  story: 'Una planta manufacturera modela su costo operativo mediante C(q) = 12q + 45, donde q es el número de unidades producidas por turno y 45 u.m. representa los gastos fijos de mantenimiento del turno. La gerencia de producción analiza el costo marginal para tomar decisiones de expansión de capacidad.',
  economicConcept: 'Costo Marginal Constante — Función de Costo Lineal',
  difficulty: 'Nivel I',
  level: 'I',
  variableSymbol: 'q',
  variableLabel: 'Unidades Producidas por Turno',
  variableUnit: 'unidades',
  functionSymbol: 'C',
  functionName: 'Función de Costo Operativo',
  functionUnit: 'u.m./turno',
  baseCoefficients: { a: 0, b: 12, c: 45 },
  parametricMeta: {
    aLabel: 'Coeficiente Cuadrático',
    aUnit: '', aMin: 0, aMax: 0, aStep: 1,
    bLabel: 'Costo Variable por Unidad (b)',
    bUnit: 'u.m./unidad', bMin: 5, bMax: 25, bStep: 1,
    cLabel: 'Costo Fijo de Turno (c)',
    cUnit: 'u.m.', cMin: 0, cMax: 100, cStep: 5,
  },
  functionLatex: "C(q) = 12q + 45",
  derivativeLatex: "C'(q) = 12",
  criticalPoint: 0,
  optimalValue: 45,
  optimalInterpretation: "C'(q) = 12 u.m./unidad: cada unidad producida adicional incrementa el costo en exactamente 12 u.m.",
  domain: [0, 20],
  evaluate: (q: number) => 12 * q + 45,
  evaluateDerivative: () => 12,
  evaluateSecondDerivative: () => 0,
  candadoSteps: {
    step1: {
      question: 'C(q) = 12q + 45 es una función lineal. ¿Qué representa su derivada C\'(q)?',
      options: [
        { id: 'cm', label: 'El costo marginal: la variación del costo total por cada unidad adicional producida.', latex: "C'(q) = \\frac{\\Delta C}{\\Delta q} \\to 12", isCorrect: true, explanation: 'Correcto. La derivada de un costo lineal es exactamente el costo marginal constante, igual al coeficiente directriz b = 12.' },
        { id: 'cf', label: 'El costo fijo total de la planta.', isCorrect: false, explanation: 'Incorrecto. El costo fijo es c = 45. La derivada mide tasas de variación, no niveles absolutos.' },
        { id: 'zero', label: 'Cero, porque la función no tiene mínimo ni máximo.', isCorrect: false, explanation: 'Incorrecto. La derivada de una función lineal bq es b, no cero.' }
      ],
      hint: 'La pendiente de una recta es constante y mide cuánto crece el costo por cada unidad adicional.'
    },
    step2: {
      prompt: 'Diferencia término a término C(q) = 12q + 45:',
      terms: [
        { original: '12q', derivative: '12', ruleUsed: 'Derivada lineal: d/dq[12q] = 12' },
        { original: '45', derivative: '0', ruleUsed: 'Regla de la constante: d/dq[45] = 0' }
      ],
      expectedDerivativeLatex: "C'(q) = 12",
      hint: "La suma de las derivadas: 12 + 0 = 12."
    },
    step3: {
      equationLatex: "C'(q) = 12 \\text{ u.m./unidad (constante en todo el dominio)}",
      criticalPoint: 0,
      explanation: 'No existe punto crítico interior. La función de costo es estrictamente creciente con pendiente uniforme.',
      economicResult: 'Decisión empresarial: producir una unidad adicional siempre cuesta 12 u.m. extra. El costo marginal es constante e independiente del volumen de producción.'
    }
  },
  poeHypothesis: {
    id: 'poe-p3',
    question: 'Si los costos variables por unidad suben de b = 12 a b = 18 (por encarecimiento de materias primas), ¿qué cambio se observará en C(q) y en C\'(q)?',
    context: 'Impacto de un shock de costos variables en la función de costo lineal.',
    targetParameter: 'b',
    options: [
      { id: 'a', label: 'C(q) se desplaza verticalmente sin cambiar pendiente; C\'(q) permanece igual.', isCorrect: false, explanation: 'Incorrecto. Cambiar b modifica la pendiente de C(q), no solo su posición vertical.' },
      { id: 'b', label: 'C(q) se vuelve más inclinada y C\'(q) aumenta de 12 a 18 u.m./unidad.', isCorrect: true, explanation: 'Correcto. La pendiente de la recta de costo es b, por lo que C\'(q) = 18 tras el incremento.' },
      { id: 'c', label: 'Solo cambia el costo fijo; C\'(q) no varía.', isCorrect: false, explanation: 'Incorrecto. El costo fijo es c = 45. La variación en b afecta directamente a la derivada.' }
    ],
    observePrompt: 'Incrementa el deslizador b y observa cómo la pendiente de la recta de costo aumenta, encareciendo cada unidad adicional producida.',
    scientificExplanation: 'En C(q) = bq + c, la derivada C\'(q) = b es la pendiente de la recta. Un encarecimiento de materias primas (b mayor) eleva el costo marginal y reduce la rentabilidad por unidad adicional.'
  }
}

// ============================================================
// NIVEL II — SIMPLES (Cuadráticas: Máximo y Mínimo)
// ============================================================

const P4: BusinessProblem = {
  id: 'p4',
  problemNumber: 4,
  romanNumeral: 'IV',
  title: 'P4 · Depreciación de Maquinaria (Curva Acelerada)',
  era: 'Contabilidad de Activos',
  year: 'Nivel II',
  protagonist: 'Departamento de Activos Fijos',
  story: 'El departamento de activos fijos estima que el desgaste acumulado de una prensa industrial sigue D(t) = 3t², donde t es el tiempo en años desde su adquisición. Se requiere la tasa marginal de depreciación para calcular las provisiones contables anuales y decidir el momento óptimo de reemplazo.',
  economicConcept: 'Derivada de Potencia Cuadrática — Tasa Marginal de Depreciación',
  difficulty: 'Nivel II',
  level: 'II',
  variableSymbol: 't',
  variableLabel: 'Años desde Adquisición',
  variableUnit: 'años',
  functionSymbol: 'D',
  functionName: 'Función de Depreciación Acumulada',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: 3, b: 0, c: 0 },
  parametricMeta: {
    aLabel: 'Tasa de Depreciación Acelerada (a)',
    aUnit: 'k u.m./año²', aMin: 1, aMax: 8, aStep: 0.5,
    bLabel: 'Depreciación Lineal (b)',
    bUnit: 'k u.m./año', bMin: 0, bMax: 0, bStep: 1,
    cLabel: 'Valor Residual Inicial (c)',
    cUnit: 'k u.m.', cMin: 0, cMax: 0, cStep: 1,
  },
  functionLatex: "D(t) = 3t^2",
  derivativeLatex: "D'(t) = 6t",
  criticalPoint: 0,
  optimalValue: 0,
  optimalInterpretation: "D'(t) = 6t: la tasa marginal de depreciación crece linealmente. En t = 5 años, la tasa es 30 k u.m./año.",
  domain: [0, 10],
  evaluate: (t: number) => 3 * Math.pow(t, 2),
  evaluateDerivative: (t: number) => 6 * t,
  evaluateSecondDerivative: () => 6,
  candadoSteps: {
    step1: {
      question: 'Para D(t) = 3t², ¿qué regla de diferenciación aplica?',
      options: [
        { id: 'pot', label: 'Regla de la Potencia: d/dt[atⁿ] = a·n·tⁿ⁻¹. Con n=2: d/dt[3t²] = 3·2·t = 6t', latex: '\\frac{d}{dt}[3t^2] = 6t', isCorrect: true, explanation: 'Correcto. Se multiplica el coeficiente 3 por el exponente 2 y se resta 1 al grado.' },
        { id: 'lin', label: 'Derivada del término lineal: la función no tiene exponente.', isCorrect: false, explanation: 'Incorrecto. El exponente de t es 2, no 1.' },
        { id: 'const', label: 'Regla de la constante: 3 es un escalar fijo.', isCorrect: false, explanation: 'Incorrecto. La función tiene la variable t elevada al cuadrado. La regla de la constante aplica a términos sin variable.' }
      ],
      hint: 'Multiplica el coeficiente (3) por el exponente (2) y resta 1 al grado.'
    },
    step2: {
      prompt: 'Aplica la Regla de la Potencia a D(t) = 3t²:',
      terms: [{ original: '3t^2', derivative: '6t', ruleUsed: 'Regla de la potencia: d/dt[3t²] = 3·2·t^(2-1) = 6t' }],
      expectedDerivativeLatex: "D'(t) = 6t",
      hint: "D'(t) = 3 · 2 · t^(2-1) = 6t"
    },
    step3: {
      equationLatex: "D'(t) = 6t \\quad \\Rightarrow \\quad D'(5) = 30 \\text{ k u.m./año}",
      criticalPoint: 0,
      explanation: 'La tasa de depreciación crece con el tiempo. No hay máximo en el dominio positivo; la función es estrictamente creciente y convexa.',
      economicResult: 'A los 5 años, la prensa se deprecia 30 k u.m. por año adicional de uso. La convexidad indica aceleración del desgaste.'
    }
  },
  poeHypothesis: {
    id: 'poe-p4',
    question: 'Si se duplica la tasa de depreciación (a pasa de 3 a 6), ¿cómo cambia la tasa marginal D\'(t)?',
    context: 'Análisis de sensibilidad del coeficiente cuadrático en la función de depreciación.',
    targetParameter: 'a',
    options: [
      { id: 'a', label: 'La tasa marginal D\'(t) también se duplica: pasa de 6t a 12t.', isCorrect: true, explanation: 'Correcto. D\'(t) = 2at. Si a=6, entonces D\'(t) = 12t.' },
      { id: 'b', label: 'La tasa marginal permanece igual; solo cambia el nivel de la curva.', isCorrect: false, explanation: 'Incorrecto. El coeficiente a entra en la derivada como factor 2a.' },
      { id: 'c', label: 'La tasa marginal D\'(t) disminuye porque el activo pierde valor más rápido.', isCorrect: false, explanation: 'Incorrecto. Una depreciación más acelerada implica una derivada mayor, no menor.' }
    ],
    observePrompt: 'Incrementa el parámetro a y observa cómo la parábola se vuelve más empinada y la derivada en cada punto aumenta.',
    scientificExplanation: 'D\'(t) = 2at. El coeficiente a es un factor directo de la tasa marginal; duplicarlo duplica la pendiente de la función de depreciación.'
  }
}

const P5: BusinessProblem = {
  id: 'p5',
  problemNumber: 5,
  romanNumeral: 'V',
  title: 'P5 · Depreciación de Flota Vehicular',
  era: 'Gestión de Activos',
  year: 'Nivel II',
  protagonist: 'Gerencia de Logística',
  story: 'La gerencia de logística de una empresa distribuidora modela el valor residual de su flota de camiones mediante V(t) = 80 - 2t², donde t es el número de años en servicio y 80 k u.m. es el valor de adquisición. Se necesita determinar cuándo la tasa de pérdida de valor es máxima y cuándo el activo debe renovarse.',
  economicConcept: 'Función Cuadrática Decreciente — Punto de Valor Cero',
  difficulty: 'Nivel II',
  level: 'II',
  variableSymbol: 't',
  variableLabel: 'Años en Servicio',
  variableUnit: 'años',
  functionSymbol: 'V',
  functionName: 'Función de Valor Residual',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: -2, b: 0, c: 80 },
  parametricMeta: {
    aLabel: 'Tasa de Pérdida de Valor (a)',
    aUnit: 'k u.m./año²', aMin: -5, aMax: -1, aStep: 0.5,
    bLabel: 'Coeficiente Lineal (b)',
    bUnit: '', bMin: 0, bMax: 0, bStep: 1,
    cLabel: 'Valor de Adquisición (c)',
    cUnit: 'k u.m.', cMin: 40, cMax: 120, cStep: 5,
  },
  functionLatex: "V(t) = 80 - 2t^2",
  derivativeLatex: "V'(t) = -4t",
  criticalPoint: 0,
  optimalValue: 80,
  optimalInterpretation: "V'(t) = -4t. La tasa de pérdida de valor aumenta linealmente. En t = 0 el vehículo está en su máximo valor de 80 k u.m.",
  domain: [0, 6],
  evaluate: (t: number) => 80 - 2 * Math.pow(t, 2),
  evaluateDerivative: (t: number) => -4 * t,
  evaluateSecondDerivative: () => -4,
  candadoSteps: {
    step1: {
      question: 'V(t) = 80 - 2t². ¿Qué regla aplica al término -2t²?',
      options: [
        { id: 'pot', label: 'Regla de la Potencia: d/dt[-2t²] = -2·2·t = -4t', latex: '\\frac{d}{dt}[-2t^2] = -4t', isCorrect: true, explanation: 'Correcto. La regla se aplica independientemente del signo del coeficiente.' },
        { id: 'c', label: 'Regla de la constante, porque 80 es el término más visible.', isCorrect: false, explanation: 'Incorrecto. Se aplica la regla de la constante a 80, pero la derivada del término -2t² es -4t, no cero.' },
        { id: 'neg', label: 'La derivada de -2t² es positiva porque hay un signo negativo.', isCorrect: false, explanation: 'Incorrecto. El signo negativo se conserva: d/dt[-2t²] = -4t.' }
      ],
      hint: 'Ignora el signo al contar el proceso; aplica la regla y conserva el signo al final.'
    },
    step2: {
      prompt: 'Diferencia término a término V(t) = 80 - 2t²:',
      terms: [
        { original: '80', derivative: '0', ruleUsed: 'Regla de la constante: d/dt[80] = 0' },
        { original: '-2t^2', derivative: '-4t', ruleUsed: 'Regla de la potencia: d/dt[-2t²] = -4t' }
      ],
      expectedDerivativeLatex: "V'(t) = -4t",
      hint: "V'(t) = 0 + (-4t) = -4t"
    },
    step3: {
      equationLatex: "V'(t^*) = 0 \\implies -4t^* = 0 \\implies t^* = 0",
      criticalPoint: 0,
      explanation: 'El máximo de valor ocurre en t* = 0 (momento de la compra). Luego la función es estrictamente decreciente: el vehículo pierde valor cada año.',
      economicResult: 'La flota alcanza valor cero en t = √40 ≈ 6.3 años. La tasa de pérdida acelera: a los 5 años se pierde 20 k u.m./año.'
    }
  },
  poeHypothesis: {
    id: 'poe-p5',
    question: 'Si se adquiere un modelo de vehículo superior con c = 120 k u.m. pero la misma tasa a = -2, ¿cuándo se deprecia completamente?',
    context: 'Efecto del valor inicial en el horizonte de vida útil del activo.',
    targetParameter: 'c',
    options: [
      { id: 'a', label: 'En el mismo momento (t ≈ 6.3 años), porque la tasa de depreciación no cambia.', isCorrect: false, explanation: 'Incorrecto. El valor cero ocurre en t = √(c/2). Con c = 120: t = √60 ≈ 7.7 años.' },
      { id: 'b', label: 'Más tarde, aproximadamente a los 7.7 años, porque el valor inicial es mayor.', isCorrect: true, explanation: 'Correcto. V(t) = 0 implica t² = c/2 = 60, es decir t ≈ 7.7 años.' },
      { id: 'c', label: 'Antes, porque un activo más caro tiene mayor desgaste relativo.', isCorrect: false, explanation: 'Incorrecto. La tasa de desgaste a permanece igual; solo cambia el punto de partida.' }
    ],
    observePrompt: 'Modifica c y observa cómo la parábola se desplaza hacia arriba, extendiendo el tiempo hasta que cruza el eje t.',
    scientificExplanation: 'El cruce con el eje (valor cero) ocurre cuando c = at², es decir t = √(c/a). El valor inicial c determina la vida útil del activo pero no su tasa de depreciación marginal.'
  }
}

const P6: BusinessProblem = {
  id: 'p6',
  problemNumber: 6,
  romanNumeral: 'VI',
  title: 'P6 · Ingreso Total y Optimización de Precio (e-Commerce)',
  era: 'Siglo XVII — Fermat',
  year: '1637',
  protagonist: 'Pierre de Fermat',
  story: 'Modelo clásico de relación inversa entre precio y demanda en un canal de e-commerce: I(x) = -2x² + 24x, donde x es el precio unitario. Determinar el precio óptimo x* que maximiza el ingreso total.',
  economicConcept: 'Condición de Primer Orden f\'(x*) = 0 — Ingreso Marginal',
  difficulty: 'Nivel II',
  level: 'II',
  variableSymbol: 'x',
  variableLabel: 'Precio Unitario de Venta',
  variableUnit: 'u.m.',
  functionSymbol: 'I',
  functionName: 'Función de Ingreso Total',
  functionUnit: 'u.m.',
  baseCoefficients: { a: -2, b: 24, c: 0 },
  parametricMeta: {
    aLabel: 'Coeficiente de Elasticidad Cuadrática (a)',
    aUnit: 'u.m./precio²', aMin: -4, aMax: -1, aStep: 0.5,
    bLabel: 'Precio Máximo Marginal de Entrada (b)',
    bUnit: 'u.m./precio', bMin: 12, bMax: 36, bStep: 2,
    cLabel: 'Ingreso Autónomo Fijo (c)',
    cUnit: 'u.m.', cMin: -10, cMax: 10, cStep: 1
  },
  functionLatex: "I(x) = -2x^2 + 24x",
  derivativeLatex: "I'(x) = -4x + 24",
  secondDerivativeLatex: "I''(x) = -4",
  concavityAnalysis: { value: -4, isConcaveDown: true, meaning: "I''(x) = -4 < 0: concavidad hacia abajo certifica Máximo Global." },
  criticalPoint: 6,
  optimalValue: 72,
  optimalInterpretation: 'x* = 6.00 u.m. maximiza el ingreso total en 72.00 u.m.',
  domain: [0, 12],
  evaluate: (x: number) => -2 * Math.pow(x, 2) + 24 * x,
  evaluateDerivative: (x: number) => -4 * x + 24,
  evaluateSecondDerivative: () => -4,
  candadoSteps: {
    step1: {
      question: 'Para I(x) = ax² + bx + c, ¿cuál es la regla aplicable al término cuadrático?',
      options: [
        { id: 'potencia', label: 'Regla de la Potencia: d/dx[axⁿ] = a·n·xⁿ⁻¹ combinada con la Regla de la Suma', latex: '\\frac{d}{dx}[a x^n] = a \\cdot n x^{n-1}', isCorrect: true, explanation: 'Correcto. Cada término polinómico se diferencia reduciendo su exponente en una unidad.' },
        { id: 'cociente', label: 'Regla del Cociente', isCorrect: false, explanation: 'Incorrecto. La función es un polinomio de segundo grado, no un cociente.' },
        { id: 'cadena', label: 'Diferenciación de funciones trascendentes', isCorrect: false, explanation: 'Incorrecto. No existen bases trascendentes en esta función.' }
      ],
      hint: 'Multiplica el coeficiente por el exponente 2 y resta 1 al grado.'
    },
    step2: {
      prompt: 'Diferencia término a término I(x) = -2x² + 24x:',
      terms: [
        { original: '-2x^2', derivative: '-4x', ruleUsed: 'Regla de la potencia: d/dx[-2x²] = -4x' },
        { original: '24x', derivative: '24', ruleUsed: 'Derivada lineal: d/dx[24x] = 24' }
      ],
      expectedDerivativeLatex: "I'(x) = -4x + 24",
      hint: "I'(x) = 2a·x + b = -4x + 24."
    },
    step3: {
      equationLatex: "I'(x^*) = 0 \\implies -4x^* + 24 = 0 \\implies x^* = 6",
      criticalPoint: 6,
      explanation: 'x* = -b/(2a) = -24/(-4) = 6.00',
      economicResult: 'Fijar el precio en x* = 6 u.m. maximiza el ingreso total en 72 u.m.'
    }
  },
  poeHypothesis: {
    id: 'poe-p6',
    question: 'Si modificas únicamente el término constante c, ¿qué ocurrirá con el precio óptimo x*?',
    context: 'Invarianza de la Condición de Primer Orden frente a desplazamientos verticales.',
    targetParameter: 'c',
    options: [
      { id: 'a', label: 'x* aumentará porque el ingreso global disponible es mayor.', isCorrect: false, explanation: 'Incorrecto. La derivada del término constante es cero; no altera la raíz.' },
      { id: 'b', label: "x* permanecerá exactamente inalterado, porque d/dx[c] = 0.", isCorrect: true, explanation: 'Correcto. La derivada de c es cero; la ecuación I\'(x) = 0 no depende de c.' },
      { id: 'c', label: 'x* se reducirá para mantener el equilibrio de mercado.', isCorrect: false, explanation: 'Incorrecto. El término fijo no cambia la sensibilidad marginal.' }
    ],
    observePrompt: 'Modifica c y observa cómo el vértice V* sube o baja, pero su coordenada horizontal x* se mantiene fija.',
    scientificExplanation: 'Toda traslación vertical preserva la función derivada. Los ingresos fijos no alteran el punto de equilibrio marginal.'
  }
}

const P7: BusinessProblem = {
  id: 'p7',
  problemNumber: 7,
  romanNumeral: 'VII',
  title: 'P7 · Utilidad Neta — Planta de Ensamble (Cournot-Marshall)',
  era: 'Siglo XIX',
  year: '1838–1890',
  protagonist: 'Augustin Cournot y Alfred Marshall',
  story: 'U(q) = -3q² + 30q - 27 modela la utilidad neta de una planta de ensamble industrial, donde q son los lotes de producción y 27 k£ es el costo fijo de operación. Determinar el volumen óptimo q* y demostrar el máximo mediante la segunda derivada.',
  economicConcept: 'Criterio de la Segunda Derivada (U\'\' < 0) — Óptimo de Producción',
  difficulty: 'Nivel II',
  level: 'II',
  variableSymbol: 'q',
  variableLabel: 'Nivel de Producción Agregada',
  variableUnit: 'lotes',
  functionSymbol: 'U',
  functionName: 'Función de Utilidad Neta',
  functionUnit: 'k£',
  baseCoefficients: { a: -3, b: 30, c: -27 },
  parametricMeta: {
    aLabel: 'Penalización por Deseconomías de Escala (a)',
    aUnit: 'k£/lote²', aMin: -5, aMax: -1, aStep: 0.5,
    bLabel: 'Margen de Contribución Variable (b)',
    bUnit: 'k£/lote', bMin: 16, bMax: 44, bStep: 2,
    cLabel: 'Costo Fijo de Operación de Planta (c)',
    cUnit: 'k£', cMin: -50, cMax: -10, cStep: 1
  },
  functionLatex: "U(q) = -3q^2 + 30q - 27",
  derivativeLatex: "U'(q) = -6q + 30",
  secondDerivativeLatex: "U''(q) = -6 < 0",
  concavityAnalysis: { value: -6, isConcaveDown: true, meaning: "U''(q) = -6 < 0 garantiza Máximo Estricto de Utilidad." },
  criticalPoint: 5,
  optimalValue: 48,
  optimalInterpretation: 'q* = 5 lotes maximiza la utilidad neta en 48 k£.',
  domain: [0, 10],
  evaluate: (q: number) => -3 * Math.pow(q, 2) + 30 * q - 27,
  evaluateDerivative: (q: number) => -6 * q + 30,
  evaluateSecondDerivative: () => -6,
  candadoSteps: {
    step1: {
      question: '¿Cómo se demuestra que q* = 5 es un Máximo y no un Mínimo?',
      options: [
        { id: 'seg', label: 'Criterio de la Segunda Derivada: U\'\'(q) = 2a. Si 2a < 0, la concavidad es hacia abajo (Máximo).', latex: "U''(q) = 2a < 0 \\Rightarrow \\text{Máximo}", isCorrect: true, explanation: 'Correcto. U\'\'(q) = -6 < 0 certifica Máximo Estricto.' },
        { id: 'val', label: 'Porque U(5) = 48 es el mayor valor posible en el dominio.', isCorrect: false, explanation: 'Incorrecto como método general; para ello se requiere el criterio analítico de la segunda derivada.' },
        { id: 'graf', label: 'Observando que la gráfica tiene forma de campana (parábola cóncava arriba).', isCorrect: false, explanation: 'Incorrecto en sentido técnico. Una parábola cóncava hacia arriba tiene un mínimo, no un máximo.' }
      ],
      hint: 'Si U\'\'(q*) < 0, la concavidad hacia abajo garantiza que el punto crítico es un Máximo.'
    },
    step2: {
      prompt: 'Diferencia U(q) = -3q² + 30q - 27:',
      terms: [
        { original: '-3q^2', derivative: '-6q', ruleUsed: 'Regla de la potencia: d/dq[-3q²] = -6q' },
        { original: '30q', derivative: '30', ruleUsed: 'Derivada lineal: d/dq[30q] = 30' },
        { original: '-27', derivative: '0', ruleUsed: 'Regla de la constante: d/dq[-27] = 0' }
      ],
      expectedDerivativeLatex: "U'(q) = -6q + 30",
      hint: "U'(q) = -6q + 30."
    },
    step3: {
      equationLatex: "U'(q^*) = 0 \\implies -6q^* + 30 = 0 \\implies q^* = 5",
      criticalPoint: 5,
      explanation: 'q* = -b/(2a) = -30/(-6) = 5. La segunda derivada U\'\'(q*) = -6 < 0 certifica el máximo.',
      economicResult: 'Producir exactamente q* = 5 lotes genera la Utilidad Máxima de 48 k£.'
    }
  },
  poeHypothesis: {
    id: 'poe-p7',
    question: 'Si el costo fijo de planta sube (c más negativo), ¿cambia el volumen óptimo q*?',
    context: 'Invarianza de la Condición de Primer Orden ante cambios en costos fijos.',
    targetParameter: 'c',
    options: [
      { id: 'a', label: 'Sí, q* disminuye porque la empresa produce menos ante costos mayores.', isCorrect: false, explanation: 'Incorrecto. U\'(q) = -6q + 30 no depende de c. La derivada del término fijo es cero.' },
      { id: 'b', label: 'No, q* permanece en 5 lotes. Solo cambia el nivel de utilidad máxima.', isCorrect: true, explanation: 'Correcto. d/dq[c] = 0. Los costos fijos son irrelevantes para la decisión de producción óptima.' },
      { id: 'c', label: 'q* aumenta para compensar el mayor costo fijo con más producción.', isCorrect: false, explanation: 'Incorrecto. La decisión marginal depende de la derivada, que no contiene c.' }
    ],
    observePrompt: 'Mueve el deslizador c (más negativo) y observa cómo la parábola desciende sin que el vértice se desplace horizontalmente.',
    scientificExplanation: 'Los costos fijos son irrelevantes para las decisiones marginales de corto plazo: solo afectan el nivel de beneficio, no el volumen óptimo de producción.'
  }
}

const P8: BusinessProblem = {
  id: 'p8',
  problemNumber: 8,
  romanNumeral: 'VIII',
  title: 'P8 · Costo Unitario Mínimo (Textil)',
  era: 'Economía de la Producción',
  year: 'Nivel II',
  protagonist: 'Planta Textil Industrial',
  story: 'Una planta textil estima su función de costo unitario promedio en C(q) = q² - 10q + 40, donde q es el volumen de producción en miles de metros. La gerencia necesita determinar el volumen q* que minimiza el costo por metro producido para optimizar la eficiencia productiva.',
  economicConcept: 'Minimización de Costo — Condición de Primer Orden f\'(q*) = 0',
  difficulty: 'Nivel II',
  level: 'II',
  variableSymbol: 'q',
  variableLabel: 'Volumen de Producción',
  variableUnit: 'miles de metros',
  functionSymbol: 'C',
  functionName: 'Función de Costo Unitario Promedio',
  functionUnit: 'u.m./metro',
  baseCoefficients: { a: 1, b: -10, c: 40 },
  parametricMeta: {
    aLabel: 'Coeficiente de Ineficiencia Escalar (a)',
    aUnit: 'u.m./m³', aMin: 0.5, aMax: 3, aStep: 0.5,
    bLabel: 'Reducción por Economías de Escala (b)',
    bUnit: 'u.m./m²', bMin: -15, bMax: -5, bStep: 1,
    cLabel: 'Costo Fijo Unitario (c)',
    cUnit: 'u.m./m', cMin: 20, cMax: 60, cStep: 5,
  },
  functionLatex: "C(q) = q^2 - 10q + 40",
  derivativeLatex: "C'(q) = 2q - 10",
  secondDerivativeLatex: "C''(q) = 2 > 0",
  concavityAnalysis: { value: 2, isConcaveDown: false, meaning: "C''(q) = 2 > 0: concavidad hacia arriba certifica Mínimo de Costo." },
  criticalPoint: 5,
  optimalValue: 15,
  optimalInterpretation: 'q* = 5 miles de metros minimiza el costo unitario en 15 u.m./metro.',
  domain: [0, 10],
  evaluate: (q: number) => Math.pow(q, 2) - 10 * q + 40,
  evaluateDerivative: (q: number) => 2 * q - 10,
  evaluateSecondDerivative: () => 2,
  candadoSteps: {
    step1: {
      question: 'C\'\'(q) = 2 > 0. ¿Qué implica esto sobre el punto crítico?',
      options: [
        { id: 'min', label: 'El Criterio de la Segunda Derivada: C\'\'(q*) > 0 implica concavidad hacia arriba, es decir, un Mínimo de Costo.', latex: "C''(q^*) > 0 \\Rightarrow \\text{Mínimo}", isCorrect: true, explanation: 'Correcto. La parábola abre hacia arriba y el punto crítico es el costo mínimo.' },
        { id: 'max', label: 'C\'\'(q*) > 0 implica un Máximo, porque la derivada es positiva.', isCorrect: false, explanation: 'Incorrecto. El signo positivo de la segunda derivada indica Mínimo, no Máximo.' },
        { id: 'inf', label: 'C\'\'(q*) > 0 indica un punto de inflexión sin extremo.', isCorrect: false, explanation: 'Incorrecto. Un punto de inflexión requiere que la segunda derivada cambie de signo; aquí es constante y positiva.' }
      ],
      hint: 'Si la segunda derivada es positiva, la parábola abre hacia arriba: el punto crítico es un mínimo.'
    },
    step2: {
      prompt: 'Diferencia C(q) = q² - 10q + 40:',
      terms: [
        { original: 'q^2', derivative: '2q', ruleUsed: 'Regla de la potencia: d/dq[q²] = 2q' },
        { original: '-10q', derivative: '-10', ruleUsed: 'Derivada lineal: d/dq[-10q] = -10' },
        { original: '40', derivative: '0', ruleUsed: 'Regla de la constante: d/dq[40] = 0' }
      ],
      expectedDerivativeLatex: "C'(q) = 2q - 10",
      hint: "C'(q) = 2q - 10."
    },
    step3: {
      equationLatex: "C'(q^*) = 0 \\implies 2q^* - 10 = 0 \\implies q^* = 5",
      criticalPoint: 5,
      explanation: 'q* = 10/2 = 5. C\'\'(5) = 2 > 0 confirma mínimo.',
      economicResult: 'Producir q* = 5 mil metros minimiza el costo unitario en C(5) = 15 u.m./metro. Producir menos o más es menos eficiente.'
    }
  },
  poeHypothesis: {
    id: 'poe-p8',
    question: 'Si el coeficiente cuadrático a aumenta de 1 a 2 (mayor ineficiencia a escala), ¿cómo cambia el costo mínimo?',
    context: 'Efecto del coeficiente cuadrático en el costo mínimo y el volumen óptimo.',
    targetParameter: 'a',
    options: [
      { id: 'a', label: 'El costo mínimo aumenta y q* disminuye.', isCorrect: true, explanation: 'Correcto. Con a mayor, la parábola es más estrecha. q* = -b/(2a) = 10/4 = 2.5 y C(2.5) = 27.5.' },
      { id: 'b', label: 'El costo mínimo disminuye porque la empresa es más eficiente.', isCorrect: false, explanation: 'Incorrecto. Un a mayor implica mayor penalización por desviarse del óptimo.' },
      { id: 'c', label: 'q* no cambia, solo cambia el nivel del mínimo.', isCorrect: false, explanation: 'Incorrecto. q* = -b/(2a) depende de a; si a cambia, q* también cambia.' }
    ],
    observePrompt: 'Incrementa a y observa cómo la parábola se estrecha y el mínimo se desplaza hacia la izquierda y hacia arriba.',
    scientificExplanation: 'En C(q) = aq² + bq + c, el mínimo ocurre en q* = -b/(2a). Un aumento en a reduce q* y puede elevar el costo mínimo C(q*) = c - b²/(4a).'
  }
}

const P9: BusinessProblem = {
  id: 'p9',
  problemNumber: 9,
  romanNumeral: 'IX',
  title: 'P9 · ROI de Campaña Digital (Optimización de Gasto)',
  era: 'Marketing Digital',
  year: 'Nivel II',
  protagonist: 'Dirección de Marketing',
  story: 'La dirección de marketing modela el retorno sobre la inversión (ROI) de una campaña de publicidad digital mediante R(x) = -0.5x² + 8x + 10, donde x es el presupuesto invertido en miles de u.m. por semana. Se busca el presupuesto óptimo x* que maximiza el ROI total.',
  economicConcept: 'Maximización de ROI — Condición de Primer Orden',
  difficulty: 'Nivel II',
  level: 'II',
  variableSymbol: 'x',
  variableLabel: 'Presupuesto Semanal en Publicidad Digital',
  variableUnit: 'k u.m.',
  functionSymbol: 'R',
  functionName: 'Función de Retorno sobre la Inversión',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: -0.5, b: 8, c: 10 },
  parametricMeta: {
    aLabel: 'Coeficiente de Saturación (a)',
    aUnit: 'k u.m./semana²', aMin: -2, aMax: -0.1, aStep: 0.1,
    bLabel: 'Efectividad Marginal Inicial (b)',
    bUnit: 'k u.m./semana', bMin: 4, bMax: 16, bStep: 1,
    cLabel: 'ROI Base Orgánico (c)',
    cUnit: 'k u.m.', cMin: 0, cMax: 20, cStep: 1,
  },
  functionLatex: "R(x) = -0.5x^2 + 8x + 10",
  derivativeLatex: "R'(x) = -x + 8",
  secondDerivativeLatex: "R''(x) = -1 < 0",
  concavityAnalysis: { value: -1, isConcaveDown: true, meaning: "R''(x) = -1 < 0: el ROI tiene un máximo global." },
  criticalPoint: 8,
  optimalValue: 42,
  optimalInterpretation: 'x* = 8 k u.m./semana maximiza el ROI en 42 k u.m.',
  domain: [0, 16],
  evaluate: (x: number) => -0.5 * Math.pow(x, 2) + 8 * x + 10,
  evaluateDerivative: (x: number) => -x + 8,
  evaluateSecondDerivative: () => -1,
  candadoSteps: {
    step1: {
      question: 'R(x) = -0.5x² + 8x + 10. ¿Qué regla aplica al término -0.5x²?',
      options: [
        { id: 'pot', label: 'Regla de la Potencia: d/dx[-0.5x²] = -0.5·2·x = -x', latex: '\\frac{d}{dx}[-0.5x^2] = -x', isCorrect: true, explanation: 'Correcto. Se multiplica -0.5 por el exponente 2 y se reduce el grado en 1.' },
        { id: 'lin', label: 'Derivada lineal: el coeficiente 0.5 es un escalar.', isCorrect: false, explanation: 'Incorrecto. x está elevada al cuadrado; aplica la regla de la potencia, no la lineal.' },
        { id: 'zero', label: 'La derivada es 0.5 porque el signo negativo cancela.', isCorrect: false, explanation: 'Incorrecto. d/dx[-0.5x²] = -1·x = -x.' }
      ],
      hint: 'd/dx[-0.5x²] = -0.5 · 2 · x¹ = -x.'
    },
    step2: {
      prompt: 'Diferencia R(x) = -0.5x² + 8x + 10:',
      terms: [
        { original: '-0.5x^2', derivative: '-x', ruleUsed: 'Regla de la potencia: d/dx[-0.5x²] = -x' },
        { original: '8x', derivative: '8', ruleUsed: 'Derivada lineal: d/dx[8x] = 8' },
        { original: '10', derivative: '0', ruleUsed: 'Regla de la constante: d/dx[10] = 0' }
      ],
      expectedDerivativeLatex: "R'(x) = -x + 8",
      hint: "R'(x) = -x + 8."
    },
    step3: {
      equationLatex: "R'(x^*) = 0 \\implies -x^* + 8 = 0 \\implies x^* = 8",
      criticalPoint: 8,
      explanation: 'x* = 8 k u.m. Invertir más allá de este punto genera rendimientos decrecientes negativos.',
      economicResult: 'Un presupuesto semanal de 8 k u.m. maximiza el ROI en 42 k u.m. Gastar más reduce el retorno neto.'
    }
  },
  poeHypothesis: {
    id: 'poe-p9',
    question: 'Si el equipo de marketing aumenta la efectividad marginal inicial b de 8 a 12 (mejor targeting), ¿qué ocurre con x*?',
    context: 'Efecto del coeficiente lineal en el presupuesto óptimo de marketing.',
    targetParameter: 'b',
    options: [
      { id: 'a', label: 'x* aumenta de 8 a 12 k u.m., justificando mayor inversión.', isCorrect: true, explanation: 'Correcto. x* = -b/(2a) = -12/(-1) = 12 k u.m.' },
      { id: 'b', label: 'x* disminuye porque la campaña es más eficiente con menos presupuesto.', isCorrect: false, explanation: 'Incorrecto. Mayor b implica un punto óptimo más alejado del origen.' },
      { id: 'c', label: 'x* no cambia; solo cambia el ROI máximo.', isCorrect: false, explanation: 'Incorrecto. x* = -b/(2a) depende directamente de b.' }
    ],
    observePrompt: 'Incrementa b y observa cómo el vértice V* se desplaza hacia la derecha, indicando que el presupuesto óptimo es mayor.',
    scientificExplanation: 'En R(x) = ax² + bx + c, el máximo ocurre en x* = -b/(2a). Una mejora en targeting (b mayor) desplaza el óptimo hacia mayor inversión, elevando también el ROI máximo.'
  }
}

const P10: BusinessProblem = {
  id: 'p10',
  problemNumber: 10,
  romanNumeral: 'X',
  title: 'P10 · Productividad de Empaque (Optimización de Turno)',
  era: 'Ingeniería Industrial',
  year: 'Nivel II',
  protagonist: 'Planta de Empaque Logístico',
  story: 'Un operador de planta logística modela la productividad acumulada de un turno de trabajo mediante P(t) = -4t² + 32t, donde t es el número de horas trabajadas y P está en unidades empacadas por hora. Se requiere determinar el momento t* en que la productividad alcanza su máximo para programar las pausas obligatorias.',
  economicConcept: 'Optimización de Productividad Laboral — Rendimiento Marginal',
  difficulty: 'Nivel II',
  level: 'II',
  variableSymbol: 't',
  variableLabel: 'Horas de Turno',
  variableUnit: 'horas',
  functionSymbol: 'P',
  functionName: 'Función de Productividad Acumulada',
  functionUnit: 'unidades empacadas',
  baseCoefficients: { a: -4, b: 32, c: 0 },
  parametricMeta: {
    aLabel: 'Penalización por Fatiga (a)',
    aUnit: 'u/h³', aMin: -8, aMax: -1, aStep: 1,
    bLabel: 'Productividad Marginal Inicial (b)',
    bUnit: 'u/h²', bMin: 16, bMax: 48, bStep: 2,
    cLabel: 'Producción Autónoma (c)',
    cUnit: 'u', cMin: 0, cMax: 0, cStep: 1,
  },
  functionLatex: "P(t) = -4t^2 + 32t",
  derivativeLatex: "P'(t) = -8t + 32",
  secondDerivativeLatex: "P''(t) = -8 < 0",
  concavityAnalysis: { value: -8, isConcaveDown: true, meaning: "P''(t) = -8 < 0: máximo de productividad certificado." },
  criticalPoint: 4,
  optimalValue: 64,
  optimalInterpretation: 't* = 4 horas: la productividad acumulada alcanza su pico en 64 unidades. Después de este punto, la fatiga reduce el ritmo.',
  domain: [0, 8],
  evaluate: (t: number) => -4 * Math.pow(t, 2) + 32 * t,
  evaluateDerivative: (t: number) => -8 * t + 32,
  evaluateSecondDerivative: () => -8,
  candadoSteps: {
    step1: {
      question: '¿Qué indica P\'\'(t) = -8 sobre el punto óptimo t* = 4?',
      options: [
        { id: 'max', label: 'P\'\'(t*) < 0 confirma que t* = 4 es un Máximo de Productividad.', latex: "P''(t^*) = -8 < 0 \\Rightarrow \\text{Máximo}", isCorrect: true, explanation: 'Correcto. La concavidad hacia abajo garantiza que la productividad alcanza su pico en t* = 4 horas.' },
        { id: 'min', label: 'P\'\'(t*) < 0 indica que la productividad cae después de t* = 4.', isCorrect: false, explanation: 'Esto es verdad como observación, pero no es el enunciado del criterio de la segunda derivada.' },
        { id: 'inf', label: 'P\'\'(t*) < 0 indica un punto de inflexión donde la curva cambia de forma.', isCorrect: false, explanation: 'Un punto de inflexión requiere que P\'\'(t) cambie de signo; aquí es una constante negativa.' }
      ],
      hint: 'Si P\'\'(t*) < 0, la concavidad es hacia abajo y t* es un Máximo.'
    },
    step2: {
      prompt: 'Diferencia P(t) = -4t² + 32t:',
      terms: [
        { original: '-4t^2', derivative: '-8t', ruleUsed: 'Regla de la potencia: d/dt[-4t²] = -8t' },
        { original: '32t', derivative: '32', ruleUsed: 'Derivada lineal: d/dt[32t] = 32' }
      ],
      expectedDerivativeLatex: "P'(t) = -8t + 32",
      hint: "P'(t) = -8t + 32."
    },
    step3: {
      equationLatex: "P'(t^*) = 0 \\implies -8t^* + 32 = 0 \\implies t^* = 4",
      criticalPoint: 4,
      explanation: 't* = 4 horas. La productividad marginal P\'(t) es positiva para t < 4 y negativa para t > 4.',
      economicResult: 'Programar la pausa de turno justo después de 4 horas maximiza la producción acumulada. Extender el turno más allá de este punto reduce el rendimiento neto.'
    }
  },
  poeHypothesis: {
    id: 'poe-p10',
    question: 'Si la fatiga aumenta (|a| crece de 4 a 6), ¿qué le ocurre a t*, el momento óptimo?',
    context: 'Sensibilidad del momento óptimo ante el coeficiente de fatiga.',
    targetParameter: 'a',
    options: [
      { id: 'a', label: 't* se reduce: la fatiga obliga a pausar antes.', isCorrect: true, explanation: 'Correcto. t* = -b/(2a) = -32/(2·(-6)) = 32/12 ≈ 2.67 horas.' },
      { id: 'b', label: 't* no cambia; solo cambia la productividad máxima.', isCorrect: false, explanation: 'Incorrecto. a entra en el denominador de t* = -b/(2a).' },
      { id: 'c', label: 't* aumenta porque el trabajador se adapta al esfuerzo mayor.', isCorrect: false, explanation: 'Incorrecto. Mayor |a| comprime el parabólico y desplaza el vértice a la izquierda.' }
    ],
    observePrompt: 'Incrementa |a| y observa cómo el vértice V* se desplaza hacia la izquierda: el pico de productividad ocurre antes.',
    scientificExplanation: 't* = -b/(2a). Un coeficiente de fatiga mayor (|a| mayor) acorta el tiempo óptimo de trabajo continuo, anticipando el pico y reduciendo también la productividad máxima.'
  }
}

const P11: BusinessProblem = {
  id: 'p11',
  problemNumber: 11,
  romanNumeral: 'XI',
  title: 'P11 · Tarifa de Transporte y Demanda Óptima',
  era: 'Microeconomía del Transporte',
  year: 'Nivel II',
  protagonist: 'Operadora Logística de Carga',
  story: 'Una operadora logística modela el ingreso neto de transporte de carga como I(p) = -5p² + 50p - 45, donde p es la tarifa por tonelada en u.m. El problema es determinar la tarifa p* que maximiza el ingreso neto, considerando la elasticidad de la demanda de los clientes industriales.',
  economicConcept: 'Maximización de Ingreso con Demanda Elástica — Precio Óptimo',
  difficulty: 'Nivel II',
  level: 'II',
  variableSymbol: 'p',
  variableLabel: 'Tarifa por Tonelada',
  variableUnit: 'u.m./ton',
  functionSymbol: 'I',
  functionName: 'Función de Ingreso Neto de Transporte',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: -5, b: 50, c: -45 },
  parametricMeta: {
    aLabel: 'Elasticidad Precio-Demanda (a)',
    aUnit: 'k u.m./(u.m./ton)²', aMin: -8, aMax: -2, aStep: 0.5,
    bLabel: 'Ingreso Marginal Inicial (b)',
    bUnit: 'k u.m./(u.m./ton)', bMin: 30, bMax: 70, bStep: 5,
    cLabel: 'Costo Fijo Regulatorio (c)',
    cUnit: 'k u.m.', cMin: -80, cMax: -10, cStep: 5,
  },
  functionLatex: "I(p) = -5p^2 + 50p - 45",
  derivativeLatex: "I'(p) = -10p + 50",
  secondDerivativeLatex: "I''(p) = -10 < 0",
  concavityAnalysis: { value: -10, isConcaveDown: true, meaning: "I''(p) = -10 < 0: máximo de ingreso certificado." },
  criticalPoint: 5,
  optimalValue: 80,
  optimalInterpretation: 'p* = 5 u.m./ton maximiza el ingreso neto en 80 k u.m.',
  domain: [0, 10],
  evaluate: (p: number) => -5 * Math.pow(p, 2) + 50 * p - 45,
  evaluateDerivative: (p: number) => -10 * p + 50,
  evaluateSecondDerivative: () => -10,
  candadoSteps: {
    step1: {
      question: 'Para I(p) = -5p² + 50p - 45, ¿qué implica I\'\'(p) = -10 < 0?',
      options: [
        { id: 'max', label: 'El punto crítico es un Máximo de Ingreso: la concavidad es estrictamente hacia abajo.', latex: "I''(p^*) = -10 < 0 \\Rightarrow \\text{Máximo}", isCorrect: true, explanation: 'Correcto. La segunda derivada negativa certifica el máximo por el Criterio analítico.' },
        { id: 'min', label: 'El punto crítico es un Mínimo; la empresa minimiza pérdidas.', isCorrect: false, explanation: 'Incorrecto. Un mínimo requiere segunda derivada positiva.' },
        { id: 'neu', label: 'No hay extremo; la curva es monótonamente decreciente.', isCorrect: false, explanation: 'Incorrecto. Una segunda derivada negativa constante indica función cóncava con un único máximo.' }
      ],
      hint: 'Signo negativo de I\'\'(p) → parábola cóncava abajo → máximo.'
    },
    step2: {
      prompt: 'Diferencia I(p) = -5p² + 50p - 45:',
      terms: [
        { original: '-5p^2', derivative: '-10p', ruleUsed: 'Regla de la potencia: d/dp[-5p²] = -10p' },
        { original: '50p', derivative: '50', ruleUsed: 'Derivada lineal: d/dp[50p] = 50' },
        { original: '-45', derivative: '0', ruleUsed: 'Regla de la constante: d/dp[-45] = 0' }
      ],
      expectedDerivativeLatex: "I'(p) = -10p + 50",
      hint: "I'(p) = -10p + 50."
    },
    step3: {
      equationLatex: "I'(p^*) = 0 \\implies -10p^* + 50 = 0 \\implies p^* = 5",
      criticalPoint: 5,
      explanation: 'p* = 5 u.m./ton. La tarifa óptima equilibra el ingreso por tonelada adicional con la caída en la demanda.',
      economicResult: 'Fijar la tarifa en p* = 5 u.m./ton genera el ingreso máximo de 80 k u.m. Tarifas superiores o inferiores reducen el ingreso neto.'
    }
  },
  poeHypothesis: {
    id: 'poe-p11',
    question: 'Si la regulación impone un costo fijo adicional (c más negativo), ¿cómo afecta a la tarifa óptima p*?',
    context: 'Invarianza del precio óptimo frente a costos regulatorios fijos.',
    targetParameter: 'c',
    options: [
      { id: 'a', label: 'p* sube para absorber el mayor costo regulatorio.', isCorrect: false, explanation: 'Incorrecto. I\'(p) = -10p + 50 no depende de c. El costo fijo no altera la decisión de precio.' },
      { id: 'b', label: 'p* permanece en 5 u.m./ton; solo cae el ingreso neto máximo.', isCorrect: true, explanation: 'Correcto. d/dp[c] = 0. Los costos fijos regulatorios no modifican la tarifa óptima.' },
      { id: 'c', label: 'p* disminuye para mantener la competitividad ante el mayor costo.', isCorrect: false, explanation: 'Incorrecto. La decisión marginal de precio no depende del nivel de costos fijos.' }
    ],
    observePrompt: 'Mueve c hacia valores más negativos y observa cómo la parábola desciende sin que el vértice se desplace horizontalmente.',
    scientificExplanation: 'Los costos fijos (regulatorios, de infraestructura, etc.) desplazan verticalmente la función de ingreso pero no alteran el precio óptimo p* = -b/(2a).'
  }
}

// ============================================================
// NIVEL III — INTERMEDIOS (Equilibrio, Cúbicas, EOQ)
// ============================================================

const P12: BusinessProblem = {
  id: 'p12',
  problemNumber: 12,
  romanNumeral: 'XII',
  title: 'P12 · Equilibrio de Cournot: Ingreso Marginal = Costo Marginal',
  era: 'Microeconomía de la Empresa',
  year: 'Nivel III',
  protagonist: 'Monopolio Industrial Regulado',
  story: 'Un monopolio industrial determina el volumen óptimo de producción q* donde el Ingreso Marginal iguala el Costo Marginal: I\'(q) = C\'(q). Con I(q) = -2q² + 40q (ingreso total) y C(q) = 8q + 30 (costo total), la condición de equilibrio determina la producción que maximiza el beneficio neto B(q) = I(q) - C(q).',
  economicConcept: 'Condición de Maximización de Beneficio: IM = CM en q* (Cournot 1838)',
  difficulty: 'Nivel III',
  level: 'III',
  variableSymbol: 'q',
  variableLabel: 'Volumen de Producción',
  variableUnit: 'miles de unidades',
  functionSymbol: 'B',
  functionName: 'Función de Beneficio Neto B(q) = I(q) - C(q)',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: -2, b: 32, c: -30 },
  parametricMeta: {
    aLabel: 'Coeficiente Cuadrático del Beneficio (a)',
    aUnit: 'k u.m./u²', aMin: -4, aMax: -1, aStep: 0.5,
    bLabel: 'Ingreso Marginal Neto Inicial (b)',
    bUnit: 'k u.m./u', bMin: 20, bMax: 44, bStep: 2,
    cLabel: 'Costo Fijo (c)',
    cUnit: 'k u.m.', cMin: -60, cMax: -10, cStep: 5,
  },
  functionLatex: "B(q) = I(q) - C(q) = -2q^2 + 32q - 30",
  derivativeLatex: "B'(q) = I'(q) - C'(q) = -4q + 32",
  secondDerivativeLatex: "B''(q) = -4 < 0",
  concavityAnalysis: { value: -4, isConcaveDown: true, meaning: "B''(q) = -4 < 0: la condición IM = CM determina un Máximo de Beneficio." },
  criticalPoint: 8,
  optimalValue: 98,
  optimalInterpretation: 'q* = 8 miles de u. maximiza el beneficio neto en 98 k u.m.',
  domain: [0, 16],
  evaluate: (q: number) => -2 * Math.pow(q, 2) + 32 * q - 30,
  evaluateDerivative: (q: number) => -4 * q + 32,
  evaluateSecondDerivative: () => -4,
  equilibriumMode: true,
  costCurve: {
    label: "C(q) = 8q + 30",
    functionLatex: "C(q) = 8q + 30",
    derivativeLatex: "C'(q) = 8 \\text{ (Costo Marginal)}",
    evaluate: (q: number) => 8 * q + 30,
    evaluateDerivative: () => 8,
    color: 'red'
  },
  candadoSteps: {
    step1: {
      question: 'La condición de equilibrio IM = CM equivale a B\'(q*) = 0. ¿Por qué?',
      options: [
        { id: 'ben', label: "B'(q) = I'(q) - C'(q) = 0 implica I'(q) = C'(q): el ingreso marginal iguala al costo marginal.", latex: "B'(q^*) = 0 \\Leftrightarrow I'(q^*) = C'(q^*)", isCorrect: true, explanation: 'Correcto. Maximizar el beneficio requiere que la tasa marginal de ingreso iguale a la de costo.' },
        { id: 'cost', label: 'Se iguala el ingreso total con el costo total: I(q) = C(q).', isCorrect: false, explanation: 'Incorrecto. I(q) = C(q) es la condición de punto de equilibrio contable (break-even), no de maximización.' },
        { id: 'zero', label: 'El ingreso marginal debe ser cero en el máximo.', isCorrect: false, explanation: 'Incorrecto. El ingreso marginal debe igualar al costo marginal, no necesariamente ser cero.' }
      ],
      hint: "B'(q) = I'(q) - C'(q). Cuando B'(q*) = 0, los marginales se igualan."
    },
    step2: {
      prompt: 'Diferencia B(q) = -2q² + 32q - 30:',
      terms: [
        { original: '-2q^2', derivative: '-4q', ruleUsed: 'Regla de la potencia: d/dq[-2q²] = -4q' },
        { original: '32q', derivative: '32', ruleUsed: 'Derivada lineal: d/dq[32q] = 32' },
        { original: '-30', derivative: '0', ruleUsed: 'Regla de la constante: d/dq[-30] = 0' }
      ],
      expectedDerivativeLatex: "B'(q) = -4q + 32",
      hint: "B'(q) = -4q + 32."
    },
    step3: {
      equationLatex: "B'(q^*) = 0 \\implies -4q^* + 32 = 0 \\implies q^* = 8",
      criticalPoint: 8,
      explanation: 'q* = 8. Verificación: I\'(8) = -4·8 + 40 = 8 = C\'(q) = 8. La condición IM = CM se cumple.',
      economicResult: 'Producir q* = 8 miles de unidades maximiza el beneficio neto en B(8) = 98 k u.m.'
    }
  },
  poeHypothesis: {
    id: 'poe-p12',
    question: 'Si el costo marginal CM aumenta de 8 a 12 u.m./u, ¿cómo cambia la producción óptima q*?',
    context: 'Efecto de un aumento en el costo marginal sobre el equilibrio IM = CM.',
    targetParameter: 'b',
    options: [
      { id: 'a', label: 'q* disminuye: producir es más caro, el óptimo cae.', isCorrect: true, explanation: 'Correcto. Un CM mayor eleva el costo variable de B(q), reduciendo b y por tanto q* = -b/(2a).' },
      { id: 'b', label: 'q* aumenta para compensar el mayor costo con más volumen.', isCorrect: false, explanation: 'Incorrecto. Más producción implica más costo total; el equilibrio se mueve hacia menor q*.' },
      { id: 'c', label: 'q* permanece igual; solo cambia el beneficio máximo.', isCorrect: false, explanation: 'Incorrecto. El costo marginal afecta directamente a B\'(q) = I\'(q) - CM, modificando la raíz q*.' }
    ],
    observePrompt: 'En el gráfico de equilibrio (Modo Docente), observa cómo la intersección IM = CM se desplaza hacia la izquierda cuando el CM aumenta.',
    scientificExplanation: 'Cuando CM sube, la condición IM = CM se satisface a un volumen menor. El óptimo q* = (b - CM)/(2|a|) decrece con el costo marginal.'
  }
}

const P13: BusinessProblem = {
  id: 'p13',
  problemNumber: 13,
  romanNumeral: 'XIII',
  title: 'P13 · Cruce de Curvas Marginales (Maximización de Beneficio)',
  era: 'Economía Analítica',
  year: 'Nivel III',
  protagonist: 'Empresa Manufacturera con Estructura Cuadrática de Costos',
  story: 'Una empresa manufacturera tiene ingreso I(q) = 36q - q² y costo C(q) = q² + 4q + 20. El beneficio B(q) = I(q) - C(q) = -2q² + 32q - 20. Se requiere demostrar que el cruce de las curvas de ingreso marginal y costo marginal identifica el mismo q* que la Condición de Primer Orden del beneficio.',
  economicConcept: 'Equilibrio de Beneficio: Cruce IM = CM y Máximo de B(q)',
  difficulty: 'Nivel III',
  level: 'III',
  variableSymbol: 'q',
  variableLabel: 'Producción Manufacturera',
  variableUnit: 'miles de unidades',
  functionSymbol: 'B',
  functionName: 'Función de Beneficio Neto',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: -2, b: 32, c: -20 },
  parametricMeta: {
    aLabel: 'Coeficiente Cuadrático del Beneficio (a)',
    aUnit: 'k u.m./u²', aMin: -4, aMax: -1, aStep: 0.5,
    bLabel: 'Margen de Beneficio Marginal Inicial (b)',
    bUnit: 'k u.m./u', bMin: 20, bMax: 44, bStep: 2,
    cLabel: 'Costo Fijo Neto (c)',
    cUnit: 'k u.m.', cMin: -50, cMax: -5, cStep: 5,
  },
  functionLatex: "B(q) = -2q^2 + 32q - 20",
  derivativeLatex: "B'(q) = -4q + 32",
  secondDerivativeLatex: "B''(q) = -4 < 0",
  concavityAnalysis: { value: -4, isConcaveDown: true, meaning: "B''(q) = -4 < 0: q* = 8 es un Máximo Estricto de Beneficio." },
  criticalPoint: 8,
  optimalValue: 108,
  optimalInterpretation: 'q* = 8 miles de u. maximiza el beneficio neto en 108 k u.m.',
  domain: [0, 16],
  evaluate: (q: number) => -2 * Math.pow(q, 2) + 32 * q - 20,
  evaluateDerivative: (q: number) => -4 * q + 32,
  evaluateSecondDerivative: () => -4,
  equilibriumMode: true,
  costCurve: {
    label: "C(q) = q² + 4q + 20",
    functionLatex: "C(q) = q^2 + 4q + 20",
    derivativeLatex: "C'(q) = 2q + 4 \\text{ (Costo Marginal)}",
    evaluate: (q: number) => Math.pow(q, 2) + 4 * q + 20,
    evaluateDerivative: (q: number) => 2 * q + 4,
    color: 'amber'
  },
  candadoSteps: {
    step1: {
      question: 'I(q) = 36q - q² tiene IM(q) = 36 - 2q. C(q) = q² + 4q + 20 tiene CM(q) = 2q + 4. ¿En qué q se cruzan los marginales?',
      options: [
        { id: 'eq', label: "IM = CM → 36 - 2q = 2q + 4 → 4q = 32 → q* = 8.", latex: "36 - 2q = 2q + 4 \\Rightarrow q^* = 8", isCorrect: true, explanation: 'Correcto. En q* = 8, el ingreso marginal iguala exactamente al costo marginal.' },
        { id: 'b4', label: "Se cruzan en q = 4, porque es el punto medio del dominio.", isCorrect: false, explanation: 'Incorrecto. Hay que resolver la ecuación algebraicamente, no asumir el punto medio.' },
        { id: 'zero', label: "Se cruzan donde IM = 0, es decir q = 18.", isCorrect: false, explanation: 'Incorrecto. IM = 0 no es la condición de cruce; se requiere IM = CM.' }
      ],
      hint: 'Iguala 36 - 2q = 2q + 4 y despeja q.'
    },
    step2: {
      prompt: 'Diferencia B(q) = -2q² + 32q - 20:',
      terms: [
        { original: '-2q^2', derivative: '-4q', ruleUsed: 'Regla de la potencia: d/dq[-2q²] = -4q' },
        { original: '32q', derivative: '32', ruleUsed: 'Derivada lineal: d/dq[32q] = 32' },
        { original: '-20', derivative: '0', ruleUsed: 'Regla de la constante: d/dq[-20] = 0' }
      ],
      expectedDerivativeLatex: "B'(q) = -4q + 32",
      hint: "B'(q) = -4q + 32."
    },
    step3: {
      equationLatex: "B'(q^*) = 0 \\implies -4q^* + 32 = 0 \\implies q^* = 8",
      criticalPoint: 8,
      explanation: 'q* = 8 es idéntico al cruce IM = CM. El análisis gráfico confirma la consistencia del resultado.',
      economicResult: 'B(8) = -2(64) + 32(8) - 20 = -128 + 256 - 20 = 108 k u.m. de beneficio máximo.'
    }
  },
  poeHypothesis: {
    id: 'poe-p13',
    question: 'Si el costo fijo aumenta de 20 a 40 (c más negativo en B), ¿cambia q*?',
    context: 'Invarianza del volumen óptimo ante variaciones en costos fijos.',
    targetParameter: 'c',
    options: [
      { id: 'a', label: 'q* no cambia; solo cae el beneficio máximo.', isCorrect: true, explanation: 'Correcto. d/dq[c] = 0. Los costos fijos nunca alteran la decisión de producción óptima.' },
      { id: 'b', label: 'q* cae para compensar el mayor costo.', isCorrect: false, explanation: 'Incorrecto. B\'(q) = -4q + 32 no contiene c.' },
      { id: 'c', label: 'q* aumenta para distribuir el costo fijo en más unidades.', isCorrect: false, explanation: 'Incorrecto. Producir más no reduce los costos fijos; son independientes del volumen.' }
    ],
    observePrompt: 'Modifica c y observa cómo la parábola de beneficio desciende uniformemente sin desplazar su vértice horizontalmente.',
    scientificExplanation: 'Principio de Invarianza de Costos Fijos: los costos fijos desplazan verticalmente B(q) pero no la derivada B\'(q). Por tanto, q* = argmax B(q) es independiente de los costos fijos.'
  }
}

const P14: BusinessProblem = {
  id: 'p14',
  problemNumber: 14,
  romanNumeral: 'XIV',
  title: 'P14 · Beneficio Agroindustrial (Función Cúbica)',
  era: 'Economía Agroindustrial',
  year: 'Nivel III',
  protagonist: 'Cooperativa Agroindustrial',
  story: 'Una cooperativa agroindustrial modela su beneficio estacional mediante P(x) = -x³ + 6x² + 15x (miles de u.m.), donde x es la superficie de hectáreas cultivadas en decenas. La cúbica captura economías de escala iniciales y deseconomías para grandes extensiones. Se requieren los puntos estacionarios y decidir cuál es el máximo relativo de beneficio.',
  economicConcept: 'Función Cúbica — Máximo y Mínimo Relativos — Regla de la Potencia',
  difficulty: 'Nivel III',
  level: 'III',
  variableSymbol: 'x',
  variableLabel: 'Hectáreas Cultivadas (decenas)',
  variableUnit: 'dec·ha',
  functionSymbol: 'P',
  functionName: 'Función de Beneficio Agroindustrial',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: -1, b: 6, c: 15 },
  parametricMeta: {
    aLabel: 'Penalización Cúbica (a·x³)',
    aUnit: 'k u.m./dec³', aMin: -3, aMax: -0.5, aStep: 0.5,
    bLabel: 'Coeficiente Cuadrático (b·x²)',
    bUnit: 'k u.m./dec²', bMin: 3, bMax: 9, bStep: 1,
    cLabel: 'Beneficio Marginal Lineal (c·x)',
    cUnit: 'k u.m./dec', cMin: 5, cMax: 25, cStep: 5,
  },
  functionLatex: "P(x) = -x^3 + 6x^2 + 15x",
  derivativeLatex: "P'(x) = -3x^2 + 12x + 15",
  secondDerivativeLatex: "P''(x) = -6x + 12",
  criticalPoint: 5,
  optimalValue: 100,
  optimalInterpretation: "P'(x) = 0 da dos puntos: x = -1 (fuera de dominio) y x = 5 (máximo relativo). P(5) = 100 k u.m.",
  domain: [0, 8],
  evaluate: (x: number) => -Math.pow(x, 3) + 6 * Math.pow(x, 2) + 15 * x,
  evaluateDerivative: (x: number) => -3 * Math.pow(x, 2) + 12 * x + 15,
  evaluateSecondDerivative: (x: number) => -6 * x + 12,
  candadoSteps: {
    step1: {
      question: 'P(x) = -x³ + 6x² + 15x. ¿Cuántos puntos estacionarios puede tener P\'(x) = 0?',
      options: [
        { id: 'dos', label: "P'(x) = -3x² + 12x + 15 es una ecuación cuadrática: puede tener hasta 2 raíces reales.", latex: "P'(x) = -3x^2 + 12x + 15 = 0", isCorrect: true, explanation: 'Correcto. Una ecuación cuadrática puede tener 0, 1 o 2 raíces reales.' },
        { id: 'uno', label: "P'(x) siempre tiene exactamente 1 raíz porque P es cúbica.", isCorrect: false, explanation: 'Incorrecto. Una función cúbica puede tener hasta 2 puntos estacionarios (P\' es cuadrática).' },
        { id: 'tres', label: "P'(x) puede tener 3 raíces porque P tiene grado 3.", isCorrect: false, explanation: 'Incorrecto. P\' tiene grado 2, y una ecuación de grado 2 tiene como máximo 2 raíces reales.' }
      ],
      hint: "P'(x) tiene grado 2; aplica la fórmula cuadrática para encontrar sus raíces."
    },
    step2: {
      prompt: 'Diferencia P(x) = -x³ + 6x² + 15x:',
      terms: [
        { original: '-x^3', derivative: '-3x^2', ruleUsed: 'Regla de la potencia: d/dx[-x³] = -3x²' },
        { original: '6x^2', derivative: '12x', ruleUsed: 'Regla de la potencia: d/dx[6x²] = 12x' },
        { original: '15x', derivative: '15', ruleUsed: 'Derivada lineal: d/dx[15x] = 15' }
      ],
      expectedDerivativeLatex: "P'(x) = -3x^2 + 12x + 15",
      hint: "P'(x) = -3x² + 12x + 15."
    },
    step3: {
      equationLatex: "-3x^2 + 12x + 15 = 0 \\implies x^2 - 4x - 5 = 0 \\implies (x-5)(x+1) = 0 \\implies x^* = 5",
      criticalPoint: 5,
      explanation: 'x = 5 y x = -1. Solo x* = 5 está en el dominio. P\'\'(5) = -6(5)+12 = -18 < 0: máximo relativo.',
      economicResult: 'Cultivar x* = 5 decenas de hectáreas maximiza el beneficio en P(5) = -125 + 150 + 75 = 100 k u.m.'
    }
  },
  poeHypothesis: {
    id: 'poe-p14',
    question: 'La función cúbica P(x) tiene dos puntos estacionarios. ¿Cuál es el criterio analítico para distinguir el máximo del mínimo?',
    context: 'Criterio de la Segunda Derivada aplicado a funciones cúbicas.',
    targetParameter: 'a',
    options: [
      { id: 'a', label: "Se evalúa P''(x) en cada punto: si P''(x*) < 0 → máximo; si P''(x*) > 0 → mínimo.", isCorrect: true, explanation: 'Correcto. P\'\'(5) = -18 < 0 (máximo). P\'\'(-1) = 18 > 0 (mínimo relativo, fuera del dominio).' },
      { id: 'b', label: 'Se comparan los valores P(x) en ambos puntos; el mayor es el máximo.', isCorrect: false, explanation: 'Incorrecto como método general; puede haber extremos globales en la frontera del dominio. El criterio analítico es más riguroso.' },
      { id: 'c', label: 'El máximo siempre es la raíz positiva de P\'(x) = 0.', isCorrect: false, explanation: 'Incorrecto. La positividad de la raíz no determina el tipo de extremo; se requiere analizar P\'\'.' }
    ],
    observePrompt: 'Activa la derivada P\'(x) en el gráfico y verifica que cruza el eje horizontal dos veces, una en x = -1 (mínimo) y otra en x = 5 (máximo).',
    scientificExplanation: 'El Criterio de la Segunda Derivada: si P\'(x*) = 0 y P\'\'(x*) < 0, entonces x* es un máximo local. Si P\'\'(x*) > 0, es un mínimo local. Si P\'\'(x*) = 0, el criterio es inconcluyente.'
  }
}

const P15: BusinessProblem = {
  id: 'p15',
  problemNumber: 15,
  romanNumeral: 'XV',
  title: 'P15 · Costos Operativos Cúbicos (Planta Química)',
  era: 'Ingeniería de Procesos',
  year: 'Nivel III',
  protagonist: 'Planta Química de Producción Continua',
  story: 'La función de costo operativo total de una planta química está modelada por C(q) = (1/3)q³ - 3q² + 10q + 12 (k u.m.), donde q es el número de lotes diarios procesados. Se requiere minimizar el costo marginal, es decir, hallar el mínimo de C\'(q).',
  economicConcept: 'Mínimo del Costo Marginal — Segunda Derivada de C\'(q)',
  difficulty: 'Nivel III',
  level: 'III',
  variableSymbol: 'q',
  variableLabel: 'Lotes Diarios Procesados',
  variableUnit: 'lotes',
  functionSymbol: 'C',
  functionName: 'Función de Costo Operativo Total',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: 1, b: -3, c: 10 },
  parametricMeta: {
    aLabel: 'Coeficiente Cúbico (a/3)',
    aUnit: '', aMin: 0.5, aMax: 2, aStep: 0.5,
    bLabel: 'Coeficiente Cuadrático (b)',
    bUnit: '', bMin: -5, bMax: -1, bStep: 0.5,
    cLabel: 'Costo Marginal Base (c)',
    cUnit: 'k u.m./lote', cMin: 5, cMax: 20, cStep: 1,
  },
  functionLatex: "C(q) = \\tfrac{1}{3}q^3 - 3q^2 + 10q + 12",
  derivativeLatex: "C'(q) = q^2 - 6q + 10",
  secondDerivativeLatex: "C''(q) = 2q - 6",
  criticalPoint: 3,
  optimalValue: 21,
  optimalInterpretation: 'El mínimo de C\'(q) ocurre en q = 3. C\'(3) = 9 - 18 + 10 = 1 k u.m./lote.',
  domain: [0, 8],
  evaluate: (q: number) => (1/3) * Math.pow(q, 3) - 3 * Math.pow(q, 2) + 10 * q + 12,
  evaluateDerivative: (q: number) => Math.pow(q, 2) - 6 * q + 10,
  evaluateSecondDerivative: (q: number) => 2 * q - 6,
  candadoSteps: {
    step1: {
      question: "C'(q) = q² - 6q + 10 es una parábola. ¿Cómo se minimiza C'(q)?",
      options: [
        { id: 'der', label: "Se minimiza derivando C'(q) e igualando a cero: C''(q) = 2q - 6 = 0 → q = 3.", latex: "C''(q) = 2q - 6 = 0 \\Rightarrow q = 3", isCorrect: true, explanation: 'Correcto. El mínimo de C\'(q) se encuentra igualando su propia derivada (C\'\') a cero.' },
        { id: 'val', label: "Se evalúa C'(q) en varios puntos y se toma el menor.", isCorrect: false, explanation: 'Incorrecto como método analítico. La diferenciación de C\'(q) es el enfoque formal.' },
        { id: 'cero', label: "El mínimo de C'(q) es cero porque los costos tienen un mínimo natural en q = 0.", isCorrect: false, explanation: 'Incorrecto. C\'(q) = q² - 6q + 10 = (q-3)² + 1 ≥ 1 > 0. El mínimo no es cero.' }
      ],
      hint: 'Para minimizar C\'(q), encuentra la raíz de C\'\'(q) = 0.'
    },
    step2: {
      prompt: 'Diferencia C(q) = (1/3)q³ - 3q² + 10q + 12:',
      terms: [
        { original: '\\tfrac{1}{3}q^3', derivative: 'q^2', ruleUsed: 'Regla de la potencia: d/dq[(1/3)q³] = q²' },
        { original: '-3q^2', derivative: '-6q', ruleUsed: 'Regla de la potencia: d/dq[-3q²] = -6q' },
        { original: '10q', derivative: '10', ruleUsed: 'Derivada lineal: d/dq[10q] = 10' },
        { original: '12', derivative: '0', ruleUsed: 'Regla de la constante: d/dq[12] = 0' }
      ],
      expectedDerivativeLatex: "C'(q) = q^2 - 6q + 10",
      hint: "C'(q) = q² - 6q + 10."
    },
    step3: {
      equationLatex: "C''(q) = 2q - 6 = 0 \\implies q = 3 \\quad C'(3) = 9 - 18 + 10 = 1",
      criticalPoint: 3,
      explanation: 'El costo marginal mínimo es 1 k u.m./lote, alcanzado en q = 3. Procesar 3 lotes diarios es el punto de máxima eficiencia marginal.',
      economicResult: 'Para q < 3, el costo marginal decrece; para q > 3, aumenta. q = 3 es el punto de eficiencia marginal máxima.'
    }
  },
  poeHypothesis: {
    id: 'poe-p15',
    question: '¿Puede el costo marginal C\'(q) = q² - 6q + 10 llegar a ser negativo en algún momento?',
    context: 'Análisis de la forma de la función de costo marginal cúbica.',
    targetParameter: 'b',
    options: [
      { id: 'a', label: 'No. C\'(q) = (q-3)² + 1 ≥ 1 > 0 para todo q real. El costo marginal es siempre positivo.', isCorrect: true, explanation: 'Correcto. El discriminante de q² - 6q + 10 es 36 - 40 = -4 < 0: no hay raíces reales. La parábola siempre está por encima del eje.' },
      { id: 'b', label: 'Sí, para q suficientemente grande el costo marginal se vuelve negativo.', isCorrect: false, explanation: 'Incorrecto. q² domina para valores grandes y siempre es positivo.' },
      { id: 'c', label: 'Solo si se modifican los parámetros hacia valores más negativos.', isCorrect: false, explanation: 'Incorrecto con los parámetros actuales; se requiere discriminante positivo para raíces reales.' }
    ],
    observePrompt: 'Observa la gráfica de C\'(q) = q² - 6q + 10: es una parábola que no toca el eje horizontal, confirmando que el costo marginal siempre es positivo.',
    scientificExplanation: 'C\'(q) = (q-3)² + 1 es una parábola desplazada cuyo mínimo es 1 > 0. Esto implica que cada lote adicional siempre cuesta al menos 1 k u.m. marginal extra.'
  }
}

const P16: BusinessProblem = {
  id: 'p16',
  problemNumber: 16,
  romanNumeral: 'XVI',
  title: 'P16 · Escalado de Ventas B2B (Dinámica Cúbica)',
  era: 'Gestión Comercial Estratégica',
  year: 'Nivel III',
  protagonist: 'División B2B de Software Empresarial',
  story: 'La evolución de las ventas de una división B2B sigue V(t) = -t³ + 9t² (millones de u.m.), donde t es el trimestre desde el lanzamiento. La dirección comercial requiere identificar el momento t* de aceleración máxima de ventas (inflexión) y el pico de ingresos.',
  economicConcept: 'Función Cúbica — Punto de Inflexión y Máximo de Ventas',
  difficulty: 'Nivel III',
  level: 'III',
  variableSymbol: 't',
  variableLabel: 'Trimestres desde Lanzamiento',
  variableUnit: 'trimestres',
  functionSymbol: 'V',
  functionName: 'Función de Ventas B2B Acumuladas',
  functionUnit: 'M u.m.',
  baseCoefficients: { a: -1, b: 9, c: 0 },
  parametricMeta: {
    aLabel: 'Penalización Cúbica (a)',
    aUnit: '', aMin: -2, aMax: -0.5, aStep: 0.5,
    bLabel: 'Coeficiente Cuadrático (b)',
    bUnit: '', bMin: 4, bMax: 12, bStep: 1,
    cLabel: 'Ventas Base (c)',
    cUnit: 'M u.m.', cMin: 0, cMax: 10, cStep: 1,
  },
  functionLatex: "V(t) = -t^3 + 9t^2",
  derivativeLatex: "V'(t) = -3t^2 + 18t",
  secondDerivativeLatex: "V''(t) = -6t + 18",
  criticalPoint: 6,
  optimalValue: 108,
  optimalInterpretation: 't* = 6 trimestres: pico de ventas en 108 M u.m. Punto de inflexión en t = 3 (aceleración máxima).',
  domain: [0, 9],
  evaluate: (t: number) => -Math.pow(t, 3) + 9 * Math.pow(t, 2),
  evaluateDerivative: (t: number) => -3 * Math.pow(t, 2) + 18 * t,
  evaluateSecondDerivative: (t: number) => -6 * t + 18,
  candadoSteps: {
    step1: {
      question: "V''(t) = -6t + 18 = 0 da t = 3. ¿Qué ocurre en este punto?",
      options: [
        { id: 'inf', label: "Es el punto de inflexión: la tasa de crecimiento de ventas V'(t) alcanza su máximo en t = 3.", latex: "V''(3) = 0 \\Rightarrow \\text{Inflexión (máxima aceleración de ventas)}", isCorrect: true, explanation: 'Correcto. En el punto de inflexión, la derivada segunda cambia de signo: la función pasa de cóncava hacia arriba a cóncava hacia abajo.' },
        { id: 'max', label: "Es el máximo de ventas V(t).", isCorrect: false, explanation: 'Incorrecto. El máximo de V(t) ocurre donde V\'(t) = 0, no donde V\'\'(t) = 0.' },
        { id: 'min', label: "Es el mínimo de ventas porque la segunda derivada se anula.", isCorrect: false, explanation: 'Incorrecto. Un mínimo requiere V\'(t) = 0 y V\'\'(t) > 0.' }
      ],
      hint: 'Donde V\'\'(t) = 0 y cambia de signo, hay un punto de inflexión en V(t) y un extremo de V\'(t).'
    },
    step2: {
      prompt: 'Diferencia V(t) = -t³ + 9t²:',
      terms: [
        { original: '-t^3', derivative: '-3t^2', ruleUsed: 'Regla de la potencia: d/dt[-t³] = -3t²' },
        { original: '9t^2', derivative: '18t', ruleUsed: 'Regla de la potencia: d/dt[9t²] = 18t' }
      ],
      expectedDerivativeLatex: "V'(t) = -3t^2 + 18t",
      hint: "V'(t) = -3t² + 18t."
    },
    step3: {
      equationLatex: "V'(t^*) = 0 \\implies -3t^*(t^* - 6) = 0 \\implies t^* = 6",
      criticalPoint: 6,
      explanation: 't* = 6 (t = 0 es el inicio). V\'\'(6) = -6(6)+18 = -18 < 0: máximo.',
      economicResult: 'El pico de ventas ocurre en el trimestre 6 con 108 M u.m. El punto de inflexión en t = 3 indica el momento de máxima aceleración comercial.'
    }
  },
  poeHypothesis: {
    id: 'poe-p16',
    question: '¿En qué trimestre ocurre la máxima aceleración de ventas V\'(t) (no el máximo de V)?',
    context: 'Distinción entre máximo de función, máximo de derivada y punto de inflexión.',
    targetParameter: 'b',
    options: [
      { id: 'a', label: 'En t = 3 (punto de inflexión de V), donde V\'\'(t) = 0 y V\'(t) alcanza su pico.', isCorrect: true, explanation: 'Correcto. V\'\'(3) = 0 y V\'\'\'(3) = -6 < 0: t = 3 es un máximo de V\'(t) y un punto de inflexión de V(t).' },
      { id: 'b', label: 'En t = 6, el mismo momento que el pico de ventas.', isCorrect: false, explanation: 'Incorrecto. En t = 6, V\'(6) = 0: la tasa de crecimiento se anula, no es máxima.' },
      { id: 'c', label: 'En t = 0, al inicio del lanzamiento.', isCorrect: false, explanation: 'Incorrecto. V\'(0) = 0; la aceleración inicial también es cero.' }
    ],
    observePrompt: 'En la gráfica de V\'(t), identifica su máximo en t = 3. Ese es el trimestre de mayor velocidad de expansión comercial.',
    scientificExplanation: 'El máximo de V\'(t) ocurre donde V\'\'(t) = 0, es decir, en el punto de inflexión de V(t). En t = 3, la empresa experimenta su mayor tasa de crecimiento de ventas antes de que la saturación del mercado ralentice la expansión.'
  }
}

const P17: BusinessProblem = {
  id: 'p17',
  problemNumber: 17,
  romanNumeral: 'XVII',
  title: 'P17 · Lote Económico de Pedido EOQ (Harris-Wilson)',
  era: 'Siglo XX — Ford W. Harris',
  year: '1913',
  protagonist: 'Ford W. Harris',
  story: 'C(x) = 2x + 32x⁻¹ + 10 modela el costo logístico total de un almacén industrial, donde x es el lote de pedido en toneladas. Minimizar C(x) usando potencias negativas para encontrar el Lote Económico Óptimo x* = 4 toneladas.',
  economicConcept: 'Modelo EOQ — Potencias Negativas — Minimización de Costo Logístico',
  difficulty: 'Nivel III',
  level: 'III',
  variableSymbol: 'x',
  variableLabel: 'Lote de Pedido',
  variableUnit: 'toneladas',
  functionSymbol: 'C',
  functionName: 'Función de Costo Logístico Total',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: 2, b: 32, c: 10 },
  parametricMeta: {
    aLabel: 'Costo Unitario de Almacenamiento (a)',
    aUnit: 'k u.m./ton', aMin: 1, aMax: 5, aStep: 0.5,
    bLabel: 'Costo Fijo de Pedido × Demanda (b)',
    bUnit: 'k u.m.·ton', bMin: 8, bMax: 72, bStep: 4,
    cLabel: 'Gastos Fijos Administrativos (c)',
    cUnit: 'k u.m.', cMin: 0, cMax: 20, cStep: 1,
  },
  functionLatex: "C(x) = 2x + \\frac{32}{x} + 10",
  derivativeLatex: "C'(x) = 2 - \\frac{32}{x^2}",
  secondDerivativeLatex: "C''(x) = \\frac{64}{x^3} > 0",
  concavityAnalysis: { value: 2, isConcaveDown: false, meaning: "C''(x) > 0 para todo x > 0: mínimo de costo logístico certificado." },
  criticalPoint: 4,
  optimalValue: 26,
  optimalInterpretation: 'x* = 4 toneladas minimiza el costo logístico en C(4) = 8 + 8 + 10 = 26 k u.m.',
  domain: [0.5, 12],
  evaluate: (x: number) => Math.abs(x) < 0.001 ? Infinity : 2 * x + 32 / x + 10,
  evaluateDerivative: (x: number) => Math.abs(x) < 0.001 ? -Infinity : 2 - 32 / Math.pow(x, 2),
  evaluateSecondDerivative: (x: number) => Math.abs(x) < 0.001 ? Infinity : 64 / Math.pow(x, 3),
  candadoSteps: {
    step1: {
      question: 'Para C(x) = 2x + 32x⁻¹ + 10, ¿qué regla aplica al término 32x⁻¹?',
      options: [
        { id: 'neg', label: 'Regla de la Potencia con exponente negativo: d/dx[32x⁻¹] = 32·(-1)·x⁻² = -32x⁻²', latex: '\\frac{d}{dx}[32x^{-1}] = -\\frac{32}{x^2}', isCorrect: true, explanation: 'Correcto. La regla de la potencia se aplica idénticamente para exponentes negativos.' },
        { id: 'coc', label: 'Regla del Cociente: d/dx[32/x] con u=32, v=x.', isCorrect: false, explanation: 'Válido pero equivalente a la Regla de la Potencia con n=-1. El enfoque más directo es n=-1.' },
        { id: 'lin', label: 'Derivada lineal: el coeficiente es 32.', isCorrect: false, explanation: 'Incorrecto. La derivada de 32x⁻¹ no es 32; el exponente es -1, no 1.' }
      ],
      hint: 'Reescribe 32/x como 32x⁻¹ y aplica d/dx[axⁿ] = a·n·xⁿ⁻¹ con n = -1.'
    },
    step2: {
      prompt: 'Diferencia C(x) = 2x + 32x⁻¹ + 10:',
      terms: [
        { original: '2x', derivative: '2', ruleUsed: 'Derivada lineal: d/dx[2x] = 2' },
        { original: '32x^{-1}', derivative: '-32x^{-2}', ruleUsed: 'Potencia negativa: d/dx[32x⁻¹] = -32x⁻²' },
        { original: '10', derivative: '0', ruleUsed: 'Regla de la constante: d/dx[10] = 0' }
      ],
      expectedDerivativeLatex: "C'(x) = 2 - \\frac{32}{x^2}",
      hint: "C'(x) = 2 - 32/x²."
    },
    step3: {
      equationLatex: "C'(x^*) = 0 \\implies 2 - \\frac{32}{(x^*)^2} = 0 \\implies (x^*)^2 = 16 \\implies x^* = 4",
      criticalPoint: 4,
      explanation: 'x* = √(32/2) = √16 = 4. C\'\'(4) = 64/64 = 1 > 0: mínimo verificado.',
      economicResult: 'El Lote Económico de Pedido óptimo es x* = 4 toneladas con costo mínimo de 26 k u.m. En este punto, el costo de almacenamiento (8) iguala al costo de transporte por pedido (8).'
    }
  },
  poeHypothesis: {
    id: 'poe-p17',
    question: 'Si el costo fijo de pedido b se duplica de 32 a 64, ¿cómo cambia x*?',
    context: 'Sensibilidad del Lote Económico de Pedido al costo de ordenamiento.',
    targetParameter: 'b',
    options: [
      { id: 'a', label: 'x* se multiplica por √2 ≈ 1.41: pasa de 4 a aproximadamente 5.66 toneladas.', isCorrect: true, explanation: 'Correcto. x* = √(b/a) = √(64/2) = √32 ≈ 5.66.' },
      { id: 'b', label: 'x* se duplica exactamente a 8 toneladas.', isCorrect: false, explanation: 'Incorrecto. x* = √(b/a); al duplicar b, x* aumenta por √2, no por 2.' },
      { id: 'c', label: 'x* no cambia; solo aumenta el costo mínimo.', isCorrect: false, explanation: 'Incorrecto. b entra en la fórmula del óptimo x* = √(b/a).' }
    ],
    observePrompt: 'Duplica b y observa cómo el punto mínimo de la curva en forma de U se desplaza hacia la derecha (mayor lote óptimo).',
    scientificExplanation: 'x* = √(b/a). La relación es de raíz cuadrada, no lineal: duplicar b eleva x* en un factor √2 ≈ 1.41. Este es el modelo clásico de Harris-Wilson (1913).'
  }
}

const P18: BusinessProblem = {
  id: 'p18',
  problemNumber: 18,
  romanNumeral: 'XVIII',
  title: 'P18 · EOQ Cadena de Frío (Variante Logística)',
  era: 'Logística Refrigerada',
  year: 'Nivel III',
  protagonist: 'Distribuidora de Alimentos Frescos',
  story: 'Una distribuidora de alimentos frescos opera con función de costo logístico refrigerado C(x) = 3x + 27x⁻¹ + 15 (k u.m.), donde x son los palés por pedido. El mayor costo de almacenamiento (a = 3) refleja la refrigeración. Se requiere el lote óptimo x* que minimiza el costo total.',
  economicConcept: 'EOQ con Costos de Refrigeración — Potencias Negativas',
  difficulty: 'Nivel III',
  level: 'III',
  variableSymbol: 'x',
  variableLabel: 'Palés por Pedido',
  variableUnit: 'palés',
  functionSymbol: 'C',
  functionName: 'Función de Costo Logístico Refrigerado',
  functionUnit: 'k u.m.',
  baseCoefficients: { a: 3, b: 27, c: 15 },
  parametricMeta: {
    aLabel: 'Costo de Almacenamiento Refrigerado (a)',
    aUnit: 'k u.m./palé', aMin: 1, aMax: 6, aStep: 0.5,
    bLabel: 'Costo de Pedido × Demanda (b)',
    bUnit: 'k u.m.·palé', bMin: 9, bMax: 54, bStep: 3,
    cLabel: 'Costos Logísticos Fijos (c)',
    cUnit: 'k u.m.', cMin: 0, cMax: 30, cStep: 5,
  },
  functionLatex: "C(x) = 3x + \\frac{27}{x} + 15",
  derivativeLatex: "C'(x) = 3 - \\frac{27}{x^2}",
  secondDerivativeLatex: "C''(x) = \\frac{54}{x^3} > 0",
  criticalPoint: 3,
  optimalValue: 33,
  optimalInterpretation: 'x* = 3 palés por pedido minimiza el costo total en C(3) = 9 + 9 + 15 = 33 k u.m.',
  domain: [0.5, 10],
  evaluate: (x: number) => Math.abs(x) < 0.001 ? Infinity : 3 * x + 27 / x + 15,
  evaluateDerivative: (x: number) => Math.abs(x) < 0.001 ? -Infinity : 3 - 27 / Math.pow(x, 2),
  evaluateSecondDerivative: (x: number) => Math.abs(x) < 0.001 ? Infinity : 54 / Math.pow(x, 3),
  candadoSteps: {
    step1: {
      question: '¿Cómo difiere este EOQ (a=3, b=27) del Problema XVII (a=2, b=32)?',
      options: [
        { id: 'form', label: 'La fórmula es la misma: x* = √(b/a) = √(27/3) = √9 = 3. El mayor costo de refrigeración (a=3) reduce el lote óptimo.', latex: 'x^* = \\sqrt{\\frac{b}{a}} = \\sqrt{9} = 3', isCorrect: true, explanation: 'Correcto. Mayor costo de almacenamiento refrigerado → lotes más pequeños y frecuentes.' },
        { id: 'lin', label: 'Se usa una fórmula diferente porque la función es lineal.', isCorrect: false, explanation: 'Incorrecto. La función tiene la misma forma EOQ; la fórmula del óptimo es idéntica.' },
        { id: 'sin', label: 'No hay diferencia; x* es el mismo que en el P17.', isCorrect: false, explanation: 'Incorrecto. x* = √(b/a) depende de a y b, que son diferentes.' }
      ],
      hint: 'x* = √(b/a). Sustituye a=3, b=27.'
    },
    step2: {
      prompt: 'Diferencia C(x) = 3x + 27x⁻¹ + 15:',
      terms: [
        { original: '3x', derivative: '3', ruleUsed: 'Derivada lineal: d/dx[3x] = 3' },
        { original: '27x^{-1}', derivative: '-27x^{-2}', ruleUsed: 'Potencia negativa: d/dx[27x⁻¹] = -27x⁻²' },
        { original: '15', derivative: '0', ruleUsed: 'Regla de la constante: d/dx[15] = 0' }
      ],
      expectedDerivativeLatex: "C'(x) = 3 - \\frac{27}{x^2}",
      hint: "C'(x) = 3 - 27/x²."
    },
    step3: {
      equationLatex: "C'(x^*) = 0 \\implies 3 = \\frac{27}{(x^*)^2} \\implies (x^*)^2 = 9 \\implies x^* = 3",
      criticalPoint: 3,
      explanation: 'x* = 3 palés. C(3) = 9 + 9 + 15 = 33 k u.m. El mayor costo de refrigeración justifica pedidos más frecuentes y pequeños.',
      economicResult: 'Pedidos de 3 palés minimizan el costo logístico refrigerado. Ampliar los lotes incrementa los costos de almacenamiento fría; reducirlos eleva los costos de transporte.'
    }
  },
  poeHypothesis: {
    id: 'poe-p18',
    question: 'Si la distribuidora instala refrigeración más eficiente (a baja de 3 a 1.5), ¿qué ocurre con x*?',
    context: 'Efecto de la reducción del costo de refrigeración en el lote óptimo.',
    targetParameter: 'a',
    options: [
      { id: 'a', label: 'x* aumenta: x* = √(27/1.5) = √18 ≈ 4.24 palés. Lotes más grandes son rentables.', isCorrect: true, explanation: 'Correcto. Al reducirse a, la penalización por almacenamiento es menor; conviene pedir más cantidad con menos frecuencia.' },
      { id: 'b', label: 'x* disminuye porque la refrigeración eficiente permite mayor rotación.', isCorrect: false, explanation: 'Incorrecto. Un menor a reduce el costo de mantener inventario; el óptimo se desplaza hacia lotes más grandes.' },
      { id: 'c', label: 'x* no cambia; solo baja el costo mínimo total.', isCorrect: false, explanation: 'Incorrecto. x* = √(b/a) depende de a.' }
    ],
    observePrompt: 'Reduce a y observa cómo el mínimo de la curva se desplaza hacia la derecha: conviene pedir más unidades por pedido.',
    scientificExplanation: 'x* = √(b/a). Al reducirse el costo de almacenamiento a, el Lote Económico crece. La mejora tecnológica en refrigeración permite políticas de inventario más holgadas.'
  }
}

// ============================================================
// NIVEL IV — AVANZADOS (Media/Marginal, Exponencial)
// ============================================================

const P19: BusinessProblem = {
  id: 'p19',
  problemNumber: 19,
  romanNumeral: 'XIX',
  title: 'P19 · Costo Medio = Costo Marginal (Eficiencia Empresarial)',
  era: 'Microeconomía Avanzada',
  year: 'Nivel IV',
  protagonist: 'Empresa Manufacturera de Alta Eficiencia',
  story: 'La empresa tiene función de costo total CT(q) = 2q² + 8q + 32. Se define el Costo Medio CM̄(q) = CT(q)/q = 2q + 8 + 32/q y el Costo Marginal CMg(q) = CT\'(q) = 4q + 8. Se pide demostrar que el Costo Medio se minimiza en el punto donde CM̄(q) = CMg(q) y calcular dicho punto.',
  economicConcept: 'Relación Costo Medio–Marginal: CM̄(q*) = CMg(q*) en el mínimo del costo medio',
  difficulty: 'Nivel IV',
  level: 'IV',
  variableSymbol: 'q',
  variableLabel: 'Volumen de Producción',
  variableUnit: 'miles de unidades',
  functionSymbol: 'C',
  functionName: 'Función de Costo Medio C̄(q)',
  functionUnit: 'u.m./u',
  baseCoefficients: { a: 2, b: 8, c: 32 },
  parametricMeta: {
    aLabel: 'Coeficiente Variable de Costo (a)',
    aUnit: 'u.m./u²', aMin: 1, aMax: 5, aStep: 0.5,
    bLabel: 'Costo Variable Lineal (b)',
    bUnit: 'u.m./u', bMin: 4, bMax: 16, bStep: 1,
    cLabel: 'Costo Fijo Total (c)',
    cUnit: 'u.m.', cMin: 8, cMax: 64, cStep: 4,
  },
  functionLatex: "\\bar{C}(q) = 2q + 8 + \\frac{32}{q}",
  derivativeLatex: "\\bar{C}'(q) = 2 - \\frac{32}{q^2}",
  secondDerivativeLatex: "\\bar{C}''(q) = \\frac{64}{q^3} > 0",
  criticalPoint: 4,
  optimalValue: 24,
  optimalInterpretation: "C̄'(q*) = 0 → q* = 4. C̄(4) = 8 + 8 + 8 = 24 u.m./u. Se verifica: CMg(4) = 4(4)+8 = 24 = C̄(4).",
  domain: [0.5, 10],
  evaluate: (q: number) => Math.abs(q) < 0.001 ? Infinity : 2 * q + 8 + 32 / q,
  evaluateDerivative: (q: number) => Math.abs(q) < 0.001 ? -Infinity : 2 - 32 / Math.pow(q, 2),
  evaluateSecondDerivative: (q: number) => Math.abs(q) < 0.001 ? Infinity : 64 / Math.pow(q, 3),
  candadoSteps: {
    step1: {
      question: 'C̄(q) = CT(q)/q = 2q + 8 + 32/q. ¿Qué regla aplica a d/dq[32/q]?',
      options: [
        { id: 'neg', label: 'Potencia negativa: d/dq[32q⁻¹] = 32·(-1)·q⁻² = -32/q²', latex: '\\frac{d}{dq}\\left[\\frac{32}{q}\\right] = -\\frac{32}{q^2}', isCorrect: true, explanation: 'Correcto. El término 32/q es equivalente a 32q⁻¹ y se diferencia con la regla de la potencia.' },
        { id: 'prod', label: 'Regla del Producto aplicada a CT(q) y 1/q.', isCorrect: false, explanation: 'Válido pero más complejo. El enfoque directo es reescribir como 32q⁻¹ y aplicar la regla de la potencia.' },
        { id: 'const', label: 'La derivada de 32/q es 32 porque 32 es el numerador constante.', isCorrect: false, explanation: 'Incorrecto. 32/q tiene una variable q en el denominador; su derivada no es 32.' }
      ],
      hint: 'Reescribe 32/q como 32q⁻¹ y aplica la regla de la potencia con n = -1.'
    },
    step2: {
      prompt: 'Diferencia C̄(q) = 2q + 8 + 32q⁻¹:',
      terms: [
        { original: '2q', derivative: '2', ruleUsed: 'Derivada lineal: d/dq[2q] = 2' },
        { original: '8', derivative: '0', ruleUsed: 'Regla de la constante: d/dq[8] = 0' },
        { original: '32q^{-1}', derivative: '-32q^{-2}', ruleUsed: 'Potencia negativa: d/dq[32q⁻¹] = -32q⁻²' }
      ],
      expectedDerivativeLatex: "\\bar{C}'(q) = 2 - \\frac{32}{q^2}",
      hint: "C̄'(q) = 2 - 32/q²."
    },
    step3: {
      equationLatex: "\\bar{C}'(q^*) = 0 \\implies 2 = \\frac{32}{(q^*)^2} \\implies q^* = 4",
      criticalPoint: 4,
      explanation: 'q* = √(32/2) = 4. Verificación: C̄(4) = 8+8+8 = 24. CMg(4) = 4(4)+8 = 24. Se cumple C̄(q*) = CMg(q*).',
      economicResult: 'En q* = 4 miles de unidades, el costo por unidad es mínimo (24 u.m./u). Producir menos o más eleva el costo unitario promedio.'
    }
  },
  poeHypothesis: {
    id: 'poe-p19',
    question: '¿Siempre se cumple que C̄(q*) = CMg(q*) en el mínimo del costo medio?',
    context: 'Demostración general de la relación costo medio–marginal.',
    targetParameter: 'c',
    options: [
      { id: 'a', label: 'Sí. Es un resultado matemático general: el CMg siempre cruza al C̄ en su punto mínimo.', isCorrect: true, explanation: 'Correcto. C̄\'(q) = [CT\'(q)·q - CT(q)]/q² = 0 implica CT\'(q) = CT(q)/q, es decir CMg = C̄.' },
      { id: 'b', label: 'Solo ocurre cuando los costos son cuadráticos.', isCorrect: false, explanation: 'Incorrecto. La relación CMg = C̄ en el mínimo del costo medio es un teorema general, independiente de la forma funcional.' },
      { id: 'c', label: 'Solo es válido cuando los costos fijos son positivos.', isCorrect: false, explanation: 'Incorrecto. La demostración algebraica es independiente del nivel de los costos fijos.' }
    ],
    observePrompt: 'Modifica c y observa que, sin importar el costo fijo, el mínimo del Costo Medio siempre coincide con el punto donde CMg cruza al C̄.',
    scientificExplanation: 'Demostración: C̄\'(q) = 0 ↔ CT\'(q)/q - CT(q)/q² = 0 ↔ CT\'(q) = CT(q)/q = C̄(q). En términos económicos: si CMg < C̄, producir más reduce el costo medio; si CMg > C̄, producir más lo eleva. El equilibrio ocurre en el cruce.'
  }
}

const P20: BusinessProblem = {
  id: 'p20',
  problemNumber: 20,
  romanNumeral: 'XX',
  title: 'P20 · Capitalización Continua y Velocidad de Creación de Valor',
  era: 'Siglo XXI — FinTech',
  year: 'Actualidad',
  protagonist: 'Fondo de Inversión FinTech',
  story: 'V(t) = 10·e^(0.5t) + 5 modela el valor de una cartera de bonos corporativos con capitalización continua al 50% anual, más una reserva fija de 5 M. En t = 0 (fecha de inversión inicial), la dirección financiera necesita calcular la tasa de crecimiento instantánea V\'(0) mediante la Regla de la Cadena Exponencial.',
  economicConcept: 'Derivada Exponencial con Regla de la Cadena — Tasa de Creación de Valor',
  difficulty: 'Nivel IV',
  level: 'IV',
  variableSymbol: 't',
  variableLabel: 'Años desde la Inversión Inicial',
  variableUnit: 'años',
  functionSymbol: 'V',
  functionName: 'Función de Valor de Cartera',
  functionUnit: 'M u.m.',
  baseCoefficients: { a: 10, b: 0.5, c: 5 },
  parametricMeta: {
    aLabel: 'Capital Invertido (a)',
    aUnit: 'M u.m.', aMin: 1, aMax: 20, aStep: 1,
    bLabel: 'Tasa de Capitalización Continua (b)',
    bUnit: '1/año', bMin: 0.1, bMax: 1.0, bStep: 0.05,
    cLabel: 'Reserva de Liquidez Fija (c)',
    cUnit: 'M u.m.', cMin: 0, cMax: 15, cStep: 1,
  },
  functionLatex: "V(t) = 10 e^{0.5t} + 5",
  derivativeLatex: "V'(t) = 5 e^{0.5t}",
  secondDerivativeLatex: "V''(t) = 2.5 e^{0.5t} > 0",
  criticalPoint: 0,
  optimalValue: 15,
  optimalInterpretation: "V'(0) = 5 M u.m./año: la tasa de creación de valor en la inversión inicial es 5 M anuales. La función crece de forma convexamente acelerada.",
  domain: [0, 8],
  evaluate: (t: number) => 10 * Math.exp(0.5 * t) + 5,
  evaluateDerivative: (t: number) => 5 * Math.exp(0.5 * t),
  evaluateSecondDerivative: (t: number) => 2.5 * Math.exp(0.5 * t),
  candadoSteps: {
    step1: {
      question: 'Para V(t) = 10·e^(0.5t) + 5, ¿qué regla de diferenciación aplica al término 10·e^(0.5t)?',
      options: [
        { id: 'cadena', label: 'Regla de la Cadena: d/dt[a·e^(k·t)] = a·k·e^(k·t). Con a=10, k=0.5: V\'(t) = 5e^(0.5t)', latex: '\\frac{d}{dt}[10 e^{0.5t}] = 10 \\cdot 0.5 \\cdot e^{0.5t} = 5e^{0.5t}', isCorrect: true, explanation: 'Correcto. La derivada de e^(kt) es k·e^(kt) por la Regla de la Cadena.' },
        { id: 'pot', label: 'Regla de la Potencia: se extrae el exponente 0.5 como factor.', isCorrect: false, explanation: 'Incorrecto. La regla de la potencia aplica a xⁿ, no a e^(kt). La base es constante (e) y el exponente es variable (0.5t).' },
        { id: 'log', label: 'La derivada de e^(0.5t) es ln(e^(0.5t)) = 0.5t.', isCorrect: false, explanation: 'Incorrecto. Esa es la propiedad logarítmica, no la derivada. d/dt[e^(0.5t)] = 0.5·e^(0.5t).' }
      ],
      hint: 'd/dt[a·e^(kt)] = a·k·e^(kt). Identifica a = 10 y k = 0.5.'
    },
    step2: {
      prompt: 'Diferencia V(t) = 10·e^(0.5t) + 5:',
      terms: [
        { original: '10 e^{0.5t}', derivative: '5 e^{0.5t}', ruleUsed: 'Regla de la Cadena: d/dt[10e^(0.5t)] = 10·0.5·e^(0.5t) = 5e^(0.5t)' },
        { original: '5', derivative: '0', ruleUsed: 'Regla de la constante: d/dt[5] = 0' }
      ],
      expectedDerivativeLatex: "V'(t) = 5 e^{0.5t}",
      hint: "V'(t) = 10 · 0.5 · e^(0.5t) = 5e^(0.5t)."
    },
    step3: {
      equationLatex: "V'(0) = 5 e^{0.5 \\cdot 0} = 5 \\cdot 1 = 5 \\text{ M u.m./año}",
      criticalPoint: 0,
      explanation: 'Se evalúa la tasa instantánea en t = 0 (fecha inicial). V\'\'(t) = 2.5e^(0.5t) > 0: aceleración continua de rendimientos.',
      economicResult: 'En el momento de la inversión, el capital crece a 5 M u.m. por año. La convexidad certifica aceleración continua de los rendimientos.'
    }
  },
  poeHypothesis: {
    id: 'poe-p20',
    question: 'Si la tasa de capitalización sube de k = 0.5 a k = 1 (doble de interés continuo), ¿cómo cambia V\'(0)?',
    context: 'Efecto de la tasa de capitalización en la velocidad instantánea de creación de valor.',
    targetParameter: 'b',
    options: [
      { id: 'a', label: "V'(0) se duplica: pasa de 5 a 10 M u.m./año.", isCorrect: true, explanation: 'Correcto. V\'(t) = a·k·e^(kt). En t=0: V\'(0) = a·k = 10·1 = 10 M u.m./año.' },
      { id: 'b', label: "V'(0) permanece igual; solo cambia la trayectoria futura.", isCorrect: false, explanation: 'Incorrecto. k entra como factor directo en V\'(0) = a·k.' },
      { id: 'c', label: "V'(0) aumenta por el factor e, aproximadamente 2.718 veces.", isCorrect: false, explanation: 'Incorrecto. e solo aparece en la evaluación en t > 0. En t = 0, e^(k·0) = 1.' }
    ],
    observePrompt: 'Incrementa b (tasa k) y observa cómo la curva V(t) se vuelve más pronunciada y la tangente en t = 0 tiene mayor pendiente.',
    scientificExplanation: 'La tasa de creación de valor instantánea en t = 0 es V\'(0) = a·k. Duplicar la tasa de capitalización continua duplica exactamente la velocidad inicial de crecimiento del capital.'
  }
}

// ============================================================
// CATÁLOGO COMPLETO — 20 PROBLEMAS EMPRESARIALES
// ============================================================

export const ALL_BUSINESS_PROBLEMS: BusinessProblem[] = [
  P1, P2, P3, P4, P5, P6, P7, P8, P9, P10,
  P11, P12, P13, P14, P15, P16, P17, P18, P19, P20
]

// Problemas clásicos (compatibilidad con IDs legacy)
export const BUSINESS_PROBLEMS = ALL_BUSINESS_PROBLEMS

export const PROBLEMS_BY_LEVEL = {
  I: ALL_BUSINESS_PROBLEMS.filter(p => p.level === 'I'),
  II: ALL_BUSINESS_PROBLEMS.filter(p => p.level === 'II'),
  III: ALL_BUSINESS_PROBLEMS.filter(p => p.level === 'III'),
  IV: ALL_BUSINESS_PROBLEMS.filter(p => p.level === 'IV'),
}
