import express from 'express';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user skills
router.put('/skills', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { skills } = req.body;
    // Update user skills logic here
    // Example: req.user.skills = skills; await req.user.save();
    req.user.skills = skills;
    await req.user.save();
    return res.status(200).json({
      success: true,
      message: 'Skills updated successfully',
      skills: req.user.skills
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user job roles
router.put('/job-roles', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { jobRoles } = req.body;
    if (!Array.isArray(jobRoles)) {
      return res.status(400).json({
        success: false,
        message: 'Job roles must be an array'
      });
    }
    req.user.jobRoles = jobRoles;
    await req.user.save();
    return res.status(200).json({
      success: true,
      message: 'Job roles updated successfully',
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        skills: req.user.skills,
        jobRoles: req.user.jobRoles,
        avatar: req.user.avatar,
        stats: req.user.stats,
        preferences: req.user.preferences,
        emailVerified: req.user.emailVerified,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user profile (skills and job roles together)
router.put('/profile', protect, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { skills, jobRoles, name } = req.body;
    if (skills && Array.isArray(skills)) {
      req.user.skills = skills;
    }
    if (jobRoles && Array.isArray(jobRoles)) {
      req.user.jobRoles = jobRoles;
    }
    if (name && typeof name === 'string') {
      req.user.name = name;
    }
    await req.user.save();
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        skills: req.user.skills,
        jobRoles: req.user.jobRoles,
        avatar: req.user.avatar,
        stats: req.user.stats,
        preferences: req.user.preferences,
        emailVerified: req.user.emailVerified,
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
