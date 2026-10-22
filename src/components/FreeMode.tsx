import React, { useState, useEffect } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Target
} from 'lucide-react'
import { WhiteboardCanvas } from './WhiteboardCanvas'
import { GraphingCalculator } from './GraphingCalculator'
import { LatexRenderer } from './LatexRenderer'
import type { BusinessProblem, ProblemId } from '../types/problem'
import { getMathjsFormula, getDefaultTangentPoint } from '../services/problemHelpers'

interface FreeModeProps {
  currentProblem: BusinessProblem
  onSelectProblem: (id: ProblemId) => void
  problemsList: BusinessProblem[]
}

export const FreeMode: React.FC<FreeModeProps> = ({ 
  currentProblem,
  onSelectProblem,
  problemsList 
}) => {
  // Índice del problema activo en la lista
  const currentIndex = problemsList.findIndex(p => p.id === currentProblem.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < problemsList.length - 1

  // Punto de tangencia representativo para el problema
  const defaultX0 = getDefaultTangentPoint(currentProblem)

  // Estado compartido entre la pizarra y la calculadora
  const [calculatorInputs, setCalculatorInputs] = useState<{
    y1: string
    y2: string
    y3: string
    xStar?: number
  }>({
    y1: getMathjsFormula(currentProblem),
    y2: '',
    y3: '',
    xStar: undefined
  })

  // Sincronizar automáticamente cuando el usuario cambia de problema
  useEffect(() => {
    setCalculatorInputs({
      y1: getMathjsFormula(currentProblem),
      y2: '',
      y3: '',
      xStar: undefined
    })
  }, [currentProblem.id])

  const handleReceiveFromWhiteboard = (data: {
    y1?: string
    y2?: string
    y3?: string
    xStar?: number
  }) => {
    setCalculatorInputs(prev => ({
      y1: data.y1 !== undefined && data.y1.trim() !== '' ? data.y1 : prev.y1,
      y2: data.y2 !== undefined ? data.y2 : prev.y2,
      y3: data.y3 !== undefined ? data.y3 : prev.y3,
      xStar: data.xStar
    }))
  }

  // Definición clara de la meta según el tipo de problema
  const renderGoalText = () => {
    const v = currentProblem.variableSymbol
    const f = currentProblem.functionSymbol
    const pNum = currentProblem.problemNumber

    if (pNum === 1) {
      return (
        <span>
          <strong>Meta Didáctica:</strong> Derivar la función de costo fijo{' '}
          <code className="text-blue-800 font-bold">{f}'({v}) = 0</code>, verificar analíticamente que la derivada
          es idénticamente nula en todo el dominio y comprobar que la recta tangente en{' '}
          <code className="text-amber-800 font-bold">{v}₀ = {defaultX0}</code> es horizontal.
        </span>
      )
    }

    if (pNum === 2 || pNum === 3) {
      return (
        <span>
          <strong>Meta Didáctica:</strong> Derivar la función marginal lineal{' '}
          <code className="text-blue-800 font-bold">{f}'({v})</code>, comprobar la tasa de variación constante y
          trazar la recta tangente <code className="text-amber-800 font-bold">T({v})</code> en{' '}
          <code className="text-amber-800 font-bold">{v}₀ = {defaultX0}</code>.
        </span>
      )
    }

    return (
      <span>
        <strong>Meta Didáctica:</strong> Derivar la función marginal{' '}
        <code className="text-blue-800 font-bold">{f}'({v})</code>, hallar el punto crítico óptimo{' '}
        <code className="text-purple-800 font-bold">{v}* = {currentProblem.criticalPoint} {currentProblem.variableUnit}</code>{' '}
        donde <code className="text-emerald-800 font-bold">{f}'({v}*) = 0</code> y la recta tangente{' '}
        <code className="text-amber-800 font-bold">T({v})</code> en{' '}
        <code className="text-amber-800 font-bold">{v}₀ = {defaultX0}</code>.
      </span>
    )
  }

  return (
    <div id="step-free-mode" className="w-full space-y-4 font-sans">
      
      {/* 1. TARJETA LIMPIA Y VISIBLE: ENUNCIADO DEL PROBLEMA EMPRESARIAL ACTIVO */}
      <section className="bg-white border border-[#d4d4d0] p-4 sm:p-5 shadow-xs space-y-3.5">
        
        {/* Cabecera Técnica de la Tarjeta con Navegación Directa */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5e0] pb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-700 inline-block"></span>
            <span className="font-bold text-stone-900 uppercase tracking-wider text-[11px] sm:text-xs">
              CASO EMPRESARIAL ACTIVO
            </span>
            <span className="text-stone-400">|</span>
            <span className="px-2 py-0.5 bg-[#f7f6f2] border border-[#d4d4d0] text-stone-700 font-bold text-[10px] uppercase">
              Nivel {currentProblem.level}
            </span>
            <span className="text-stone-400 hidden sm:inline">|</span>
            <span className="text-stone-600 hidden sm:inline">{currentProblem.economicConcept}</span>
          </div>

          {/* Controles de Navegación Rápida entre Problemas P1 a P20 */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => hasPrev && onSelectProblem(problemsList[currentIndex - 1].id)}
              disabled={!hasPrev}
              className={`h-7 px-2 border flex items-center gap-1 text-[11px] transition-colors ${
                hasPrev 
                  ? 'bg-white hover:bg-[#f7f6f2] border-[#d4d4d0] text-stone-800 cursor-pointer' 
                  : 'bg-[#faf9f6] border-[#e5e5e0] text-stone-300 cursor-not-allowed'
              }`}
              title="Ir al problema anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Selector Sincronizado */}
            <select
              value={currentProblem.id}
              onChange={(e) => onSelectProblem(e.target.value)}
              className="h-7 px-2 bg-[#f7f6f2] hover:bg-white border border-[#d4d4d0] text-stone-900 font-mono text-[11px] font-bold focus:outline-none focus:border-blue-700 cursor-pointer"
            >
              <optgroup label="NIVEL I — Muy Simples (Lineales y Constantes)">
                {problemsList.filter(p => p.level === 'I').map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="NIVEL II — Simples (Cuadráticas y Optimización)">
                {problemsList.filter(p => p.level === 'II').map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="NIVEL III — Intermedios (Equilibrio, Cúbicas y EOQ)">
                {problemsList.filter(p => p.level === 'III').map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="NIVEL IV — Avanzados (Costo Medio y Exponencial)">
                {problemsList.filter(p => p.level === 'IV').map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              onClick={() => hasNext && onSelectProblem(problemsList[currentIndex + 1].id)}
              disabled={!hasNext}
              className={`h-7 px-2 border flex items-center gap-1 text-[11px] transition-colors ${
                hasNext 
                  ? 'bg-white hover:bg-[#f7f6f2] border-[#d4d4d0] text-stone-800 cursor-pointer' 
                  : 'bg-[#faf9f6] border-[#e5e5e0] text-stone-300 cursor-not-allowed'
              }`}
              title="Ir al problema siguiente"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Título y Enunciado Completo del Caso */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <div className="lg:col-span-8 space-y-2">
            <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <span>{currentProblem.title}</span>
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed text-justify">
              {currentProblem.story}
            </p>
          </div>

          {/* Caja con la Ecuación Primaria Renderizada en KaTeX */}
          <div className="lg:col-span-4 p-3 bg-[#faf9f6] border border-[#e5e5e0] space-y-1.5 shrink-0">
            <span className="font-mono text-[10px] uppercase font-bold text-stone-500 block">
              Ecuación del Modelo
            </span>
            <div className="py-1 px-2 bg-white border border-[#d4d4d0] flex items-center justify-center text-sm font-bold text-blue-900 overflow-x-auto">
              <LatexRenderer latex={currentProblem.functionLatex} displayMode={false} className="text-sm font-semibold" />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500">
              <span>Var: <strong className="text-stone-800">{currentProblem.variableSymbol}</strong> ({currentProblem.variableUnit})</span>
              <span>Mag: <strong className="text-stone-800">{currentProblem.functionSymbol}</strong> ({currentProblem.functionUnit})</span>
            </div>
          </div>
        </div>

        {/* Franja de Meta Didáctica Exacta para el Estudiante */}
        <div className="p-3 bg-[#f7f6f2] border-l-4 border-l-blue-700 border border-[#d4d4d0] flex items-start gap-2.5 text-xs text-stone-800 leading-relaxed">
          <Target className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="flex-1">
            {renderGoalText()}
          </div>
        </div>

      </section>

      {/* 2. GRID DE DOS COLUMNAS: PIZARRA CIENTÍFICA (IZQ) Y MOTOR CARTESIANO (DER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Columna Izquierda: Pizarra con Tinta Digital y Líneas Simbólicas */}
        <div className="lg:col-span-6 space-y-4">
          <WhiteboardCanvas
            onSendToCalculator={handleReceiveFromWhiteboard}
            initialExpressions={{
              y1: calculatorInputs.y1,
              y2: calculatorInputs.y2,
              y3: calculatorInputs.y3,
              xStar: calculatorInputs.xStar
            }}
            problem={currentProblem}
          />
        </div>

        {/* Columna Derecha: Calculadora Gráfica con Doble Prueba Geométrica */}
        <div className="lg:col-span-6 space-y-4">
          <GraphingCalculator
            initialY1={calculatorInputs.y1}
            initialY2={calculatorInputs.y2}
            initialY3={calculatorInputs.y3}
            initialXStar={calculatorInputs.xStar}
            domainX={currentProblem.domain}
            problem={currentProblem}
          />
        </div>

      </div>

    </div>
  )
}
