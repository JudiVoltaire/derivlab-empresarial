import React, { useRef, useEffect } from 'react'
import type { BusinessProblem } from '../types/problem'

interface BusinessSceneCanvasProps {
  problem: BusinessProblem
  currentX: number
  isUnlocked: boolean
}

export const BusinessSceneCanvas: React.FC<BusinessSceneCanvasProps> = ({
  problem,
  currentX,
  isUnlocked
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let animTime = 0

    const render = () => {
      animTime += 0.03
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      
      // Ajustar resolución retina
      if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
      }

      ctx.save()
      ctx.scale(dpr, dpr)
      const w = rect.width
      const h = rect.height

      // Fondo base
      ctx.fillStyle = '#090d16'
      ctx.fillRect(0, 0, w, h)

      const fVal = problem.evaluate(currentX)
      const slope = problem.evaluateDerivative(currentX)
      const isOptimal = Math.abs(currentX - problem.criticalPoint) < 0.25

      // Renderizar escena específica del problema
      switch (problem.problemNumber) {
        case 1:
          drawFermatScene(ctx, w, h, currentX, fVal, slope, isOptimal, animTime)
          break
        case 2:
          drawCournotFactoryScene(ctx, w, h, currentX, fVal, slope, isOptimal, animTime)
          break
        case 3:
          drawEoqBalanceScene(ctx, w, h, currentX, fVal, slope, isOptimal, animTime)
          break
        case 4:
          drawFintechTerminalScene(ctx, w, h, currentX, fVal, slope, isOptimal, animTime)
          break
      }

      // Overlay de estado de optimización
      drawSceneHeader(ctx, w, problem, currentX, fVal, slope, isOptimal, isUnlocked)

      ctx.restore()
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [problem, currentX, isUnlocked])

  return (
    <div className="w-full rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative group">
      <canvas
        ref={canvasRef}
        className="w-full h-[220px] sm:h-[260px] block cursor-crosshair touch-none"
      />
    </div>
  )
}

