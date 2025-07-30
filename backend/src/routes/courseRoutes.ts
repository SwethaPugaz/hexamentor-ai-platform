import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get all courses
router.get('/', protect, async (req, res) => {
  try {
    // Course logic here
    res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
