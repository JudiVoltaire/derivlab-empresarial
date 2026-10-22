import React, { useState } from 'react'
import { WhiteboardCanvas } from './WhiteboardCanvas'
import { GraphingCalculator } from './GraphingCalculator'
import type { BusinessProblem } from '../types/problem'

interface FreeModeProps {
  currentProblem?: BusinessProblem
}

export const FreeMode: React.FC<FreeModeProps> = ({ currentProblem }) => {
  // Estado compartido entre la pizarra y la calculadora
  const [calculatorInputs, setCalculatorInputs] = useState<{
    y1?: string
    y2?: string
    y3?: string
    xStar?: number
  }>({
    y1: currentProblem?.functionLatex ? currentProblem.functionLatex.split('=')[1]?.trim() : '-2*x^2 + 24*x',
    y2: currentProblem?.derivativeLatex ? currentProblem.derivativeLatex.split('=')[1]?.trim() : '-4*x + 24',
    y3: '12*x - 36',
    xStar: currentProblem?.criticalPoint ?? 6
  })

  const handleReceiveFromWhiteboard = (data: {
    y1?: string
    y2?: string
    y3?: string
    xStar?: number
  }) => {
    setCalculatorInputs(prev => ({
      ...prev,
      ...data
    }))
  }

  return (
    <div id="step-free-mode" className="w-full space-y-4">
      {/* Banner de Contexto de Modo Libre Universitario */}
      <div className="bg-white border border-[#d4d4d0] p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-stone-900 text-white font-bold uppercase text-[10px] tracking-wider">
            MODO LIBRE
          </span>
          <span className="text-stone-700 font-semibold">
            Pizarra Universitaria Híbrida + Graficadora de Doble Prueba
          </span>
        </div>
        <div className="text-[11px] text-stone-500">
          Formula hipótesis simbólicas a mano o en KaTeX y valida la tangencia instantánea a 60 FPS
        </div>
      </div>

      {/* Grid de Dos Columnas: Pizarra a la izquierda (7 cols) y Graficadora a la derecha (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Columna Izquierda: Pizarra con Tinta Digital y Líneas Simbólicas */}
        <div className="lg:col-span-6 space-y-4">
          <WhiteboardCanvas
            onSendToCalculator={handleReceiveFromWhiteboard}
            initialExpressions={{
              y1: calculatorInputs.y1,
              y2: calculatorInputs.y2,
              xStar: calculatorInputs.xStar
            }}
          />
        </div>

        {/* Columna Derecha: Calculadora Gráfica con Doble Prueba Geométrica */}
        <div className="lg:col-span-6 space-y-4">
          <GraphingCalculator
            initialY1={calculatorInputs.y1}
            initialY2={calculatorInputs.y2}
            initialY3={calculatorInputs.y3}
            initialXStar={calculatorInputs.xStar}
            domainX={currentProblem?.domain || [0, 12]}
          />
        </div>
      </div>
    </div>
  )
}
