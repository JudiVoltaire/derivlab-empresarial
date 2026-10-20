import type { BusinessProblem } from '../types/problem'

export const BUSINESS_PROBLEMS: BusinessProblem[] = [
  {
    id: 'problema-1',
    problemNumber: 1,
    romanNumeral: 'I',
    title: 'Problema I: Ingreso Total y Optimización de Fermat',
    era: 'Siglo XVII',
    year: '1637',
    protagonist: 'Pierre de Fermat (1637)',
    story: 'En 1637, Pierre de Fermat formuló el método de adecuación (precursor del cálculo diferencial) para modelar la relación inversa entre el precio unitario y la demanda agregada en el gremio mercantil de telas en Toulouse, determinando analíticamente el punto exacto donde la tasa marginal instantánea se anula.',
    economicConcept: 'Condición de Primer Orden f\'(x*) = 0 en Ingreso Marginal',
    difficulty: 'Nivel I',
    
    variableSymbol: 'x',
    variableLabel: 'Precio Unitario de Venta',
    variableUnit: 'monedas',
    functionSymbol: 'I',
    functionName: 'Función de Ingreso Total',
    functionUnit: 'monedas',
    
    baseCoefficients: { a: -2, b: 24, c: 0 },
    parametricMeta: {
      aLabel: 'Coeficiente de Elasticidad Cuadrática (a)',
      aUnit: 'monedas/u²',
      aMin: -4,
      aMax: -1,
      aStep: 0.5,

      bLabel: 'Precio Máximo Marginal de Entrada (b)',
      bUnit: 'monedas/u',
      bMin: 12,
      bMax: 36,
      bStep: 2,

      cLabel: 'Ingreso Autónomo Fijo (c)',
      cUnit: 'monedas',
      cMin: -10,
      cMax: 10,
      cStep: 1
    },

    functionLatex: 'I(x) = -2x^2 + 24x',
    derivativeLatex: "I'(x) = -4x + 24",
    secondDerivativeLatex: "I''(x) = -4",
    
    concavityAnalysis: {
      value: -4,
      isConcaveDown: true,
      meaning: 'La segunda derivada I\'\'(x) = -4 < 0 es estrictamente negativa en todo el dominio; por el Criterio de la Segunda Derivada, la concavidad estricta hacia abajo certifica que el punto crítico es un Máximo Global de Ingreso.'
    },
    
    criticalPoint: 6,
    optimalValue: 72,
    optimalInterpretation: 'Fijar el precio en x* = 6.00 monedas maximiza el Ingreso Total en 72.00 unidades monetarias. Por encima de este valor, la caída en el volumen de ventas supera el incremento unitario de precio.',
    
    domain: [0, 12],
    
    evaluate: (x: number) => -2 * Math.pow(x, 2) + 24 * x,
    evaluateDerivative: (x: number) => -4 * x + 24,
    evaluateSecondDerivative: () => -4,
    
    candadoSteps: {
      step1: {
        question: 'Para la función polinómica I(x) = a·x² + b·x + c, ¿cuál es el axioma de derivación aplicable al término cuadrático?',
        options: [
          {
            id: 'potencia',
            label: 'Regla de la Potencia d/dx[a·xⁿ] = a·n·xⁿ⁻¹ combinada con la Regla de la Suma',
            latex: '\\frac{d}{dx}[a x^n] = a \\cdot n x^{n-1}',
            isCorrect: true,
            explanation: 'Correcto. Cada término polinómico se diferencia de forma lineal reduciendo su exponente en una unidad.'
          },
          {
            id: 'cociente',
            label: 'Regla del Cociente para razones de producción',
            latex: '\\frac{d}{dx}\\left[\\frac{u}{v}\\right]',
            isCorrect: false,
            explanation: 'Incorrecto. La función es un polinomio de segundo grado, no un cociente de polinomios.'
          },
          {
            id: 'cadena',
            label: 'Diferenciación de funciones trascendentes',
            latex: '\\frac{d}{dx}[e^u]',
            isCorrect: false,
            explanation: 'Incorrecto. No existen bases trascendentes ni argumentos compuestos en esta función.'
          }
        ],
        hint: 'Multiplica el coeficiente por el exponente 2 y resta 1 al grado.'
      },
      step2: {
        prompt: 'Diferencia término a término la función de Ingreso Total I(x):',
        terms: [
          { original: 'a x^2', derivative: '2a x', ruleUsed: 'Regla de la potencia: d/dx[ax²] = 2ax' },
          { original: 'b x', derivative: 'b', ruleUsed: 'Derivada lineal: d/dx[bx] = b' },
          { original: 'c', derivative: '0', ruleUsed: 'Regla de la constante: d/dx[c] = 0' }
        ],
        expectedDerivativeLatex: "I'(x) = -4x + 24",
        hint: 'I\'(x) = 2a·x + b.'
      },
      step3: {
        equationLatex: "I'(x^*) = 0 \\implies 2a x^* + b = 0 \\implies x^* = -\\frac{b}{2a}",
        criticalPoint: 6,
        explanation: 'Despeje algebraico de la Condición de Primer Orden: x* = -24 / (2·(-2)) = 6.00.',
        economicResult: 'En x* = 6.00, la tasa marginal instantánea es cero: el ingreso total se encuentra en su cúspide.'
      }
    },

    poeHypothesis: {
      id: 'poe-1',
      question: 'Si modificas únicamente el término constante c (ingreso base autónomo o subsidio fijo), ¿qué ocurrirá con el precio óptimo x* que maximiza el ingreso?',
      context: 'Análisis de invarianza de la Condición de Primer Orden f\'(x*) = 0 frente a desplazamientos verticales.',
      targetParameter: 'c',
      options: [
        {
          id: 'opt-a',
          label: 'El precio óptimo x* aumentará porque el ingreso global disponible es mayor.',
          isCorrect: false,
          explanation: 'Incorrecto. Aunque el ingreso total crece verticalmente, la tasa marginal de ganancia por cada incremento de precio depende únicamente de la pendiente, no de la altura de la curva.'
        },
        {
          id: 'opt-b',
          label: 'El precio óptimo x* permanecerá exactamente inalterado (x* = 6.00), porque la derivada del término constante es cero (d/dx[c] = 0).',
          isCorrect: true,
          explanation: '¡Excelente deducción! Como d/dx[c] = 0, la ecuación I\'(x) = 2a·x + b no depende de c. Por tanto, la raíz x* = -b/(2a) es invariante ante variaciones en c.'
        },
        {
          id: 'opt-c',
          label: 'El precio óptimo x* se reducirá para mantener el equilibrio de mercado.',
          isCorrect: false,
          explanation: 'Incorrecto. El subsidio fijo no cambia la sensibilidad ni la elasticidad marginal de los compradores.'
        }
      ],
      observePrompt: 'Comprobación experimental: Modifica el deslizador del parámetro c en el panel de sensibilidad o arrastra la curva verticalmente. Observa cómo el vértice V* sube o baja de nivel, pero su coordenada horizontal x* se mantiene fija.',
      scientificExplanation: 'Principio de Invarianza Marginal: Toda traslación vertical f(x) + c preserva la función derivada f\'(x). En economía gerencial, los ingresos o costos fijos no alteran el punto de equilibrio marginal de corto plazo.'
    }
  },
  {
    id: 'problema-2',
    problemNumber: 2,
    romanNumeral: 'II',
    title: 'Problema II: Utilidad Neta y Concavidad de Cournot-Marshall',
    era: 'Siglo XIX',
    year: '1838–1890',
    protagonist: 'Augustin Cournot y Alfred Marshall',
    story: 'Durante el desarrollo de la economía matemática clásica, Cournot y Marshall demostraron que el beneficio empresarial se optimiza exactamente cuando el ingreso marginal iguala al costo marginal (Utilidad Marginal nula), y que los costos fijos de infraestructura fabril no alteran el volumen óptimo de producción.',
    economicConcept: 'Criterio de la Segunda Derivada (U\'\' < 0) e Invarianza de Costos Fijos',
    difficulty: 'Nivel II',
    
    variableSymbol: 'q',
    variableLabel: 'Nivel de Producción Agregada',
    variableUnit: 'lotes fabriles',
    functionSymbol: 'U',
    functionName: 'Función de Utilidad Neta',
    functionUnit: 'miles de libras (£)',
    
    baseCoefficients: { a: -3, b: 30, c: -27 },
    parametricMeta: {
      aLabel: 'Penalización por Deseconomías de Escala (a)',
      aUnit: 'k£/lote²',
      aMin: -5,
      aMax: -1,
      aStep: 0.5,

      bLabel: 'Margen de Contribución Variable (b)',
      bUnit: 'k£/lote',
      bMin: 16,
      bMax: 44,
      bStep: 2,

      cLabel: 'Costo Fijo de Operación de Planta (c)',
      cUnit: 'k£',
      cMin: -50,
      cMax: -10,
      cStep: 1
    },

    functionLatex: 'U(q) = -3q^2 + 30q - 27',
    derivativeLatex: "U'(q) = -6q + 30",
    secondDerivativeLatex: "U''(q) = -6 < 0",
    
    concavityAnalysis: {
      value: -6,
      isConcaveDown: true,
      meaning: 'La segunda derivada U\'\'(q) = 2a = -6 es negativa e independiente de q. El Criterio de la Segunda Derivada garantiza que el punto estacionario q* es un Máximo Estricto de Utilidad.'
    },
    
    criticalPoint: 5,
    optimalValue: 48,
    optimalInterpretation: 'Producir exactamente q* = 5.00 lotes genera la Utilidad Máxima de 48.00 mil libras. Alterar el costo fijo c traslada verticalmente la curva sin modificar la decisión óptima q*.',
    
    domain: [0, 10],
    
    evaluate: (q: number) => -3 * Math.pow(q, 2) + 30 * q - 27,
    evaluateDerivative: (q: number) => -6 * q + 30,
    evaluateSecondDerivative: () => -6,
    
    candadoSteps: {
      step1: {
        question: '¿Cuál es el comportamiento de la derivada del costo fijo c al diferenciar la función respecto a q?',
        options: [
          {
            id: 'constante',
            label: 'Su derivada es estrictamente 0 por la Regla de la Constante d/dq[c] = 0',
            latex: '\\frac{d}{dq}[c] = 0',
            isCorrect: true,
            explanation: 'Correcto. Los costos fijos no varían respecto a la escala marginal; su tasa de cambio instantánea es nula.'
          },
          {
            id: 'mantiene',
            label: 'El costo fijo permanece inalterado en la derivada como término independiente',
            latex: '\\frac{d}{dq}[c] = c',
            isCorrect: false,
            explanation: 'Incorrecto. La derivada de cualquier magnitud constante independiente de la variable es cero.'
          },
          {
            id: 'divide',
            label: 'Pasa al denominador como costo medio',
            latex: '\\frac{c}{q}',
            isCorrect: false,
            explanation: 'Incorrecto. Eso corresponde a la definición de costo medio, no a la diferenciación marginal.'
          }
        ],
        hint: 'La derivada mide la variación instantánea; una constante no sufre variación.'
      },
      step2: {
        prompt: 'Calcula la derivada analítica término a término de U(q) = a·q² + b·q + c:',
        terms: [
          { original: 'a q^2', derivative: '2a q', ruleUsed: 'Regla de la potencia: d/dq[aq²] = 2aq' },
          { original: 'b q', derivative: 'b', ruleUsed: 'Derivada lineal: d/dq[bq] = b' },
          { original: 'c', derivative: '0', ruleUsed: 'Regla de la constante: d/dq[c] = 0' }
        ],
        expectedDerivativeLatex: "U'(q) = -6q + 30",
        hint: 'U\'(q) = 2a·q + b.'
      },
      step3: {
        equationLatex: "U'(q^*) = 0 \\implies 2a q^* + b = 0 \\quad \\text{con} \\quad U''(q^*) = 2a < 0",
        criticalPoint: 5,
        explanation: 'Despeje: q* = -b / (2a) = -30 / (2·(-3)) = 5.00 lotes. U\'\'(5) = -6 < 0 confirma el máximo por concavidad.',
        economicResult: 'En q* = 5.00, la Utilidad Marginal es nula y la Utilidad Total alcanza su pico de £48,000.'
      }
    },

    poeHypothesis: {
      id: 'poe-2',
      question: 'Si los costos fijos fabriles aumentan en 15 mil libras (haciendo c más negativo), ¿cómo reaccionará la Utilidad Marginal U\'(q) y el volumen óptimo q*?',
      context: 'Dilema clásico de Cournot y Marshall: Toma de decisiones en el margen frente a costos hundidos/fijos.',
      targetParameter: 'c',
      options: [
        {
          id: 'opt-a',
          label: 'La Utilidad Marginal disminuye y la fábrica debe reducir la producción q*.',
          isCorrect: false,
          explanation: 'Incorrecto. El costo fijo se incurre independientemente del nivel de producción; no modifica el costo de producir una unidad adicional.'
        },
        {
          id: 'opt-b',
          label: 'La Utilidad Marginal y el lote óptimo q* = 5.00 permanecen estrictamente inalterados, ya que d/dq[c] = 0.',
          isCorrect: true,
          explanation: '¡Exacto! El costo marginal de una constante es nulo. Por ende, la regla de decisión marginalista no cambia ante variaciones de costos de estructura.'
        },
        {
          id: 'opt-c',
          label: 'La fábrica debe duplicar q* para amortizar los nuevos costos fijos.',
          isCorrect: false,
          explanation: 'Incorrecto. Producir más allá de q* incurre en deseconomías de escala que reducirían aún más la utilidad neta.'
        }
      ],
      observePrompt: 'Comprobación experimental: Desplaza el control c hacia valores más negativos. Observa la Fig. 2 (Función Marginal U\'): ¡la recta verde no se mueve en absoluto! El cruce con U\'=0 se mantiene fijo en q* = 5.00.',
      scientificExplanation: 'Axioma Microeconómico: Las decisiones de optimización se toman en el margen (U\'=0). Los costos fijos afectan el nivel contable del beneficio, pero no la tasa marginal ni la escala óptima de producción.'
    }
  },
  {
    id: 'problema-3',
    problemNumber: 3,
    romanNumeral: 'III',
    title: 'Problema III: Optimización de Inventarios EOQ de Ford W. Harris',
    era: 'Siglo XX',
    year: '1913',
    protagonist: 'Ford Whitman Harris (1913)',
    story: 'En 1913, el ingeniero Ford Whitman Harris publicó en Westinghouse el modelo analítico de Lote Económico de Pedido (EOQ). Su objetivo consistía en equilibrar dos fuerzas económicas contrapuestas: el costo de reposición por pedido frecuente (proporcional a x⁻¹) frente al costo de posesión en bodega (lineal en x).',
    economicConcept: 'Diferenciación de Exponentes Negativos x⁻¹ y Minimización de Costos',
    difficulty: 'Nivel III',
    
    variableSymbol: 'x',
    variableLabel: 'Tamaño del Lote de Reorden',
    variableUnit: 'cientos de unidades',
    functionSymbol: 'C',
    functionName: 'Costo Logístico Agregado',
    functionUnit: 'miles de dólares ($k)',
    
    baseCoefficients: { a: 2, b: 32, c: 10 },
    parametricMeta: {
      aLabel: 'Costo Unitario Anual de Almacenamiento (a)',
      aUnit: 'k$/(100 u)',
      aMin: 1,
      aMax: 4,
      aStep: 0.5,

      bLabel: 'Costo Fijo de Gestión de Envío por Lote (b)',
      bUnit: 'k$',
      bMin: 16,
      bMax: 64,
      bStep: 2,

      cLabel: 'Costo Fijo de Operación Logística (c)',
      cUnit: 'k$',
      cMin: 5,
      cMax: 25,
      cStep: 1
    },

    functionLatex: 'C(x) = 2x + 32x^{-1} + 10',
    derivativeLatex: "C'(x) = 2 - 32x^{-2} = 2 - \\frac{32}{x^2}",
    secondDerivativeLatex: "C''(x) = \\frac{64}{x^3} > 0",
    
    concavityAnalysis: {
      value: 1,
      isConcaveDown: false,
      meaning: 'Para x* > 0, la segunda derivada C\'\'(x) = 2b/x³ > 0 es estrictamente positiva. La concavidad estricta hacia arriba certifica que la Condición de Primer Orden resuelve un Mínimo Absoluto de Costo.'
    },
    
    criticalPoint: 4,
    optimalValue: 26,
    optimalInterpretation: 'La dimensión óptima de reorden es x* = 4.00 cientos de unidades (400 unidades), minimizando el costo total en $26.00k anuales.',
    
    domain: [1, 10],
    
    evaluate: (x: number) => 2 * x + 32 / x + 10,
    evaluateDerivative: (x: number) => 2 - 32 / Math.pow(x, 2),
    evaluateSecondDerivative: (x: number) => 64 / Math.pow(x, 3),
    
    candadoSteps: {
      step1: {
        question: '¿Qué teorema de derivación se aplica al término de costos de transporte b·x⁻¹ = b/x?',
        options: [
          {
            id: 'potencia_negativa',
            label: 'Regla de la Potencia para exponentes enteros negativos: d/dx[x⁻¹] = -1·x⁻² = -1/x²',
            latex: '\\frac{d}{dx}[b x^{-1}] = -b x^{-2} = -\\frac{b}{x^2}',
            isCorrect: true,
            explanation: 'Correcto. La variable en el denominador equivale a x⁻¹; al diferenciar, el exponente baja multiplicando con signo negativo.'
          },
          {
            id: 'logaritmo_error',
            label: 'Diferenciación logarítmica d/dx[b/x] = b·ln(x)',
            latex: 'b \\ln(x)',
            isCorrect: false,
            explanation: 'Incorrecto. La función logarítmica es la antiderivada de 1/x, no su derivada.'
          },
          {
            id: 'lineal_error',
            label: 'Derivación como coeficiente lineal constante',
            latex: 'b',
            isCorrect: false,
            explanation: 'Incorrecto. La variable se encuentra en el denominador; su grado es -1, no 1.'
          }
        ],
        hint: 'Reescribe b/x como b·x⁻¹ y aplica n = -1.'
      },
      step2: {
        prompt: 'Calcula la derivada de la función de Costo Logístico C(x) = a·x + b·x⁻¹ + c:',
        terms: [
          { original: 'a x', derivative: 'a', ruleUsed: 'Derivada lineal: d/dx[ax] = a' },
          { original: 'b x^{-1}', derivative: '-b x^{-2}', ruleUsed: 'Potencia negativa: d/dx[b·x⁻¹] = -b·x⁻²' },
          { original: 'c', derivative: '0', ruleUsed: 'Costo fijo independiente: d/dx[c] = 0' }
        ],
        expectedDerivativeLatex: "C'(x) = 2 - \\frac{32}{x^2}",
        hint: 'C\'(x) = a - b/x².'
      },
      step3: {
        equationLatex: "C'(x^*) = 0 \\implies a - \\frac{b}{(x^*)^2} = 0 \\implies (x^*)^2 = \\frac{b}{a} \\implies x^* = \\sqrt{\\frac{b}{a}}",
        criticalPoint: 4,
        explanation: 'Despeje: (x*)² = 32 / 2 = 16 ⟹ x* = √16 = 4.00 (se adopta la raíz positiva por restricción económica x > 0).',
        economicResult: 'En x* = 4.00, el costo de emitir órdenes compensa con precisión el costo de almacenaje.'
      }
    },

    poeHypothesis: {
      id: 'poe-3',
      question: 'Si el costo unitario de almacenaje (parámetro a) se cuadruplica mientras los costos de pedido se mantienen fijos, ¿qué ocurrirá con el tamaño de lote óptimo x*?',
      context: 'Sensibilidad no lineal en el modelo EOQ de Harris con exponente fraccionario.',
      targetParameter: 'a',
      options: [
        {
          id: 'opt-a',
          label: 'El lote óptimo x* se reducirá a la mitad (x* / √4 = x* / 2), pues conviene ordenar pedidos más pequeños y frecuentes.',
          isCorrect: true,
          explanation: '¡Brillante deducción analítica! En x* = √(b/a), como el parámetro a está en el denominador dentro de la raíz cuadrada, multiplicar a por 4 divide a x* por √4 = 2.'
        },
        {
          id: 'opt-b',
          label: 'El lote óptimo x* se dividirá por 4 de forma directamente proporcional.',
          isCorrect: false,
          explanation: 'Incorrecto. La relación no es lineal; la condición de primer orden genera una raíz cuadrada sobre el cociente b/a.'
        },
        {
          id: 'opt-c',
          label: 'El lote óptimo x* debe aumentar para llenar la bodega más rápido.',
          isCorrect: false,
          explanation: 'Incorrecto. Si almacenar es cuatro veces más caro, mantener lotes grandes dispara el costo de posesión en almacén.'
        }
      ],
      observePrompt: 'Comprobación experimental: Desplaza el parámetro a de 2 a 4 en el control. Observa cómo el vértice V* en la Fig. 1 y el cruce C\'(x)=0 en la Fig. 2 se trasladan hacia la izquierda.',
      scientificExplanation: 'Ley de la Raíz Cuadrada de Inventarios: La sensibilidad del óptimo respecto al costo de posesión sigue una elasticidad de -0.5 (potencia inversa de la raíz cuadrada). Al cuadruplicar el costo de almacenaje, el tamaño económico de pedido se contrae en un 50%.'
    }
  },
  {
    id: 'problema-4',
    problemNumber: 4,
    romanNumeral: 'IV',
    title: 'Problema IV: Capitalización Continua y Derivada Instantánea',
    era: 'Siglo XXI',
    year: 'Actualidad',
    protagonist: 'Modelos Cuantitativos de Algoritmos Financieros',
    story: 'En los modelos de valoración de activos financieros y derivados de alta frecuencia, la capitalización de intereses ocurre de manera continua en base e. La derivada de primer orden determina la tasa instantánea de rendimiento marginal dV/dt requerida para la toma automatizada de decisiones.',
    economicConcept: 'Tasa Instantánea de Crecimiento y Regla de la Cadena Exponencial e^(kt)',
    difficulty: 'Nivel IV',
    
    variableSymbol: 't',
    variableLabel: 'Horizonte Temporal Transcurrido',
    variableUnit: 'años',
    functionSymbol: 'V',
    functionName: 'Valoración Continua de Cartera',
    functionUnit: 'millones de dólares ($M)',
    
    baseCoefficients: { a: 10, b: 0.5, c: 0 },
    parametricMeta: {
      aLabel: 'Capital Inicial Base Depositado (a)',
      aUnit: 'M$',
      aMin: 5,
      aMax: 30,
      aStep: 1,

      bLabel: 'Tasa Nominal de Capitalización Continua (b)',
      bUnit: '1/año',
      bMin: 0.1,
      bMax: 0.8,
      bStep: 0.05,

      cLabel: 'Reserva Fija Autónoma de Liquidez (c)',
      cUnit: 'M$',
      cMin: 0,
      cMax: 15,
      cStep: 1
    },

    functionLatex: 'V(t) = 10 e^{0.5t}',
    derivativeLatex: "V'(t) = 5 e^{0.5t}",
    secondDerivativeLatex: "V''(t) = 2.5 e^{0.5t} > 0",
    
    concavityAnalysis: {
      value: 2.5,
      isConcaveDown: false,
      meaning: 'La segunda derivada V\'\'(t) = a·b²·e^(bt) > 0 es estrictamente positiva para todo t ≥ 0. La curva es estrictamente convexa, indicando una aceleración perpetua del rendimiento compuesto.'
    },
    
    criticalPoint: 0,
    optimalValue: 10,
    optimalInterpretation: 'En el origen t = 0, la velocidad instantánea de creación de valor es V\'(0) = a·b = 5.00 M$/año sobre un capital base de $10.00M.',
    
    domain: [0, 4],
    
    evaluate: (t: number) => 10 * Math.exp(0.5 * t),
    evaluateDerivative: (t: number) => 5 * Math.exp(0.5 * t),
    evaluateSecondDerivative: (t: number) => 2.5 * Math.exp(0.5 * t),
    
    candadoSteps: {
      step1: {
        question: '¿Qué principio de derivación se aplica a la función exponencial continua V(t) = a·e^(b·t)?',
        options: [
          {
            id: 'cadena_exponencial',
            label: 'Regla de la Cadena Exponencial: d/dt[a·e^(bt)] = a·b·e^(bt)',
            latex: '\\frac{d}{dt}[a e^{bt}] = a \\cdot b e^{bt}',
            isCorrect: true,
            explanation: 'Correcto. La derivada de eᵘ(t) es eᵘ(t) multiplicada por la derivada interna del exponente u\'(t) = b.'
          },
          {
            id: 'potencia_invalida',
            label: 'Regla de la potencia sobre base trascendente',
            latex: 'a \\cdot bt \\cdot e^{bt-1}',
            isCorrect: false,
            explanation: 'Incorrecto. El número e es la base constante de Euler; no se aplica la regla de la potencia.'
          },
          {
            id: 'constante_error',
            label: 'Derivada nula',
            latex: '0',
            isCorrect: false,
            explanation: 'Incorrecto. La variable t se encuentra en el exponente.'
          }
        ],
        hint: 'Multiplica el coeficiente exterior por la tasa b del exponente.'
      },
      step2: {
        prompt: 'Calcula la derivada analítica de V(t) = a·e^(b·t) + c:',
        terms: [
          { original: 'a e^{bt}', derivative: 'a·b e^{bt}', ruleUsed: 'Regla de la cadena: d/dt[a·e^(bt)] = a·b·e^(bt)' },
          { original: 'c', derivative: '0', ruleUsed: 'Regla de la constante: d/dt[c] = 0' }
        ],
        expectedDerivativeLatex: "V'(t) = 5 e^{0.5t}",
        hint: 'V\'(t) = a·b·e^(bt).'
      },
      step3: {
        equationLatex: "V'(0) = a \\cdot b \\cdot e^0 = a \\cdot b",
        criticalPoint: 0,
        explanation: 'Evaluando en t = 0: V\'(0) = 10 · 0.5 · e⁰ = 5.00 M$/año.',
        economicResult: 'La tasa instantánea de rendimiento en el instante de apertura es de $5.00M anuales.'
      }
    },

    poeHypothesis: {
      id: 'poe-4',
      question: 'Al incrementar la tasa nominal de rendimiento b de 0.5 a 0.8 anual, ¿qué ocurre con la velocidad instantánea de creación de valor V\'(t) en el momento inicial t = 0?',
      context: 'Aplicación de la Regla de la Cadena Exponencial d/dt[a·e^(bt)] = a·b·e^(bt) en el origen.',
      targetParameter: 'b',
      options: [
        {
          id: 'opt-a',
          label: 'La velocidad instantánea inicial V\'(0) aumenta en proporción directa al incremento de b (V\'(0) = a·b), haciendo más empinada la recta tangente.',
          isCorrect: true,
          explanation: '¡Excelente! En t = 0, el factor e^(b·0) = 1. Por consiguiente, la derivada instantánea es simplemente V\'(0) = a·b, creciendo de forma lineal con la tasa b.'
        },
        {
          id: 'opt-b',
          label: 'La velocidad en t = 0 permanece en cero porque el tiempo apenas comienza.',
          isCorrect: false,
          explanation: 'Incorrecto. La velocidad de flujo continuo de capital no es nula en t = 0; el capital inicial comienza a devengar intereses instantáneamente.'
        },
        {
          id: 'opt-c',
          label: 'La velocidad instantánea se multiplica exponencialmente por e^0.8.',
          isCorrect: false,
          explanation: 'Incorrecto. En t = 0 el exponente b·t es 0, por lo que e⁰ = 1.'
        }
      ],
      observePrompt: 'Comprobación experimental: Desplaza el control de la tasa b. Observa cómo la recta tangente verde en el origen se inclina con mayor pendiente y la Fig. 2 eleva su punto de partida.',
      scientificExplanation: 'Regla de la Cadena Exponencial: La derivada de f(t) = a·e^(bt) extrae la tasa interna b como factor multiplicativo exterior. En t = 0, la pendiente de la recta tangente refleja con exactitud el producto a·b.'
    }
  }
];
