@echo off
echo Starting HexaMentor Servers...

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm start"

echo Waiting 3 seconds...
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "npm run dev"

echo Servers started!
echo Frontend: http://localhost:5173 (or next available port)
echo Backend: http://localhost:5000
pause