// =========================================================================
// ESCENA 1: Puesto Mercantil del Siglo XVII (Pierre de Fermat)
// =========================================================================
function drawFermatScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  x: number,
  fVal: number,
  _slope: number,
  isOptimal: boolean,
  time: number
) {
  // Cielo y suelo de adoquines
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.7)
  skyGrad.addColorStop(0, '#0f172a')
  skyGrad.addColorStop(1, '#1e1b4b')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h * 0.7)

  ctx.fillStyle = '#1e293b'
  ctx.fillRect(0, h * 0.7, w, h * 0.3)

  // Línea de adoquines
  ctx.strokeStyle = '#334155'
  ctx.lineWidth = 1
  for (let lx = 0; lx < w; lx += 24) {
    ctx.beginPath()
    ctx.moveTo(lx, h * 0.7)
    ctx.lineTo(lx - 12, h)
    ctx.stroke()
  }

  // Puesto de telas (Toldo a rayas rojo/blanco)
  const stallX = w * 0.2
  const stallY = h * 0.45
  const stallW = w * 0.35
  const stallH = h * 0.35

  // Postes de madera
  ctx.fillStyle = '#78350f'
  ctx.fillRect(stallX, stallY, 10, stallH)
  ctx.fillRect(stallX + stallW - 10, stallY, 10, stallH)

  // Mesa
  ctx.fillStyle = '#92400e'
  ctx.fillRect(stallX - 8, stallY + stallH * 0.45, stallW + 16, 14)

  // Rollos de tela en la mesa
  ctx.fillStyle = '#4338ca'
  ctx.beginPath()
  ctx.ellipse(stallX + 25, stallY + stallH * 0.4, 16, 8, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#059669'
  ctx.beginPath()
  ctx.ellipse(stallX + 55, stallY + stallH * 0.4, 14, 7, 0, 0, Math.PI * 2)
  ctx.fill()

  // Toldo ondulado
  const awningH = 26
  for (let s = 0; s < 6; s++) {
    ctx.fillStyle = s % 2 === 0 ? '#b91c1c' : '#f8fafc'
    ctx.fillRect(stallX + (s * stallW) / 6, stallY - awningH, stallW / 6, awningH)
  }

  // Cartel de Precio
  ctx.fillStyle = '#fbbf24'
  ctx.font = 'bold 11px system-ui'
  ctx.fillText(`Precio: ${x.toFixed(1)} monedas`, stallX + 12, stallY - 6)

  // Compradores (flujo proporcional a la demanda: alta si precio es bajo/medio)
  const demandRate = Math.max(0.1, 1 - x / 12)
  const buyerCount = Math.floor(demandRate * 4) + 1
  ctx.fillStyle = '#94a3b8'

  for (let i = 0; i < buyerCount; i++) {
    const bx = stallX - 35 - i * 30 + Math.sin(time + i) * 3
    const by = h * 0.72 + (i % 2) * 10
    // Cabeza
    ctx.beginPath()
    ctx.arc(bx, by - 22, 6, 0, Math.PI * 2)
    ctx.fill()
    // Cuerpo
    ctx.fillRect(bx - 5, by - 16, 10, 16)
  }

  // Cofre de Monedas en la derecha (se llena con fVal)
  const chestX = w * 0.72
  const chestY = h * 0.65
  const chestW = 60
  const chestH = 34

  // Base del cofre
  ctx.fillStyle = '#854d0e'
  ctx.fillRect(chestX, chestY, chestW, chestH)
  ctx.strokeStyle = '#fef08a'
  ctx.lineWidth = 2
  ctx.strokeRect(chestX, chestY, chestW, chestH)

  // Monedas apiladas en el cofre proporcional al Ingreso Total fVal (normalizado a 72)
  const fillPct = Math.max(0.05, Math.min(1, fVal / 72))
  const coinLayers = Math.floor(fillPct * 6)

  for (let l = 0; l < coinLayers; l++) {
    ctx.fillStyle = '#eab308'
    for (let c = 0; c < 5; c++) {
      ctx.beginPath()
      ctx.ellipse(chestX + 10 + c * 10, chestY - 4 - l * 4, 6, 3, 0, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Chispas doradas si está en el punto óptimo
  if (isOptimal) {
    ctx.fillStyle = '#fde047'
    for (let p = 0; p < 6; p++) {
      const px = chestX + 30 + Math.cos(time * 3 + p) * 32
      const py = chestY - 10 + Math.sin(time * 3 + p) * 20
      ctx.beginPath()
      ctx.arc(px, py, 2.5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#4ade80'
    ctx.font = 'bold 11px system-ui'
    ctx.fillText('¡INGRESO MÁXIMO!', chestX - 15, chestY - 32)
  }
}

// =========================================================================
// ESCENA 2: Fábrica a Vapor del Siglo XIX (Cournot & Marshall)
// =========================================================================
function drawCournotFactoryScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  q: number,
  _fVal: number,
  slope: number,
  isOptimal: boolean,
  time: number
) {
  // Fondo de hollín victoriano
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h)
  bgGrad.addColorStop(0, '#111827')
  bgGrad.addColorStop(1, '#1c1917')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, w, h)

  // Fachada de ladrillos de la fábrica
  const facX = w * 0.1
  const facY = h * 0.35
  const facW = w * 0.5
  const facH = h * 0.65

  ctx.fillStyle = '#7f1d1d'
  ctx.fillRect(facX, facY, facW, facH)

  // Ventanas industriales
  ctx.fillStyle = '#fef08a'
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 3; col++) {
      ctx.fillRect(facX + 18 + col * 34, facY + 20 + row * 35, 18, 22)
    }
  }

  // 2 Chimeneas
  const chimSpeed = Math.max(0.5, q * 0.6)
  const chimX1 = facX + 25
  const chimX2 = facX + facW - 40
  const chimW = 20
  const chimH = h * 0.22

  ctx.fillStyle = '#450a0a'
  ctx.fillRect(chimX1, facY - chimH, chimW, chimH)
  ctx.fillRect(chimX2, facY - chimH, chimW, chimH)

  // Humo animado (velocidad según q)
  for (let i = 0; i < 5; i++) {
    const smokeY1 = facY - chimH - ((time * chimSpeed * 18 + i * 20) % 60)
    const smokeX1 = chimX1 + 10 + Math.sin(smokeY1 * 0.1) * 8
    const smokeAlpha = Math.max(0, 1 - (facY - chimH - smokeY1) / 60) * 0.4
    ctx.fillStyle = `rgba(156, 163, 175, ${smokeAlpha})`
    ctx.beginPath()
    ctx.arc(smokeX1, smokeY1, 8 + i * 2, 0, Math.PI * 2)
    ctx.fill()
  }

  // Pistón a vapor animado oscilante
  const pistonX = facX + facW + 30
  const pistonY = h * 0.45
  const stroke = Math.sin(time * (1 + q * 0.8)) * 16

  ctx.fillStyle = '#475569'
  ctx.fillRect(pistonX, pistonY - 30, 24, 70)
  // Cilindro móvil
  ctx.fillStyle = '#e2e8f0'
  ctx.fillRect(pistonX + 4, pistonY - 20 + stroke, 16, 24)

  // Velocímetro / Dial de Utilidad Marginal U'(q)
  const dialX = w * 0.82
  const dialY = h * 0.55
  const dialR = 36

  // Carátula del dial
  ctx.beginPath()
  ctx.arc(dialX, dialY, dialR, Math.PI * 0.8, Math.PI * 2.2)
  ctx.fillStyle = '#0f172a'
  ctx.fill()
  ctx.strokeStyle = '#475569'
  ctx.lineWidth = 3
  ctx.stroke()

  // Zonas de color: Verde al centro (slope=0), Rojo si slope < 0
  ctx.lineWidth = 4
  // Positivo (pendiente > 0)
  ctx.strokeStyle = '#38bdf8'
  ctx.beginPath()
  ctx.arc(dialX, dialY, dialR - 6, Math.PI, Math.PI * 1.5)
  ctx.stroke()
  // Óptimo (slope = 0)
  ctx.strokeStyle = '#4ade80'
  ctx.beginPath()
  ctx.arc(dialX, dialY, dialR - 6, Math.PI * 1.45, Math.PI * 1.55)
  ctx.stroke()
  // Saturación / Negativo
  ctx.strokeStyle = '#f43f5e'
  ctx.beginPath()
  ctx.arc(dialX, dialY, dialR - 6, Math.PI * 1.5, Math.PI * 2)
  ctx.stroke()

  // Aguja del manómetro (inclinada según la pendiente slope = U'(q))
  // slope oscila entre +30 y -30 aprox.
  const angle = Math.PI * 1.5 + Math.max(-1, Math.min(1, -slope / 30)) * (Math.PI * 0.4)
  ctx.strokeStyle = isOptimal ? '#4ade80' : '#fbbf24'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(dialX, dialY)
  ctx.lineTo(dialX + Math.cos(angle) * (dialR - 8), dialY + Math.sin(angle) * (dialR - 8))
  ctx.stroke()

  ctx.fillStyle = '#94a3b8'
  ctx.font = 'bold 9px system-ui'
  ctx.fillText('Utilidad Marginal', dialX - 32, dialY + dialR + 14)
}

