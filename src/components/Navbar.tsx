import React, { useState } from 'react'
import { 
  Volume2, 
  VolumeX, 
  BookOpen, 
  ChevronDown, 
  Check 
} from 'lucide-react'
import type { ProblemId } from '../types/problem'
import { BUSINESS_PROBLEMS } from '../data/problems'
import { RulesModal } from './RulesModal'

interface NavbarProps {
  currentProblemId: ProblemId
  onSelectProblem: (id: ProblemId) => void
  completedProblemIds: ProblemId[]
  isSoundEnabled: boolean
  onToggleSound: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProblemId,
  onSelectProblem,
  completedProblemIds,
  isSoundEnabled,
  onToggleSound
}) => {
  const [isRulesOpen, setIsRulesOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const currentProblem = BUSINESS_PROBLEMS.find(p => p.id === currentProblemId) || BUSINESS_PROBLEMS[0]
  const solvedCount = completedProblemIds.length

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#d4d4d0] font-sans text-stone-900 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          
          {/* Logotipo Editorial Suizo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 bg-stone-900 text-white font-mono font-bold text-xs flex items-center justify-center">
              DL
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-sm tracking-tight text-stone-900 block leading-none">
                DERIVLAB
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 block mt-0.5">
                Cálculo Diferencial Empresarial
              </span>
            </div>
          </div>

          {/* Selector Central de Problemas I - IV */}
          <div className="relative flex-1 max-w-sm mx-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-9 px-3 bg-[#f7f6f2] hover:bg-[#ebe9e1] border border-[#d4d4d0] flex items-center justify-between gap-2 cursor-pointer transition-colors text-xs font-semibold"
              aria-expanded={isDropdownOpen}
              aria-label="Seleccionar Problema de Estudio"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="font-mono text-blue-700 font-bold shrink-0">
                  {currentProblem.title.split(':')[0]}
                </span>
                <span className="text-stone-800 truncate">
                  {currentProblem.title.split(':')[1]?.trim() || currentProblem.title}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-600 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menú Desplegable Técnico */}
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-[#d4d4d0] shadow-md divide-y divide-[#e5e5e0]">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-stone-500 bg-[#faf9f6]">
                    Catálogo de Modelos Paramétricos
                  </div>
                  {BUSINESS_PROBLEMS.map((problem) => {
                    const isSelected = problem.id === currentProblemId
                    const isSolved = completedProblemIds.includes(problem.id)
                    return (
                      <button
                        key={problem.id}
                        onClick={() => {
                          onSelectProblem(problem.id)
                          setIsDropdownOpen(false)
                        }}
                        className={`w-full p-2.5 text-left flex items-center justify-between gap-2.5 transition-colors cursor-pointer text-xs ${
                          isSelected 
                            ? 'bg-[#f7f6f2] font-semibold text-blue-800' 
                            : 'hover:bg-[#faf9f6] text-stone-700'
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span className="font-bold text-stone-900">{problem.title.split(':')[0]}</span>
                            <span className="text-stone-400">· {problem.era}</span>
                          </div>
                          <p className="text-xs text-stone-800 truncate mt-0.5">
                            {problem.title.split(':')[1]?.trim() || problem.title}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {isSolved ? (
                            <Check className="w-3.5 h-3.5 text-emerald-700" />
                          ) : (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#f7f6f2] border border-[#d4d4d0] text-stone-600">
                              {problem.difficulty}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Acciones del Extremo Derecho */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Indicador Numérico Tabular */}
            <div 
              className="px-2.5 h-8 bg-[#f7f6f2] border border-[#d4d4d0] flex items-center gap-1.5 text-xs font-mono tabular-nums text-stone-700"
              title={`${solvedCount} de 4 Problemas Analíticamente Validados`}
            >
              <span className="text-stone-500 hidden sm:inline">PROGRESO:</span>
              <span className="font-bold text-stone-900">{solvedCount}/4</span>
            </div>

            {/* Toggle de Sonificación */}
            <button
              onClick={onToggleSound}
              className={`w-8 h-8 flex items-center justify-center border cursor-pointer transition-colors ${
                isSoundEnabled
                  ? 'bg-white border-[#d4d4d0] text-emerald-700 hover:bg-[#f7f6f2]'
                  : 'bg-[#f7f6f2] border-[#d4d4d0] text-stone-400 hover:text-stone-600'
              }`}
              title={isSoundEnabled ? 'Sonificación activa (silenciar)' : 'Sonificación silenciada (activar)'}
              aria-label={isSoundEnabled ? 'Silenciar audio' : 'Activar audio'}
            >
              {isSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Botón Formulario de Reglas */}
            <button
              onClick={() => setIsRulesOpen(true)}
              className="h-8 px-2.5 bg-white hover:bg-[#f7f6f2] border border-[#d4d4d0] text-stone-800 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Consultar Compendio de Reglas de Derivación"
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden md:inline">Reglas</span>
            </button>
          </div>

        </div>
      </header>

      {/* Modal con las Reglas */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />
    </>
  )
}
