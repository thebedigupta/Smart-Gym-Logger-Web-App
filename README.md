# Smart Gym Logger Web App 💪

A comprehensive web application for tracking and logging gym workouts, exercises, and fitness progress. Built with modern technologies for a seamless user experience.

## 🚀 Features

- **Stunning Landing Page** - Beautiful, responsive design with animations
- **Smart Workout Tracking** - Log exercises with intelligent suggestions
- **Progress Analytics** - Visualize your fitness journey with detailed charts
- **Goal Setting** - Set and track personalized fitness goals
- **Achievement System** - Earn badges and unlock milestones
- **Responsive Design** - Works perfectly on all devices
- **Real-time Dashboard** - Monitor your progress at a glance

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icons
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database (ready for connection)
- **JWT** - Authentication and authorization
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection

## 📋 Project Structure

```
Smart-Gym-Logger-Web-App/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── pages/         # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── routes/           # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── workouts.js   # Workout management
│   │   ├── exercises.js  # Exercise database
│   │   └── users.js      # User management
│   ├── server.js         # Main server file
│   ├── package.json
│   └── .env              # Environment variables
│
└── README.md
```

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm package manager

### One-Command Setup & Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/thebedigupta/Smart-Gym-Logger-Web-App.git
   cd Smart-Gym-Logger-Web-App
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   ```bash
   # Copy and edit server environment file
   cp server/.env.example server/.env
   
   # Copy and edit client environment file  
   cp client/.env.example client/.env
   ```

4. **Start both servers with ONE command! 🚀**
   ```bash
   npm run dev
   ```

   That's it! Both frontend and backend will start simultaneously.

5. **Open your browser**
   - Frontend: http://localhost:5173 (or 5174 if 5173 is busy)
   - Backend API: http://localhost:5000/api/health

### Alternative Setup Methods

**Windows Users:**
```bash
# Run the setup script
setup.bat
```

**Linux/Mac Users:**
```bash
# Make script executable and run
chmod +x setup.sh
./setup.sh
```

### Available Commands
```bash
npm run dev          # 🚀 Start both client and server
npm run server:dev   # 🖥️  Start only server
npm run client:dev   # 💻 Start only client  
npm run build        # 📦 Build for production
npm run install:all  # 📥 Install all dependencies
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Workouts
- `GET /api/workouts` - Get user workouts
- `POST /api/workouts` - Create new workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout

### Exercises
- `GET /api/exercises` - Get exercise database
- `POST /api/exercises` - Create custom exercise
- `GET /api/exercises/:id` - Get specific exercise

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/stats` - Get workout statistics

## 🎨 UI Components

### Landing Page
- Hero section with call-to-action
- Feature showcase with animations
- Testimonials and social proof
- Responsive navigation
- Beautiful gradient backgrounds

### Authentication
- Modern login/register forms
- Password visibility toggles
- Social authentication options
- Form validation and feedback

### Dashboard
- Real-time statistics cards
- Recent workout history
- Quick action buttons
- Progress tracking charts
- Goal achievement system

## 🔧 Development

### Available Scripts

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Server:**
- `npm start` - Start production server
- `npm run dev` - Start with nodemon (development)

### Environment Variables

Create a `.env` file in the server directory:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/smart-gym-logger
JWT_SECRET=your-super-secret-jwt-key
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Build the client: `npm run build`
2. Deploy the `dist` folder

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy the server folder

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- Lucide for beautiful icons

---

**Happy Coding! 🎉**

Built with ❤️ for fitness enthusiasts everywhere.