// =========================================================================
// ESCENA 3: Balanza Logística del Almacén (Ford W. Harris • EOQ)
// =========================================================================
function drawEoqBalanceScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  x: number,
  _fVal: number,
  _slope: number,
  isOptimal: boolean,
  _time: number
) {
  // Fondo de almacén industrial 1913
  ctx.fillStyle = '#0b0f19'
  ctx.fillRect(0, 0, w, h)

  // Vigas de acero en el techo
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(0, 30)
  ctx.lineTo(w, 30)
  for (let bx = 0; bx < w; bx += 40) {
    ctx.moveTo(bx, 0)
    ctx.lineTo(bx + 20, 30)
    ctx.lineTo(bx + 40, 0)
  }
  ctx.stroke()

  // Balanza Central
  const pivotX = w * 0.5
  const pivotY = h * 0.65
  const beamW = Math.min(220, w * 0.6)

  // Base triangular
  ctx.fillStyle = '#334155'
  ctx.beginPath()
  ctx.moveTo(pivotX, pivotY - 35)
  ctx.lineTo(pivotX - 25, pivotY + 20)
  ctx.lineTo(pivotX + 25, pivotY + 20)
  ctx.closePath()
  ctx.fill()

  // Cálculo de fuerzas opuestas en EOQ
  // Costo de Pedidos / Envíos = 32 / x
  // Costo de Almacenamiento = 2 * x
  const orderCost = 32 / Math.max(0.5, x)
  const holdingCost = 2 * x
  const diff = holdingCost - orderCost // Si > 0, pesa más la derecha

  // Ángulo de inclinación de la balanza (-0.2 a +0.2 rad)
  const tilt = Math.max(-0.25, Math.min(0.25, diff * 0.03))

  ctx.save()
  ctx.translate(pivotX, pivotY - 35)
  ctx.rotate(tilt)

  // Brazo de la balanza
  ctx.strokeStyle = isOptimal ? '#4ade80' : '#e2e8f0'
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.moveTo(-beamW / 2, 0)
  ctx.lineTo(beamW / 2, 0)
  ctx.stroke()

  // Platillo Izquierdo (Costo de Pedidos 32/x)
  const panLeftX = -beamW / 2
  ctx.strokeStyle = '#94a3b8'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(panLeftX, 0)
  ctx.lineTo(panLeftX - 15, 45)
  ctx.lineTo(panLeftX + 15, 45)
  ctx.closePath()
  ctx.stroke()
  // Barra/Carga de Pedidos
  const orderH = Math.min(40, orderCost * 2)
  ctx.fillStyle = '#38bdf8'
  ctx.fillRect(panLeftX - 12, 45 - orderH, 24, orderH)

  // Platillo Derecho (Costo de Almacenaje 2x)
  const panRightX = beamW / 2
  ctx.beginPath()
  ctx.moveTo(panRightX, 0)
  ctx.lineTo(panRightX - 15, 45)
  ctx.lineTo(panRightX + 15, 45)
  ctx.closePath()
  ctx.stroke()
  // Barra/Carga de Almacén
  const holdingH = Math.min(40, holdingCost * 2)
  ctx.fillStyle = '#f59e0b'
  ctx.fillRect(panRightX - 12, 45 - holdingH, 24, holdingH)

  ctx.restore()

  // Rótulos inferiores
  ctx.font = 'bold 10px system-ui'
  ctx.fillStyle = '#38bdf8'
  ctx.fillText(`Costo Pedidos: $${orderCost.toFixed(1)}k`, pivotX - beamW / 2 - 25, h * 0.92)

  ctx.fillStyle = '#f59e0b'
  ctx.fillText(`Costo Almacén: $${holdingCost.toFixed(1)}k`, pivotX + beamW / 2 - 50, h * 0.92)

  if (isOptimal) {
    ctx.fillStyle = '#4ade80'
    ctx.font = 'bold 12px system-ui'
    ctx.fillText('⚖️ ¡EQUILIBRIO PERFECTO EOQ!', pivotX - 85, h * 0.28)
  }
}

