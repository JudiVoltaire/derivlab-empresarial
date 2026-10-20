import React from 'react'
import { Delete, Eraser } from 'lucide-react'

interface MathKeypadProps {
  variableSymbol: string
  problemNumber: number
  onInsert: (token: string) => void
  onBackspace: () => void
  onClear: () => void
}

export const MathKeypad: React.FC<MathKeypadProps> = ({
  variableSymbol,
  problemNumber,
  onInsert,
  onBackspace,
  onClear
}) => {
  const v = variableSymbol

  // Teclas dinámicas según el problema activo
  const mathKeys = [
    { label: v, insert: v, primary: true },
    { label: `${v}²`, insert: `${v}^2` },
    problemNumber === 3
      ? { label: `${v}⁻²`, insert: `${v}^-2` }
      : { label: `${v}³`, insert: `${v}^3` },
    problemNumber === 4
      ? { label: 'e^(kt)', insert: 'e^(0.5t)' }
      : { label: '·', insert: '*' },
    { label: '+', insert: ' + ' },
    { label: '−', insert: ' - ' },
    { label: '/', insert: '/' },
    { label: '^', insert: '^' },
    { label: '(', insert: '(' },
    { label: ')', insert: ')' }
  ]

  const numKeys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.']

  return (
    <div className="p-3 bg-[#f7f6f2] border border-[#d4d4d0] select-none space-y-2">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600">
          Entrada Rápida de Notación
        </span>
        <button
          type="button"
          onClick={onClear}
          className="text-[11px] font-mono px-2 py-0.5 bg-white hover:bg-[#ebe9e1] text-stone-600 border border-[#d4d4d0] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Eraser className="w-3 h-3" /> Limpiar
        </button>
      </div>

      {/* Fila 1: Variables y Operadores */}
      <div className="grid grid-cols-5 gap-1.5">
        {mathKeys.slice(0, 5).map((k, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onInsert(k.insert)}
            className={`h-9 font-mono font-semibold text-xs transition-colors flex items-center justify-center cursor-pointer border ${
              k.primary
                ? 'bg-blue-700 hover:bg-blue-800 text-white border-blue-700'
                : 'bg-white hover:bg-[#ebe9e1] text-stone-900 border-[#d4d4d0]'
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* Fila 2: Exponentes y Paréntesis */}
      <div className="grid grid-cols-5 gap-1.5">
        {mathKeys.slice(5).map((k, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onInsert(k.insert)}
            className="h-9 bg-white hover:bg-[#ebe9e1] text-stone-800 border border-[#d4d4d0] font-mono text-xs transition-colors flex items-center justify-center cursor-pointer"
          >
            {k.label}
          </button>
        ))}
      </div>

      {/* Fila 3: Numérico y Borrar */}
      <div className="grid grid-cols-4 gap-1.5">
        {numKeys.map((num, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onInsert(num)}
            className="h-9 bg-white hover:bg-[#ebe9e1] text-stone-900 border border-[#d4d4d0] font-mono text-xs tabular-nums transition-colors flex items-center justify-center cursor-pointer"
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={onBackspace}
          className="h-9 bg-[#fbf5f2] hover:bg-[#f6eae4] text-rose-800 border border-rose-200 font-mono text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          aria-label="Borrar último caracter"
        >
          <Delete className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
