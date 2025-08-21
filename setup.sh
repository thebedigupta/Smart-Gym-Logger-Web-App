#!/bin/bash

# Smart Gym Logger - Development Setup Script
echo "🏋️  Smart Gym Logger Web App - Development Setup"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "🖥️  Installing server dependencies..."
cd server && npm install && cd ..

# Install client dependencies  
echo "💻 Installing client dependencies..."
cd client && npm install && cd ..

# Check for environment files
if [ ! -f "server/.env" ]; then
    echo "⚠️  Server .env file not found. Please copy server/.env.example to server/.env and configure it."
fi

if [ ! -f "client/.env" ]; then
    echo "⚠️  Client .env file not found. Please copy client/.env.example to client/.env and configure it."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Available commands:"
echo "  npm run dev        - Start both client and server in development mode"
echo "  npm run server:dev - Start only the server"  
echo "  npm run client:dev - Start only the client"
echo "  npm run build      - Build client for production"
echo ""
echo "🚀 Run 'npm run dev' to start both servers!"
