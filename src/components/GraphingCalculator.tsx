import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react'
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  CheckCircle2, 
  AlertTriangle,
  Eye, 
  EyeOff,
  Crosshair,
  Sliders
} from 'lucide-react'
import { compile } from 'mathjs'

interface GraphingCalculatorProps {
  initialY1?: string
  initialY2?: string
  initialY3?: string
  initialXStar?: number
  domainX?: [number, number]
}

interface CurveSlot {
  id: 'y1' | 'y2' | 'y3' | 'xStar'
  label: string
  color: string
  rawExpression: string
  visible: boolean
  isCompiledOk: boolean
  errorMsg?: string
}

interface IntersectionPoint {
  x: number
  y: number
  type: 'root' | 'cross' | 'tangent'
  label: string
}

export const GraphingCalculator: React.FC<GraphingCalculatorProps> = ({
  initialY1 = '-2*x^2 + 24*x',
  initialY2 = '-4*x + 24',
  initialY3 = '12*x - 36',
  initialXStar = 6,
  domainX = [0, 12]
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Ranuras de funciones
  const [slots, setSlots] = useState<CurveSlot[]>([
    {
      id: 'y1',
      label: 'y₁ = f(x)',
      color: '#1d4ed8', // Azul cobalto
      rawExpression: initialY1,
      visible: true,
      isCompiledOk: true
    },
    {
      id: 'y2',
      label: "y₂ = f'(x)",
      color: '#15803d', // Verde bosque
      rawExpression: initialY2,
      visible: true,
      isCompiledOk: true
    },
    {
      id: 'y3',
      label: 'y₃ = T(x)',
      color: '#d97706', // Ámbar / Naranja
      rawExpression: initialY3,
      visible: true,
      isCompiledOk: true
    },
    {
      id: 'xStar',
      label: 'x = x*',
      color: '#7c3aed', // Púrpura punteado
      rawExpression: initialXStar.toString(),
      visible: true,
      isCompiledOk: true
    }
  ])

  // Punto de tangencia de prueba x₀
  const [tangentX0, setTangentX0] = useState<number>(3)

  // Estado de la cámara cartesiana
  const [viewState, setViewState] = useState({
    minX: domainX[0] - 1,
    maxX: domainX[1] + 1,
    minY: -15,
    maxY: 85
  })

  // Estado de arrastre del canvas (Pan)
  const isPanningRef = useRef(false)
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const viewAtPanStartRef = useRef({ ...viewState })

  // Nodo magnético activo en hover
  const [hoveredNode, setHoveredNode] = useState<IntersectionPoint | null>(null)
  const [mouseCanvasPos, setMouseCanvasPos] = useState<{ x: number; y: number } | null>(null)

  // Actualizar slots cuando cambien props iniciales
  useEffect(() => {
    setSlots(prev => prev.map(s => {
      if (s.id === 'y1' && initialY1) return { ...s, rawExpression: initialY1 }
      if (s.id === 'y2' && initialY2) return { ...s, rawExpression: initialY2 }
      if (s.id === 'y3' && initialY3) return { ...s, rawExpression: initialY3 }
      if (s.id === 'xStar' && initialXStar !== undefined) return { ...s, rawExpression: initialXStar.toString() }
      return s
    }))
  }, [initialY1, initialY2, initialY3, initialXStar])

  // Función auxiliar para parsear y compilar expresiones con mathjs
  const prepareExpression = (expr: string): string => {
    let clean = expr.trim()
    // Añadir multiplicación implícita entre números y variables (ej. 2x -> 2*x, 4x^2 -> 4*x^2)
    clean = clean.replace(/(\d)([a-zA-Z])/g, '$1*$2')
    clean = clean.replace(/(\))([a-zA-Z\d])/g, '$1*$2')
    return clean
  }

  // Compilar funciones mathjs
  const compiledFunctions = useMemo(() => {
    const compileSafe = (raw: string) => {
      try {
        const cleaned = prepareExpression(raw)
        const compiled = compile(cleaned)
        return {
          fn: (xVal: number): number => {
            try {
              const res = compiled.evaluate({ x: xVal, q: xVal, t: xVal, p: xVal, e: Math.E })
              return typeof res === 'number' && !isNaN(res) ? res : NaN
            } catch {
              return NaN
            }
          },
          ok: true
        }
      } catch (err) {
        return {
          fn: () => NaN,
          ok: false,
          error: (err as Error).message
        }
      }
    }

    const y1Slot = slots.find(s => s.id === 'y1')
    const y2Slot = slots.find(s => s.id === 'y2')
    const y3Slot = slots.find(s => s.id === 'y3')
    const xStarSlot = slots.find(s => s.id === 'xStar')

    const y1Compiled = compileSafe(y1Slot?.rawExpression || '')
    const y2Compiled = compileSafe(y2Slot?.rawExpression || '')
    const y3Compiled = compileSafe(y3Slot?.rawExpression || '')
    const parsedXStar = parseFloat(xStarSlot?.rawExpression || 'NaN')

    return {
      y1: y1Compiled,
      y2: y2Compiled,
      y3: y3Compiled,
      xStar: isNaN(parsedXStar) ? null : parsedXStar
    }
  }, [slots])

  // ============================================================
  // MOTOR DE DOBLE PRUEBA GEOMÉTRICA & DETECCIÓN DE INTERSECCIONES
  // ============================================================
  const geometricAnalysis = useMemo(() => {
    const intersections: IntersectionPoint[] = []
    const { y1, y2, y3, xStar } = compiledFunctions

    if (!y1.ok && !y2.ok) return { intersections, verdictOk: false, verdictMsg: 'Esperando funciones válidas...' }

    const stepSize = (viewState.maxX - viewState.minX) / 1000
    const sampleRange = [viewState.minX, viewState.maxX]

    // 1. Detección de raíces de f'(x) = 0 (Cruces con el eje y=0)
    if (y2.ok) {
      let prevSign = Math.sign(y2.fn(sampleRange[0]))
      for (let x = sampleRange[0] + stepSize; x <= sampleRange[1]; x += stepSize) {
        const currentSign = Math.sign(y2.fn(x))
        if (prevSign !== 0 && currentSign !== 0 && prevSign !== currentSign) {
          // Bisección para refinar raíz
          let left = x - stepSize
          let right = x
          for (let iter = 0; iter < 15; iter++) {
            const mid = (left + right) / 2
            const midVal = y2.fn(mid)
            if (Math.abs(midVal) < 0.0001) {
              left = mid
              break
            }
            if (Math.sign(midVal) === Math.sign(y2.fn(left))) {
              left = mid
            } else {
              right = mid
            }
          }
          const rootX = Math.round(left * 1000) / 1000
          intersections.push({
            x: rootX,
            y: 0,
            type: 'root',
            label: `f'(x*) = 0 en x = ${rootX.toFixed(2)}`
          })
        }
        prevSign = currentSign
      }
    }

    // 2. Intersección entre y1 y la recta vertical x = x*
    if (y1.ok && xStar !== null) {
      const yValAtXStar = y1.fn(xStar)
      if (!isNaN(yValAtXStar)) {
        intersections.push({
          x: xStar,
          y: Math.round(yValAtXStar * 100) / 100,
          type: 'cross',
          label: `Extremo V*(x*, f(x*)) = (${xStar.toFixed(2)}, ${yValAtXStar.toFixed(2)})`
        })
      }
    }

    // 3. Validación Anti-Falsos Positivos
    let verdictOk = false
    let verdictMsg = ''

    if (xStar !== null && y2.ok && y1.ok) {
      const derivAtXStar = y2.fn(xStar)
      const isDerivZero = Math.abs(derivAtXStar) < 0.05

      // Verificar si x* es extremo de y1 evaluando vecindades pequeñas
      const eps = 0.05
      const yCenter = y1.fn(xStar)
      const yLeft = y1.fn(xStar - eps)
      const yRight = y1.fn(xStar + eps)
      const isExtremum = (yCenter >= yLeft && yCenter >= yRight) || (yCenter <= yLeft && yCenter <= yRight)

      // Verificar tangencia de y3 si está activa
      let isTangentValid = true
      let tangentMsg = ''
      if (y3.ok) {
        // Pendiente de la recta tangente y3(x)
        const y3_0 = y3.fn(tangentX0)
        const y3_1 = y3.fn(tangentX0 + 1)
        const studentSlope = y3_1 - y3_0
        const exactSlope = y2.fn(tangentX0)
        const slopeDiff = Math.abs(studentSlope - exactSlope)

        if (slopeDiff > 0.08) {
          isTangentValid = false
          tangentMsg = `Discrepancia en tangente y₃: pendiente m=${studentSlope.toFixed(2)} difiere de f'(${tangentX0})=${exactSlope.toFixed(2)} (Δm=${slopeDiff.toFixed(2)}).`
        }
      }

      if (isDerivZero && isExtremum && isTangentValid) {
        verdictOk = true
        verdictMsg = `✓ Intersección y Tangencia Exactas — Derivada Validada en x* = ${xStar.toFixed(2)}`
      } else if (!isDerivZero) {
        verdictOk = false
        verdictMsg = `⚠ Discrepancia: f'(${xStar.toFixed(2)}) = ${derivAtXStar.toFixed(3)} ≠ 0 (No anula la tasa marginal).`
      } else if (!isTangentValid) {
        verdictOk = false
        verdictMsg = `⚠ ${tangentMsg}`
      } else {
        verdictOk = false
        verdictMsg = `⚠ Discrepancia: x* = ${xStar.toFixed(2)} anula f' pero no constituye un extremo local en y₁.`
      }
    }

    return {
      intersections,
      verdictOk,
      verdictMsg
    }
  }, [compiledFunctions, viewState, tangentX0])

  // Conversión Cartesiana a Píxeles
  const toScreenX = useCallback((xVal: number, width: number) => {
    return ((xVal - viewState.minX) / (viewState.maxX - viewState.minX)) * width
  }, [viewState.minX, viewState.maxX])

  const toScreenY = useCallback((yVal: number, height: number) => {
    return height - ((yVal - viewState.minY) / (viewState.maxY - viewState.minY)) * height
  }, [viewState.minY, viewState.maxY])

  // Renderizado Cartesiano a 60 FPS
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

    // Fondo Blanco Puro
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Rejilla Milimetrada Cartesiana
    const xStep = Math.max(1, Math.round((viewState.maxX - viewState.minX) / 10))
    const yStep = Math.max(5, Math.round((viewState.maxY - viewState.minY) / 8))

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

    // Ejes Principales X = 0 y Y = 0
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

    // Etiquetas de escala
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
      ctx.fillText(`${y}`, Math.min(width - 24, Math.max(4, originX + 4)), sy + 3)
    }

    // ==========================================
    // Trazo de Curvas con Clipping
    // ==========================================
    const samplePoints = 400
    const dx = (viewState.maxX - viewState.minX) / samplePoints

    const drawCurve = (fn: (x: number) => number, color: string, isDashed: boolean = false) => {
      ctx.save()
      ctx.strokeStyle = color
      ctx.lineWidth = 2 * dpr
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

    // 1. Curva y1 = f(x)
    const y1Slot = slots.find(s => s.id === 'y1')
    if (y1Slot?.visible && compiledFunctions.y1.ok) {
      drawCurve(compiledFunctions.y1.fn, '#1d4ed8')
    }

    // 2. Curva y2 = f'(x)
    const y2Slot = slots.find(s => s.id === 'y2')
    if (y2Slot?.visible && compiledFunctions.y2.ok) {
      drawCurve(compiledFunctions.y2.fn, '#15803d')
    }

    // 3. Recta Tangente y3 = T(x)
    const y3Slot = slots.find(s => s.id === 'y3')
    if (y3Slot?.visible && compiledFunctions.y3.ok) {
      drawCurve(compiledFunctions.y3.fn, '#d97706', true)
    }

    // 4. Recta Vertical x = x*
    const xStarSlot = slots.find(s => s.id === 'xStar')
    if (xStarSlot?.visible && compiledFunctions.xStar !== null) {
      const sx = toScreenX(compiledFunctions.xStar, width)
      ctx.save()
      ctx.strokeStyle = '#7c3aed'
      ctx.lineWidth = 1.5 * dpr
      ctx.setLineDash([4 * dpr, 4 * dpr])
      ctx.beginPath()
      ctx.moveTo(sx, 0)
      ctx.lineTo(sx, height)
      ctx.stroke()
      ctx.restore()
    }

    // ==========================================
    // Dibujo de Nodos Magnéticos e Intersecciones
    // ==========================================
    geometricAnalysis.intersections.forEach(pt => {
      const sx = toScreenX(pt.x, width)
      const sy = toScreenY(pt.y, height)

      ctx.save()
      if (pt.type === 'root') {
        ctx.fillStyle = '#15803d'
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        ctx.arc(sx, sy, 5 * dpr, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      } else {
        ctx.fillStyle = '#1d4ed8'
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        ctx.arc(sx, sy, 5 * dpr, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
      }
      ctx.restore()
    })

    // Punto de tangencia actual P(x₀, f(x₀))
    if (compiledFunctions.y1.ok) {
      const y0 = compiledFunctions.y1.fn(tangentX0)
      if (!isNaN(y0)) {
        const sx = toScreenX(tangentX0, width)
        const sy = toScreenY(y0, height)
        ctx.save()
        ctx.fillStyle = '#d97706'
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 2 * dpr
        ctx.beginPath()
        ctx.arc(sx, sy, 6 * dpr, 0, Math.PI * 2)
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      }
    }

    ctx.restore()
  }, [viewState, slots, compiledFunctions, geometricAnalysis, toScreenX, toScreenY, tangentX0])

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

  // Auto-encuadrar vista
  const handleAutoFit = () => {
    setViewState({
      minX: domainX[0] - 1,
      maxX: domainX[1] + 1,
      minY: -15,
      maxY: 85
    })
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

    // Detectar nodo magnético cercano (hover < 15px)
    let closestNode: IntersectionPoint | null = null
    let minDist = 15

    geometricAnalysis.intersections.forEach(pt => {
      const sx = toScreenX(pt.x, rect.width)
      const sy = toScreenY(pt.y, rect.height)
      const dist = Math.hypot(px - sx, py - sy)
      if (dist < minDist) {
        minDist = dist
        closestNode = pt
      }
    })

    setHoveredNode(closestNode)
    setMouseCanvasPos({ x: px, y: py })

    if (isPanningRef.current) {
      const dxPx = e.clientX - panStartRef.current.x
      const dyPx = e.clientY - panStartRef.current.y

      const worldWidth = viewAtPanStartRef.current.maxX - viewAtPanStartRef.current.minX
      const worldHeight = viewAtPanStartRef.current.maxY - viewAtPanStartRef.current.minY

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
      // Ignorar si no fue capturado
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    const factor = e.deltaY > 0 ? 1.15 : 0.85
    handleZoom(factor)
  }

  // Actualizar expresión de una ranura
  const handleUpdateSlot = (id: string, val: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, rawExpression: val } : s))
  }

  const handleToggleVisibility = (id: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s))
  }

  return (
    <div id="step-graphing-calc" className="bg-white border border-[#d4d4d0] shadow-xs flex flex-col h-full space-y-3 p-3 sm:p-4">
      {/* Cabecera Técnica de la Graficadora */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e5e5e0] pb-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-bold text-stone-900 flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-blue-700" />
            MOTOR CARTESIANO DE DOBLE PRUEBA
          </span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-500 text-[11px]">Desmos / GeoGebra Spec</span>
        </div>

        {/* Botones de Cámara */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleZoom(0.8)}
            className="p-1.5 border border-[#d4d4d0] bg-white text-stone-700 hover:bg-[#f7f6f2] cursor-pointer"
            title="Acercar (Zoom In)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleZoom(1.25)}
            className="p-1.5 border border-[#d4d4d0] bg-white text-stone-700 hover:bg-[#f7f6f2] cursor-pointer"
            title="Alejar (Zoom Out)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleAutoFit}
            className="px-2 py-1 border border-[#d4d4d0] bg-white text-stone-700 hover:bg-[#f7f6f2] cursor-pointer flex items-center gap-1 text-[11px]"
            title="Auto-encuadrar vista"
          >
            <Maximize2 className="w-3 h-3 text-stone-600" />
            <span>Encuadrar</span>
          </button>
        </div>
      </div>

      {/* Ranuras de Funciones y Entradas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
        {slots.map(slot => (
          <div 
            key={slot.id} 
            className="p-1.5 bg-[#faf9f6] border border-[#e5e5e0] flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() => handleToggleVisibility(slot.id)}
                className="text-stone-500 hover:text-stone-900 cursor-pointer"
                title={slot.visible ? 'Ocultar curva' : 'Mostrar curva'}
              >
                {slot.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-stone-300" />}
              </button>
              <span className="w-2.5 h-2.5 inline-block shrink-0" style={{ backgroundColor: slot.color }} />
              <span className="font-bold text-stone-800 text-[11px] min-w-[50px]">{slot.label}</span>
            </div>

            <input
              type="text"
              value={slot.rawExpression}
              onChange={(e) => handleUpdateSlot(slot.id, e.target.value)}
              placeholder="f(x)"
              className="flex-1 px-1.5 py-0.5 bg-white border border-[#d4d4d0] text-xs font-mono text-stone-900 focus:outline-none focus:border-blue-700"
            />
          </div>
        ))}
      </div>

      {/* Control Interactivo de Punto Tangente x₀ */}
      <div className="flex items-center justify-between gap-2 p-2 bg-[#f7f6f2] border border-[#d4d4d0] text-xs font-mono">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="text-stone-700 font-bold">Punto de Tangencia de Prueba:</span>
          <span className="px-1.5 py-0.5 bg-white border border-[#d4d4d0] font-bold text-stone-900">
            x₀ = {tangentX0}
          </span>
        </div>
        <input
          type="range"
          min={domainX[0]}
          max={domainX[1]}
          step={0.5}
          value={tangentX0}
          onChange={(e) => setTangentX0(parseFloat(e.target.value))}
          className="w-36 accent-amber-600 cursor-pointer"
        />
      </div>

      {/* Lienzo Cartesiano */}
      <div className="relative w-full h-[280px] sm:h-[340px] bg-white border border-[#d4d4d0] overflow-hidden select-none cursor-grab active:cursor-grabbing">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
          className="w-full h-full block"
        />

        {/* Tooltip de Nodo Magnético */}
        {hoveredNode && mouseCanvasPos && (
          <div
            className="absolute z-20 pointer-events-none px-2 py-1 bg-stone-900 text-white font-mono text-[10px] shadow-md border border-stone-700"
            style={{
              left: Math.min(mouseCanvasPos.x + 12, 280),
              top: Math.max(mouseCanvasPos.y - 25, 10)
            }}
          >
            {hoveredNode.label}
          </div>
        )}

        <div className="absolute top-2 right-2 pointer-events-none text-[9px] font-mono text-stone-400 bg-white/80 px-1.5 py-0.5 border border-[#e5e5e0]">
          Rueda: Zoom · Arrastre: Panorámica
        </div>
      </div>

      {/* Dictamen de Doble Prueba Geométrica */}
      <div id="step-intersection-badge" className={`p-2.5 border font-mono text-xs flex items-center justify-between gap-2 ${
        geometricAnalysis.verdictOk 
          ? 'bg-emerald-50 border-emerald-400 text-emerald-900' 
          : 'bg-amber-50 border-amber-300 text-amber-900'
      }`}>
        <div className="flex items-center gap-2">
          {geometricAnalysis.verdictOk ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="font-semibold text-[11px] leading-tight">
            {geometricAnalysis.verdictMsg}
          </span>
        </div>

        <span className="text-[10px] px-2 py-0.5 bg-white border border-[#d4d4d0] text-stone-700 font-bold uppercase shrink-0">
          {geometricAnalysis.verdictOk ? 'Convergencia Exacta' : 'Revisión Requerida'}
        </span>
      </div>
    </div>
  )
}
