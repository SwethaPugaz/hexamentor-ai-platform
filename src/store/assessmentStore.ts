import { create } from 'zustand';

interface AssessmentResult {
  skillCategory: string;
  score: number;
  maxScore: number;
  competencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface DetailedAssessmentResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  timeSpent: number;
  categoryScores: Array<{
    category: string;
    score: number;
    correct: number;
    total: number;
  }>;
  skillGaps: Array<{
    skill: string;
    score: number;
    needsImprovement: boolean;
    topics: string[];
  }>;
}

interface AssessmentState {
  currentQuestion: number;
  totalQuestions: number;
  answers: Record<number, string>;
  results: AssessmentResult[];
  detailedResults: DetailedAssessmentResult | null;
  isCompleted: boolean;
  skillGaps: string[];
  setCurrentQuestion: (question: number) => void;
  setAnswer: (questionId: number, answer: string) => void;
  setResults: (results: AssessmentResult[] | DetailedAssessmentResult) => void;
  setSkillGaps: (gaps: string[]) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  currentQuestion: 0,
  totalQuestions: 0,
  answers: {},
  results: [],
  detailedResults: null,
  isCompleted: false,
  skillGaps: [],
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer }
  })),
  setResults: (results) => {
    if (Array.isArray(results)) {
      set({ results });
    } else {
      set({ detailedResults: results });
    }
  },
  setSkillGaps: (gaps) => set({ skillGaps: gaps }),
  completeAssessment: () => set({ isCompleted: true }),
  resetAssessment: () => set({ 
    currentQuestion: 0, 
    answers: {}, 
    results: [], 
    detailedResults: null,
    isCompleted: false,
    skillGaps: []
  }),
}));