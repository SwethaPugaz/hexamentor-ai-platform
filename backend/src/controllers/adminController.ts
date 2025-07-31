import { User } from '../models/User';
import { Request, Response } from 'express';

// Get all users (admin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password'); // Exclude password
    res.status(200).json({
      success: true,
      data: users
    });
  } catch {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
