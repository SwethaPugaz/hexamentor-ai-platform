import express from 'express';
import {
  getAssessments,
  getAssessment,
  createAssessment,
  updateAssessment,
  deleteAssessment,
  submitAssessment,
  getAdaptiveQuestions
} from '../controllers/assessmentController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes (with authentication)
router.get('/', protect, getAssessments);
router.get('/:id', protect, getAssessment);
router.post('/:id/submit', protect, submitAssessment);
router.post('/adaptive', protect, getAdaptiveQuestions);

// Admin routes
router.post('/', protect, authorize('admin'), createAssessment);
router.put('/:id', protect, authorize('admin'), updateAssessment);
router.delete('/:id', protect, authorize('admin'), deleteAssessment);

export default router;
