import { useState, useEffect, useMemo } from 'react'
import { 
  Unlock, 
  Lock, 
  CheckCircle2, 
  BookOpen, 
  Activity 
} from 'lucide-react'
import { 
  Navbar, 
  AlgebraicLockChalkboard, 
  ParametricControls, 
  SynchronizedGraphs,
  PoeHypothesisCard,
  FreeMode
} from './components'
import { ALL_BUSINESS_PROBLEMS } from './data'
import type { ProblemId, AppMode, BusinessProblem } from './types'
import type { ParametricCoefficients } from './services/parametricEngine'
import { analyzeParametricModel } from './services/parametricEngine'
import { soundEngine, startTutorial } from './services'

export default function App() {
  const [problemsList, setProblemsList] = useState<BusinessProblem[]>(ALL_BUSINESS_PROBLEMS)
  const [currentProblemId, setCurrentProblemId] = useState<ProblemId>('p1')
  const [completedProblemIds, setCompletedProblemIds] = useState<ProblemId[]>([])
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundEngine.isSoundEnabled())
  const [unlockedProblems, setUnlockedProblems] = useState<Record<string, boolean>>({})
  const [appMode, setAppMode] = useState<AppMode>('estudiante')

  const currentProblem = useMemo(() => {
    return problemsList.find(p => p.id === currentProblemId) || problemsList[0]
  }, [problemsList, currentProblemId])

  // Coeficientes paramétricos vivos (a, b, c) para el problema activo
  const [coefficients, setCoefficients] = useState<ParametricCoefficients>(currentProblem.baseCoefficients)

  // Estado geométrico cartesiano (punto de evaluación x e incremento deltaX)
  const [currentX, setCurrentX] = useState<number>(2)
  const [deltaX, setDeltaX] = useState<number>(0.5)

  // Disparar tutorial automáticamente en la primera visita (Ruta A)
  useEffect(() => {
    const timer = setTimeout(() => {
      startTutorial('A', false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Actualizar parámetros al cambiar de problema
  useEffect(() => {
    setCoefficients(currentProblem.baseCoefficients)
    const initX = Math.round((currentProblem.domain[0] + (currentProblem.domain[1] - currentProblem.domain[0]) * 0.3) * 10) / 10
    setCurrentX(initX)
    setDeltaX(0.5)
  }, [currentProblem])

  // Análisis analítico vivo a 60 FPS
  const dynamicAnalysis = useMemo(() => {
    return analyzeParametricModel(
      currentProblem.problemNumber,
      coefficients,
      currentProblem.variableSymbol,
      currentProblem.functionSymbol
    )
  }, [currentProblem, coefficients])

  const isCurrentProblemUnlocked = !!unlockedProblems[currentProblem.id]

  const handleToggleSound = () => {
    const nextState = soundEngine.toggleSound()
    setIsSoundEnabled(nextState)
    if (nextState) {
      soundEngine.playSuccessChord()
    }
  }

  const handleSelectProblem = (id: ProblemId) => {
    setCurrentProblemId(id)
    soundEngine.playLimitTick(0.15)
  }

  const handleResetCoefficients = () => {
    setCoefficients(currentProblem.baseCoefficients)
    soundEngine.playLimitTick(0.2)
  }

  const handleRandomVariation = () => {
    const meta = currentProblem.parametricMeta
    const randomBetween = (min: number, max: number, step: number) => {
      const stepsCount = Math.floor((max - min) / step)
      if (stepsCount <= 0) return min
      const randomStep = Math.floor(Math.random() * (stepsCount + 1))
      return Math.round((min + randomStep * step) * 100) / 100
    }
    const newA = meta.aMin === meta.aMax ? currentProblem.baseCoefficients.a : randomBetween(meta.aMin, meta.aMax, meta.aStep)
    const newB = meta.bMin === meta.bMax ? currentProblem.baseCoefficients.b : randomBetween(meta.bMin, meta.bMax, meta.bStep)
    const newC = meta.cMin === meta.cMax ? currentProblem.baseCoefficients.c : randomBetween(meta.cMin, meta.cMax, meta.cStep)
    setCoefficients({ a: newA, b: newB, c: newC })
    soundEngine.playLimitTick(0.2)
  }

  const handleAddCustomProblem = (customProblem: BusinessProblem) => {
    setProblemsList(prev => [customProblem, ...prev])
    setCurrentProblemId(customProblem.id)
    setCoefficients(customProblem.baseCoefficients)
  }

  const handleUnlockProblem = (problemId: string) => {
    setUnlockedProblems(prev => ({ ...prev, [problemId]: true }))
    if (!completedProblemIds.includes(problemId as ProblemId)) {
      setCompletedProblemIds(prev => [...prev, problemId as ProblemId])
    }
  }

  const handleStartTutorialRoute = (route: 'A' | 'B') => {
    if (route === 'B') {
      setAppMode('libre')
      setTimeout(() => {
        startTutorial('B', true)
      }, 400)
    } else {
      if (appMode === 'libre') setAppMode('estudiante')
      setTimeout(() => {
        startTutorial('A', true)
      }, 400)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-stone-900 flex flex-col font-sans selection:bg-blue-700 selection:text-white">
      {/* Barra de Navegación Editorial con Perfil Universitario */}
      <Navbar
        currentProblemId={currentProblemId}
        onSelectProblem={handleSelectProblem}
        completedProblemIds={completedProblemIds}
        isSoundEnabled={isSoundEnabled}
        onToggleSound={handleToggleSound}
        appMode={appMode}
        onToggleAppMode={setAppMode}
        onStartTutorialRoute={handleStartTutorialRoute}
        onRandomVariation={handleRandomVariation}
        onCustomProblem={handleAddCustomProblem}
        problemsList={problemsList}
      />

      {/* Contenedor Principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
        
        {/* Renderizado Condicional: MODO LIBRE vs MODOS RETO/DOCENTE */}
        {appMode === 'libre' ? (
          <FreeMode 
            currentProblem={currentProblem}
            onSelectProblem={handleSelectProblem}
            problemsList={problemsList}
          />
        ) : (
          <>
            {/* Cabecera Técnica del Problema Activo */}
            <section className="bg-white border border-[#d4d4d0] p-4 sm:p-5 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e5e0] pb-2 text-[11px] font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-700 uppercase tracking-widest">
                    {currentProblem.title.split('·')[0]?.trim() || `P${currentProblem.problemNumber}`}
                  </span>
                  <span className="text-stone-400">|</span>
                  <span className="text-stone-600">{currentProblem.era} ({currentProblem.year})</span>
                  <span className="text-stone-400">|</span>
                  <span className="text-stone-600">{currentProblem.protagonist}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#f7f6f2] border border-[#d4d4d0] text-stone-700 uppercase font-semibold">
                    {currentProblem.difficulty} (Nivel {currentProblem.level})
                  </span>
                  <span className={`px-2 py-0.5 border font-semibold flex items-center gap-1.5 ${
                    isCurrentProblemUnlocked
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-stone-100 text-stone-600 border-stone-300'
                  }`}>
                    {isCurrentProblemUnlocked ? <Unlock className="w-3 h-3 text-emerald-700" /> : <Lock className="w-3 h-3 text-stone-500" />}
                    <span>{isCurrentProblemUnlocked ? 'Optimización Habilitada' : 'Validación Requerida'}</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <h1 className="text-base sm:text-xl font-bold tracking-tight text-stone-900">
                    {currentProblem.title}
                  </h1>
                  <p className="text-xs text-stone-600 leading-relaxed text-justify">
                    {currentProblem.story}
                  </p>
                </div>

                {/* Telemetría Rápida */}
                <div className="p-3 bg-[#faf9f6] border border-[#e5e5e0] shrink-0 font-mono text-xs space-y-1 min-w-[240px]">
                  <div className="flex items-center justify-between text-stone-500 text-[10px] uppercase font-bold">
                    <span>Estatus Paramétrico</span>
                    <Activity className="w-3 h-3 text-blue-700" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Punto Crítico {currentProblem.variableSymbol}*:</span>
                    <span className="font-bold text-blue-800 tabular-nums">
                      {appMode === 'estudiante' && !isCurrentProblemUnlocked ? (
                        <span className="text-stone-400 font-normal italic">[Oculto en Reto]</span>
                      ) : (
                        `${dynamicAnalysis.criticalPoint} ${currentProblem.variableUnit}`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Valor Extremo:</span>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {appMode === 'estudiante' && !isCurrentProblemUnlocked ? (
                        <span className="text-stone-400 font-normal italic">[Oculto en Reto]</span>
                      ) : (
                        `${dynamicAnalysis.optimalValue} ${currentProblem.functionUnit}`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-600">Derivada en {currentProblem.variableSymbol}*:</span>
                    <span className="font-bold text-emerald-800 tabular-nums">0.0000 (Equilibrio)</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Micro-Predicción Socrática: Ciclo POE (Predecir - Observar - Explicar) */}
            <PoeHypothesisCard
              poe={currentProblem.poeHypothesis}
              problemTitle={currentProblem.title}
            />

            {/* Estructura Modular de Dos Columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              
              {/* PANEL IZQUIERDO: Geometría Cartesiana y Parámetros (7 columnas) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* 1. Doble Gráfica Sincronizada con Arrastre V* */}
                <SynchronizedGraphs
                  problem={currentProblem}
                  coefficients={coefficients}
                  onChangeCoefficients={setCoefficients}
                  currentX={currentX}
                  onChangeX={setCurrentX}
                  deltaX={deltaX}
                  onChangeDeltaX={setDeltaX}
                />

                {/* 2. Controles de Sensibilidad Paramétrica y Desglose KaTeX */}
                <ParametricControls
                  problem={currentProblem}
                  coefficients={coefficients}
                  onChangeCoefficients={setCoefficients}
                  onResetCoefficients={handleResetCoefficients}
                  analysis={dynamicAnalysis}
                  appMode={appMode}
                  isUnlocked={isCurrentProblemUnlocked}
                />

                {/* 3. Panel de Concesión Económica cuando está desbloqueado */}
                {isCurrentProblemUnlocked && (
                  <div className="bg-white border-2 border-emerald-600 p-4 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-900 border-b border-emerald-100 pb-2">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                        <span className="uppercase tracking-wide">Dictamen de Optimización Concedido</span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-700">60 FPS Verificado</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                      <div className="p-2 bg-[#f7f6f2] border border-[#e5e5e0]">
                        <span className="text-[10px] text-stone-500 block">Punto {currentProblem.variableSymbol}*</span>
                        <span className="font-bold text-blue-800 text-sm tabular-nums">{dynamicAnalysis.criticalPoint}</span>
                      </div>
                      <div className="p-2 bg-[#f7f6f2] border border-[#e5e5e0]">
                        <span className="text-[10px] text-stone-500 block">Extremo {currentProblem.functionSymbol}({currentProblem.variableSymbol}*)</span>
                        <span className="font-bold text-stone-900 text-sm tabular-nums">{dynamicAnalysis.optimalValue}</span>
                      </div>
                      <div className="p-2 bg-[#f7f6f2] border border-[#e5e5e0]">
                        <span className="text-[10px] text-stone-500 block">Tasa f'({dynamicAnalysis.criticalPoint})</span>
                        <span className="font-bold text-emerald-800 text-sm tabular-nums">0.00</span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed bg-[#faf9f6] p-2.5 border border-[#e5e5e0]">
                      {dynamicAnalysis.economicDescription}
                    </p>
                  </div>
                )}

              </div>

              {/* PANEL DERECHO: Hoja de Resolución Diferencial (5 columnas) */}
              <div className="lg:col-span-5 space-y-4">
                <AlgebraicLockChalkboard
                  problem={currentProblem}
                  coefficients={coefficients}
                  analysis={dynamicAnalysis}
                  isUnlocked={isCurrentProblemUnlocked}
                  onUnlockProblem={handleUnlockProblem}
                  onRequestVariation={handleResetCoefficients}
                />

                {/* Nota de Metodología Científica */}
                <div className="p-3 bg-white border border-[#d4d4d0] space-y-1 text-xs text-stone-600">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wide">
                    <BookOpen className="w-3.5 h-3.5 text-blue-700" /> Metodología de Validación Paramétrica
                  </span>
                  <p className="leading-relaxed text-[11px]">
                    Cualquier modificación en los coeficientes <code>(a, b, c)</code> o desplazamiento del vértice <code>V*</code> recalcula instantáneamente los valores esperados de la derivada y del punto crítico en la Hoja de Resolución.
                  </p>
                </div>
              </div>

            </div>
          </>
        )}

      </main>

      {/* Pie Editorial Suizo Universitario */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-4 text-center text-[11px] font-mono text-stone-500 border-t border-[#d4d4d0] mt-8">
        <p>DERIVLAB EMPRESARIAL · ANÁLISIS DIFERENCIAL Y OPTIMIZACIÓN PARAMÉTRICA · NIVEL UNIVERSITARIO</p>
      </footer>
    </div>
  )
}
