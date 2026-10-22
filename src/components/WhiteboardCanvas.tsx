import React, { useRef, useState, useEffect, useCallback } from 'react'
import { 
  Pen, 
  Eraser, 
  RotateCcw, 
  Trash2
} from 'lucide-react'

interface WhiteboardCanvasProps {
  className?: string
}

/**
 * Convierte dinámicamente cualquier entrada de texto a notación KaTeX válida
 */
export const formatRawToLatex = (
  raw: string,
  variableSymbol: string = 'x',
  functionSymbol: string = 'f'
): string => {
  const v = variableSymbol
  const f = functionSymbol
  const prefix = `${f}'(${v}) = `

  if (!raw || !raw.trim()) {
    return `${prefix}\\dots`
  }

  let clean = raw.trim()
  // Limpiar posibles prefijos si el estudiante escribió "f'(x) =" o "f(x) ="
  clean = clean.replace(/^[a-zA-Z_]\([^)]*\)\s*=\s*/, '')
  clean = clean.replace(/^[a-zA-Z_]'\([^)]*\)\s*=\s*/, '')
  clean = clean.replace(/^[a-zA-Z_]\*\s*=\s*/, '')

  // Exponenciales: exp(...) -> e^{...} o e^(...) -> e^{...}
  clean = clean.replace(/exp\(([^)]+)\)/g, 'e^{$1}')
  clean = clean.replace(/e\^\{([^}]+)\}/g, 'e^{$1}')
  clean = clean.replace(/e\^([a-zA-Z0-9_.-]+)/g, 'e^{$1}')

  // Fracciones simples: a/b, a/x, a/x^2
  clean = clean.replace(/(\d+)\/([a-zA-Z]\^2)/g, '\\frac{$1}{$2}')
  clean = clean.replace(/(\d+)\/([a-zA-Z])/g, '\\frac{$1}{$2}')
  clean = clean.replace(/([a-zA-Z\d]+)\/([a-zA-Z\d]+)/g, '\\frac{$1}{$2}')

  // Potencias: x^2 -> x^{2}
  clean = clean.replace(/([a-zA-Z])\^(\d+)/g, '$1^{$2}')

  // Multiplicaciones explícitas: * -> espacio fino
  clean = clean.replace(/\*/g, ' ')

  return `${prefix}${clean}`
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [strokeColor, setStrokeColor] = useState<string>('#18181b')
  const [strokeWidth, setStrokeWidth] = useState<number>(2)
  const isDrawingRef = useRef<boolean>(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const historyRef = useRef<ImageData[]>([])
  const [canUndo, setCanUndo] = useState(false)

  // Dibujar cuadrícula técnica sobria
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Cuadrícula fina cada 20px
    ctx.strokeStyle = '#f1f1ee'
    ctx.lineWidth = 1
    for (let x = 0; x < width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Guías cada 100px
    ctx.strokeStyle = '#e5e5e0'
    ctx.lineWidth = 1
    for (let x = 0; x < width; x += 100) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += 100) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    ctx.restore()
  }, [])

  // Inicializar Canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = container.getBoundingClientRect()
    const width = Math.floor(rect.width * dpr)
    const height = Math.floor(rect.height * dpr)

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      drawGrid(ctx, width, height)
      const snapshot = ctx.getImageData(0, 0, width, height)
      historyRef.current = [snapshot]
      setCanUndo(false)
    }
  }, [drawGrid])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  // Guardar snapshot para Undo
  const saveSnapshot = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (historyRef.current.length >= 20) {
      historyRef.current.shift()
    }
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
    setCanUndo(true)
  }

  // Deshacer
  const handleUndo = () => {
    const canvas = canvasRef.current
    if (!canvas || historyRef.current.length <= 1) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    historyRef.current.pop() // Quitar el actual
    const previous = historyRef.current[historyRef.current.length - 1]
    if (previous) {
      ctx.putImageData(previous, 0, 0)
    }
    setCanUndo(historyRef.current.length > 1)
  }

  // Limpiar pizarra
  const handleClear = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    drawGrid(ctx, canvas.width, canvas.height)
    saveSnapshot()
  }

  // Coordenadas con DPI
  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    return {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr
    }
  }

  // Eventos de Puntero
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    isDrawingRef.current = true
    const pt = getCoordinates(e)
    lastPointRef.current = pt

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = strokeWidth * 6
    } else {
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth * (window.devicePixelRatio || 1)
    }

    ctx.beginPath()
    ctx.arc(pt.x, pt.y, (ctx.lineWidth / 2), 0, Math.PI * 2)
    ctx.fillStyle = ctx.strokeStyle
    ctx.fill()
    ctx.restore()
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !lastPointRef.current) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const current = getCoordinates(e)
    const prev = lastPointRef.current

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = strokeWidth * 6
    } else {
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = strokeWidth * (window.devicePixelRatio || 1)
    }

    ctx.beginPath()
    ctx.moveTo(prev.x, prev.y)
    ctx.lineTo(current.x, current.y)
    ctx.stroke()
    ctx.restore()

    lastPointRef.current = current
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawingRef.current) {
      isDrawingRef.current = false
      lastPointRef.current = null
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        // Ignorar si ya se soltó
      }
      saveSnapshot()
    }
  }

  return (
    <div id="step-whiteboard" className={`bg-white border border-[#d4d4d0] shadow-xs flex flex-col h-full ${className}`}>
      {/* Barra de Herramientas de la Pizarra */}
      <div className="p-3 border-b border-[#e5e5e0] bg-[#faf9f6] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-blue-700 inline-block"></span>
          <span className="font-bold text-stone-900 tracking-tight">
            1. Pizarra de Borrador (Haz tus cuentas aquí)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Lápiz vs Borrador */}
          <div className="flex border border-[#d4d4d0] bg-white p-0.5">
            <button
              onClick={() => setTool('pen')}
              className={`px-2 py-1 flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                tool === 'pen' ? 'bg-[#f7f6f2] text-blue-700 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Lápiz"
            >
              <Pen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lápiz</span>
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`px-2 py-1 flex items-center gap-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                tool === 'eraser' ? 'bg-[#f7f6f2] text-amber-700 font-bold' : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Borrador"
            >
              <Eraser className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Borrador</span>
            </button>
          </div>

          {/* Paleta de Colores */}
          <div className="flex items-center border border-[#d4d4d0] bg-white p-1 gap-1">
            <button
              onClick={() => { setTool('pen'); setStrokeColor('#18181b'); }}
              className={`w-4 h-4 rounded-none cursor-pointer transition-transform ${
                strokeColor === '#18181b' && tool === 'pen' ? 'ring-2 ring-stone-900 scale-110' : ''
              }`}
              style={{ backgroundColor: '#18181b' }}
              title="Negro"
            />
            <button
              onClick={() => { setTool('pen'); setStrokeColor('#1d4ed8'); }}
              className={`w-4 h-4 rounded-none cursor-pointer transition-transform ${
                strokeColor === '#1d4ed8' && tool === 'pen' ? 'ring-2 ring-blue-700 scale-110' : ''
              }`}
              style={{ backgroundColor: '#1d4ed8' }}
              title="Azul"
            />
            <button
              onClick={() => { setTool('pen'); setStrokeColor('#b91c1c'); }}
              className={`w-4 h-4 rounded-none cursor-pointer transition-transform ${
                strokeColor === '#b91c1c' && tool === 'pen' ? 'ring-2 ring-red-700 scale-110' : ''
              }`}
              style={{ backgroundColor: '#b91c1c' }}
              title="Rojo"
            />
          </div>

          {/* Grosor de Trazo */}
          <div className="flex border border-[#d4d4d0] bg-white p-0.5 text-[10px]">
            {[1, 2, 4].map(w => (
              <button
                key={w}
                onClick={() => setStrokeWidth(w)}
                className={`px-1.5 py-0.5 cursor-pointer font-bold ${
                  strokeWidth === w ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-[#f7f6f2]'
                }`}
              >
                {w}px
              </button>
            ))}
          </div>

          {/* Deshacer y Limpiar */}
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            className={`p-1.5 border border-[#d4d4d0] bg-white transition-colors ${
              canUndo ? 'text-stone-800 hover:bg-[#f7f6f2] cursor-pointer' : 'text-stone-300 cursor-not-allowed'
            }`}
            title="Deshacer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 border border-[#d4d4d0] bg-white text-stone-600 hover:text-red-700 hover:bg-[#f7f6f2] transition-colors cursor-pointer"
            title="Limpiar pizarra"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Área del Canvas ocupando todo el alto disponible */}
      <div 
        ref={containerRef}
        className="relative w-full flex-1 min-h-[440px] sm:min-h-[500px] bg-white touch-none cursor-crosshair overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block"
        />
        <div className="absolute bottom-2 right-2 pointer-events-none text-[9px] font-mono text-stone-400 bg-white/80 px-2 py-0.5 border border-[#e5e5e0]">
          Lienzo de dibujo · Stylus / Táctil / Ratón
        </div>
      </div>
    </div>
  )
}
