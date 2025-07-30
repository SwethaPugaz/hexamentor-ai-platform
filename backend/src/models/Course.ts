import mongoose, { Document, Schema } from 'mongoose';

export interface IModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'interactive' | 'quiz' | 'assignment';
  content: string; // URL for video, text content, or interactive content
  duration: number; // in minutes
  order: number;
  isRequired: boolean;
  prerequisites: string[];
  resources: {
    type: 'document' | 'link' | 'video' | 'code';
    title: string;
    url: string;
  }[];
}

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  category: string;
  subcategory: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // total duration in minutes
  instructor: {
    name: string;
    avatar: string;
    bio: string;
    expertise: string[];
  };
  modules: IModule[];
  skills: string[]; // skills covered in this course
  prerequisites: string[];
  learningObjectives: string[];
  targetAudience: string[];
  price: {
    amount: number;
    currency: string;
    discountAmount?: number;
    discountPercentage?: number;
  };
  rating: {
    average: number;
    count: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
  enrollment: {
    count: number;
    limit?: number;
    isOpen: boolean;
  };
  tags: string[];
  language: string;
  subtitles: string[];
  certificate: {
    available: boolean;
    template: string;
    criteria: {
      minimumScore: number;
      completionRate: number;
    };
  };
  isPublished: boolean;
  isAIGenerated: boolean;
  aiPrompt?: string;
  createdBy: mongoose.Types.ObjectId;
  analytics: {
    views: number;
    enrollments: number;
    completions: number;
    averageProgress: number;
    averageRating: number;
    dropoffPoints: { moduleId: string; dropoffRate: number }[];
  };
  seo: {
    slug: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const moduleSchema = new Schema<IModule>({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Module title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Module description is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'text', 'interactive', 'quiz', 'assignment'],
    required: true
  },
  content: {
    type: String,
    required: [true, 'Module content is required']
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  order: {
    type: Number,
    required: true,
    min: 1
  },
  isRequired: {
    type: Boolean,
    default: true
  },
  prerequisites: [{
    type: String,
    trim: true
  }],
  resources: [{
    type: {
      type: String,
      enum: ['document', 'link', 'video', 'code'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    }
  }]
});

const courseSchema = new Schema<ICourse>({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true,
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  thumbnail: {
    type: String,
    required: [true, 'Thumbnail is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  subcategory: {
    type: String,
    trim: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  instructor: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      required: true
    },
    bio: {
      type: String,
      required: true,
      trim: true
    },
    expertise: [{
      type: String,
      trim: true
    }]
  },
  modules: [moduleSchema],
  skills: [{
    type: String,
    required: true,
    trim: true
  }],
  prerequisites: [{
    type: String,
    trim: true
  }],
  learningObjectives: [{
    type: String,
    required: true,
    trim: true
  }],
  targetAudience: [{
    type: String,
    trim: true
  }],
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      default: 'USD'
    },
    discountAmount: {
      type: Number,
      min: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  enrollment: {
    count: {
      type: Number,
      default: 0,
      min: 0
    },
    limit: {
      type: Number,
      min: 1
    },
    isOpen: {
      type: Boolean,
      default: true
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  language: {
    type: String,
    required: true,
    default: 'English'
  },
  subtitles: [{
    type: String,
    trim: true
  }],
  certificate: {
    available: {
      type: Boolean,
      default: false
    },
    template: {
      type: String
    },
    criteria: {
      minimumScore: {
        type: Number,
        default: 70,
        min: 0,
        max: 100
      },
      completionRate: {
        type: Number,
        default: 80,
        min: 0,
        max: 100
      }
    }
  },
  isPublished: {
    type: Boolean,
    default: false
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
    views: {
      type: Number,
      default: 0
    },
    enrollments: {
      type: Number,
      default: 0
    },
    completions: {
      type: Number,
      default: 0
    },
    averageProgress: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    },
    dropoffPoints: [{
      moduleId: String,
      dropoffRate: Number
    }]
  },
  seo: {
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
    },
    metaTitle: {
      type: String,
      trim: true
    },
    metaDescription: {
      type: String,
      trim: true
    },
    keywords: [{
      type: String,
      trim: true
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
courseSchema.index({ category: 1, level: 1 });
courseSchema.index({ skills: 1 });
courseSchema.index({ tags: 1 });
courseSchema.index({ 'rating.average': -1 });
courseSchema.index({ 'enrollment.count': -1 });
courseSchema.index({ isPublished: 1, createdAt: -1 });
courseSchema.index({ 'seo.slug': 1 });

// Generate SEO slug before saving
courseSchema.pre('save', function(next) {
  if (!this.seo.slug) {
    this.seo.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Virtual for total modules
courseSchema.virtual('totalModules').get(function() {
  return this.modules ? this.modules.length : 0;
});

// Virtual for completion rate
courseSchema.virtual('completionRate').get(function() {
  if (this.analytics?.enrollments === 0) return 0;
  return (this.analytics?.completions || 0) / (this.analytics?.enrollments || 1) * 100;
});

export const Course = mongoose.model<ICourse>('Course', courseSchema);
