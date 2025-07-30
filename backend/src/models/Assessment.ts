import mongoose, { Document, Schema } from 'mongoose';

export interface IQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  concept: string;
  tags: string[];
  timeLimit: number; // in seconds
  points: number;
}

export interface IAssessment extends Document {
  _id: string;
  title: string;
  description: string;
  type: 'skill-based' | 'role-based' | 'adaptive' | 'custom';
  targetSkills: string[];
  targetJobRoles: string[];
  questions: IQuestion[];
  totalQuestions: number;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  isActive: boolean;
  isAIGenerated: boolean;
  aiPrompt?: string;
  createdBy: mongoose.Types.ObjectId;
  analytics: {
    totalAttempts: number;
    averageScore: number;
    completionRate: number;
    averageTimeSpent: number;
    skillGapsIdentified: { [skill: string]: number };
  };
  tags: string[];
  prerequisites: string[];
  createdAt: Date;
  updatedAt: Date;
}

const questionSchema = new Schema<IQuestion>({
  id: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: [true, 'Question text is required'],
    trim: true
  },
  options: [{
    type: String,
    required: true,
    trim: true
  }],
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
    min: 0
  },
  explanation: {
    type: String,
    required: [true, 'Explanation is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  concept: {
    type: String,
    required: [true, 'Concept is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  timeLimit: {
    type: Number,
    default: 60, // 60 seconds default
    min: 10,
    max: 300
  },
  points: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  }
});

const assessmentSchema = new Schema<IAssessment>({
  title: {
    type: String,
    required: [true, 'Assessment title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Assessment description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  type: {
    type: String,
    enum: ['skill-based', 'role-based', 'adaptive', 'custom'],
    required: true,
    default: 'skill-based'
  },
  targetSkills: [{
    type: String,
    trim: true
  }],
  targetJobRoles: [{
    type: String,
    trim: true
  }],
  questions: [questionSchema],
  totalQuestions: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 5,
    max: 180 // 3 hours max
  },
  passingScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 70
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'adaptive'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  analytics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    averageTimeSpent: {
      type: Number,
      default: 0
    },
    skillGapsIdentified: {
      type: Object,
      default: {}
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
assessmentSchema.index({ targetSkills: 1 });
assessmentSchema.index({ targetJobRoles: 1 });
assessmentSchema.index({ type: 1, isActive: 1 });
assessmentSchema.index({ createdBy: 1 });
assessmentSchema.index({ tags: 1 });

// Virtual for average difficulty
assessmentSchema.virtual('averageDifficulty').get(function() {
  if (!this.questions || this.questions.length === 0) return 'medium';
  
  const difficultyMap = { easy: 1, medium: 2, hard: 3 };
  const total = this.questions.reduce((sum, q) => sum + difficultyMap[q.difficulty], 0);
  const average = total / this.questions.length;
  
  if (average <= 1.3) return 'easy';
  if (average <= 2.3) return 'medium';
  return 'hard';
});

export const Assessment = mongoose.model<IAssessment>('Assessment', assessmentSchema);