// =========================================================================
// ESCENA 4: Monitor FinTech del Siglo XXI (IA e Interés Continuo)
// =========================================================================
function drawFintechTerminalScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  fVal: number,
  slope: number,
  _isOptimal: boolean,
  time: number
) {
  // Fondo HUD cibernético
  ctx.fillStyle = '#030712'
  ctx.fillRect(0, 0, w, h)

  // Cuadrícula cyberpunk
  ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)'
  ctx.lineWidth = 1
  for (let gx = 0; gx < w; gx += 20) {
    ctx.beginPath()
    ctx.moveTo(gx, 0)
    ctx.lineTo(gx, h)
    ctx.stroke()
  }
  for (let gy = 0; gy < h; gy += 20) {
    ctx.beginPath()
    ctx.moveTo(0, gy)
    ctx.lineTo(w, gy)
    ctx.stroke()
  }

  // Gráfica de crecimiento exponencial estilizada en el HUD
  const marginL = 40
  const marginB = 35
  const chartW = w - 80
  const chartH = h - 70

  // Curva de capitalización continua
  ctx.strokeStyle = '#6366f1'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  for (let px = 0; px <= chartW; px += 4) {
    const normT = (px / chartW) * 4 // Dominio [0, 4]
    const normV = 10 * Math.exp(0.5 * normT) // V(t)
    const normY = (h - marginB) - (normV / 75) * chartH
    if (px === 0) ctx.moveTo(marginL + px, normY)
    else ctx.lineTo(marginL + px, normY)
  }
  ctx.stroke()

  // Posición actual en la curva
  const currPx = marginL + (t / 4) * chartW
  const currPy = (h - marginB) - (fVal / 75) * chartH

  // Vector Tangente de Velocidad Instantánea V'(t)
  const vecLen = Math.min(50, 15 + slope * 3)
  const vecAngle = Math.atan2(-slope * 1.5, 30) // En coordenadas canvas Y baja

  ctx.strokeStyle = '#10b981'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(currPx, currPy)
  const endX = currPx + Math.cos(vecAngle) * vecLen
  const endY = currPy + Math.sin(vecAngle) * vecLen
  ctx.lineTo(endX, endY)
  ctx.stroke()

  // Punta de flecha del vector tangente
  const arrowSize = 6
  ctx.fillStyle = '#10b981'
  ctx.beginPath()
  ctx.moveTo(endX, endY)
  ctx.lineTo(endX - arrowSize * Math.cos(vecAngle - 0.5), endY - arrowSize * Math.sin(vecAngle - 0.5))
  ctx.lineTo(endX - arrowSize * Math.cos(vecAngle + 0.5), endY - arrowSize * Math.sin(vecAngle + 0.5))
  ctx.closePath()
  ctx.fill()

  // Pulso en el punto actual
  ctx.fillStyle = '#38bdf8'
  ctx.beginPath()
  ctx.arc(currPx, currPy, 5 + Math.sin(time * 6) * 1.5, 0, Math.PI * 2)
  ctx.fill()

  // Panel HUD flotante
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
  ctx.fillRect(w - 180, 15, 165, 52)
  ctx.strokeStyle = '#38bdf8'
  ctx.lineWidth = 1
  ctx.strokeRect(w - 180, 15, 165, 52)

  ctx.fillStyle = '#94a3b8'
  ctx.font = '10px monospace'
  ctx.fillText(`t = ${t.toFixed(2)} años`, w - 172, 30)
  ctx.fillStyle = '#38bdf8'
  ctx.fillText(`V(t)  = $${fVal.toFixed(2)}M`, w - 172, 44)
  ctx.fillStyle = '#10b981'
  ctx.fillText(`V'(t) = $${slope.toFixed(2)}M/año`, w - 172, 58)
}

