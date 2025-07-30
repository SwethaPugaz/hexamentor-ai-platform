import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'employee' | 'admin';
  avatar?: string;
  skills: string[];
  jobRoles: string[];
  assessmentHistory: {
    assessmentId: string;
    completedAt: Date;
    score: number;
    results: {
      skillCategory: string;
      score: number;
      maxScore: number;
      competencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    }[];
    skillGaps: string[];
  }[];
  enrolledCourses: {
    courseId: string;
    enrolledAt: Date;
    progress: number;
    completedAt?: Date;
  }[];
  preferences: {
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
    difficultyPreference: 'easy' | 'medium' | 'hard' | 'adaptive';
    notifications: {
      email: boolean;
      push: boolean;
      reminders: boolean;
    };
  };
  stats: {
    totalAssessments: number;
    totalCoursesCompleted: number;
    averageScore: number;
    hoursLearned: number;
    skillsAcquired: number;
    lastActive: Date;
  };
  isActive: boolean;
  emailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee'
  },
  avatar: {
    type: String,
    default: null
  },
  skills: [{
    type: String,
    trim: true
  }],
  jobRoles: [{
    type: String,
    trim: true
  }],
  assessmentHistory: [{
    assessmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assessment'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    results: [{
      skillCategory: String,
      score: Number,
      maxScore: Number,
      competencyLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
      }
    }],
    skillGaps: [String]
  }],
  enrolledCourses: [{
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrolledAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedAt: Date
  }],
  preferences: {
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'mixed'],
      default: 'mixed'
    },
    difficultyPreference: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'adaptive'],
      default: 'adaptive'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      reminders: {
        type: Boolean,
        default: true
      }
    }
  },
  stats: {
    totalAssessments: {
      type: Number,
      default: 0
    },
    totalCoursesCompleted: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    hoursLearned: {
      type: Number,
      default: 0
    },
    skillsAcquired: {
      type: Number,
      default: 0
    },
    lastActive: {
      type: Date,
      default: Date.now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ jobRoles: 1 });
userSchema.index({ 'stats.lastActive': -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update lastActive on any interaction
userSchema.pre(['find', 'findOne', 'findOneAndUpdate'], function() {
  this.set({ 'stats.lastActive': new Date() });
});

export const User = mongoose.model<IUser>('User', userSchema);
