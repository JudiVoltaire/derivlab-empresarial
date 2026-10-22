import React, { useRef, useState, useEffect, useCallback } from 'react'
import { 
  Pen, 
  Eraser, 
  RotateCcw, 
  Trash2, 
  Send, 
  Plus, 
  Trash
} from 'lucide-react'
import { LatexRenderer } from './LatexRenderer'

interface WhiteboardCanvasProps {
  onSendToCalculator?: (data: {
    y1?: string
    y2?: string
    y3?: string
    xStar?: number
  }) => void
  initialExpressions?: {
    y1?: string
    y2?: string
    xStar?: number
  }
}

interface AlgebraicStep {
  id: string
  label: string
  rawExpression: string
  latexExpression: string
  targetSlot: 'y1' | 'y2' | 'y3' | 'xStar'
}

export const WhiteboardCanvas: React.FC<WhiteboardCanvasProps> = ({
  onSendToCalculator,
  initialExpressions
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen')
  const [strokeColor, setStrokeColor] = useState<string>('#18181b')
  const [strokeWidth, setStrokeWidth] = useState<number>(2)
  const isDrawingRef = useRef<boolean>(false)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const historyRef = useRef<ImageData[]>([])
  const [canUndo, setCanUndo] = useState(false)

  // Líneas algebraicas formalizadas
  const [algebraicSteps, setAlgebraicSteps] = useState<AlgebraicStep[]>([
    {
      id: 'step-1',
      label: 'Función Total f(x)',
      rawExpression: initialExpressions?.y1 || '-2*x^2 + 24*x',
      latexExpression: 'f(x) = -2x^2 + 24x',
      targetSlot: 'y1'
    },
    {
      id: 'step-2',
      label: "Función Marginal f'(x)",
      rawExpression: initialExpressions?.y2 || '-4*x + 24',
      latexExpression: "f'(x) = -4x + 24",
      targetSlot: 'y2'
    },
    {
      id: 'step-3',
      label: 'Punto Crítico x*',
      rawExpression: initialExpressions?.xStar?.toString() || '6',
      latexExpression: 'x^* = 6',
      targetSlot: 'xStar'
    }
  ])

  // Dibujar cuadrícula técnica
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save()
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Cuadrícula fina de 20px
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

    // Cuadrícula mayor cada 100px
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
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const width = Math.floor(rect.width * dpr)
    const height = Math.floor(rect.height * dpr)

    canvas.width = width
    canvas.height = height

    drawGrid(ctx, width, height)

    // Guardar estado inicial en historia
    const initialSnapshot = ctx.getImageData(0, 0, width, height)
    historyRef.current = [initialSnapshot]
    setCanUndo(false)
  }, [drawGrid])

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

    historyRef.current.pop() // Quita el actual
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

  // Coordenadas con soporte de DPI
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

  // Eventos de Puntero (Stylus, Touch, Mouse a 60 FPS)
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

  // Convertir expresión a LaTeX básico
  const formatRawToLatex = (raw: string, target: string): string => {
    let clean = raw.replace(/\*/g, '').trim()
    clean = clean.replace(/(\w+)\^(\d+)/g, '$1^{$2}')
    if (target === 'y1') return `f(x) = ${clean}`
    if (target === 'y2') return `f'(x) = ${clean}`
    if (target === 'y3') return `T(x) = ${clean}`
    if (target === 'xStar') return `x^* = ${clean}`
    return clean
  }

  const handleUpdateStep = (id: string, raw: string) => {
    setAlgebraicSteps(prev =>
      prev.map(step => {
        if (step.id !== id) return step
        return {
          ...step,
          rawExpression: raw,
          latexExpression: formatRawToLatex(raw, step.targetSlot)
        }
      })
    )
  }

  const handleAddStep = () => {
    const newId = `step-${Date.now()}`
    setAlgebraicSteps(prev => [
      ...prev,
      {
        id: newId,
        label: 'Recta Tangente T(x)',
        rawExpression: '12*x - 36',
        latexExpression: 'T(x) = 12x - 36',
        targetSlot: 'y3'
      }
    ])
  }

  const handleRemoveStep = (id: string) => {
    setAlgebraicSteps(prev => prev.filter(s => s.id !== id))
  }

  // Transferir expresiones a la Calculadora Gráfica
  const handleTransferToCalculator = () => {
    if (!onSendToCalculator) return

    const y1Step = algebraicSteps.find(s => s.targetSlot === 'y1')
    const y2Step = algebraicSteps.find(s => s.targetSlot === 'y2')
    const y3Step = algebraicSteps.find(s => s.targetSlot === 'y3')
    const xStarStep = algebraicSteps.find(s => s.targetSlot === 'xStar')

    const parsedXStar = xStarStep ? parseFloat(xStarStep.rawExpression) : undefined

    onSendToCalculator({
      y1: y1Step?.rawExpression,
      y2: y2Step?.rawExpression,
      y3: y3Step?.rawExpression,
      xStar: isNaN(parsedXStar || NaN) ? undefined : parsedXStar
    })
  }

  return (
    <div id="step-whiteboard" className="bg-white border border-[#d4d4d0] shadow-xs flex flex-col h-full">
      {/* Barra de Herramientas de la Pizarra */}
      <div className="p-3 border-b border-[#e5e5e0] bg-[#faf9f6] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="font-bold text-stone-900 tracking-tight flex items-center gap-1">
            <span className="w-2 h-2 bg-blue-700 inline-block"></span>
            PIZARRA CIENTÍFICA
          </span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-500 text-[11px]">Tinta Vectorial 60 FPS</span>
        </div>

        <div className="flex items-center gap-1">
          {/* Herramienta Pluma vs Borrador */}
          <div className="flex border border-[#d4d4d0] bg-white p-0.5">
            <button
              onClick={() => setTool('pen')}
              className={`p-1.5 transition-colors cursor-pointer ${
                tool === 'pen' ? 'bg-[#f7f6f2] text-blue-700 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Pluma Técnica"
            >
              <Pen className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-1.5 transition-colors cursor-pointer ${
                tool === 'eraser' ? 'bg-[#f7f6f2] text-amber-700 font-bold' : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Borrador"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Paleta de Colores Técnicos */}
          <div className="flex items-center border border-[#d4d4d0] bg-white p-1 gap-1">
            <button
              onClick={() => { setTool('pen'); setStrokeColor('#18181b'); }}
              className={`w-4 h-4 rounded-none cursor-pointer transition-transform ${
                strokeColor === '#18181b' && tool === 'pen' ? 'ring-2 ring-stone-900 scale-110' : ''
              }`}
              style={{ backgroundColor: '#18181b' }}
              title="Grafito Técnico (#18181b)"
            />
            <button
              onClick={() => { setTool('pen'); setStrokeColor('#1d4ed8'); }}
              className={`w-4 h-4 rounded-none cursor-pointer transition-transform ${
                strokeColor === '#1d4ed8' && tool === 'pen' ? 'ring-2 ring-blue-700 scale-110' : ''
              }`}
              style={{ backgroundColor: '#1d4ed8' }}
              title="Azul Cobalto (#1d4ed8)"
            />
            <button
              onClick={() => { setTool('pen'); setStrokeColor('#b91c1c'); }}
              className={`w-4 h-4 rounded-none cursor-pointer transition-transform ${
                strokeColor === '#b91c1c' && tool === 'pen' ? 'ring-2 ring-red-700 scale-110' : ''
              }`}
              style={{ backgroundColor: '#b91c1c' }}
              title="Rojo Editorial (#b91c1c)"
            />
          </div>

          {/* Grosor de trazo */}
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
            title="Deshacer trazo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 border border-[#d4d4d0] bg-white text-stone-600 hover:text-red-700 hover:bg-[#f7f6f2] transition-colors cursor-pointer"
            title="Limpiar pizarra entera"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Área del Canvas con Cuadrícula Milimetrada */}
      <div className="relative w-full h-[260px] sm:h-[320px] bg-white touch-none cursor-crosshair overflow-hidden">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block"
        />
        <div className="absolute bottom-1 right-2 pointer-events-none text-[9px] font-mono text-stone-400">
          Cuadrícula 20px · Stylus / Táctil / Ratón
        </div>
      </div>

      {/* Sección Inferior: Líneas Algebraicas Formalizadas */}
      <div className="border-t border-[#d4d4d0] p-3 bg-[#faf9f6] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-stone-700">
            Líneas de Resolución Simbólica
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleAddStep}
              className="px-2 py-0.5 bg-white hover:bg-[#f7f6f2] border border-[#d4d4d0] text-stone-700 text-[11px] font-mono flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 text-blue-700" />
              <span>+ Línea</span>
            </button>
            <button
              onClick={handleTransferToCalculator}
              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Graficar en Calculadora →</span>
            </button>
          </div>
        </div>

        {/* Lista de expresiones KaTeX */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {algebraicSteps.map((step) => {
            const slotColor = 
              step.targetSlot === 'y1' ? 'text-blue-700 border-l-4 border-l-blue-700' :
              step.targetSlot === 'y2' ? 'text-emerald-700 border-l-4 border-l-emerald-700' :
              step.targetSlot === 'y3' ? 'text-amber-700 border-l-4 border-l-amber-700' :
              'text-purple-700 border-l-4 border-l-purple-700'

            return (
              <div 
                key={step.id}
                className={`p-2 bg-white border border-[#d4d4d0] ${slotColor} flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs`}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-stone-500">
                      {step.label} [{step.targetSlot}]
                    </span>
                    {algebraicSteps.length > 2 && (
                      <button
                        onClick={() => handleRemoveStep(step.id)}
                        className="text-stone-400 hover:text-red-700 cursor-pointer"
                        title="Eliminar línea"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={step.rawExpression}
                      onChange={(e) => handleUpdateStep(step.id, e.target.value)}
                      placeholder="Escribe expresión, ej: -2*x^2 + 24*x"
                      className="flex-1 px-2 py-1 bg-[#f7f6f2] border border-[#d4d4d0] font-mono text-xs text-stone-900 focus:outline-none focus:border-blue-700"
                    />
                    <div className="bg-[#faf9f6] px-2 py-1 border border-[#e5e5e0] min-w-[130px] flex items-center justify-center">
                      <LatexRenderer latex={step.latexExpression} className="text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
