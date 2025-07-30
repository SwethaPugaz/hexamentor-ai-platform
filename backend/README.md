# HexaMentor Backend API

A comprehensive backend API for the HexaMentor adaptive learning and assessment platform.

## Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Employee/Admin)
  - Password reset functionality
  - Email verification

- **Adaptive Assessments**
  - AI-powered question generation
  - Skill-based and role-based assessments
  - Real-time scoring and analytics
  - Personalized skill gap analysis

- **Course Management**
  - AI-generated course recommendations
  - Progress tracking
  - Modular content structure
  - Certificate generation

- **Admin Dashboard**
  - User management
  - Assessment analytics
  - Course management
  - System monitoring

- **AI Integration**
  - OpenAI-powered content generation
  - Personalized learning paths
  - Adaptive difficulty adjustment

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **AI Services**: OpenAI GPT-4
- **Email**: Nodemailer
- **File Upload**: Cloudinary
- **Security**: Helmet, CORS, Rate limiting

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/hexamentor
   JWT_SECRET=your-super-secret-jwt-key
   OPENAI_API_KEY=your-openai-api-key
   # ... other variables
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB locally
   mongod
   
   # Or using MongoDB Atlas (update MONGODB_URI in .env)
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgotpassword` - Forgot password
- `PUT /api/auth/resetpassword/:token` - Reset password
- `PUT /api/auth/profile` - Update profile

### Assessments
- `GET /api/assessments` - Get all assessments
- `GET /api/assessments/:id` - Get single assessment
- `POST /api/assessments` - Create assessment (Admin)
- `PUT /api/assessments/:id` - Update assessment (Admin)
- `DELETE /api/assessments/:id` - Delete assessment (Admin)
- `POST /api/assessments/:id/submit` - Submit assessment
- `POST /api/assessments/adaptive` - Get adaptive questions

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get single course
- `POST /api/courses` - Create course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Skills & Job Roles
- `GET /api/skills` - Get all skills
- `GET /api/job-roles` - Get all job roles

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/skills` - Update user skills

### Admin
- `GET /api/admin/analytics` - Get system analytics

### AI
- `POST /api/ai/generate-questions` - Generate AI questions

## Database Schema

### User
- Personal information and authentication
- Skills and job roles
- Assessment history
- Enrolled courses
- Learning preferences
- Statistics and analytics

### Assessment
- Assessment metadata
- Questions with multiple choice options
- Scoring and analytics
- AI generation info

### Course
- Course content and structure
- Modules and lessons
- Instructor information
- Enrollment and progress tracking

## Development

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests

### Code Structure
```
src/
├── config/         # Database and app configuration
├── controllers/    # Route controllers
├── middleware/     # Express middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── services/       # Business logic services
├── utils/          # Utility functions
└── server.ts       # Application entry point
```

## Security

- **Authentication**: JWT tokens with secure HTTP-only cookies
- **Authorization**: Role-based access control
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Express-validator for request validation
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configured for specific origins
- **Password Hashing**: bcrypt with salt rounds

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=strong-random-secret
OPENAI_API_KEY=sk-...
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
