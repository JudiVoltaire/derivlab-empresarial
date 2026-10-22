import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Check
} from 'lucide-react'
import { compile } from 'mathjs'
import { WhiteboardCanvas, formatRawToLatex } from './WhiteboardCanvas'
import { GraphingCalculator } from './GraphingCalculator'
import { LatexRenderer } from './LatexRenderer'
import { ValidationModal, type ValidationModalData } from './ValidationModal'
import type { BusinessProblem, ProblemId } from '../types/problem'
import { getDefaultTangentPoint } from '../services/problemHelpers'
import { soundEngine } from '../services'

interface FreeModeProps {
  currentProblem: BusinessProblem
  onSelectProblem: (id: ProblemId) => void
  problemsList: BusinessProblem[]
  onMarkSolved?: (id: ProblemId) => void
  completedProblemIds?: ProblemId[]
}

interface CheckResult {
  status: 'correct' | 'incorrect' | 'empty' | 'syntax_error'
  message: string
}

export const FreeMode: React.FC<FreeModeProps> = ({ 
  currentProblem,
  onSelectProblem,
  problemsList,
  onMarkSolved,
  completedProblemIds = []
}) => {
  // Navegación de ejercicios
  const currentIndex = problemsList.findIndex(p => p.id === currentProblem.id)
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < problemsList.length - 1
  const isProblemSolved = completedProblemIds.includes(currentProblem.id as ProblemId)

  // Referencia para re-enfocar la caja de entrada tras cerrar el modal
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Estado del ejercicio: entrada del alumno y punto de prueba
  const [userDerivative, setUserDerivative] = useState<string>('')
  const [testPointX0, setTestPointX0] = useState<number>(() => getDefaultTangentPoint(currentProblem))
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null)

  // Estado del modal vistoso de validación
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ValidationModalData | null>(null)

  // Al cambiar de problema, limpiar respuestas y actualizar punto de prueba
  useEffect(() => {
    setUserDerivative('')
    setTestPointX0(getDefaultTangentPoint(currentProblem))
    setCheckResult(null)
    setIsModalOpen(false)
    setModalData(null)
  }, [currentProblem.id])

  // Función para evaluar la derivada del estudiante en un punto dado
  const evaluateStudentDerivative = useCallback((raw: string, testVal: number): number => {
    if (!raw || !raw.trim()) return NaN

    let clean = raw.trim()
    // Limpiar posibles prefijos si el estudiante escribió f'(x)=, f'(q)=, f'(t)=, f'(p)=, f(x)=, etc.
    clean = clean.replace(/^[a-zA-Z_]'\([^)]*\)\s*=\s*/, '')
    clean = clean.replace(/^[a-zA-Z_]\([^)]*\)\s*=\s*/, '')
    clean = clean.replace(/^[a-zA-Z_]\*\s*=\s*/, '')
    clean = clean.replace(/^[a-zA-Z]\s*=\s*/, '')

    // Exponenciales: exp(...) y e^(...)
    clean = clean.replace(/exp\(([^)]+)\)/g, 'e^($1)')

    // Multiplicación implícita como 2x -> 2*x, 6t -> 6*t
    clean = clean.replace(/(\d)([a-zA-Z])/g, '$1*$2')
    clean = clean.replace(/(\))([a-zA-Z\d])/g, '$1*$2')

    try {
      const compiled = compile(clean)
      // Soporte universal: acepta indistintamente x, q, t, p
      const res = compiled.evaluate({ 
        x: testVal, 
        q: testVal, 
        t: testVal, 
        p: testVal, 
        e: Math.E 
      })
      return typeof res === 'number' && !isNaN(res) && isFinite(res) ? res : NaN
    } catch {
      return NaN
    }
  }, [])

  // Formato LaTeX dinámico para la vista previa
  const liveLatexPreview = useMemo(() => {
    return formatRawToLatex(
      userDerivative, 
      currentProblem.variableSymbol, 
      currentProblem.functionSymbol
    )
  }, [userDerivative, currentProblem.variableSymbol, currentProblem.functionSymbol])

  // Comprobar la derivada al presionar el botón "Comprobar" o pulsar Enter
  const handleCheck = () => {
    if (!userDerivative || !userDerivative.trim()) {
      const emptyMsg = 'Por favor escribe tu derivada antes de comprobar.'
      setCheckResult({
        status: 'empty',
        message: emptyMsg
      })
      setModalData({
        status: 'empty',
        userRawInput: userDerivative,
        userLatexPreview: liveLatexPreview,
        message: emptyMsg
      })
      setIsModalOpen(true)
      return
    }

    // Comprobar equivalencia matemática en 4 puntos interiores del dominio
    const [dMin, dMax] = currentProblem.domain
    const span = dMax - dMin
    const testPoints = [
      dMin + span * 0.2,
      dMin + span * 0.4,
      dMin + span * 0.6,
      dMin + span * 0.8
    ]

    let maxDiff = 0
    let hasSyntaxError = false

    for (const pt of testPoints) {
      const studentVal = evaluateStudentDerivative(userDerivative, pt)
      const expectedVal = currentProblem.evaluateDerivative(pt)
      if (isNaN(studentVal)) {
        hasSyntaxError = true
        break
      }
      const diff = Math.abs(studentVal - expectedVal)
      if (diff > maxDiff) maxDiff = diff
    }

    if (hasSyntaxError) {
      soundEngine.playErrorThud()
      const syntaxMsg = 'Revisa la escritura: usa signos y operaciones claros (ej: -4x + 24 o 6t).'
      setCheckResult({
        status: 'syntax_error',
        message: syntaxMsg
      })
      setModalData({
        status: 'syntax_error',
        userRawInput: userDerivative,
        userLatexPreview: liveLatexPreview,
        message: syntaxMsg
      })
      setIsModalOpen(true)
      return
    }

    const isDerivCorrect = maxDiff < 0.15

    if (isDerivCorrect) {
      soundEngine.playSuccessChord()
      const successMsg = '✓ ¡Correcto! Tu derivada es exacta y coincide con la función del ejercicio.'
      setCheckResult({
        status: 'correct',
        message: successMsg
      })
      setModalData({
        status: 'correct',
        userRawInput: userDerivative,
        userLatexPreview: liveLatexPreview,
        message: successMsg
      })
      setIsModalOpen(true)
      if (onMarkSolved) {
        onMarkSolved(currentProblem.id as ProblemId)
      }
    } else {
      soundEngine.playErrorThud()
      const errorMsg = 'Aún no es correcta. La curva verde no coincide con la pendiente de la función azul. Revisa tus operaciones en la pizarra e inténtalo de nuevo.'
      setCheckResult({
        status: 'incorrect',
        message: errorMsg
      })
      setModalData({
        status: 'incorrect',
        userRawInput: userDerivative,
        userLatexPreview: liveLatexPreview,
        message: errorMsg
      })
      setIsModalOpen(true)
    }
  }

  // Cerrar modal y devolver el foco inmediatamente al input para el nuevo intento
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 50)
  }

  // Avanzar al siguiente ejercicio desde el modal
  const handleNextProblem = () => {
    setIsModalOpen(false)
    if (hasNext) {
      onSelectProblem(problemsList[currentIndex + 1].id)
    }
  }

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
      
      {/* 1. TARJETA PRINCIPAL DEL EJERCICIO (INTERFAZ SIMPLE DE UN SOLO PASO) */}
      <section className="bg-white border border-[#d4d4d0] p-4 sm:p-5 shadow-xs space-y-4">
        
        {/* Barra superior con selector de los 20 problemas */}
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
            {isProblemSolved && (
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] uppercase font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Resuelto
              </span>
            )}
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
              onChange={(e) => onSelectProblem(e.target.value as ProblemId)}
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
            <div className="py-2 px-4 bg-[#f7f6f2] border border-[#d4d4d0] inline-block shadow-2xs">
              <LatexRenderer 
                latex={currentProblem.functionLatex} 
                className="text-lg sm:text-2xl font-bold text-blue-900" 
              />
            </div>
          </div>
        </div>

        {/* ÚNICA CAJA DIRECTA PARA RESPONDER */}
        <div className="space-y-2 pt-3 border-t border-[#f1f1ee]">
          <label className="block text-xs font-mono font-bold text-stone-900 uppercase">
            Escribe aquí tu derivada:
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            
            {/* Input directo */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={userDerivative}
                onChange={(e) => {
                  setUserDerivative(e.target.value)
                  if (checkResult) setCheckResult(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCheck()
                  }
                }}
                placeholder={`Escribe aquí tu derivada (ej: ${placeholderExample} o en x)...`}
                className="w-full px-3.5 py-2.5 bg-white border-2 border-stone-300 focus:border-blue-700 font-mono text-sm text-stone-900 focus:outline-none shadow-2xs transition-colors"
                autoComplete="off"
                spellCheck={false}
              />
            </div>

            {/* Vista previa KaTeX */}
            <div className="min-w-[140px] px-3.5 py-2.5 bg-[#faf9f6] border border-[#d4d4d0] flex items-center justify-center font-mono text-xs overflow-x-auto">
              <LatexRenderer latex={liveLatexPreview} />
            </div>

            {/* Botón Comprobar */}
            <button
              onClick={handleCheck}
              className="h-10 px-5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-mono text-xs font-bold border border-blue-800 shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shrink-0"
              title="Comprobar si tu derivada es correcta (o presiona Enter)"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Comprobar</span>
            </button>

          </div>
        </div>

        {/* Barra de Retroalimentación en Lenguaje Simple */}
        <div className={`p-2.5 border font-mono text-xs flex items-center gap-2 transition-colors ${
          checkResult?.status === 'correct' 
            ? 'bg-emerald-50 border-emerald-400 text-emerald-900' 
            : checkResult?.status === 'incorrect' || checkResult?.status === 'syntax_error' || checkResult?.status === 'empty'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-[#faf9f6] border-[#e5e5e0] text-stone-600'
        }`}>
          {checkResult?.status === 'correct' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : checkResult?.status === 'incorrect' || checkResult?.status === 'syntax_error' || checkResult?.status === 'empty' ? (
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-stone-500 shrink-0" />
          )}
          <span className="font-sans text-xs font-medium">
            {checkResult ? checkResult.message : 'Escribe tu derivada arriba y pulsa "Comprobar" (o presiona Enter). La curva verde se dibuja automáticamente en vivo sobre el gráfico.'}
          </span>
        </div>

      </section>

      {/* 2. DISEÑO LIMPIO DE 2 COLUMNAS: PIZARRA (IZQ) + GRÁFICO AUTOMÁTICO (DER) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        
        {/* Columna Izquierda: 1. Pizarra de Borrador (Haz tus cuentas aquí) */}
        <div className="lg:col-span-6 flex flex-col">
          <WhiteboardCanvas className="flex-1" />
        </div>

        {/* Columna Derecha: 2. Gráfico en Vivo (Curva Azul + Derivada Verde en Vivo) */}
        <div className="lg:col-span-6 flex flex-col">
          <GraphingCalculator
            problem={currentProblem}
            userDerivative={userDerivative}
            testPointX0={testPointX0}
            onChangeTestPointX0={setTestPointX0}
            className="flex-1"
          />
        </div>

      </div>

      {/* MODAL VISTOSO DE VALIDACIÓN (CUBRE PARTE DE LA PANTALLA ANTES DE DEJAR CONTINUAR) */}
      <ValidationModal
        isOpen={isModalOpen}
        data={modalData}
        problem={currentProblem}
        onClose={handleCloseModal}
        onNextProblem={handleNextProblem}
        hasNextProblem={hasNext}
      />

    </div>
  )
}
