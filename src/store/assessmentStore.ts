import { create } from 'zustand';

interface AssessmentResult {
  skillCategory: string;
  score: number;
  maxScore: number;
  competencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface AssessmentState {
  currentQuestion: number;
  totalQuestions: number;
  answers: Record<number, string>;
  results: AssessmentResult[];
  isCompleted: boolean;
  skillGaps: string[];
  setCurrentQuestion: (question: number) => void;
  setAnswer: (questionId: number, answer: string) => void;
  setResults: (results: AssessmentResult[]) => void;
  setSkillGaps: (gaps: string[]) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set) => ({
  currentQuestion: 0,
  totalQuestions: 0,
  answers: {},
  results: [],
  isCompleted: false,
  skillGaps: [],
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setAnswer: (questionId, answer) => set((state) => ({
    answers: { ...state.answers, [questionId]: answer }
  })),
  setResults: (results) => set({ results }),
  setSkillGaps: (gaps) => set({ skillGaps: gaps }),
  completeAssessment: () => set({ isCompleted: true }),
  resetAssessment: () => set({ 
    currentQuestion: 0, 
    answers: {}, 
    results: [], 
    isCompleted: false,
    skillGaps: []
  }),
}));