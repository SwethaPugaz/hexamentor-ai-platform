import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { IQuestion } from '../models/Assessment';

interface AIQuestionParams {
  prompt: string;
  skills: string[];
  jobRoles: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  questionCount: number;
  userHistory?: object[];
}

interface QuestionData {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category?: string;
  concept?: string;
  tags?: string[];
  timeLimit?: number;
  points?: number;
}

// Initialize AI clients only when needed
let openai: OpenAI | null = null;
let gemini: GoogleGenerativeAI | null = null;

const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-testing') {
      throw new Error('OpenAI API key is not configured.');
    }
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

const getGeminiClient = (): GoogleGenerativeAI => {
  if (!gemini) {
    if (!process.env.GOOGLE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY === 'dummy-key-for-testing') {
      throw new Error('Google Gemini API key is not configured.');
    }
    gemini = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }
  return gemini;
};

export const generateAIQuestions = async (params: AIQuestionParams): Promise<IQuestion[]> => {
  try {
    // Try Google Gemini first if available
    if (process.env.GOOGLE_AI_API_KEY && process.env.GOOGLE_AI_API_KEY !== 'dummy-key-for-testing') {
      console.log('🚀 Using Google Gemini for question generation');
      return await generateGeminiQuestions(params);
    }
    
    // Fallback to OpenAI if available
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'dummy-key-for-testing') {
      console.log('🚀 Using OpenAI for question generation');
      return await generateOpenAIQuestions(params);
    }

    // Use fallback if no API keys available
    console.log('⚠️ No AI API keys found, using fallback questions');
    return generateFallbackQuestions(params);
  } catch (error) {
    console.error('❌ AI question generation failed:', error);
    return generateFallbackQuestions(params);
  }
};

const generateGeminiQuestions = async (params: AIQuestionParams): Promise<IQuestion[]> => {
  const geminiClient = getGeminiClient();
  const model = geminiClient.getGenerativeModel({ model: "gemini-pro" });

  const { prompt, skills, jobRoles, difficulty, questionCount } = params;

  const systemPrompt = `Generate ${questionCount} high-quality multiple-choice questions for a learning assessment.

Skills to assess: ${skills.join(', ')}
Job roles: ${jobRoles.join(', ')}
Difficulty: ${difficulty}
Context: ${prompt}

Requirements:
1. Each question should test knowledge of the specified skills
2. Questions should be ${difficulty} difficulty level
3. Each question must have exactly 4 options
4. Only one option should be correct
5. Include a clear explanation for the correct answer

Return ONLY a valid JSON array with this structure:
[
  {
    "question": "What is the main purpose of React hooks?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "Detailed explanation of why this is correct",
    "category": "React",
    "concept": "hooks",
    "timeLimit": 60,
    "points": 2
  }
]`;

  const result = await model.generateContent(systemPrompt);
  const response = await result.response;
  const text = response.text();

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array found in response');
    }

    const questionsData = JSON.parse(jsonMatch[0]) as QuestionData[];
    
    const questions: IQuestion[] = questionsData.map((q: QuestionData, index: number) => ({
      id: index + 1,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || 'Explanation not provided',
      category: q.category || skills[0] || 'General',
      concept: q.concept || skills[0] || 'general',
      tags: Array.isArray(q.tags) ? q.tags : [skills[0] || 'general'],
      timeLimit: q.timeLimit || 60,
      points: q.points || 1,
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    }));

    return questions;
  } catch (parseError) {
    console.error('Failed to parse Gemini response:', parseError);
    return generateFallbackQuestions(params);
  }
};

const generateOpenAIQuestions = async (params: AIQuestionParams): Promise<IQuestion[]> => {
  // OpenAI implementation placeholder
  console.log('OpenAI integration placeholder - using fallback');
  return generateFallbackQuestions(params);
};

// Fallback questions when AI is not available
const generateFallbackQuestions = (params: AIQuestionParams): IQuestion[] => {
  const { skills, difficulty, questionCount } = params;
  
  const fallbackQuestions: IQuestion[] = [
    {
      id: 1,
      question: "What is the primary purpose of version control systems like Git?",
      options: [
        "To compile code faster",
        "To track changes and collaborate on code",
        "To run automated tests",
        "To deploy applications"
      ],
      correctAnswer: 1,
      explanation: "Version control systems track changes in code over time and facilitate collaboration among developers.",
      category: skills[0] || "Programming",
      concept: "version-control",
      tags: ["git", "collaboration"],
      timeLimit: 60,
      points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    },
    {
      id: 2,
      question: "Which of the following is NOT a JavaScript data type?",
      options: [
        "string",
        "boolean", 
        "float",
        "undefined"
      ],
      correctAnswer: 2,
      explanation: "JavaScript has number (not specifically float), string, boolean, undefined, null, object, and symbol as primitive data types.",
      category: "JavaScript",
      concept: "data-types",
      tags: ["primitives"],
      timeLimit: 45,
      points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    },
    {
      id: 3,
      question: "In React, what is the purpose of the useState hook?",
      options: [
        "To handle side effects",
        "To manage component state",
        "To optimize performance",
        "To handle routing"
      ],
      correctAnswer: 1,
      explanation: "useState is a React hook that allows functional components to have local state.",
      category: "React",
      concept: "hooks",
      tags: ["state", "functional-components"],
      timeLimit: 50,
      points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    },
    {
      id: 4,
      question: "What does REST stand for in web development?",
      options: [
        "Rapid Enterprise Software Testing",
        "Representational State Transfer",
        "Remote Entity State Tracking",
        "Real-time Event Stream Technology"
      ],
      correctAnswer: 1,
      explanation: "REST stands for Representational State Transfer, an architectural style for designing networked applications.",
      category: "Web Development",
      concept: "api",
      tags: ["architecture", "http"],
      timeLimit: 55,
      points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    },
    {
      id: 5,
      question: "What is the main benefit of using TypeScript over JavaScript?",
      options: [
        "Faster execution speed",
        "Static type checking",
        "Smaller file sizes",
        "Better browser compatibility"
      ],
      correctAnswer: 1,
      explanation: "TypeScript provides static type checking, which helps catch errors at compile time rather than runtime.",
      category: "TypeScript",
      concept: "types",
      tags: ["static-analysis", "development"],
      timeLimit: 50,
      points: difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3,
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    }
  ];

  return fallbackQuestions.slice(0, questionCount);
};

// Course recommendation using AI
export const generateAICourse = async (skillGaps: string[], _userPreferences?: object) => {
  return {
    courses: [
      {
        title: "Personalized Learning Path",
        description: `Course focusing on: ${skillGaps.join(', ')}`,
        modules: skillGaps.map(skill => `${skill} Fundamentals`),
        estimatedHours: skillGaps.length * 8,
        level: "Intermediate"
      }
    ]
  };
};
