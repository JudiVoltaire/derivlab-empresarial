import React, { useRef, useEffect, useState } from 'react'
import { Play, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import type { BusinessProblem } from '../types/problem'
import type { ParametricCoefficients } from '../services/parametricEngine'
import { 
  evaluateParametricFunction, 
  evaluateParametricDerivative,
  solveInverseKinematics
} from '../services/parametricEngine'
import { soundEngine } from '../services'

interface SynchronizedGraphsProps {
  problem: BusinessProblem
  coefficients: ParametricCoefficients
  onChangeCoefficients: (newCoeffs: ParametricCoefficients) => void
  currentX: number
  onChangeX: (newX: number) => void
  deltaX: number
  onChangeDeltaX: (newDelta: number) => void
}

export const SynchronizedGraphs: React.FC<SynchronizedGraphsProps> = ({
  problem,
  coefficients,
  onChangeCoefficients,
  currentX,
  onChangeX,
  deltaX,
  onChangeDeltaX
}) => {
  const canvasTotalRef = useRef<HTMLCanvasElement | null>(null)
  const canvasMarginalRef = useRef<HTMLCanvasElement | null>(null)
  
  const [isAnimatingLimit, setIsAnimatingLimit] = useState(false)
  const [isTableOpen, setIsTableOpen] = useState(false)

  // Tipo de arrastre: 'P' (punto de evaluación) o 'V' (vértice/punto crítico para cinemática inversa)
  const activeDragTarget = useRef<'P' | 'V' | null>(null)

  // Cálculo del Punto Crítico vivo x*
  const currentCriticalX = problem.problemNumber === 3
    ? Math.sqrt(Math.max(0.01, coefficients.b / Math.max(0.1, coefficients.a)))
    : problem.problemNumber === 4
    ? 0
    : -coefficients.b / (2 * (coefficients.a || -1))

  const currentCriticalY = evaluateParametricFunction(problem.problemNumber, currentCriticalX, coefficients)

  // 1. Renderizado de Gráfica 1: Función Total f(x), Curva Fantasma f0, Secante, Tangente y Nodos P y V*
  useEffect(() => {
    const canvas = canvasTotalRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    const w = rect.width
    const h = rect.height

    const padL = 45
    const padR = 25
    const padT = 32
    const padB = 35

    const [xMin, xMax] = problem.domain
    const plotW = w - padL - padR
    const plotH = h - padT - padB

    // Rango dinámico en Y
    let yMin = Infinity
    let yMax = -Infinity
    const steps = 80
    const livePoints: { x: number; y: number }[] = []
    const ghostPoints: { x: number; y: number }[] = []

    for (let i = 0; i <= steps; i++) {
      const px = xMin + (i * (xMax - xMin)) / steps
      const pyLive = evaluateParametricFunction(problem.problemNumber, px, coefficients)
      const pyGhost = evaluateParametricFunction(problem.problemNumber, px, problem.baseCoefficients)

      if (!isNaN(pyLive) && isFinite(pyLive)) {
        yMin = Math.min(yMin, pyLive, pyGhost)
        yMax = Math.max(yMax, pyLive, pyGhost)
        livePoints.push({ x: px, y: pyLive })
        ghostPoints.push({ x: px, y: pyGhost })
      }
    }

    yMin = Math.min(0, yMin)
    yMax = Math.max(yMax * 1.15, 10)
    const ySpan = yMax - yMin || 1

    const toCanvasX = (vx: number) => padL + ((vx - xMin) / (xMax - xMin)) * plotW
    const toCanvasY = (vy: number) => padT + plotH - ((vy - yMin) / ySpan) * plotH

    // Fondo Papel Técnico
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    // Cuadrícula Milimétrica Técnica
    ctx.strokeStyle = '#e7e5e4'
    ctx.lineWidth = 1
    for (let gy = 0; gy <= 4; gy++) {
      const cY = padT + (gy * plotH) / 4
      const valY = yMax - (gy * ySpan) / 4
      ctx.beginPath()
      ctx.moveTo(padL, cY)
      ctx.lineTo(w - padR, cY)
      ctx.stroke()
      ctx.fillStyle = '#78716c'
      ctx.font = '10px "IBM Plex Mono", monospace'
      ctx.fillText(valY.toFixed(0), 10, cY + 3)
    }

    for (let gx = 0; gx <= 4; gx++) {
      const cX = padL + (gx * plotW) / 4
      const valX = xMin + (gx * (xMax - xMin)) / 4
      ctx.beginPath()
      ctx.moveTo(cX, padT)
      ctx.lineTo(cX, h - padB)
      ctx.stroke()
      ctx.fillStyle = '#78716c'
      ctx.font = '10px "IBM Plex Mono", monospace'
      ctx.fillText(valX.toFixed(1), cX - 10, h - padB + 16)
    }

    // Curva Fantasma Base f0(x) (Punteada en Gris Grafito)
    ctx.strokeStyle = '#a8a29e'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ghostPoints.forEach((pt, idx) => {
      const cx = toCanvasX(pt.x)
      const cy = toCanvasY(pt.y)
      if (idx === 0) ctx.moveTo(cx, cy)
      else ctx.lineTo(cx, cy)
    })
    ctx.stroke()
    ctx.setLineDash([])

    // Curva Viva f(x) (Azul Cobalto)
    ctx.strokeStyle = '#1d4ed8'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    livePoints.forEach((pt, idx) => {
      const cx = toCanvasX(pt.x)
      const cy = toCanvasY(pt.y)
      if (idx === 0) ctx.moveTo(cx, cy)
      else ctx.lineTo(cx, cy)
    })
    ctx.stroke()

    // Rectas Secante y Tangente
    const fx = evaluateParametricFunction(problem.problemNumber, currentX, coefficients)
    const xQ = Math.min(xMax, currentX + deltaX)
    const fQ = evaluateParametricFunction(problem.problemNumber, xQ, coefficients)

    const px = toCanvasX(currentX)
    const py = toCanvasY(fx)
    const qx = toCanvasX(xQ)
    const qy = toCanvasY(fQ)

    // Triángulo Incremental
    ctx.fillStyle = 'rgba(194, 65, 12, 0.08)'
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(qx, py)
    ctx.lineTo(qx, qy)
    ctx.closePath()
    ctx.fill()

    ctx.strokeStyle = '#c2410c'
    ctx.setLineDash([2, 2])
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(qx, py)
    ctx.lineTo(qx, qy)
    ctx.stroke()
    ctx.setLineDash([])

    // Recta Secante (Bermellón)
    const secSlope = (fQ - fx) / (xQ - currentX || 0.0001)
    const secSpan = 2
    ctx.strokeStyle = '#c2410c'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(toCanvasX(currentX - secSpan), toCanvasY(fx - secSlope * secSpan))
    ctx.lineTo(toCanvasX(currentX + deltaX + secSpan), toCanvasY(fx + secSlope * (deltaX + secSpan)))
    ctx.stroke()

    // Recta Tangente (Verde Bosque)
    const tanSlope = evaluateParametricDerivative(problem.problemNumber, currentX, coefficients)
    const tanSpan = 2.5
    ctx.strokeStyle = '#15803d'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(toCanvasX(currentX - tanSpan), toCanvasY(fx - tanSlope * tanSpan))
    ctx.lineTo(toCanvasX(currentX + tanSpan), toCanvasY(fx + tanSlope * tanSpan))
    ctx.stroke()

    // Nodo Q
    ctx.fillStyle = '#c2410c'
    ctx.beginPath()
    ctx.arc(qx, qy, 4, 0, Math.PI * 2)
    ctx.fill()

    // Nodo P(x₀, f(x₀)) (Arrastrable para evaluación)
    ctx.fillStyle = '#1d4ed8'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#1c1917'
    ctx.font = '600 10px "IBM Plex Sans", sans-serif'
    ctx.fillText(`P(${currentX.toFixed(1)}, ${fx.toFixed(1)})`, px + 8, py - 6)

    // NODO DE CONTROL V*(x*, y*) (Vértice / Punto Crítico para Cinemática Inversa)
    const vx = toCanvasX(currentCriticalX)
    const vy = toCanvasY(currentCriticalY)

    // Rombo técnico
    const rSize = 7
    ctx.fillStyle = '#15803d'
    ctx.beginPath()
    ctx.moveTo(vx, vy - rSize)
    ctx.lineTo(vx + rSize, vy)
    ctx.lineTo(vx, vy + rSize)
    ctx.lineTo(vx - rSize, vy)
    ctx.closePath()
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.fillStyle = '#15803d'
    ctx.font = 'bold 10px "IBM Plex Sans", sans-serif'
    ctx.fillText(`V* (${currentCriticalX.toFixed(1)}, ${currentCriticalY.toFixed(1)})`, vx - 20, vy - 12)

    // Título Editorial
    ctx.fillStyle = '#1c1917'
    ctx.font = 'bold 11px "IBM Plex Sans", sans-serif'
    ctx.fillText(`FIGURA 1.1 — Curva Primaria ${problem.functionSymbol}(${problem.variableSymbol}) y Curva Canónica Base`, padL, 18)

    ctx.restore()
  }, [problem, coefficients, currentX, deltaX, currentCriticalX, currentCriticalY])

  // 2. Renderizado de Gráfica 2: Función Marginal f'(x) en sincronía
  useEffect(() => {
    const canvas = canvasMarginalRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)
    const w = rect.width
    const h = rect.height

    const padL = 45
    const padR = 25
    const padT = 32
    const padB = 35

    const [xMin, xMax] = problem.domain
    const plotW = w - padL - padR
    const plotH = h - padT - padB

    let mMin = Infinity
    let mMax = -Infinity
    const steps = 80
    const mPoints: { x: number; y: number }[] = []

    for (let i = 0; i <= steps; i++) {
      const px = xMin + (i * (xMax - xMin)) / steps
      const py = evaluateParametricDerivative(problem.problemNumber, px, coefficients)
      if (!isNaN(py) && isFinite(py)) {
        mMin = Math.min(mMin, py)
        mMax = Math.max(mMax, py)
        mPoints.push({ x: px, y: py })
      }
    }

    mMin = Math.min(mMin * 1.1, -5)
    mMax = Math.max(mMax * 1.1, 5)
    const mSpan = mMax - mMin || 1

    const toCanvasX = (vx: number) => padL + ((vx - xMin) / (xMax - xMin)) * plotW
    const toCanvasY = (vy: number) => padT + plotH - ((vy - mMin) / mSpan) * plotH

    // Fondo Papel
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)

    // Cuadrícula
    ctx.strokeStyle = '#e7e5e4'
    ctx.lineWidth = 1
    for (let gy = 0; gy <= 4; gy++) {
      const cY = padT + (gy * plotH) / 4
      const valY = mMax - (gy * mSpan) / 4
      ctx.beginPath()
      ctx.moveTo(padL, cY)
      ctx.lineTo(w - padR, cY)
      ctx.stroke()
      ctx.fillStyle = '#78716c'
      ctx.font = '10px "IBM Plex Mono", monospace'
      ctx.fillText(valY.toFixed(0), 10, cY + 3)
    }

    // EJE HORIZONTAL f'(x) = 0
    const zeroY = toCanvasY(0)
    ctx.strokeStyle = '#c2410c'
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(padL, zeroY)
    ctx.lineTo(w - padR, zeroY)
    ctx.stroke()
    ctx.setLineDash([])

    ctx.fillStyle = '#c2410c'
    ctx.font = 'bold 9px "IBM Plex Mono", monospace'
    ctx.fillText("f'=0", 12, zeroY + 3)

    // Curva Marginal f'(x) (Verde Bosque)
    ctx.strokeStyle = '#15803d'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    mPoints.forEach((pt, idx) => {
      const cx = toCanvasX(pt.x)
      const cy = toCanvasY(pt.y)
      if (idx === 0) ctx.moveTo(cx, cy)
      else ctx.lineTo(cx, cy)
    })
    ctx.stroke()

    // Intersección con cero (x*, 0)
    const optCx = toCanvasX(currentCriticalX)
    ctx.fillStyle = '#15803d'
    ctx.beginPath()
    ctx.arc(optCx, zeroY, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#15803d'
    ctx.font = 'bold 10px "IBM Plex Mono", monospace'
    ctx.fillText(`x* = ${currentCriticalX.toFixed(2)}`, optCx - 18, zeroY - 8)

    // Punto actual evaluado
    const currDeriv = evaluateParametricDerivative(problem.problemNumber, currentX, coefficients)
    const cpx = toCanvasX(currentX)
    const cpy = toCanvasY(currDeriv)

    // Guía vertical
    ctx.strokeStyle = 'rgba(29, 78, 216, 0.3)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(cpx, padT)
    ctx.lineTo(cpx, h - padB)
    ctx.stroke()

    ctx.fillStyle = '#1d4ed8'
    ctx.beginPath()
    ctx.arc(cpx, cpy, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = '#1c1917'
    ctx.font = '600 10px "IBM Plex Mono", monospace'
    ctx.fillText(`m = ${currDeriv.toFixed(2)}`, cpx + 6, cpy - 6)

    // Título Editorial
    ctx.fillStyle = '#1c1917'
    ctx.font = 'bold 11px "IBM Plex Sans", sans-serif'
    ctx.fillText(`FIGURA 1.2 — Función Marginal Instantánea ${problem.functionSymbol}'(${problem.variableSymbol})`, padL, 18)

    ctx.restore()
  }, [problem, coefficients, currentX, currentCriticalX])

  // Lógica de Arrastre de Nodos (Punto P o Vértice V*)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasTotalRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clientX = e.clientX - rect.left
    const clientY = e.clientY - rect.top

    const padL = 45
    const padR = 25
    const padT = 32
    const padB = 35
    const plotW = rect.width - padL - padR
    const plotH = rect.height - padT - padB
    const [xMin, xMax] = problem.domain

    // Calcular coordenadas canvas de P y V*
    const fx = evaluateParametricFunction(problem.problemNumber, currentX, coefficients)
    const px = padL + ((currentX - xMin) / (xMax - xMin)) * plotW

    // Estimar rango Y para ubicar píxeles
    let yMin = 0
    let yMax = 10
    for (let i = 0; i <= 20; i++) {
      const sx = xMin + (i * (xMax - xMin)) / 20
      const sy = evaluateParametricFunction(problem.problemNumber, sx, coefficients)
      yMin = Math.min(yMin, sy)
      yMax = Math.max(yMax, sy)
    }
    yMax = Math.max(yMax * 1.15, 10)
    const ySpan = yMax - yMin || 1

    const py = padT + plotH - ((fx - yMin) / ySpan) * plotH
    const vx = padL + ((currentCriticalX - xMin) / (xMax - xMin)) * plotW
    const vy = padT + plotH - ((currentCriticalY - yMin) / ySpan) * plotH

    // Comprobar si el clic está cerca de V* (radio 16px)
    const distToV = Math.hypot(clientX - vx, clientY - vy)
    const distToP = Math.hypot(clientX - px, clientY - py)

    if (distToV < 18) {
      activeDragTarget.current = 'V'
    } else if (distToP < 18) {
      activeDragTarget.current = 'P'
    } else {
      activeDragTarget.current = 'P'
      updatePointPFromClientX(e.clientX, rect, padL, plotW, xMin, xMax)
    }
  }

  const updatePointPFromClientX = (
    clientX: number,
    rect: DOMRect,
    padL: number,
    plotW: number,
    xMin: number,
    xMax: number
  ) => {
    const relX = clientX - rect.left - padL
    const pct = Math.max(0, Math.min(1, relX / plotW))
    const newX = xMin + pct * (xMax - xMin)
    onChangeX(Math.round(newX * 10) / 10)
    soundEngine.playSlopeTone(evaluateParametricDerivative(problem.problemNumber, newX, coefficients))
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDragTarget.current) return
    const canvas = canvasTotalRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()

    const padL = 45
    const padR = 25
    const padT = 32
    const padB = 35
    const plotW = rect.width - padL - padR
    const plotH = rect.height - padT - padB
    const [xMin, xMax] = problem.domain

    if (activeDragTarget.current === 'P') {
      updatePointPFromClientX(e.clientX, rect, padL, plotW, xMin, xMax)
    } else if (activeDragTarget.current === 'V') {
      // Cinemática Inversa: recalcular coeficientes (a, b, c) según el arrastre de V*
      const relX = e.clientX - rect.left - padL
      const relY = e.clientY - rect.top - padT
      const pctX = Math.max(0.05, Math.min(0.95, relX / plotW))
      const targetX = xMin + pctX * (xMax - xMin)

      // Estimar Y deseada
      let yMin = 0
      let yMax = 10
      for (let i = 0; i <= 20; i++) {
        const sx = xMin + (i * (xMax - xMin)) / 20
        const sy = evaluateParametricFunction(problem.problemNumber, sx, coefficients)
        yMin = Math.min(yMin, sy)
        yMax = Math.max(yMax, sy)
      }
      yMax = Math.max(yMax * 1.15, 10)
      const ySpan = yMax - yMin || 1

      const targetY = yMin + (1 - Math.max(0, Math.min(1, relY / plotH))) * ySpan

      const invertedCoeffs = solveInverseKinematics(
        problem.problemNumber,
        targetX,
        targetY,
        coefficients
      )
      onChangeCoefficients(invertedCoeffs)
      soundEngine.playSlopeTone(0)
    }
  }

  const handlePointerUp = () => {
    activeDragTarget.current = null
  }

  // Animación del Límite lim Δx -> 0
  const handleAnimateLimit = () => {
    if (isAnimatingLimit) return
    setIsAnimatingLimit(true)

    const startDelta = 1.0
    const targetDelta = 0.001
    const startTime = performance.now()
    const duration = 1500

    const step = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(1, elapsed / duration)
      const currentDelta = startDelta * Math.pow(1 - progress, 2.5) + targetDelta * progress

      onChangeDeltaX(Math.max(0.001, currentDelta))
      soundEngine.playLimitTick(currentDelta)

      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        onChangeDeltaX(0.001)
        soundEngine.playSuccessChord()
        setIsAnimatingLimit(false)
      }
    }

    requestAnimationFrame(step)
  }

  // Filas de Convergencia del Límite
  const testDeltas = [1.0, 0.5, 0.1, 0.01, 0.001]
  const fx = evaluateParametricFunction(problem.problemNumber, currentX, coefficients)
  const exactDerivative = evaluateParametricDerivative(problem.problemNumber, currentX, coefficients)

  const limitRows = testDeltas.map(dx => {
    const fPlusDx = evaluateParametricFunction(problem.problemNumber, currentX + dx, coefficients)
    const dy = fPlusDx - fx
    const secSlope = dy / dx
    const error = Math.abs(secSlope - exactDerivative)
    return {
      dx,
      fPlusDx,
      dy,
      secSlope,
      error
    }
  })

  return (
    <div id="step-synchronized-graphs" className="w-full space-y-3 font-sans text-stone-900">
      
      {/* Barra de Control de la Gráfica */}
      <div className="bg-white border border-[#d4d4d0] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-700" />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Plano Cartesiano Bidireccional
          </span>
          <span className="text-[10px] text-stone-500 font-mono hidden sm:inline">
            (Arrastra V* para deformar coeficientes)
          </span>
        </div>

        <div id="step-limit-control" className="flex items-center gap-2">
          <button
            onClick={handleAnimateLimit}
            disabled={isAnimatingLimit}
            className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold tracking-wide border cursor-pointer transition-colors flex items-center gap-1.5 ${
              isAnimatingLimit
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-stone-900 text-white hover:bg-stone-800 border-stone-900'
            }`}
          >
            <Play className="w-3 h-3 fill-current" />
            <span>{isAnimatingLimit ? 'Calculando Límite...' : 'Ejecutar paso al límite Δx→0'}</span>
          </button>

          <button
            onClick={() => {
              onChangeDeltaX(0.5)
              soundEngine.playLimitTick(0.5)
            }}
            className="min-h-[36px] p-2 bg-[#f7f6f2] hover:bg-[#ebe9e1] text-stone-600 hover:text-stone-900 border border-[#d4d4d0] cursor-pointer"
            title="Restablecer incremento Δx = 0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Doble Lienzo Técnico Lado a Lado (o Apilado en Móvil) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Gráfica 1: Función Total f(x) */}
        <div className="bg-white border border-[#d4d4d0] p-2 relative shadow-xs">
          <canvas
            ref={canvasTotalRef}
            className="w-full h-[220px] sm:h-[260px] block cursor-crosshair touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-stone-500 font-mono">
            <span>● P({problem.variableSymbol}₀, f): Evaluación</span>
            <span>◆ V*({problem.variableSymbol}*, y*): Vértice Arrastrable</span>
          </div>
        </div>

        {/* Gráfica 2: Función Marginal f'(x) */}
        <div className="bg-white border border-[#d4d4d0] p-2 relative shadow-xs">
          <canvas
            ref={canvasMarginalRef}
            className="w-full h-[220px] sm:h-[260px] block pointer-events-none"
          />
          <div className="flex items-center justify-between px-2 pt-1 text-[10px] text-stone-500 font-mono">
            <span className="text-emerald-800 font-bold">― Tasa Marginal f'</span>
            <span className="text-amber-800 font-bold">-- Condición f' = 0</span>
          </div>
        </div>
      </div>

      {/* Sliders de Precisión Manual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-2.5 bg-white border border-[#d4d4d0] flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-stone-700 shrink-0">Punto {problem.variableSymbol}₀:</span>
          <input
            type="range"
            min={problem.domain[0]}
            max={problem.domain[1]}
            step="0.1"
            value={currentX}
            onChange={(e) => {
              const nx = parseFloat(e.target.value)
              onChangeX(nx)
              soundEngine.playSlopeTone(evaluateParametricDerivative(problem.problemNumber, nx, coefficients))
            }}
            className="w-full h-1.5 bg-[#d4d4d0] appearance-none cursor-pointer accent-blue-700"
          />
          <span className="font-mono text-xs font-bold text-blue-800 tabular-nums w-12 text-right">
            {currentX.toFixed(1)}
          </span>
        </div>

        <div className="p-2.5 bg-white border border-[#d4d4d0] flex items-center justify-between gap-3 text-xs">
          <span className="font-semibold text-stone-700 shrink-0">Incremento Δ{problem.variableSymbol}:</span>
          <input
            type="range"
            min="0.001"
            max="1.5"
            step="0.01"
            value={deltaX}
            onChange={(e) => {
              const nd = parseFloat(e.target.value)
              onChangeDeltaX(nd)
              soundEngine.playLimitTick(nd)
            }}
            className="w-full h-1.5 bg-[#d4d4d0] appearance-none cursor-pointer accent-amber-700"
          />
          <span className="font-mono text-xs font-bold text-amber-800 tabular-nums w-14 text-right">
            {deltaX.toFixed(3)}
          </span>
        </div>
      </div>

      {/* 4.º REGISTRO SEMIÓTICO DE DUVAL: Tabla Numérica de Convergencia del Límite */}
      <div id="step-duval-table" className="bg-white border border-[#d4d4d0] shadow-xs">
        <button
          onClick={() => setIsTableOpen(!isTableOpen)}
          className="w-full p-3 flex items-center justify-between text-left text-xs font-bold text-stone-800 hover:bg-[#faf9f6] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-700" />
            <span className="uppercase tracking-wider">
              Tabla de Convergencia Numérica (Δy/Δ{problem.variableSymbol} → f'({problem.variableSymbol}₀))
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-stone-500 font-normal hidden sm:inline">
              Registro Tabular de Raymond Duval
            </span>
            {isTableOpen ? <ChevronUp className="w-4 h-4 text-stone-600" /> : <ChevronDown className="w-4 h-4 text-stone-600" />}
          </div>
        </button>

        {isTableOpen && (
          <div className="p-3.5 bg-[#faf9f6] border-t border-[#e5e5e0] overflow-x-auto space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono border-b border-[#e5e5e0] pb-2 text-stone-600">
              <span>
                Punto Fijo de Evaluación: <strong>{problem.variableSymbol}₀ = {currentX.toFixed(2)}</strong>
              </span>
              <span>
                Derivada Analítica Exacta: <strong className="text-emerald-800">f'({currentX.toFixed(2)}) = {exactDerivative.toFixed(4)}</strong>
              </span>
            </div>

            <table className="w-full text-xs text-left border-collapse font-mono">
              <thead>
                <tr className="border-b border-[#d4d4d0] text-stone-700 text-[10px] sm:text-[11px] uppercase tracking-wide">
                  <th className="py-2 px-2 bg-stone-100">1. Incremento Δ{problem.variableSymbol}</th>
                  <th className="py-2 px-2">2. Punto {problem.variableSymbol}₀ + Δ{problem.variableSymbol}</th>
                  <th className="py-2 px-2">3. Variación Δy</th>
                  <th className="py-2 px-2 text-amber-900 bg-amber-50/70">4. Cociente Δy/Δ{problem.variableSymbol}</th>
                  <th className="py-2 px-2 text-emerald-900 bg-emerald-50/70">5. Convergencia → f'({problem.variableSymbol}₀)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e5e0] tabular-nums text-[11px]">
                {limitRows.map((row, idx) => {
                  const isUltraClose = row.dx === 0.001
                  return (
                    <tr 
                      key={idx} 
                      className={`transition-colors ${
                        isUltraClose ? 'bg-emerald-50/60 font-semibold' : 'hover:bg-white'
                      }`}
                    >
                      <td className="py-2 px-2 font-bold text-stone-900 bg-stone-50/50">
                        {row.dx.toFixed(3)}
                      </td>
                      <td className="py-2 px-2 text-stone-700">
                        {(currentX + row.dx).toFixed(3)}
                      </td>
                      <td className="py-2 px-2 text-stone-600">
                        {row.dy >= 0 ? `+${row.dy.toFixed(4)}` : row.dy.toFixed(4)}
                      </td>
                      <td className="py-2 px-2 font-bold text-amber-900 bg-amber-50/40">
                        {row.secSlope.toFixed(4)}
                      </td>
                      <td className="py-2 px-2 text-emerald-900 bg-emerald-50/40">
                        <div className="flex items-center gap-1.5">
                          <span>{exactDerivative.toFixed(4)}</span>
                          {row.error < 0.005 ? (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-100 border border-emerald-300 text-emerald-800 uppercase font-bold">
                              Convergente
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono text-stone-400">
                              (err: {row.error.toFixed(4)})
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Fundamento de Raymond Duval */}
            <div className="p-2.5 bg-white border border-[#e5e5e0] text-[11px] text-stone-600 leading-relaxed">
              <span className="font-bold text-stone-800 uppercase font-mono text-[10px] block mb-0.5">
                Fundamentación Didáctica de Raymond Duval:
              </span>
              La comprensión profunda del concepto de derivada exige la conversión y congruencia entre cuatro registros semióticos: 
              el <em>registro coloquial</em> (contexto empresarial), el <em>registro algebraico</em> (fórmula simbólica), 
              el <em>registro geométrico</em> (rectas secante y tangente en Fig. 1 y 2) y el <em>registro tabular numérico</em> (esta tabla de aproximación), 
              demostrando que la derivada es el límite exacto del cociente incremental cuando Δ{problem.variableSymbol} tiende a 0.
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
