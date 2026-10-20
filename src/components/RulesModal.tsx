import React from 'react'
import { X, BookOpen, ShieldCheck } from 'lucide-react'
import { LatexRenderer } from './LatexRenderer'

interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const rules = [
    {
      title: '1. Regla de la Constante (Costos Fijos Autónomos)',
      latex: '\\frac{d}{dx}[c] = 0',
      description: 'Los costos fijos de planta o licencias no varían con la escala de producción; su tasa marginal de cambio es nula.',
      example: '\\frac{d}{dq}[-27] = 0'
    },
    {
      title: '2. Regla de la Potencia (Polinomios de Grado n)',
      latex: '\\frac{d}{dx}[a x^n] = a \\cdot n x^{n-1}',
      description: 'El exponente se multiplica por el coeficiente principal y se reduce el grado polinómico en una unidad.',
      example: '\\frac{d}{dx}[-2x^2] = -2 \\cdot 2x^1 = -4x'
    },
    {
      title: '3. Regla de la Suma y Diferencia',
      latex: '\\frac{d}{dx}[u(x) \\pm v(x)] = u\'(x) \\pm v\'(x)',
      description: 'La tasa marginal del ingreso o utilidad agregada equivale a la suma algebraica de las derivadas de cada término.',
      example: '\\frac{d}{dx}[-2x^2 + 24x] = -4x + 24'
    },
    {
      title: '4. Regla del Exponente Negativo (Modelo EOQ de Harris)',
      latex: '\\frac{d}{dx}[a x^{-1}] = -a x^{-2} = -\\frac{a}{x^2}',
      description: 'El costo de reposición por lote fraccionario b/x se expresa analíticamente como b·x⁻¹ para derivar sin ambigüedad.',
      example: '\\frac{d}{dx}\\left[\\frac{32}{x}\\right] = \\frac{d}{dx}[32x^{-1}] = -\\frac{32}{x^2}'
    },
    {
      title: '5. Regla del Cociente',
      latex: '\\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u\'v - uv\'}{v^2}',
      description: 'Fundamental para el análisis de costos medios unitarios y razones marginales de rentabilidad.',
      example: 'c\'(q) = \\frac{C\'(q)q - C(q)}{q^2}'
    },
    {
      title: '6. Regla de la Cadena Exponencial (Capitalización Continua)',
      latex: '\\frac{d}{dt}\\left[a e^{bt}\\right] = a \\cdot b e^{bt}',
      description: 'Aplica a modelos en base trascendente e. La derivada de eᵘ es la función exponencial multiplicada por la derivada del exponente u\'.',
      example: '\\frac{d}{dt}[10 e^{0.5t}] = 10 \\cdot 0.5 e^{0.5t} = 5 e^{0.5t}'
    },
    {
      title: '7. Criterio de la Segunda Derivada (Concavidad Estricta)',
      latex: "f''(x^*) < 0 \\implies \\text{Máximo Local} \\quad | \\quad f''(x^*) > 0 \\implies \\text{Mínimo Local}",
      description: 'Determina si el punto estacionario f\'(x*) = 0 corresponde a una cúspide de utilidad o a un valle de costos.',
      example: "U''(5) = -6 < 0 \\; (\\text{Máximo de Utilidad}) \\quad | \\quad C''(4) = 1 > 0 \\; (\\text{Mínimo de Costo})"
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs font-sans">
      <div 
        className="w-full max-w-2xl max-h-[90vh] bg-white border border-[#d4d4d0] shadow-lg flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rules-modal-title"
      >
        {/* Cabecera */}
        <div className="px-5 py-3.5 border-b border-[#e5e5e0] flex items-center justify-between bg-[#faf9f6]">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-4 h-4 text-stone-700" />
            <div>
              <h2 id="rules-modal-title" className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-900">
                Compendio de Reglas de Diferenciación Empresarial
              </h2>
              <span className="text-[10px] font-mono text-stone-500">
                Currículo Preuniversitario de 5.º y 6.º de Secundaria
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-[#ebe9e1] transition-colors cursor-pointer"
            aria-label="Cerrar compendio"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nota Curricular */}
        <div className="mx-5 mt-4 p-3 bg-[#f7f6f2] border border-[#e5e5e0] flex items-start gap-2.5 text-xs text-stone-700">
          <ShieldCheck className="w-4 h-4 text-stone-800 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Restricción Curricular:</strong> Quedan excluidas funciones trigonométricas y logarítmicas para concentrar el análisis en elasticidades polinómicas, modelos racionales EOQ y capitalización continua exponencial.
          </p>
        </div>

        {/* Lista de Reglas */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {rules.map((rule, idx) => (
            <div 
              key={idx}
              className="p-3 bg-white border border-[#e5e5e0] space-y-2"
            >
              <span className="text-xs font-bold text-stone-900 block font-mono">
                {rule.title}
              </span>
              
              <div className="py-2 px-3 bg-[#f7f6f2] border border-[#e5e5e0] text-center text-stone-900 overflow-x-auto text-sm">
                <LatexRenderer latex={rule.latex} displayMode={true} />
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">
                {rule.description}
              </p>

              <div className="text-[11px] text-stone-600 bg-white p-2 border border-[#f0f0eb] flex flex-wrap items-center gap-1.5 font-mono">
                <span className="font-semibold text-stone-500 uppercase">Ejemplo:</span>
                <LatexRenderer latex={rule.example} />
              </div>
            </div>
          ))}
        </div>

        {/* Pie */}
        <div className="p-3 bg-[#faf9f6] border-t border-[#e5e5e0] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs tracking-wide uppercase transition-colors cursor-pointer"
          >
            Cerrar Compendio
          </button>
        </div>
      </div>
    </div>
  )
}
