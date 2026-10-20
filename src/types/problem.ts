// Tipos de datos para los Problemas Empresariales de DerivLab
// Rigor académico: Problema I - IV, sensibilidad paramétrica y optimización

import type { ParametricCoefficients, ParametricMeta } from '../services/parametricEngine'

export type ProblemId = 'problema-1' | 'problema-2' | 'problema-3' | 'problema-4';

export type VariableSymbol = 'x' | 'q' | 't';

export interface AnalyticalStepOption {
  id: string;
  label: string;
  latex?: string;
  isCorrect: boolean;
  explanation: string;
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

export interface BusinessProblem {
  id: ProblemId;
  problemNumber: 1 | 2 | 3 | 4;
  romanNumeral: 'I' | 'II' | 'III' | 'IV';
  title: string;
  era: string;
  year: string;
  protagonist: string;
  story: string;
  economicConcept: string;
  difficulty: 'Nivel I' | 'Nivel II' | 'Nivel III' | 'Nivel IV';
  
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
  
  // Pasos pedagógicos del Candado Analítico
  candadoSteps: AnalyticalLockSteps;
}

export interface ProblemProgress {
  problemId: ProblemId;
  isCompleted: boolean;
  unlockedAt?: number;
  bestAccuracy?: number;
}
