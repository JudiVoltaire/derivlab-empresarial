import React from 'react'
import { X, BookOpen, Compass } from 'lucide-react'

interface TutorialRouteModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectRoute: (route: 'A' | 'B') => void
}

export const TutorialRouteModal: React.FC<TutorialRouteModalProps> = ({
  isOpen,
  onClose,
  onSelectRoute
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-xs font-sans">
      <div 
        className="w-full max-w-lg bg-white border border-[#d4d4d0] shadow-xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-[#e5e5e0] pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-700 inline-block"></span>
            <h2 className="text-sm font-bold tracking-tight text-stone-900 uppercase font-mono">
              Selecciona tu Ruta de Aprendizaje
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          DerivLab Empresarial ofrece dos recorridos didácticos adaptados a tu nivel y objetivo de estudio universitario:
        </p>

        <div className="grid grid-cols-1 gap-3">
          {/* Ruta A */}
          <button
            onClick={() => {
              onSelectRoute('A')
              onClose()
            }}
            className="w-full p-3.5 bg-[#faf9f6] hover:bg-[#f7f6f2] border border-[#d4d4d0] hover:border-blue-700 transition-colors cursor-pointer text-left space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-800 uppercase tracking-wide flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-700" />
                Ruta A: Aprender desde Cero
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#d4d4d0] text-stone-600 group-hover:text-blue-800">
                4 Etapas Didácticas
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Recorrido conceptual completo: sensibilidad paramétrica, conversión semiótica entre la Función Total y Marginal, paso al límite animado (Δx → 0) y Candado Analítico.
            </p>
          </button>

          {/* Ruta B */}
          <button
            onClick={() => {
              onSelectRoute('B')
              onClose()
            }}
            className="w-full p-3.5 bg-[#faf9f6] hover:bg-[#f7f6f2] border border-[#d4d4d0] hover:border-emerald-700 transition-colors cursor-pointer text-left space-y-1.5 group"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-emerald-700" />
                Ruta B: Tour Rápido Modo Libre
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-[#d4d4d0] text-stone-600 group-hover:text-emerald-800">
                30 Segundos
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explora la Pizarra Universitaria Híbrida (tinta digital + KaTeX), transfiere hipótesis a la Graficadora Científica y verifica la Doble Prueba Geométrica.
            </p>
          </button>
        </div>

        <div className="pt-2 border-t border-[#e5e5e0] flex items-center justify-between text-[11px] font-mono text-stone-500">
          <span>Estándar Editorial Suizo · Desmos Studio / Linear Spec</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-white cursor-pointer font-semibold text-xs"
          >
            Explorar sin Tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
