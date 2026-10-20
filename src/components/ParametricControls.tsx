import React from 'react'
import { RotateCcw, Sliders, Info } from 'lucide-react'
import type { BusinessProblem } from '../types/problem'
import type { ParametricCoefficients, DynamicAnalysis } from '../services/parametricEngine'
import { LatexRenderer } from './LatexRenderer'

interface ParametricControlsProps {
  problem: BusinessProblem
  coefficients: ParametricCoefficients
  onChangeCoefficients: (newCoeffs: ParametricCoefficients) => void
  onResetCoefficients: () => void
  analysis: DynamicAnalysis
}

export const ParametricControls: React.FC<ParametricControlsProps> = ({
  problem,
  coefficients,
  onChangeCoefficients,
  onResetCoefficients,
  analysis
}) => {
  const meta = problem.parametricMeta

  const handleUpdate = (key: keyof ParametricCoefficients, val: number) => {
    onChangeCoefficients({
      ...coefficients,
      [key]: val
    })
  }

  return (
    <div className="w-full bg-white border border-[#d4d4d0] p-4 sm:p-5 shadow-xs space-y-4 font-sans text-stone-900">
      
      {/* Cabecera Técnica */}
      <div className="flex items-center justify-between border-b border-[#e5e5e0] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-700" />
          <h2 className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-stone-900">
            Sensibilidad Paramétrica (a, b, c)
          </h2>
        </div>
        <button
          onClick={onResetCoefficients}
          className="text-[11px] font-medium text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-2.5 py-1 bg-[#f7f6f2] hover:bg-[#ebe9e1] border border-[#d4d4d0] cursor-pointer transition-colors"
          title="Restablecer a los parámetros canónicos originales"
        >
          <RotateCcw className="w-3 h-3 text-stone-500" />
          <span>Restablecer Parámetros Base</span>
        </button>
      </div>

      {/* Grid de Controles Paramétricos Numéricos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Parámetro A */}
        <div className="p-3 bg-[#f7f6f2] border border-[#e5e5e0] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-800">{meta.aLabel.split('(')[0]}</span>
            <span className="font-mono text-xs font-bold text-blue-700 tabular-nums">
              a = {coefficients.a}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={meta.aMin}
              max={meta.aMax}
              step={meta.aStep}
              value={coefficients.a}
              onChange={(e) => handleUpdate('a', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#d4d4d0] rounded-none appearance-none cursor-pointer accent-blue-700"
            />
            <input
              type="number"
              step={meta.aStep}
              value={coefficients.a}
              onChange={(e) => handleUpdate('a', parseFloat(e.target.value) || 0)}
              className="w-16 h-7 px-1.5 bg-white border border-[#d4d4d0] text-right font-mono text-xs tabular-nums text-stone-900 focus:border-blue-700 outline-none"
            />
          </div>
          <span className="text-[10px] text-stone-500 block">{meta.aUnit}</span>
        </div>

        {/* Parámetro B */}
        <div className="p-3 bg-[#f7f6f2] border border-[#e5e5e0] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-800">{meta.bLabel.split('(')[0]}</span>
            <span className="font-mono text-xs font-bold text-emerald-700 tabular-nums">
              b = {coefficients.b}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={meta.bMin}
              max={meta.bMax}
              step={meta.bStep}
              value={coefficients.b}
              onChange={(e) => handleUpdate('b', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#d4d4d0] rounded-none appearance-none cursor-pointer accent-emerald-700"
            />
            <input
              type="number"
              step={meta.bStep}
              value={coefficients.b}
              onChange={(e) => handleUpdate('b', parseFloat(e.target.value) || 0)}
              className="w-16 h-7 px-1.5 bg-white border border-[#d4d4d0] text-right font-mono text-xs tabular-nums text-stone-900 focus:border-blue-700 outline-none"
            />
          </div>
          <span className="text-[10px] text-stone-500 block">{meta.bUnit}</span>
        </div>

        {/* Parámetro C (Costo o Ingreso Fijo) */}
        <div className="p-3 bg-[#f7f6f2] border border-[#e5e5e0] space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-800">{meta.cLabel.split('(')[0]}</span>
            <span className="font-mono text-xs font-bold text-stone-800 tabular-nums">
              c = {coefficients.c}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={meta.cMin}
              max={meta.cMax}
              step={meta.cStep}
              value={coefficients.c}
              onChange={(e) => handleUpdate('c', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#d4d4d0] rounded-none appearance-none cursor-pointer accent-stone-700"
            />
            <input
              type="number"
              step={meta.cStep}
              value={coefficients.c}
              onChange={(e) => handleUpdate('c', parseFloat(e.target.value) || 0)}
              className="w-16 h-7 px-1.5 bg-white border border-[#d4d4d0] text-right font-mono text-xs tabular-nums text-stone-900 focus:border-blue-700 outline-none"
            />
          </div>
          <span className="text-[10px] text-stone-500 block">{meta.cUnit}</span>
        </div>
      </div>

      {/* Desglose Analítico en Vivo con KaTeX */}
      <div className="border border-[#e5e5e0] p-4 bg-[#faf9f6] space-y-3">
        <div className="flex items-center justify-between border-b border-[#e5e5e0] pb-2">
          <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wide">
            Ecuación Primaria y Tasa Marginal Diferenciada
          </span>
          <span className="text-[10px] font-mono text-stone-500">Recálculo continuo 60 FPS</span>
        </div>

        {/* Ecuaciones Vivas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
          <div className="p-3 bg-white border border-[#d4d4d0]">
            <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">
              Función Viva f({problem.variableSymbol}; a,b,c)
            </span>
            <div className="text-base text-blue-900 overflow-x-auto">
              <LatexRenderer latex={analysis.functionLatex} displayMode={true} />
            </div>
          </div>

          <div className="p-3 bg-white border border-[#d4d4d0]">
            <span className="text-[10px] font-mono uppercase text-stone-500 block mb-1">
              Derivada Marginal f'({problem.variableSymbol}; a,b)
            </span>
            <div className="text-base text-emerald-900 overflow-x-auto">
              <LatexRenderer latex={analysis.derivativeLatex} displayMode={true} />
            </div>
          </div>
        </div>

        {/* Desglose Término a Término */}
        <div className="text-xs space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-stone-800 block">
            Diferenciación Operativa por Sumandos:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {analysis.termsBreakdown.map((item, idx) => (
              <div key={idx} className="p-2 bg-white border border-[#e5e5e0] text-[11px]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-stone-500">Término {idx + 1}:</span>
                  <LatexRenderer latex={item.term} className="font-semibold text-stone-900" />
                </div>
                <div className="flex items-center justify-between border-t border-[#f0f0eb] pt-1">
                  <span className="font-mono text-stone-500">d/d{problem.variableSymbol}:</span>
                  <LatexRenderer latex={item.derivative} className="font-semibold text-emerald-800" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolución de la Condición de Primer Orden */}
        <div className="p-3 bg-white border border-[#d4d4d0] space-y-1 text-xs">
          <span className="text-[10px] font-mono font-bold uppercase text-stone-600 block">
            Condición de Primer Orden: f'({problem.variableSymbol}*) = 0
          </span>
          <div className="text-sm text-stone-900 py-1 overflow-x-auto">
            <LatexRenderer latex={analysis.equationSolvingLatex} displayMode={true} />
          </div>
          <div className="flex items-start gap-1.5 text-[11px] text-stone-600 pt-1 border-t border-[#f0f0eb]">
            <Info className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
            <span>
              <strong>Observación de Invarianza:</strong> Al variar el término constante <code>c = {coefficients.c}</code>, la curva se traslada verticalmente en el plano cartesiano; no obstante, su derivada instantánea y el valor de <code>{problem.variableSymbol}* = {analysis.criticalPoint}</code> permanecen algebraicamente intactos.
            </span>
          </div>
        </div>
      </div>

    </div>
  )
}
