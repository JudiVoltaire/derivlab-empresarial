import React, { useState, useEffect, useMemo, useRef } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Info
} from 'lucide-react'
import { compile } from 'mathjs'
import { WhiteboardCanvas, formatRawToLatex } from './WhiteboardCanvas'
import { GraphingCalculator } from './GraphingCalculator'
import { LatexRenderer } from './LatexRenderer'
import type { BusinessProblem, ProblemId } from '../types/problem'
import { getDefaultTangentPoint } from '../services/problemHelpers'
import { soundEngine } from '../services'

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
  // Navegación de ejercicios
  const currentIndex = problemsList.findIndex(p => p.id === currentProblem.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < problemsList.length - 1

  // Estado del ejercicio: respuestas del alumno
  const [userDerivative, setUserDerivative] = useState<string>('')
  const [userXStar, setUserXStar] = useState<string>('')
  const [testPointX0, setTestPointX0] = useState<number>(() => getDefaultTangentPoint(currentProblem))

  // Referencia para no repetir el acorde de éxito
  const hasPlayedSuccessRef = useRef<boolean>(false)

  // ¿Este problema tiene un punto crítico interior (máximo o mínimo)?
  const hasCriticalPoint = currentProblem.criticalPoint > 0 && currentProblem.problemNumber >= 4

  // Al cambiar de problema, limpiar respuestas y actualizar punto de prueba
  useEffect(() => {
    setUserDerivative('')
    setUserXStar('')
    setTestPointX0(getDefaultTangentPoint(currentProblem))
    hasPlayedSuccessRef.current = false
  }, [currentProblem.id])

  // Validación de la derivada del alumno en tiempo real
  const validation = useMemo(() => {
    if (!userDerivative || !userDerivative.trim()) {
      return {
        status: 'empty' as const,
        message: 'Escribe tu derivada arriba para verla dibujada en verde sobre el gráfico.'
      }
    }

    let clean = userDerivative.trim()
    clean = clean.replace(/^[a-zA-Z_]'\([^)]*\)\s*=\s*/, '')
    clean = clean.replace(/^[a-zA-Z_]\([^)]*\)\s*=\s*/, '')
    clean = clean.replace(/(\d)([a-zA-Z])/g, '$1*$2')
    clean = clean.replace(/(\))([a-zA-Z\d])/g, '$1*$2')

    let userCompiledFn: ((val: number) => number) | null = null
    try {
      const compiled = compile(clean)
      userCompiledFn = (val: number): number => {
        try {
          const res = compiled.evaluate({ 
            x: val, 
            q: val, 
            t: val, 
            p: val, 
            e: Math.E 
          })
          return typeof res === 'number' && !isNaN(res) && isFinite(res) ? res : NaN
        } catch {
          return NaN
        }
      }
    } catch {
      return {
        status: 'syntax_error' as const,
        message: 'Revisa la escritura: usa signos y operaciones claros (ej. -4x + 24 o 3/x^2).'
      }
    }

    // Comprobar equivalencia matemática contra la derivada real en 4 puntos del dominio
    const [dMin, dMax] = currentProblem.domain
    const span = dMax - dMin
    const testPoints = [
      dMin + span * 0.2,
      dMin + span * 0.4,
      dMin + span * 0.6,
      dMin + span * 0.8
    ]

    let maxDiff = 0
    for (const pt of testPoints) {
      const studentVal = userCompiledFn(pt)
      const expectedVal = currentProblem.evaluateDerivative(pt)
      if (isNaN(studentVal)) {
        maxDiff = 999
        break
      }
      const diff = Math.abs(studentVal - expectedVal)
      if (diff > maxDiff) maxDiff = diff
    }

    const isDerivCorrect = maxDiff < 0.15

    if (!isDerivCorrect) {
      return {
        status: 'incorrect' as const,
        message: 'La línea verde no coincide con la pendiente real de la curva azul. Revisa tus operaciones.'
      }
    }

    // Si la derivada es correcta pero falta o está mal el punto crítico
    if (hasCriticalPoint) {
      if (!userXStar || userXStar.trim() === '') {
        return {
          status: 'partial' as const,
          message: '¡Derivada correcta! Ahora escribe el punto donde la derivada da 0.'
        }
      }

      const parsedXStar = parseFloat(userXStar)
      if (isNaN(parsedXStar) || Math.abs(parsedXStar - currentProblem.criticalPoint) > 0.15) {
        return {
          status: 'partial_wrong_point' as const,
          message: `La derivada es correcta, pero el punto donde da 0 no coincide con el óptimo real.`
        }
      }
    }

    return {
      status: 'correct' as const,
      message: hasCriticalPoint
        ? `✓ ¡Correcto! Tu derivada coincide con la curva y el punto óptimo está bien calculado.`
        : `✓ ¡Correcto! Tu derivada coincide exactamente con la función empresarial.`
    }
  }, [userDerivative, userXStar, currentProblem, hasCriticalPoint])

  // Disparar sonido de acierto cuando se complete exitosamente
  useEffect(() => {
    if (validation.status === 'correct' && !hasPlayedSuccessRef.current) {
      hasPlayedSuccessRef.current = true
      soundEngine.playSuccessChord()
    }
  }, [validation.status])

  // Formato LaTeX dinámico para la vista previa
  const liveLatexPreview = useMemo(() => {
    return formatRawToLatex(
      userDerivative, 
      currentProblem.variableSymbol, 
      currentProblem.functionSymbol
    )
  }, [userDerivative, currentProblem.variableSymbol, currentProblem.functionSymbol])

  // Ejemplo sugerido para el placeholder según las variables del ejercicio
  const placeholderExample = useMemo(() => {
    const v = currentProblem.variableSymbol
    if (v === 'q') return '-6q + 30'
    if (v === 't') return '6t'
    if (v === 'p') return '-10p + 50'
    return '-4x + 24'
  }, [currentProblem.variableSymbol])

  return (
    <div id="step-free-mode" className="w-full space-y-4 font-sans">
      
      {/* 1. TARJETA PRINCIPAL DEL EJERCICIO (TODO EN UN SOLO LUGAR) */}
      <section className="bg-white border border-[#d4d4d0] p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Barra superior limpia con selector de los 20 problemas */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e5e0] pb-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-700 inline-block"></span>
            <span className="font-bold text-stone-900 uppercase">
              {currentProblem.title.split('·')[0]?.trim()}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-700 font-sans font-medium text-xs">
              {currentProblem.title.split('·')[1]?.trim() || currentProblem.title}
            </span>
            <span className="px-2 py-0.5 bg-[#f7f6f2] border border-[#d4d4d0] text-stone-600 text-[10px] uppercase font-bold">
              Nivel {currentProblem.level}
            </span>
          </div>

          {/* Botones de navegación directa: < Anterior, Selector, Siguiente > */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => hasPrev && onSelectProblem(problemsList[currentIndex - 1].id)}
              disabled={!hasPrev}
              className={`h-7 px-2 border flex items-center gap-1 text-[11px] transition-colors ${
                hasPrev 
                  ? 'bg-white hover:bg-[#f7f6f2] border-[#d4d4d0] text-stone-800 cursor-pointer' 
                  : 'bg-[#faf9f6] border-[#e5e5e0] text-stone-300 cursor-not-allowed'
              }`}
              title="Problema anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <select
              value={currentProblem.id}
              onChange={(e) => onSelectProblem(e.target.value)}
              className="h-7 px-2 bg-[#f7f6f2] hover:bg-white border border-[#d4d4d0] text-stone-900 font-mono text-[11px] font-bold focus:outline-none focus:border-blue-700 cursor-pointer"
            >
              <optgroup label="NIVEL I — Muy Simples (Constantes y Lineales)">
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
              title="Siguiente problema"
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Línea breve de contexto empresarial y Fórmula en grande */}
        <div className="space-y-2">
          <p className="text-xs text-stone-600 font-sans leading-relaxed">
            {currentProblem.economicConcept} · {currentProblem.story.split('.')[0]}.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-800">
              Deriva esta función:
            </span>
            <div className="py-1.5 px-3.5 bg-[#f7f6f2] border border-[#d4d4d0] inline-block shadow-2xs">
              <LatexRenderer 
                latex={currentProblem.functionLatex} 
                className="text-lg sm:text-xl font-bold text-blue-900" 
              />
            </div>
          </div>
        </div>

        {/* EL ÚNICO LUGAR PARA PONER LA RESPUESTA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-[#f1f1ee] items-end">
          
          {/* Caja Principal: Tu respuesta (Derivada) */}
          <div className={hasCriticalPoint ? "md:col-span-8 space-y-1.5" : "md:col-span-12 space-y-1.5"}>
            <label className="block text-xs font-mono font-bold text-stone-900 uppercase">
              Tu respuesta (Derivada):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={userDerivative}
                onChange={(e) => setUserDerivative(e.target.value)}
                placeholder={`Escribe tu derivada aquí (ej: ${placeholderExample})`}
                className="flex-1 px-3 py-2 bg-white border-2 border-stone-300 focus:border-blue-700 font-mono text-sm text-stone-900 focus:outline-none shadow-2xs transition-colors"
                autoComplete="off"
                spellCheck={false}
              />
              {/* Vista previa KaTeX al lado */}
              <div className="min-w-[150px] px-3 py-2 bg-[#faf9f6] border border-[#d4d4d0] flex items-center justify-center font-mono text-xs overflow-x-auto">
                <LatexRenderer latex={liveLatexPreview} />
              </div>
            </div>
          </div>

          {/* Caja Secundaria: Punto donde da 0 (Máximo/Mínimo) - solo si aplica */}
          {hasCriticalPoint && (
            <div className="md:col-span-4 space-y-1.5">
              <label className="block text-xs font-mono font-bold text-stone-900 uppercase">
                Punto donde da 0 (Máximo/Mínimo):
              </label>
              <input
                type="number"
                step="any"
                value={userXStar}
                onChange={(e) => setUserXStar(e.target.value)}
                placeholder={`Valor de ${currentProblem.variableSymbol}*`}
                className="w-full px-3 py-2 bg-white border-2 border-stone-300 focus:border-blue-700 font-mono text-sm text-stone-900 focus:outline-none shadow-2xs transition-colors"
              />
            </div>
          )}

        </div>

        {/* Barra de Retroalimentación en Lenguaje Simple */}
        <div className={`p-2.5 border font-mono text-xs flex items-center gap-2 transition-colors ${
          validation.status === 'correct' 
            ? 'bg-emerald-50 border-emerald-400 text-emerald-900' 
            : validation.status === 'partial' || validation.status === 'partial_wrong_point'
            ? 'bg-blue-50 border-blue-300 text-blue-900'
            : validation.status === 'incorrect' || validation.status === 'syntax_error'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-[#faf9f6] border-[#e5e5e0] text-stone-600'
        }`}>
          {validation.status === 'correct' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : validation.status === 'partial' || validation.status === 'partial_wrong_point' ? (
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
          ) : validation.status === 'incorrect' || validation.status === 'syntax_error' ? (
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-stone-500 shrink-0" />
          )}
          <span className="font-sans text-xs font-medium">
            {validation.message}
          </span>
        </div>

      </section>

      {/* 2. DISEÑO LIMPIO DE 2 COLUMNAS: PIZARRA (IZQ) + GRÁFICO AUTOMÁTICO (DER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Columna Izquierda: Pizarra de Borrador (Haz tus cuentas aquí) */}
        <div className="lg:col-span-6 flex flex-col">
          <WhiteboardCanvas className="flex-1" />
        </div>

        {/* Columna Derecha: Gráfico en Vivo (Curva Azul + Derivada Verde en Vivo) */}
        <div className="lg:col-span-6 flex flex-col">
          <GraphingCalculator
            problem={currentProblem}
            userDerivative={userDerivative}
            userXStar={userXStar ? parseFloat(userXStar) : undefined}
            testPointX0={testPointX0}
            onChangeTestPointX0={setTestPointX0}
            className="flex-1"
          />
        </div>

      </div>

    </div>
  )
}
