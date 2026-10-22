import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sliders
} from 'lucide-react'
import { compile } from 'mathjs'
import type { BusinessProblem } from '../types/problem'
import { getOptimalCameraBounds } from '../services/problemHelpers'

interface GraphingCalculatorProps {
  problem: BusinessProblem
  userDerivative: string
  userXStar?: number
  testPointX0: number
  onChangeTestPointX0: (x0: number) => void
  className?: string
}

export const GraphingCalculator: React.FC<GraphingCalculatorProps> = ({
  problem,
  userDerivative,
  userXStar,
  testPointX0,
  onChangeTestPointX0,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Estado de la cámara cartesiana
  const [viewState, setViewState] = useState(() => getOptimalCameraBounds(problem))

  // Estado de arrastre del canvas (Pan)
  const isPanningRef = useRef(false)
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const viewAtPanStartRef = useRef({ ...viewState })

  // Coordenada de hover
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null)
  const [mouseCanvasPos, setMouseCanvasPos] = useState<{ x: number; y: number } | null>(null)

  // Recentrar vista cuando cambie el problema
  useEffect(() => {
    setViewState(getOptimalCameraBounds(problem))
  }, [problem.id])

  // Compilar la derivada del usuario en tiempo real con mathjs
  const compiledUserDerivative = useMemo(() => {
    if (!userDerivative || !userDerivative.trim()) {
      return null
    }

    let clean = userDerivative.trim()
    // Limpiar posibles prefijos como "f'(x) ="
    clean = clean.replace(/^[a-zA-Z_]'\([^)]*\)\s*=\s*/, '')
    clean = clean.replace(/^[a-zA-Z_]\([^)]*\)\s*=\s*/, '')
    // Multiplicación implícita
    clean = clean.replace(/(\d)([a-zA-Z])/g, '$1*$2')
    clean = clean.replace(/(\))([a-zA-Z\d])/g, '$1*$2')

    try {
      const compiled = compile(clean)
      return (val: number): number => {
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
      return null
    }
  }, [userDerivative])

  // Conversión Cartesiana a Píxeles
  const toScreenX = useCallback((xVal: number, width: number) => {
    return ((xVal - viewState.minX) / (viewState.maxX - viewState.minX)) * width
  }, [viewState.minX, viewState.maxX])

  const toScreenY = useCallback((yVal: number, height: number) => {
    return height - ((yVal - viewState.minY) / (viewState.maxY - viewState.minY)) * height
  }, [viewState.minY, viewState.maxY])

  // Renderizado a 60 FPS
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const width = Math.floor(rect.width * dpr)
    const height = Math.floor(rect.height * dpr)

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }

    ctx.save()
    ctx.clearRect(0, 0, width, height)

    // Fondo blanco limpio
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Cuadrícula y guías
    const xRange = viewState.maxX - viewState.minX
    const yRange = viewState.maxY - viewState.minY
    const xStep = Math.max(1, Math.round(xRange / 10))
    const yStep = Math.max(1, Math.round(yRange / 8))

    ctx.strokeStyle = '#f1f1ee'
    ctx.lineWidth = 1
    for (let x = Math.floor(viewState.minX); x <= viewState.maxX; x += xStep) {
      const sx = toScreenX(x, width)
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, height)
      ctx.stroke()
    }
    for (let y = Math.floor(viewState.minY); y <= viewState.maxY; y += yStep) {
      const sy = toScreenY(y, height)
      ctx.beginPath()
      ctx.moveTo(0, sy)
      ctx.lineTo(width, sy)
      ctx.stroke()
    }

    // Ejes Cartesiano X y Y
    const originX = toScreenX(0, width)
    const originY = toScreenY(0, height)

    ctx.strokeStyle = '#d4d4d0'
    ctx.lineWidth = 1.5

    // Eje X
    ctx.beginPath()
    ctx.moveTo(0, originY)
    ctx.lineTo(width, originY)
    ctx.stroke()

    // Eje Y
    ctx.beginPath()
    ctx.moveTo(originX, 0)
    ctx.lineTo(originX, height)
    ctx.stroke()

    // Números de escala
    ctx.fillStyle = '#a8a29e'
    ctx.font = '10px "IBM Plex Mono", monospace'
    for (let x = Math.floor(viewState.minX); x <= viewState.maxX; x += xStep) {
      if (x === 0) continue
      const sx = toScreenX(x, width)
      ctx.fillText(`${x}`, sx - 6, Math.min(height - 4, Math.max(12, originY + 12)))
    }
    for (let y = Math.floor(viewState.minY); y <= viewState.maxY; y += yStep) {
      if (y === 0) continue
      const sy = toScreenY(y, height)
      ctx.fillText(`${y}`, Math.min(width - 30, Math.max(4, originX + 4)), sy + 3)
    }

    // Función auxiliar para dibujar una curva muestreada
    const samplePoints = 350
    const dx = (viewState.maxX - viewState.minX) / samplePoints

    const drawCurve = (fn: (x: number) => number, color: string, lineWidth: number = 2, isDashed: boolean = false) => {
      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth * dpr
      if (isDashed) ctx.setLineDash([6 * dpr, 4 * dpr])

      ctx.beginPath()
      let started = false

      for (let i = 0; i <= samplePoints; i++) {
        const x = viewState.minX + i * dx
        const y = fn(x)
        if (isNaN(y) || !isFinite(y)) {
          started = false
          continue
        }
        const sx = toScreenX(x, width)
        const sy = toScreenY(y, height)

        if (!started) {
          ctx.moveTo(sx, sy)
          started = true
        } else {
          ctx.lineTo(sx, sy)
        }
      }
      ctx.stroke()
      ctx.restore()
    }

    // 1. CURVA AZUL: Función Original del Problema
    drawCurve(problem.evaluate, '#1d4ed8', 2.5)

    // 2. CURVA VERDE: Derivada escrita por el usuario (en tiempo real)
    if (compiledUserDerivative) {
      drawCurve(compiledUserDerivative, '#15803d', 2)
    }

    // 3. RECTA TANGENTE EN testPointX0 (Ámbar discontinua)
    const y0 = problem.evaluate(testPointX0)
    const slope0 = problem.evaluateDerivative(testPointX0)
    if (!isNaN(y0) && isFinite(y0) && !isNaN(slope0) && isFinite(slope0)) {
      const tangentFn = (xVal: number) => y0 + slope0 * (xVal - testPointX0)
      drawCurve(tangentFn, '#d97706', 1.5, true)

      // Punto P(x0, y0) sobre la curva azul
      const sx0 = toScreenX(testPointX0, width)
      const sy0 = toScreenY(y0, height)
      ctx.save()
      ctx.fillStyle = '#d97706'
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2 * dpr
      ctx.beginPath()
      ctx.arc(sx0, sy0, 6 * dpr, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      ctx.restore()
    }

    // 4. LÍNEA PÚRPURA: Punto donde da 0 (si el usuario lo ingresó)
    if (userXStar !== undefined && !isNaN(userXStar)) {
      const sxStar = toScreenX(userXStar, width)
      ctx.save()
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth = 1.5 * dpr
      ctx.setLineDash([4 * dpr, 4 * dpr])
      ctx.beginPath()
      ctx.moveTo(sxStar, 0)
      ctx.lineTo(sxStar, height)
      ctx.stroke()

      // Nodo sobre la curva f(x*)
      const yStar = problem.evaluate(userXStar)
      if (!isNaN(yStar) && isFinite(yStar)) {
        const syStar = toScreenY(yStar, height)
        ctx.fillStyle = '#7c3aed'
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        ctx.arc(sxStar, syStar, 5 * dpr, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
      ctx.restore()
    }

    ctx.restore()
  }, [viewState, problem, compiledUserDerivative, userXStar, testPointX0, toScreenX, toScreenY])

  // Controles de Zoom
  const handleZoom = (factor: number) => {
    setViewState(prev => {
      const rangeX = (prev.maxX - prev.minX) * factor
      const rangeY = (prev.maxY - prev.minY) * factor
      const midX = (prev.minX + prev.maxX) / 2
      const midY = (prev.minY + prev.maxY) / 2
      return {
        minX: midX - rangeX / 2,
        maxX: midX + rangeX / 2,
        minY: midY - rangeY / 2,
        maxY: midY + rangeY / 2
      }
    })
  }

  // Centrar vista
  const handleAutoFit = () => {
    setViewState(getOptimalCameraBounds(problem))
  }

  // Manejo de Pan / Arrastre del Canvas
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    isPanningRef.current = true
    panStartRef.current = { x: e.clientX, y: e.clientY }
    viewAtPanStartRef.current = { ...viewState }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    // Calcular coordenada cartesiana bajo el puntero
    const worldWidth = viewState.maxX - viewState.minX
    const worldHeight = viewState.maxY - viewState.minY
    const curX = viewState.minX + (px / rect.width) * worldWidth
    const curY = viewState.minY + ((rect.height - py) / rect.height) * worldHeight

    setHoverCoord({ x: Math.round(curX * 10) / 10, y: Math.round(curY * 10) / 10 })
    setMouseCanvasPos({ x: px, y: py })

    if (isPanningRef.current) {
      const dxPx = e.clientX - panStartRef.current.x
      const dyPx = e.clientY - panStartRef.current.y

      const dxWorld = (dxPx / rect.width) * worldWidth
      const dyWorld = (dyPx / rect.height) * worldHeight

      setViewState({
        minX: viewAtPanStartRef.current.minX - dxWorld,
        maxX: viewAtPanStartRef.current.maxX - dxWorld,
        minY: viewAtPanStartRef.current.minY + dyWorld,
        maxY: viewAtPanStartRef.current.maxY + dyWorld
      })
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isPanningRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignorar si ya se soltó
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 1.15 : 0.85
    handleZoom(factor)
  }

  return (
    <div id="step-graphing-calc" className={`bg-white border border-[#d4d4d0] shadow-xs flex flex-col h-full space-y-3 p-3 sm:p-4 ${className}`}>
      
      {/* Cabecera Limpia del Gráfico en Vivo */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e5e0] pb-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-600 inline-block"></span>
          <span className="font-bold text-stone-900 tracking-tight">
            Gráfico en Vivo
          </span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-500 text-[11px] font-sans flex items-center gap-2">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-700 inline-block"></span> Función original
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-600 inline-block"></span> Tu derivada
            </span>
          </span>
        </div>

        {/* Botones Simples de Cámara: +, -, Centrar */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleZoom(0.8)}
            className="w-7 h-7 border border-[#d4d4d0] bg-white text-stone-800 hover:bg-[#f7f6f2] font-bold text-sm cursor-pointer flex items-center justify-center"
            title="Acercar (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="w-7 h-7 border border-[#d4d4d0] bg-white text-stone-800 hover:bg-[#f7f6f2] font-bold text-sm cursor-pointer flex items-center justify-center"
            title="Alejar (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleAutoFit}
            className="h-7 px-2 border border-[#d4d4d0] bg-white text-stone-800 hover:bg-[#f7f6f2] text-xs font-mono flex items-center gap-1 cursor-pointer"
            title="Centrar vista del problema"
          >
            <Maximize2 className="w-3 h-3 text-stone-600" />
            <span className="hidden sm:inline text-[11px]">Centrar vista</span>
          </button>
        </div>
      </div>

      {/* Área del Lienzo Cartesiano */}
      <div 
        ref={containerRef}
        className="relative w-full flex-1 min-h-[380px] sm:min-h-[440px] bg-white border border-[#d4d4d0] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Coordenada bajo cursor */}
        {hoverCoord && mouseCanvasPos && (
          <div
            className="absolute z-10 pointer-events-none px-2 py-0.5 bg-stone-900 text-white font-mono text-[10px] border border-stone-700 shadow-sm"
            style={{
              left: Math.min(mouseCanvasPos.x + 12, 280),
              top: Math.max(mouseCanvasPos.y - 25, 8)
            }}
          >
            ({hoverCoord.x}, {hoverCoord.y})
          </div>
        )}

        <div className="absolute top-2 right-2 pointer-events-none text-[9px] font-mono text-stone-400 bg-white/80 px-2 py-0.5 border border-[#e5e5e0]">
          Arrastra para mover · Rueda para zoom
        </div>
      </div>

      {/* Deslizador simple: Mover punto en la curva */}
      <div className="flex items-center justify-between gap-3 p-2.5 bg-[#f7f6f2] border border-[#d4d4d0] text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="text-stone-700 font-bold">Mover punto en la curva:</span>
          <span className="px-2 py-0.5 bg-white border border-[#d4d4d0] font-bold text-stone-900 tabular-nums">
            {problem.variableSymbol} = {testPointX0}
          </span>
        </div>
        <input
          type="range"
          min={problem.domain[0]}
          max={problem.domain[1]}
          step={0.5}
          value={testPointX0}
          onChange={(e) => onChangeTestPointX0(parseFloat(e.target.value))}
          className="w-40 accent-amber-600 cursor-pointer"
        />
      </div>

    </div>
  )
}
