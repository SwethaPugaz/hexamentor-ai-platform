# HexaMentor - AI-Powered Learning Assessment Platform

A comprehensive learning assessment platform with AI-generated questions using Google Gemini.

## Features

- 🤖 AI-powered question generation using Google Gemini
- 📊 Personalized assessments based on skills and job roles
- 👤 User authentication and role-based access
- 📈 Progress tracking and results analysis
- 🎯 Adaptive learning recommendations
- 💾 MongoDB Atlas cloud database
- 🔐 JWT-based authentication

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Google Gemini AI
- JWT Authentication

## Demo Accounts

**Admin:**
- Email: admin@hexamentor.com
- Password: Admin123!

**Employee:**
- Email: john.doe@techcorp.com
- Password: Employee123!

## Environment Variables

Create `.env` files in both root and backend directories:

**Backend `.env`:**
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
GOOGLE_AI_API_KEY=your_google_gemini_api_key
```

**Frontend `.env`:**
```
VITE_API_URL=http://localhost:5000
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Set up environment variables
4. Start the development servers:
   ```bash
   # Backend
   cd backend && npm run dev
   
   # Frontend (new terminal)
   npm run dev
   ```

## Deployment

The application is configured for deployment on Vercel with serverless functions.

## License

MIT License
