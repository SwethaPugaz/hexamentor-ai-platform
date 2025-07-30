import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../backend/src/config/database';

// Import routes
import authRoutes from '../backend/src/routes/authRoutes';
import userRoutes from '../backend/src/routes/userRoutes';
import courseRoutes from '../backend/src/routes/courseRoutes';
import assessmentRoutes from '../backend/src/routes/assessmentRoutes';
import skillRoutes from '../backend/src/routes/skillRoutes';
import jobRoleRoutes from '../backend/src/routes/jobRoleRoutes';
import adminRoutes from '../backend/src/routes/adminRoutes';
import aiRoutes from '../backend/src/routes/aiRoutes';

// Import middleware
import { errorHandler } from '../backend/src/middleware/errorHandler';
import { notFound } from '../backend/src/middleware/notFound';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? [
    'https://hexamentor-ai-platform.vercel.app',
    'https://hexamentor-ai-platform-git-main-swethapugaz.vercel.app'
  ] : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/job-roles', jobRoleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'HexaMentor API is running!' });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
