import express from 'express';
import { protect } from '../middleware/auth';
import { authorize } from '../middleware/auth';
import { getAllUsers } from '../controllers/adminController';

const router = express.Router();

// Admin dashboard analytics
router.get('/analytics', protect, authorize('admin'), async (req, res) => {
  try {
    // Admin analytics logic here
    res.status(200).json({
      success: true,
      data: {
        totalUsers: 0,
        totalAssessments: 0,
        totalCourses: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;

// Get all users (admin only)
router.get('/users', protect, authorize('admin'), getAllUsers);
