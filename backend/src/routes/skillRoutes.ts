import express from 'express';

const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const skills = [
      'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'C++',
      'Data Science', 'Machine Learning', 'DevOps', 'Cloud Computing',
      'UI/UX Design', 'Product Management', 'Digital Marketing'
    ];
    
    res.status(200).json({
      success: true,
      data: skills
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
