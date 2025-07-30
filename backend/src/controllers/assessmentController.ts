import { Request, Response } from 'express';
import { Assessment, IAssessment, IQuestion } from '../models/Assessment';
import { User } from '../models/User';
import { generateAIQuestions } from '../services/aiService';

// @desc    Get all assessments
// @route   GET /api/assessments
// @access  Private
export const getAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      type,
      skills,
      jobRoles,
      difficulty,
      page = 1,
      limit = 10,
      search
    } = req.query;

    // Build query
    let query: any = { isActive: true };

    if (type) query.type = type;
    if (difficulty && difficulty !== 'adaptive') query.difficulty = difficulty;
    if (skills) {
      const skillsArray = typeof skills === 'string' ? skills.split(',') : skills;
      query.targetSkills = { $in: skillsArray };
    }
    if (jobRoles) {
      const jobRolesArray = typeof jobRoles === 'string' ? jobRoles.split(',') : jobRoles;
      query.targetJobRoles = { $in: jobRolesArray };
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const assessments = await Assessment.find(query)
      .populate('createdBy', 'name email')
      .select('-questions') // Don't send questions in list view
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Assessment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: assessments.length,
      total,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      data: assessments
    });
  } catch (error) {
    console.error('Get assessments error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single assessment
// @route   GET /api/assessments/:id
// @access  Private
export const getAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!assessment) {
      res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Get assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Create assessment
// @route   POST /api/assessments
// @access  Private (Admin)
export const createAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      type,
      targetSkills,
      targetJobRoles,
      questions,
      timeLimit,
      passingScore,
      difficulty,
      isAIGenerated,
      aiPrompt
    } = req.body;

    let assessmentQuestions: IQuestion[] = questions || [];

    // If AI-generated, create questions using AI service
    if (isAIGenerated && aiPrompt) {
      try {
        assessmentQuestions = await generateAIQuestions({
          prompt: aiPrompt,
          skills: targetSkills,
          jobRoles: targetJobRoles,
          difficulty,
          questionCount: 20
        });
      } catch (aiError) {
        console.error('AI question generation error:', aiError);
        res.status(400).json({
          success: false,
          message: 'Failed to generate AI questions'
        });
        return;
      }
    }

    const assessment = await Assessment.create({
      title,
      description,
      type,
      targetSkills,
      targetJobRoles,
      questions: assessmentQuestions,
      totalQuestions: assessmentQuestions.length,
      timeLimit,
      passingScore,
      difficulty,
      isAIGenerated,
      aiPrompt,
      createdBy: req.user!._id
    });

    res.status(201).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Create assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Submit assessment
// @route   POST /api/assessments/:id/submit
// @access  Private
export const submitAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { answers, timeSpent } = req.body;
    const assessmentId = req.params.id;
    const userId = req.user!._id;

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
      return;
    }

    // Calculate score and results
    let totalScore = 0;
    let maxScore = 0;
    const categoryScores: { [key: string]: { score: number; maxScore: number } } = {};
    const skillGaps: string[] = [];

    assessment.questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      const points = question.points || 1;

      maxScore += points;
      if (isCorrect) {
        totalScore += points;
      } else {
        // Add to skill gaps if answered incorrectly
        if (!skillGaps.includes(question.concept)) {
          skillGaps.push(question.concept);
        }
      }

      // Track category scores
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { score: 0, maxScore: 0 };
      }
      categoryScores[question.category].maxScore += points;
      if (isCorrect) {
        categoryScores[question.category].score += points;
      }
    });

    // Calculate percentage score
    const percentageScore = Math.round((totalScore / maxScore) * 100);

    // Generate results by category
    const results = Object.entries(categoryScores).map(([category, scores]) => {
      const categoryPercentage = Math.round((scores.score / scores.maxScore) * 100);
      let competencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

      if (categoryPercentage >= 90) competencyLevel = 'Expert';
      else if (categoryPercentage >= 75) competencyLevel = 'Advanced';
      else if (categoryPercentage >= 60) competencyLevel = 'Intermediate';
      else competencyLevel = 'Beginner';

      return {
        skillCategory: category,
        score: scores.score,
        maxScore: scores.maxScore,
        competencyLevel
      };
    });

    // Update user's assessment history
    const user = await User.findById(userId);
    if (user) {
      user.assessmentHistory.push({
        assessmentId: assessmentId,
        completedAt: new Date(),
        score: percentageScore,
        results,
        skillGaps
      });

      // Update user stats
      user.stats.totalAssessments += 1;
      user.stats.averageScore = user.assessmentHistory.reduce((acc, curr) => acc + curr.score, 0) / user.assessmentHistory.length;
      
      await user.save();
    }

    // Update assessment analytics
    assessment.analytics.totalAttempts += 1;
    assessment.analytics.averageScore = 
      (assessment.analytics.averageScore * (assessment.analytics.totalAttempts - 1) + percentageScore) / 
      assessment.analytics.totalAttempts;
    
    // Update skill gaps identified
    skillGaps.forEach(skill => {
      const currentCount = assessment.analytics.skillGapsIdentified[skill] || 0;
      assessment.analytics.skillGapsIdentified[skill] = currentCount + 1;
    });

    await assessment.save();

    res.status(200).json({
      success: true,
      data: {
        score: percentageScore,
        totalScore,
        maxScore,
        results,
        skillGaps,
        passed: percentageScore >= assessment.passingScore,
        timeSpent
      }
    });
  } catch (error) {
    console.error('Submit assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get adaptive questions
// @route   POST /api/assessments/adaptive
// @access  Private
export const getAdaptiveQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skills, jobRoles, currentDifficulty = 'medium', questionCount = 5 } = req.body;
    const user = req.user!;

    // Generate adaptive questions based on user's profile and performance
    const adaptiveQuestions = await generateAIQuestions({
      prompt: `Generate adaptive assessment questions for a user with skills: ${skills.join(', ')} and job roles: ${jobRoles.join(', ')}`,
      skills,
      jobRoles,
      difficulty: currentDifficulty,
      questionCount,
      userHistory: user.assessmentHistory
    });

    res.status(200).json({
      success: true,
      data: {
        questions: adaptiveQuestions,
        recommendedDifficulty: currentDifficulty
      }
    });
  } catch (error) {
    console.error('Get adaptive questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update assessment
// @route   PUT /api/assessments/:id
// @access  Private (Admin)
export const updateAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const assessment = await Assessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!assessment) {
      res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    console.error('Update assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete assessment
// @route   DELETE /api/assessments/:id
// @access  Private (Admin)
export const deleteAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const assessment = await Assessment.findById(req.params.id);

    if (!assessment) {
      res.status(404).json({
        success: false,
        message: 'Assessment not found'
      });
      return;
    }

    // Soft delete by setting isActive to false
    assessment.isActive = false;
    await assessment.save();

    res.status(200).json({
      success: true,
      message: 'Assessment deleted successfully'
    });
  } catch (error) {
    console.error('Delete assessment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
