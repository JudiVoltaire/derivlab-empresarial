import React, { useEffect, useRef } from 'react'
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw,
  Sparkles
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { LatexRenderer } from './LatexRenderer'
import type { BusinessProblem } from '../types/problem'

export interface ValidationModalData {
  status: 'correct' | 'incorrect' | 'empty' | 'syntax_error'
  userRawInput: string
  userLatexPreview: string
  message: string
}

interface ValidationModalProps {
  isOpen: boolean
  data: ValidationModalData | null
  problem: BusinessProblem
  onClose: () => void
  onNextProblem?: () => void
  hasNextProblem?: boolean
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  isOpen,
  data,
  problem,
  onClose,
  onNextProblem,
  hasNextProblem = false
}) => {
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null)

  // Disparar confeti y enfocar botón principal al abrir
  useEffect(() => {
    if (!isOpen || !data) return

    if (data.status === 'correct') {
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.55 },
          colors: ['#1d4ed8', '#15803d', '#c2410c', '#18181b']
        })
      } catch {
        // Ignorar si falla confetti
      }
    }

    const timer = setTimeout(() => {
      primaryButtonRef.current?.focus()
    }, 50)
    return () => clearTimeout(timer)
  }, [isOpen, data])

  // Manejo de teclado (Enter / Escape para cerrar o avanzar)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (data?.status === 'correct' && hasNextProblem && onNextProblem) {
          onNextProblem()
        } else {
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, data, hasNextProblem, onNextProblem, onClose])

  if (!isOpen || !data) return null

  const isCorrect = data.status === 'correct'
  const isIncorrect = data.status === 'incorrect'
  const isWarning = data.status === 'syntax_error' || data.status === 'empty'

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className={`relative w-full max-w-lg bg-white border-2 shadow-2xl p-6 sm:p-7 space-y-5 text-stone-900 ${
          isCorrect 
            ? 'border-emerald-600' 
            : isIncorrect 
            ? 'border-red-600' 
            : 'border-amber-500'
        }`}
      >
        {/* Insignia Superior Editorial */}
        <div className="flex items-center justify-between border-b border-[#e5e5e0] pb-3">
          <div className={`px-2.5 py-1 text-white font-mono text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${
            isCorrect 
              ? 'bg-emerald-700' 
              : isIncorrect 
              ? 'bg-red-700' 
              : 'bg-amber-600'
          }`}>
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Validación Exitosa · Derivada Exacta</span>
              </>
            ) : isIncorrect ? (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Respuesta Incorrecta · Revisión Requerida</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Atención · Revisa tu Entrada</span>
              </>
            )}
          </div>

          <span className="font-mono text-xs text-stone-500 font-semibold">
            {problem.title.split('·')[0]?.trim()}
          </span>
        </div>

        {/* Título y Mensaje Principal */}
        <div className="space-y-1.5">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2">
            {isCorrect && (
              <>
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>¡Derivada Correcta!</span>
              </>
            )}
            {isIncorrect && <span>La derivada no coincide</span>}
            {isWarning && <span>Formato incompleto o con error</span>}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            {isCorrect && 'Tu cálculo analítico coincide exactamente con la función y describe con precisión la tasa marginal de la curva.'}
            {isIncorrect && 'La expresión ingresada genera una pendiente diferente a la función azul. Revisa tus operaciones en la Pizarra de Borrador antes de continuar.'}
            {isWarning && data.message}
          </p>
        </div>

        {/* Bloque de Comparación Matemática en KaTeX */}
        <div className="p-3.5 bg-[#f7f6f2] border border-[#d4d4d0] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#e5e5e0] pb-1.5">
            <span className="text-stone-500 uppercase text-[10px] font-bold">Función original:</span>
            <div className="text-blue-900 font-bold">
              <LatexRenderer latex={problem.functionLatex} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-0.5">
            <span className="text-stone-500 uppercase text-[10px] font-bold">Tu respuesta:</span>
            <div className={`font-bold ${isCorrect ? 'text-emerald-800' : 'text-red-700'}`}>
              <LatexRenderer latex={data.userLatexPreview} />
            </div>
          </div>
        </div>

        {/* Botones de Acción (Debe cerrarse para volver a intentar) */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">
          {isCorrect ? (
            <>
              <button
                onClick={onClose}
                className="h-10 px-4 bg-white hover:bg-[#f7f6f2] border border-[#d4d4d0] text-stone-800 font-mono text-xs font-semibold cursor-pointer transition-colors"
              >
                Seguir en este ejercicio
              </button>

              {hasNextProblem && onNextProblem ? (
                <button
                  ref={primaryButtonRef}
                  onClick={onNextProblem}
                  className="h-10 px-5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <span>Siguiente Ejercicio (Enter)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  ref={primaryButtonRef}
                  onClick={onClose}
                  className="h-10 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-bold text-xs cursor-pointer shadow-xs transition-colors"
                >
                  ¡Terminado! (Enter)
                </button>
              )}
            </>
          ) : (
            <button
              ref={primaryButtonRef}
              onClick={onClose}
              className="w-full h-11 bg-stone-900 hover:bg-stone-800 active:bg-black text-white font-mono font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Entendido, volver a intentar (Enter)</span>
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