// =========================================================================
// Rótulo de Estado Superior
// =========================================================================
function drawSceneHeader(
  ctx: CanvasRenderingContext2D,
  w: number,
  problem: BusinessProblem,
  x: number,
  fVal: number,
  slope: number,
  isOptimal: boolean,
  _isUnlocked: boolean
) {
  // Badge semi-transparente arriba a la izquierda
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'
  ctx.fillRect(10, 10, Math.min(230, w - 20), 38)
  ctx.strokeStyle = isOptimal ? 'rgba(74, 222, 128, 0.4)' : 'rgba(51, 65, 85, 0.6)'
  ctx.lineWidth = 1
  ctx.strokeRect(10, 10, Math.min(230, w - 20), 38)

  ctx.font = 'bold 11px system-ui'
  ctx.fillStyle = isOptimal ? '#4ade80' : '#f1f5f9'
  ctx.fillText(`${problem.functionSymbol}(${x.toFixed(1)}) = ${fVal.toFixed(1)} ${problem.functionUnit}`, 18, 25)

  ctx.font = '10px system-ui'
  ctx.fillStyle = isOptimal ? '#fbbf24' : '#94a3b8'
  ctx.fillText(`Tasa f'(${problem.variableSymbol}) = ${slope.toFixed(2)} ${isOptimal ? '✨ ÓPTIMO' : ''}`, 18, 40)
}
