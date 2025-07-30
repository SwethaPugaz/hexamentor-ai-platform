# 🚀 HexaMentor - AI & Database Setup Guide

## ✅ Current Status
- ✅ Backend running on port 5000
- ✅ Frontend running on port 5174  
- ⚠️ Using dummy database (limited functionality)
- ⚠️ AI features disabled

## 🎯 To Enable Full Features

### Option 1: MongoDB Atlas (Recommended - Free)

1. **Create MongoDB Atlas Account**
   ```
   https://account.mongodb.com/account/register
   ```

2. **Create Free Cluster**
   - Choose "Build a Database" 
   - Select "M0 Sandbox" (FREE)
   - Choose your region
   - Click "Create Cluster"

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Drivers" → "Node.js"
   - Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hexamentor
   ```

4. **Update Environment**
   - Edit `backend/.env`
   - Replace the MONGODB_URI line:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/hexamentor
   ```

### Option 2: OpenAI API (For AI Features)

1. **Get OpenAI API Key**
   ```
   https://platform.openai.com/api-keys
   ```

2. **Update Environment**
   - Edit `backend/.env`
   - Replace the OPENAI_API_KEY line:
   ```env
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

## 🔄 Restart Servers

After updating the environment:

1. **Stop current backend** (Ctrl+C in backend terminal)
2. **Restart backend**:
   ```powershell
   cd backend
   npm run dev
   ```

## 🧪 Test Full Features

Visit **http://localhost:5174** and test:

1. **User Registration** - Create account
2. **AI Assessment** - Take personalized quiz
3. **Course Recommendations** - Get AI-suggested courses
4. **Progress Tracking** - View learning analytics

## 🛠️ Quick Setup Commands

If you want to set up everything quickly:

```powershell
# Update MongoDB URI
$env:MONGODB_URI="mongodb+srv://your-connection-string"

# Update OpenAI Key  
$env:OPENAI_API_KEY="sk-your-openai-key"

# Restart backend
cd backend; npm run dev
```

## 📊 Features Available

### With Real Database:
- ✅ User authentication & profiles
- ✅ Progress tracking
- ✅ Course enrollment
- ✅ Assessment history
- ✅ Admin dashboard

### With AI Integration:
- ✅ Adaptive question generation
- ✅ Personalized course recommendations
- ✅ Skill gap analysis
- ✅ Learning path optimization

## 🔧 Troubleshooting

**Database Connection Issues:**
- Ensure your IP is whitelisted in MongoDB Atlas
- Check username/password in connection string
- Verify database name matches

**AI Features Not Working:**
- Verify OpenAI API key is valid
- Check API usage/billing in OpenAI dashboard
- Ensure key has proper permissions

**Server Won't Start:**
- Check if ports 5000/5174 are available
- Verify all dependencies installed: `npm install`
- Check for TypeScript errors: `npm run build`
