import React, { useState, useEffect } from 'react'
import { 
  Lightbulb, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  BookOpen, 
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import type { PoeQuestion } from '../types/problem'
import { soundEngine } from '../services'

interface PoeHypothesisCardProps {
  poe: PoeQuestion
  problemTitle: string
}

export const PoeHypothesisCard: React.FC<PoeHypothesisCardProps> = ({
  poe,
  problemTitle
}) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Reset al cambiar de problema
  useEffect(() => {
    setSelectedOptionId(null)
    setIsSubmitted(false)
    setIsCollapsed(false)
  }, [poe.id])

  const selectedOption = poe.options.find(o => o.id === selectedOptionId)

  const handleSelectOption = (id: string) => {
    if (isSubmitted) return
    setSelectedOptionId(id)
  }

  const handleSubmitPrediction = () => {
    if (!selectedOption) return
    setIsSubmitted(true)
    if (selectedOption.isCorrect) {
      soundEngine.playSuccessChord()
    } else {
      soundEngine.playErrorThud()
    }
  }

  const handleReset = () => {
    setSelectedOptionId(null)
    setIsSubmitted(false)
    soundEngine.playLimitTick(0.2)
  }

  return (
    <div id="step-poe-card" className="w-full bg-white border border-[#d4d4d0] shadow-xs font-sans text-stone-900 transition-all">
      
      {/* Cabecera Técnica del Ciclo POE */}
      <div className="p-3 sm:p-4 bg-[#faf9f6] border-b border-[#e5e5e0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 bg-blue-700 text-white flex items-center justify-center font-mono font-bold text-xs">
            P
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-stone-900">
                Ciclo POE: Predecir — Observar — Explicar
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#f7f6f2] border border-[#d4d4d0] text-stone-600 hidden sm:inline">
                Didáctica de Brousseau
              </span>
            </div>
            <p className="text-[11px] font-mono text-stone-500">
              Micro-Predicción Socrática de Sensibilidad • {problemTitle.split(':')[0]}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSubmitted && (
            <button
              onClick={handleReset}
              className="text-[11px] font-mono text-stone-600 hover:text-stone-900 flex items-center gap-1 px-2 py-1 bg-[#f7f6f2] hover:bg-[#ebe9e1] border border-[#d4d4d0] cursor-pointer"
              title="Reiniciar predicción"
            >
              <RotateCcw className="w-3 h-3 text-stone-500" />
              <span className="hidden sm:inline">Reintentar</span>
            </button>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-[#ebe9e1] text-stone-600 border border-[#d4d4d0] cursor-pointer"
            title={isCollapsed ? 'Desplegar tarjeta POE' : 'Minimizar tarjeta POE'}
            aria-label="Minimizar o desplegar tarjeta POE"
          >
            {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* FASE 1: PREDECIR (Pregunta Conceptual) */}
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-700 block">
                  Etapa 1: Formulación de Hipótesis (Predecir)
                </span>
                <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                  {poe.question}
                </p>
                <p className="text-[11px] text-stone-500 mt-0.5 italic">
                  {poe.context}
                </p>
              </div>
            </div>

            {/* Opciones de Hipótesis */}
            <div className="space-y-2 pt-2">
              {poe.options.map((opt, idx) => {
                const isSelected = selectedOptionId === opt.id
                const letter = String.fromCharCode(65 + idx)
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isSubmitted}
                    className={`w-full p-2.5 sm:p-3 text-left border flex items-start gap-2.5 text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? isSubmitted
                          ? opt.isCorrect
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-medium'
                            : 'bg-red-50 border-red-400 text-red-950 font-medium'
                          : 'bg-blue-50/60 border-blue-600 text-blue-950 font-medium shadow-2xs'
                        : isSubmitted && opt.isCorrect
                        ? 'bg-emerald-50/40 border-emerald-300 text-stone-800'
                        : 'bg-[#faf9f6] hover:bg-[#f2efe9] border-[#e5e5e0] text-stone-700'
                    }`}
                  >
                    <span className={`w-5 h-5 shrink-0 flex items-center justify-center font-mono font-bold text-[11px] border ${
                      isSelected
                        ? isSubmitted
                          ? opt.isCorrect ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-red-700 text-white border-red-700'
                          : 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white border-[#d4d4d0] text-stone-600'
                    }`}>
                      {letter}
                    </span>
                    <span className="leading-relaxed flex-1">
                      {opt.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {!isSubmitted && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleSubmitPrediction}
                  disabled={!selectedOptionId}
                  className={`px-4 py-2 text-xs font-bold tracking-wide uppercase border flex items-center gap-1.5 transition-colors ${
                    selectedOptionId
                      ? 'bg-stone-900 text-white hover:bg-stone-800 border-stone-900 cursor-pointer shadow-xs'
                      : 'bg-[#f7f6f2] text-stone-400 border-[#d4d4d0] cursor-not-allowed'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Validar Hipótesis Previa</span>
                </button>
              </div>
            )}
          </div>

          {/* FASE 2 Y 3: OBSERVAR Y EXPLICAR (Aparece tras validar) */}
          {isSubmitted && selectedOption && (
            <div className="space-y-3 pt-3 border-t border-[#e5e5e0] animate-fadeIn">
              
              {/* Dictamen del Estudiante */}
              <div className={`p-3 border flex items-start gap-2.5 text-xs ${
                selectedOption.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                {selectedOption.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <span className="font-bold uppercase tracking-wider block font-mono text-[10px]">
                    {selectedOption.isCorrect ? 'Hipótesis Científicamente Verificada' : 'Hipótesis Refutada por el Modelo'}
                  </span>
                  <p className="leading-relaxed">
                    {selectedOption.explanation}
                  </p>
                </div>
              </div>

              {/* FASE 2: OBSERVAR (Acción guiada en el simulador) */}
              <div className="p-3 bg-white border border-[#d4d4d0] flex items-start gap-2.5 text-xs">
                <Eye className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-stone-800 uppercase tracking-wide font-mono text-[10px] block">
                    Etapa 2: Contrastación Empírica (Observar)
                  </span>
                  <p className="text-stone-700 leading-relaxed">
                    {poe.observePrompt}
                  </p>
                </div>
              </div>

              {/* FASE 3: EXPLICAR (Institucionalización Didáctica de Brousseau) */}
              <div className="p-3 bg-[#faf9f6] border border-[#d4d4d0] flex items-start gap-2.5 text-xs">
                <BookOpen className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-stone-800 uppercase tracking-wide font-mono text-[10px] block">
                    Etapa 3: Institucionalización Matemática (Explicar)
                  </span>
                  <p className="text-stone-700 leading-relaxed text-justify">
                    {poe.scientificExplanation}
                  </p>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  )
}
