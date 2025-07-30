@echo off
cd /d "C:\Users\balaj\Downloads\project\backend"
set MONGODB_URI=mongodb+srv://swethapugaz:Pvs@01092004@hexamentor-cluster.uqrvbvq.mongodb.net/hexamentor?retryWrites=true&w=majority&appName=hexamentor-cluster
set NODE_ENV=development
set OPENAI_API_KEY=dummy-key-for-testing
set JWT_SECRET=hexamentor-super-secret-jwt-key-change-this-in-production-2024
set JWT_EXPIRE=7d
node dist/server.js
