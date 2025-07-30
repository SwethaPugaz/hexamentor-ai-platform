import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user skills
router.put('/skills', protect, async (req, res) => {
  try {
    const { skills } = req.body;
    // Update user skills logic here
    res.status(200).json({
      success: true,
      message: 'Skills updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
