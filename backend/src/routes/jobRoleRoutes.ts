import express from 'express';

const router = express.Router();

// Get all job roles
router.get('/', async (req, res) => {
  try {
    const jobRoles = [
      'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
      'Data Scientist', 'DevOps Engineer', 'Product Manager',
      'UI/UX Designer', 'Mobile Developer', 'Cloud Architect',
      'Machine Learning Engineer', 'Security Engineer', 'QA Engineer'
    ];
    
    res.status(200).json({
      success: true,
      data: jobRoles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
