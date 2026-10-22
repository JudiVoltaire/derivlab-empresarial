// Tipos de datos para los Problemas Empresariales de DerivLab
// Rigor académico: Problemas 1–20, sensibilidad paramétrica y optimización

import type { ParametricCoefficients, ParametricMeta } from '../services/parametricEngine'

export type ProblemId = string;

export type VariableSymbol = 'x' | 'q' | 't' | 'p';

export type AppMode = 'docente' | 'estudiante' | 'libre';

export type ProblemLevel = 'I' | 'II' | 'III' | 'IV';

export interface AnalyticalStepOption {
  id: string;
  label: string;
  latex?: string;
  isCorrect: boolean;
  explanation: string;
}

export interface PoeOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface PoeQuestion {
  id: string;
  question: string;
  context: string;
  targetParameter: 'a' | 'b' | 'c' | 'vertex';
  options: PoeOption[];
  observePrompt: string;
  scientificExplanation: string;
}

export interface AnalyticalLockSteps {
  step1: {
    question: string;
    options: AnalyticalStepOption[];
    hint: string;
  };
  step2: {
    prompt: string;
    terms: {
      original: string;
      derivative: string;
      ruleUsed: string;
    }[];
    expectedDerivativeLatex: string;
    hint: string;
  };
  step3: {
    equationLatex: string;
    criticalPoint: number;
    explanation: string;
    economicResult: string;
  };
}

// Curva dual para problemas de equilibrio (Ingreso Marginal = Costo Marginal)
export interface DualCurve {
  label: string;
  functionLatex: string;
  derivativeLatex: string;
  evaluate: (val: number) => number;
  evaluateDerivative: (val: number) => number;
  color: 'emerald' | 'amber' | 'red';
}

export interface BusinessProblem {
  id: ProblemId;
  problemNumber: number;
  romanNumeral: string;
  title: string;
  era: string;
  year: string;
  protagonist: string;
  story: string;
  economicConcept: string;
  difficulty: string;
  level: ProblemLevel;

  // Variables y funciones
  variableSymbol: VariableSymbol;
  variableLabel: string;
  variableUnit: string;
  functionSymbol: string;
  functionName: string;
  functionUnit: string;

  // Parámetros vivos y metadatos
  baseCoefficients: ParametricCoefficients;
  parametricMeta: ParametricMeta;

  // Expresiones matemáticas base
  functionLatex: string;
  derivativeLatex: string;
  secondDerivativeLatex?: string;
  concavityAnalysis?: {
    value: number;
    isConcaveDown: boolean;
    meaning: string;
  };

  // Valores óptimos base
  criticalPoint: number;
  optimalValue: number;
  optimalInterpretation: string;

  // Dominio para visualización
  domain: [number, number];

  // Evaluaciones numéricas
  evaluate: (val: number) => number;
  evaluateDerivative: (val: number) => number;
  evaluateSecondDerivative?: (val: number) => number;

  // Curva dual para problemas de equilibrio (P12, P13)
  equilibriumMode?: boolean;
  costCurve?: DualCurve;

  // Pasos pedagógicos del Candado Analítico
  candadoSteps: AnalyticalLockSteps;

  // Micro-predicción socrática (Ciclo POE: Predecir - Observar - Explicar)
  poeHypothesis: PoeQuestion;
}

export interface ProblemProgress {
  problemId: ProblemId;
  isCompleted: boolean;
  unlockedAt?: number;
  bestAccuracy?: number;
}

// Tipo para líneas algebraicas en la Pizarra Libre
export interface AlgebraicLine {
  id: string;
  expression: string;
  latex: string;
  color: 'blue' | 'red' | 'green' | 'orange' | 'purple';
  visible: boolean;
}
