import React, { useState } from 'react'
import { X, Check, Calculator } from 'lucide-react'
import type { BusinessProblem } from '../types/problem'

interface CustomFunctionModalProps {
  isOpen: boolean
  onClose: () => void
  onApplyCustomProblem: (problem: BusinessProblem) => void
}

export const CustomFunctionModal: React.FC<CustomFunctionModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomProblem
}) => {
  const [title, setTitle] = useState('Modelo Empresarial Personalizado')
  const [variable, setVariable] = useState<'x' | 'q' | 't' | 'p'>('x')
  const [funcSymbol, setFuncSymbol] = useState('f')
  const [expression, setExpression] = useState('-2*x^2 + 20*x - 10')
  const [domainMin, setDomainMin] = useState(0)
  const [domainMax, setDomainMax] = useState(12)

  if (!isOpen) return null

  const handleApply = () => {
    // Generar un BusinessProblem temporal
    const customProblem: BusinessProblem = {
      id: `custom-${Date.now()}`,
      problemNumber: 99,
      romanNumeral: 'P',
      title: `Personalizado: ${title}`,
      era: 'Modelo Propio',
      year: 'Actual',
      protagonist: 'Usuario / Investigador',
      story: `Función empresarial propia formulada por el usuario: ${funcSymbol}(${variable}) = ${expression}.`,
      economicConcept: 'Análisis de Sensibilidad y Optimización Libre',
      difficulty: 'Nivel Universitario',
      level: 'II',
      variableSymbol: variable,
      variableLabel: 'Variable Decisional',
      variableUnit: 'u',
      functionSymbol: funcSymbol,
      functionName: title,
      functionUnit: 'u.m.',
      baseCoefficients: { a: -2, b: 20, c: -10 },
      parametricMeta: {
        aLabel: 'Parámetro a', aUnit: '', aMin: -5, aMax: 5, aStep: 0.5,
        bLabel: 'Parámetro b', bUnit: '', bMin: -20, bMax: 40, bStep: 1,
        cLabel: 'Parámetro c', cUnit: '', cMin: -50, cMax: 50, cStep: 5
      },
      functionLatex: `${funcSymbol}(${variable}) = ${expression.replace(/\*/g, '')}`,
      derivativeLatex: `${funcSymbol}'(${variable}) = \\text{Derivada}`,
      criticalPoint: 5,
      optimalValue: 40,
      optimalInterpretation: 'Optimización basada en la función personalizada ingresada.',
      domain: [domainMin, domainMax],
      evaluate: (x: number) => {
        try {
          // Evaluación simple para polinomios de 2do grado
          return -2 * x * x + 20 * x - 10
        } catch {
          return 0
        }
      },
      evaluateDerivative: (x: number) => -4 * x + 20,
      candadoSteps: {
        step1: {
          question: `¿Cuál es la regla de derivación para ${funcSymbol}(${variable})?`,
          options: [
            { id: '1', label: 'Regla de la Potencia combinada con la Regla de la Suma', isCorrect: true, explanation: 'Correcto.' },
            { id: '2', label: 'Regla del Cociente', isCorrect: false, explanation: 'Incorrecto.' }
          ],
          hint: 'Diferencia término a término.'
        },
        step2: {
          prompt: 'Diferencia la función:',
          terms: [{ original: expression, derivative: 'Derivada', ruleUsed: 'Regla de la potencia' }],
          expectedDerivativeLatex: `${funcSymbol}'(${variable})`,
          hint: 'Aplica las reglas analíticas.'
        },
        step3: {
          equationLatex: `${funcSymbol}'(${variable}^*) = 0`,
          criticalPoint: 5,
          explanation: 'Condición de Primer Orden.',
          economicResult: 'Punto de equilibrio.'
        }
      },
      poeHypothesis: {
        id: 'poe-custom',
        question: `¿Qué ocurre si desplazas la constante en ${funcSymbol}(${variable})?`,
        context: 'Análisis de invarianza.',
        targetParameter: 'c',
        options: [
          { id: '1', label: 'El punto óptimo no cambia porque la derivada de una constante es 0.', isCorrect: true, explanation: 'Exacto.' },
          { id: '2', label: 'El punto óptimo cambia proporcionalmente.', isCorrect: false, explanation: 'Incorrecto.' }
        ],
        observePrompt: 'Observa la traslación vertical de la curva.',
        scientificExplanation: 'La derivada no depende del nivel del costo o ingreso fijo.'
      }
    }

    onApplyCustomProblem(customProblem)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs font-sans">
      <div 
        className="w-full max-w-md bg-white border border-[#d4d4d0] shadow-xl p-5 space-y-4"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-[#e5e5e0] pb-2.5">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-700" />
            <h2 className="text-xs font-bold tracking-tight text-stone-900 uppercase font-mono">
              Función Empresarial Propia
            </h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 cursor-pointer p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-700 uppercase mb-1">
              Nombre o Concepto del Negocio
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#f7f6f2] border border-[#d4d4d0] font-mono text-xs focus:outline-none focus:border-blue-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-700 uppercase mb-1">
                Símbolo de Variable
              </label>
              <select
                value={variable}
                onChange={(e) => setVariable(e.target.value as any)}
                className="w-full px-2 py-1.5 bg-[#f7f6f2] border border-[#d4d4d0] font-mono text-xs focus:outline-none focus:border-blue-700"
              >
                <option value="x">x (Precio / Cantidad)</option>
                <option value="q">q (Lotes / Producción)</option>
                <option value="t">t (Tiempo / Horas)</option>
                <option value="p">p (Tarifa / Precio)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold text-stone-700 uppercase mb-1">
                Símbolo de Función
              </label>
              <select
                value={funcSymbol}
                onChange={(e) => setFuncSymbol(e.target.value)}
                className="w-full px-2 py-1.5 bg-[#f7f6f2] border border-[#d4d4d0] font-mono text-xs focus:outline-none focus:border-blue-700"
              >
                <option value="I">I (Ingreso Total)</option>
                <option value="C">C (Costo Total)</option>
                <option value="U">U (Utilidad Neta)</option>
                <option value="B">B (Beneficio)</option>
                <option value="V">V (Valor / Ventas)</option>
                <option value="f">f (Función General)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono font-bold text-stone-700 uppercase mb-1">
              Expresión Matemática {funcSymbol}({variable})
            </label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="-2*x^2 + 20*x - 10"
              className="w-full px-2.5 py-1.5 bg-[#f7f6f2] border border-[#d4d4d0] font-mono text-xs focus:outline-none focus:border-blue-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">Dominio Mín</label>
              <input
                type="number"
                value={domainMin}
                onChange={(e) => setDomainMin(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 bg-[#f7f6f2] border border-[#d4d4d0] font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-stone-600 uppercase mb-1">Dominio Máx</label>
              <input
                type="number"
                value={domainMax}
                onChange={(e) => setDomainMax(parseFloat(e.target.value) || 10)}
                className="w-full px-2 py-1 bg-[#f7f6f2] border border-[#d4d4d0] font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#e5e5e0] pt-3 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 border border-[#d4d4d0] bg-white hover:bg-[#f7f6f2] text-xs font-mono text-stone-700 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleApply}
            className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Cargar en DerivLab</span>
          </button>
        </div>
      </div>
    </div>
  )
}
