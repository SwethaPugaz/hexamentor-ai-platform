# 🚀 HexaMentor Quick Setup - Full Database & AI

## Option 1: MongoDB Atlas (Cloud) - Recommended
1. Go to [MongoDB Atlas](https://account.mongodb.com/account/register)
2. Create free account → Create cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/hexamentor`
4. Update `backend/.env` MONGODB_URI with your connection string

## Option 2: Local MongoDB (Windows)
```powershell
# Install MongoDB using Chocolatey
choco install mongodb

# Or download from: https://www.mongodb.com/try/download/community
# After installation, start MongoDB:
mongod --dbpath C:\data\db
```

## Setup AI (OpenAI)
1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Update `backend/.env`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

## Run Everything
```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd ..
npm run dev
```

## Test Full Features
1. Register account at http://localhost:5173/register
2. Take AI-powered assessment
3. Get personalized course recommendations
4. View skill gap analysis
