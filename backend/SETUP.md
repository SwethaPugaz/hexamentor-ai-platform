# HexaMentor Backend Setup & Quick Start Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running (or MongoDB Atlas account)
- Git installed

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
The `.env` file has been created with default values. Update these key variables:

```env
# Required for production
JWT_SECRET=hexamentor-super-secret-jwt-key-change-this-in-production-2024

# Database (choose one)
MONGODB_URI=mongodb://localhost:27017/hexamentor  # Local MongoDB
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hexamentor  # MongoDB Atlas

# Optional: OpenAI for AI features
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Email for password reset
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Start MongoDB (if using local)
```bash
# Windows
mongod

# macOS/Linux
sudo service mongod start
# or
brew services start mongodb-community
```

### 4. Seed Database (Optional)
```bash
npm run seed
```
This creates sample data including:
- Admin user: `admin@hexamentor.com` / `admin123`
- Employee users: `john@example.com` / `password123`
- Sample assessments and courses

### 5. Start Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 6. Test the API
```bash
# Health check
curl http://localhost:5000/health

# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## �️ Database Collections & Sample Data

After running `npm run seed`, your MongoDB Atlas database will have these collections:

### 📊 Collections Created:
- **users** - Admin and employee accounts
- **assessments** - JavaScript and React quizzes
- **courses** - Learning materials and content
- **skills** - Available technical skills
- **jobroles** - Job positions and requirements

### 👤 Sample Login Credentials:
- **Admin**: `admin@hexamentor.com` / `admin123`
- **Employee**: `john@example.com` / `password123`
- **Employee**: `jane@example.com` / `password123`

### 🔍 View Your Database:
1. **MongoDB Atlas Web**: https://cloud.mongodb.com/
   - Login → Browse Collections → View all data
2. **Frontend Admin Panel**: http://localhost:5174
   - Login as admin to see dashboard with database analytics
3. **API Endpoints**: Test with Postman or curl

## �📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/logout` - Logout user
- `PUT /api/auth/profile` - Update profile (requires auth)

### Assessments
- `GET /api/assessments` - Get assessments (requires auth)
- `GET /api/assessments/:id` - Get single assessment (requires auth)
- `POST /api/assessments/:id/submit` - Submit assessment (requires auth)
- `POST /api/assessments/adaptive` - Get adaptive questions (requires auth)

### Skills & Job Roles
- `GET /api/skills` - Get all available skills
- `GET /api/job-roles` - Get all job roles

### Admin (requires admin role)
- `GET /api/admin/analytics` - Get system analytics
- `POST /api/assessments` - Create new assessment
- `PUT /api/assessments/:id` - Update assessment
- `DELETE /api/assessments/:id` - Delete assessment

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/         # Database configuration
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Express middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   ├── scripts/        # Database scripts
│   └── server.ts       # Application entry point
├── dist/               # Compiled JavaScript (after build)
├── .env               # Environment variables
├── .env.example       # Environment template
└── package.json       # Dependencies and scripts
```

## 🔧 Available Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run seed        # Seed database with sample data
npm test            # Run tests (when implemented)
```

## 🔐 Authentication Flow

1. **Register/Login**: User gets JWT token
2. **Token Storage**: Frontend stores token (localStorage/cookies)
3. **API Requests**: Include token in Authorization header: `Bearer <token>`
4. **Protection**: Middleware validates token on protected routes

Example API call with authentication:
```javascript
const response = await fetch('http://localhost:5000/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📊 Database Models

### User
- Authentication & profile information
- Skills and job roles
- Assessment history
- Course enrollment
- Learning preferences

### Assessment
- Questions with multiple choice answers
- Skill and role targeting
- AI generation capabilities
- Analytics and scoring

### Course
- Modular content structure
- Instructor information
- Progress tracking
- Certification criteria

## 🤖 AI Integration Options

The backend supports AI-powered features with multiple options:

### 🆓 **Free AI Alternatives:**
1. **Ollama (Local AI)** - Run AI models locally for free
   ```bash
   # Install Ollama: https://ollama.ai/
   # Run local model: ollama run llama2
   ```

2. **Hugging Face API** - Free tier available
   ```env
   HUGGINGFACE_API_KEY=hf_your-free-api-key
   ```

3. **Google Gemini** - Free tier (15 requests/minute)
   ```env
   GOOGLE_AI_API_KEY=your-gemini-api-key
   ```

4. **Groq API** - Free tier with fast inference
   ```env
   GROQ_API_KEY=your-groq-api-key
   ```

### 💰 **OpenAI Pricing (Pay-per-use):**
- **GPT-3.5 Turbo**: ~$0.002/1K tokens (~500 words)
- **GPT-4**: ~$0.03/1K tokens
- **New users get $5 free credits**

### 🔧 **Current Setup (Fallback Mode):**
```env
# Leave empty for dummy AI responses (no cost)
OPENAI_API_KEY=dummy-key-for-testing
```

### ✨ **AI Features Available:**

1. **Adaptive Question Generation**: Creates personalized assessment questions
2. **Course Recommendations**: Suggests courses based on skill gaps  
3. **Learning Path Optimization**: Adjusts difficulty based on performance

### 🚀 **Quick Setup - Free Options:**

**Option A: Use Dummy AI (Free, Works Now)**
```env
OPENAI_API_KEY=dummy-key-for-testing
```
✅ Application works immediately with pre-written responses

**Option B: Google Gemini (Free Tier)**
1. Go to: https://makersuite.google.com/app/apikey
2. Get free API key (15 requests/minute)
3. Update `.env`: `GOOGLE_AI_API_KEY=your-key`

**Option C: Groq (Fast & Free)**
1. Go to: https://console.groq.com/keys
2. Get free API key (fast Llama models)
3. Update `.env`: `GROQ_API_KEY=your-key`

**Option D: Local AI with Ollama**
```bash
# Install from: https://ollama.ai/
ollama pull llama2
ollama serve
```

### 💡 **Recommendation:**
- **For Development**: Use dummy AI (current setup)
- **For Production**: Google Gemini free tier or Groq
- **For Privacy**: Local Ollama setup

To enable any AI features, add your chosen API key to `.env` and restart the server.

## 🚀 Production Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super-secure-random-string
FRONTEND_URL=https://your-frontend-domain.com
```

### Build and Start
```bash
npm run build
npm start
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

## 🔍 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
✅ Solution: Ensure MongoDB is running
- Local: Start mongod service
- Atlas: Check connection string and network access
```

**2. JWT Token Errors**
```
✅ Solution: Check JWT_SECRET in .env file
- Must be a secure, random string
- Same secret must be used consistently
```

**3. CORS Errors**
```
✅ Solution: Update FRONTEND_URL in .env
- Should match your frontend URL exactly
- Default: http://localhost:5173
```

**4. Port Already in Use**
```
✅ Solution: Change PORT in .env or kill existing process
- Windows: netstat -ano | findstr :5000
- macOS/Linux: lsof -ti:5000 | xargs kill
```

### Debug Mode
Set environment variable for detailed logs:
```bash
NODE_ENV=development npm run dev
```

## 📈 Performance & Monitoring

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Request Compression**: Gzip compression enabled
- **Security Headers**: Helmet.js protection
- **Database Indexing**: Optimized queries with indexes

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Next Steps

1. **Start the server**: `npm run dev`
2. **Seed sample data**: `npm run seed`
3. **Test API endpoints** using Postman or curl
4. **Connect your frontend** to the API
5. **Configure AI features** with OpenAI API key
6. **Set up email** for password reset functionality

Happy coding! 🚀
