@echo off
echo 🏋️  Smart Gym Logger Web App - Development Setup
echo ================================================

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%

:: Install root dependencies
echo 📦 Installing root dependencies...
call npm install

:: Install server dependencies
echo 🖥️  Installing server dependencies...
cd server
call npm install
cd ..

:: Install client dependencies
echo 💻 Installing client dependencies...
cd client
call npm install
cd ..

:: Check for environment files
if not exist "server\.env" (
    echo ⚠️  Server .env file not found. Please copy server\.env.example to server\.env and configure it.
)

if not exist "client\.env" (
    echo ⚠️  Client .env file not found. Please copy client\.env.example to client\.env and configure it.
)

echo.
echo 🎉 Setup complete!
echo.
echo Available commands:
echo   npm run dev        - Start both client and server in development mode
echo   npm run server:dev - Start only the server
echo   npm run client:dev - Start only the client
echo   npm run build      - Build client for production
echo.
echo 🚀 Run 'npm run dev' to start both servers!
pause
