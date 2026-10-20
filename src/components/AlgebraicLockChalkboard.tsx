import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Send, 
  FileText,
  Lock,
  Unlock
} from 'lucide-react'
import type { BusinessProblem, AnalyticalStepOption } from '../types/problem'
import type { ParametricCoefficients, DynamicAnalysis } from '../services/parametricEngine'
import { LatexRenderer } from './LatexRenderer'
import { MathKeypad } from './MathKeypad'
import { soundEngine, validateDerivativeExpression, validateCriticalDecision } from '../services'

interface AlgebraicLockChalkboardProps {
  problem: BusinessProblem
  coefficients: ParametricCoefficients
  analysis: DynamicAnalysis
  isUnlocked: boolean
  onUnlockProblem: (problemId: string) => void
  onRequestVariation: () => void
}

export const AlgebraicLockChalkboard: React.FC<AlgebraicLockChalkboardProps> = ({
  problem,
  coefficients,
  analysis,
  isUnlocked,
  onUnlockProblem
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1)
  
  // Estado de los 3 pasos
  const [step1Completed, setStep1Completed] = useState(false)
  const [step1SelectedOption, setStep1SelectedOption] = useState<string | null>(null)
  const [step1Feedback, setStep1Feedback] = useState<{ isCorrect: boolean; message: string } | null>(null)

  const [step2Completed, setStep2Completed] = useState(false)
  const [userDerivativeInput, setUserDerivativeInput] = useState('')
  const [step2Feedback, setStep2Feedback] = useState<{ isCorrect: boolean; message: string } | null>(null)
  const [isKeypadVisible, setIsKeypadVisible] = useState(true)

  const [step3Completed, setStep3Completed] = useState(false)
  const [userCriticalPoint, setUserCriticalPoint] = useState('')
  const [userSecondDerivative, setUserSecondDerivative] = useState('')
  const [step3Feedback, setStep3Feedback] = useState<{ isCorrect: boolean; message: string } | null>(null)

  // Resetear o re-evaluar estados al cambiar de problema
  useEffect(() => {
    setActiveStep(1)
    setStep1Completed(false)
    setStep1SelectedOption(null)
    setStep1Feedback(null)

    setStep2Completed(false)
    setUserDerivativeInput('')
    setStep2Feedback(null)

    setStep3Completed(false)
    setUserCriticalPoint('')
    setUserSecondDerivative('')
    setStep3Feedback(null)
  }, [problem.id])

  const allStepsCompleted = step1Completed && step2Completed && step3Completed

  // Paso 1: Selección de regla conceptual
  const handleSelectRuleOption = (opt: AnalyticalStepOption) => {
    setStep1SelectedOption(opt.id)
    if (opt.isCorrect) {
      soundEngine.playSuccessChord()
      setStep1Completed(true)
      setStep1Feedback({ isCorrect: true, message: opt.explanation })
    } else {
      soundEngine.playErrorThud()
      setStep1Completed(false)
      setStep1Feedback({ isCorrect: false, message: opt.explanation })
    }
  }

  // Paso 2: Validación Simbólica con mathjs sincronizada con coeficientes vivos
  const handleValidateDerivative = () => {
    const result = validateDerivativeExpression(userDerivativeInput, problem, coefficients)
    if (result.isValid) {
      soundEngine.playSuccessChord()
      setStep2Completed(true)
      setStep2Feedback({ isCorrect: true, message: result.feedback })
    } else {
      soundEngine.playErrorThud()
      setStep2Completed(false)
      setStep2Feedback({ isCorrect: false, message: result.feedback })
    }
  }

  // Paso 3: Validación del Punto Crítico vivo y segunda derivada
  const handleValidateCriticalPoint = () => {
    const pt = parseFloat(userCriticalPoint)
    const sec = problem.problemNumber === 2 ? parseFloat(userSecondDerivative) : undefined
    const activeSecondDeriv = problem.problemNumber === 2 ? 2 * coefficients.a : undefined

    const result = validateCriticalDecision(
      pt, 
      problem, 
      sec, 
      analysis.criticalPoint, 
      activeSecondDeriv
    )
    if (result.isValid) {
      soundEngine.playSuccessChord()
      setStep3Completed(true)
      setStep3Feedback({ isCorrect: true, message: result.feedback })
    } else {
      soundEngine.playErrorThud()
      setStep3Completed(false)
      setStep3Feedback({ isCorrect: false, message: result.feedback })
    }
  }

  // Desbloqueo y Celebración
  const handleFinalUnlock = () => {
    if (!allStepsCompleted) return

    soundEngine.playSuccessChord()
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    })
    onUnlockProblem(problem.id)
  }

  return (
    <div id="step-algebraic-lock" className="w-full bg-white border border-[#d4d4d0] shadow-xs font-sans text-stone-900 overflow-hidden">
      
      {/* Cabecera Técnica Editorial */}
      <div className="p-4 bg-[#faf9f6] border-b border-[#e5e5e0] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-stone-700" />
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-wide uppercase text-stone-900">
              Hoja de Resolución Diferencial
            </h2>
            <span className="text-[11px] font-mono text-stone-500">
              Validación Simbólica Rigurosa • {problem.title.split(':')[0]}
            </span>
          </div>
        </div>

        <span className={`text-[11px] font-mono px-2.5 py-0.5 border ${
          isUnlocked || allStepsCompleted
            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
            : 'bg-stone-100 text-stone-600 border-stone-300'
        }`}>
          {isUnlocked || allStepsCompleted ? 'ANÁLISIS VALIDADO' : 'CANDADO ACTIVO'}
        </span>
      </div>

      {/* Pestañas de las 3 Etapas Analíticas */}
      <div className="border-b border-[#e5e5e0] bg-white">
        <div className="grid grid-cols-3 divide-x divide-[#e5e5e0]">
          {[
            { step: 1, label: 'Etapa I', subtitle: 'Axioma de Regla', isDone: step1Completed },
            { step: 2, label: 'Etapa II', subtitle: 'Derivada Viva', isDone: step2Completed },
            { step: 3, label: 'Etapa III', subtitle: "Condición f'=0", isDone: step3Completed }
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(item.step as 1 | 2 | 3)}
              className={`p-2.5 sm:p-3 text-left transition-colors cursor-pointer ${
                activeStep === item.step
                  ? 'bg-white border-b-2 border-b-blue-700 text-stone-900'
                  : 'bg-[#f7f6f2] hover:bg-[#ebe9e1] text-stone-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block">
                  {item.label}
                </span>
                {item.isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <span className="w-2 h-2 rounded-full border border-stone-400" />
                )}
              </div>
              <span className="text-xs font-semibold block truncate mt-0.5 text-stone-800">
                {item.subtitle}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cuerpo de la Etapa Activa */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* ===================== ETAPA I ===================== */}
        {activeStep === 1 && (
          <div className="space-y-3.5">
            <div>
              <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider block mb-1">
                Etapa I — Fundamento Axiomático
              </span>
              <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                {problem.candadoSteps.step1.question}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              {problem.candadoSteps.step1.options.map((opt) => {
                const isSelected = step1SelectedOption === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectRuleOption(opt)}
                    className={`w-full p-3 text-left text-xs transition-colors border cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                          : 'bg-rose-50 border-rose-400 text-rose-900'
                        : 'bg-white border-[#d4d4d0] hover:bg-[#f7f6f2] text-stone-800'
                    }`}
                  >
                    <span className="font-medium leading-relaxed">{opt.label}</span>
                    {opt.latex && (
                      <span className="shrink-0 p-1 bg-[#f7f6f2] border border-[#e5e5e0] text-stone-800">
                        <LatexRenderer latex={opt.latex} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {step1Feedback && (
              <div className={`p-3 text-xs border flex items-start gap-2 ${
                step1Feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                {step1Feedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <p>{step1Feedback.message}</p>
                  {step1Feedback.isCorrect && (
                    <button
                      onClick={() => setActiveStep(2)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 pt-1 cursor-pointer"
                    >
                      <span>Continuar hacia Etapa II (Derivada)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== ETAPA II ===================== */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider block mb-0.5">
                  Etapa II — Diferenciación Operativa
                </span>
                <p className="text-xs sm:text-sm font-semibold text-stone-900">
                  Introduce la expresión analítica de la derivada para la parametrización actual:
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsKeypadVisible(!isKeypadVisible)}
                className="text-[11px] font-mono px-2 py-1 bg-[#f7f6f2] hover:bg-[#ebe9e1] border border-[#d4d4d0] text-stone-700 cursor-pointer shrink-0"
              >
                {isKeypadVisible ? 'Ocultar Teclado' : 'Mostrar Teclado'}
              </button>
            </div>

            {/* Función viva de referencia */}
            <div className="p-2.5 bg-[#faf9f6] border border-[#e5e5e0] flex items-center justify-between text-xs">
              <span className="font-semibold text-stone-600">Función Activa:</span>
              <LatexRenderer latex={analysis.functionLatex} className="font-semibold text-blue-900 text-sm" />
            </div>

            {/* Input con Validación Simbólica mathjs */}
            <div className="space-y-1.5">
              <label htmlFor="derivative-math-input" className="block text-xs font-medium text-stone-700">
                Expresión Diferenciada f'({problem.variableSymbol}):
              </label>

              <div className="flex gap-2">
                <input
                  id="derivative-math-input"
                  type="text"
                  value={userDerivativeInput}
                  onChange={(e) => setUserDerivativeInput(e.target.value)}
                  placeholder={`Ej: ${analysis.derivativeLatex.split('=')[1]?.trim() || ''}`}
                  className="flex-1 h-10 px-3 bg-white border border-[#d4d4d0] focus:border-blue-700 font-mono text-xs sm:text-sm text-stone-900 outline-none"
                />
                <button
                  type="button"
                  onClick={handleValidateDerivative}
                  className="px-4 h-10 bg-blue-700 hover:bg-blue-800 active:scale-98 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Validar
                </button>
              </div>

              {/* Vista previa matemática en tiempo real */}
              {userDerivativeInput && (
                <div className="p-2 bg-[#f7f6f2] border border-[#e5e5e0] flex items-center gap-2 text-xs text-stone-600 font-mono">
                  <span className="text-stone-500">Render KaTeX:</span>
                  <LatexRenderer latex={`f'(${problem.variableSymbol}) = ${userDerivativeInput}`} className="text-stone-900 font-semibold" />
                </div>
              )}
            </div>

            {/* Teclado Matemático Táctil */}
            {isKeypadVisible && (
              <MathKeypad
                variableSymbol={problem.variableSymbol}
                problemNumber={problem.problemNumber}
                onInsert={(token) => setUserDerivativeInput(prev => prev + token)}
                onBackspace={() => setUserDerivativeInput(prev => prev.slice(0, -1))}
                onClear={() => setUserDerivativeInput('')}
              />
            )}

            {step2Feedback && (
              <div className={`p-3 text-xs border flex items-start gap-2 ${
                step2Feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                {step2Feedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <p>{step2Feedback.message}</p>
                  {step2Feedback.isCorrect && (
                    <button
                      onClick={() => setActiveStep(3)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 pt-1 cursor-pointer"
                    >
                      <span>Avanzar a Etapa III (Condición f'=0)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===================== ETAPA III ===================== */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider block mb-0.5">
                Etapa III — Optimización y Condición de Primer Orden
              </span>
              <p className="text-xs sm:text-sm font-semibold text-stone-900">
                Resuelve la ecuación f'({problem.variableSymbol}*) = 0 con los coeficientes activos:
              </p>
            </div>

            <div className="p-3 bg-[#faf9f6] border border-[#e5e5e0] text-center">
              <LatexRenderer latex={analysis.equationSolvingLatex} displayMode={true} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="critical-val-input" className="block text-xs font-semibold text-stone-700">
                  Punto Óptimo {problem.variableSymbol}*:
                </label>
                <input
                  id="critical-val-input"
                  type="number"
                  step="any"
                  value={userCriticalPoint}
                  onChange={(e) => setUserCriticalPoint(e.target.value)}
                  placeholder={`Ej: ${analysis.criticalPoint}`}
                  className="w-full h-10 px-3 bg-white border border-[#d4d4d0] focus:border-blue-700 font-mono text-sm tabular-nums text-stone-900 outline-none"
                />
              </div>

              {problem.problemNumber === 2 && (
                <div className="space-y-1">
                  <label htmlFor="second-deriv-val-input" className="block text-xs font-semibold text-stone-700">
                    Segunda Derivada U''(q) [Concavidad]:
                  </label>
                  <input
                    id="second-deriv-val-input"
                    type="number"
                    step="any"
                    value={userSecondDerivative}
                    onChange={(e) => setUserSecondDerivative(e.target.value)}
                    placeholder={`Ej: ${2 * coefficients.a}`}
                    className="w-full h-10 px-3 bg-white border border-[#d4d4d0] focus:border-blue-700 font-mono text-sm tabular-nums text-stone-900 outline-none"
                  />
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleValidateCriticalPoint}
              className="w-full h-10 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" /> Verificar Condición de Primer Orden
            </button>

            {step3Feedback && (
              <div className={`p-3 text-xs border flex items-start gap-2 ${
                step3Feedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}>
                {step3Feedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p>{step3Feedback.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Pie Técnico con Acción de Inyección y Desbloqueo */}
      <div className="p-4 bg-[#faf9f6] border-t border-[#e5e5e0] flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-xs font-mono text-stone-600">
          {allStepsCompleted
            ? '✓ Etapas I, II y III resueltas para los parámetros actuales.'
            : 'Resuelve las 3 etapas para desbloquear la optimización plena.'}
        </span>

        <button
          onClick={handleFinalUnlock}
          disabled={!allStepsCompleted}
          className={`min-h-[40px] px-5 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2 border ${
            allStepsCompleted
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700 cursor-pointer shadow-xs'
              : 'bg-[#ebe9e1] text-stone-400 border-[#d4d4d0] cursor-not-allowed'
          }`}
        >
          {allStepsCompleted ? (
            <>
              <Unlock className="w-3.5 h-3.5" />
              <span>Inyectar Derivada y Optimizar Problema</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>Inyectar Derivada (Bloqueado)</span>
            </>
          )}
        </button>
      </div>

    </div>
  )
}
