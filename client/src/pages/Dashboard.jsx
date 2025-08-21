import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  Target, 
  Plus,
  MoreHorizontal,
  Clock,
  Flame,
  Trophy,
  Activity
} from 'lucide-react'
import ExerciseLogger from '../components/ExerciseLogger'

const Dashboard = () => {
  const [isExerciseLoggerOpen, setIsExerciseLoggerOpen] = useState(false)
  const [recentExercises, setRecentExercises] = useState([])
  const [user, setUser] = useState(null)

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const recentWorkouts = [
    {
      id: 1,
      name: "Upper Body Strength",
      date: "Today",
      duration: "45 min",
      exercises: 8,
      calories: 320
    },
    {
      id: 2,
      name: "Leg Day",
      date: "Yesterday",
      duration: "60 min",
      exercises: 10,
      calories: 480
    },
    {
      id: 3,
      name: "Cardio Session",
      date: "2 days ago",
      duration: "30 min",
      exercises: 5,
      calories: 250
    }
  ]

  const stats = [
    {
      title: "Total Workouts",
      value: "47",
      change: "+12%",
      icon: <Dumbbell className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      title: "This Week",
      value: "5",
      change: "+25%",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      title: "Avg Duration",
      value: "52min",
      change: "+8%",
      icon: <Clock className="w-6 h-6" />,
      color: "bg-purple-500"
    },
    {
      title: "Calories Burned",
      value: "3,240",
      change: "+15%",
      icon: <Flame className="w-6 h-6" />,
      color: "bg-orange-500"
    }
  ]

  const quickActions = [
    {
      title: "Start Workout",
      description: "Begin a new training session",
      icon: <Dumbbell className="w-8 h-8" />,
      color: "bg-indigo-600 hover:bg-indigo-700",
      onClick: () => setIsExerciseLoggerOpen(true)
    },
    {
      title: "Log Exercise",
      description: "Quickly log a single exercise",
      icon: <Plus className="w-8 h-8" />,
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => setIsExerciseLoggerOpen(true)
    },
    {
      title: "View Progress",
      description: "Check your fitness analytics",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "bg-purple-600 hover:bg-purple-700",
      onClick: () => {} // TODO: Implement progress view
    },
    {
      title: "Set Goals",
      description: "Update your fitness targets",
      icon: <Target className="w-8 h-8" />,
      color: "bg-orange-600 hover:bg-orange-700",
      onClick: () => {} // TODO: Implement goal setting
    }
  ]

  const handleExerciseSave = async (exerciseLog) => {
    try {
      // Add to recent exercises for display
      setRecentExercises(prev => [exerciseLog, ...prev.slice(0, 4)])
      
      // Here you would normally save to backend
      // TODO: Implement backend API call
      
      // Show success message with exercise details
      const setsInfo = exerciseLog.sets.map((set, i) => 
        `Set ${i + 1}: ${set.reps || set.duration}${set.reps ? ' reps' : 's'} ${set.weight ? `@ ${set.weight}kg` : ''}`
      ).join(', ');
      
      alert(`✅ ${exerciseLog.name} logged successfully!\n${setsInfo}`);
      
    } catch (error) {
      console.error('Error saving exercise:', error)
      alert('❌ Error saving exercise. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <Dumbbell className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
                <span className="text-lg sm:text-xl font-bold text-gray-900">GymLogger</span>
              </div>
              <div className="hidden sm:block text-gray-500">|</div>
              <h1 className="hidden sm:block text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="bg-indigo-600 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">New Workout</span>
                <span className="sm:hidden">New</span>
              </button>
              
              {/* User Avatar */}
              <div className="relative">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name || 'Fitness Enthusiast'}! 💪
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Ready to crush your fitness goals today? Here's your progress overview.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl p-3 sm:p-6 shadow-sm border"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-4">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.color} text-white`}>
                  <div className="w-4 h-4 sm:w-6 sm:h-6">
                    {stat.icon}
                  </div>
                </div>
                <span className="text-green-600 text-xs sm:text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                className={`${action.color} text-white p-3 sm:p-6 rounded-xl text-left transition-colors`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={action.onClick}
              >
                <div className="mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8">
                    {action.icon}
                  </div>
                </div>
                <h4 className="font-semibold mb-1 text-sm sm:text-base">{action.title}</h4>
                <p className="text-xs sm:text-sm opacity-90 hidden sm:block">{action.description}</p>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Recent Workouts */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-4 sm:p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Workouts</h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                {recentWorkouts.map((workout) => (
                  <motion.div
                    key={workout.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{workout.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">{workout.date}</p>
                      </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {workout.duration}
                        </span>
                        <span className="flex items-center">
                          <Activity className="w-4 h-4 mr-1" />
                          {workout.exercises} exercises
                        </span>
                        <span className="flex items-center">
                          <Flame className="w-4 h-4 mr-1" />
                          {workout.calories} cal
                        </span>
                      </div>
                    </div>
                    <div className="text-right sm:hidden">
                      <div className="text-xs text-gray-600">
                        <div>{workout.duration}</div>
                        <div>{workout.calories} cal</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Exercises */}
          {recentExercises.length > 0 && (
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              <div className="bg-white rounded-xl shadow-sm border">
                <div className="p-4 sm:p-6 border-b">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Recent Exercises</h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    {recentExercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Dumbbell className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{exercise.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">
                              {exercise.sets.length} set{exercise.sets.length !== 1 ? 's' : ''} completed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm text-gray-600">
                            {exercise.sets.map((set, i) => (
                              <span key={i}>
                                {set.reps && `${set.reps} reps`}
                                {set.duration && `${set.duration}s`}
                                {set.weight && ` @ ${set.weight}kg`}
                                {i < exercise.sets.length - 1 && ', '}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Goals & Achievements */}
          <motion.div
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Current Goals */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Current Goals</h3>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Weekly Workouts</span>
                    <span className="text-sm text-gray-600">5/6</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '83%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Monthly Calories</span>
                    <span className="text-sm text-gray-600">8,240/10,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">5 Day Streak!</p>
                    <p className="text-xs sm:text-sm text-gray-600">Completed 5 workouts in a row</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">Goal Crusher</p>
                    <p className="text-xs sm:text-sm text-gray-600">Hit your monthly target early</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Exercise Logger Modal */}
      <ExerciseLogger
        isOpen={isExerciseLoggerOpen}
        onClose={() => setIsExerciseLoggerOpen(false)}
        onSave={handleExerciseSave}
      />
    </div>
  )
}

export default Dashboard
