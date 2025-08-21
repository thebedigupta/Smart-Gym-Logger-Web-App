import { motion } from 'framer-motion'
import { 
  Dumbbell, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar,
  Trophy,
  Activity,
  Zap,
  Shield,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  const features = [
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: "Smart Workout Tracking",
      description: "Log your exercises with intelligent suggestions and automatic progress tracking."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Goal Setting",
      description: "Set personalized fitness goals and track your journey to achieve them."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Progress Analytics",
      description: "Visualize your progress with detailed charts and performance insights."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Workout Scheduling",
      description: "Plan your workouts in advance and never miss a training session."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Achievement System",
      description: "Earn badges and achievements as you reach new fitness milestones."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Real-time Monitoring",
      description: "Monitor your performance in real-time during your workout sessions."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "This app transformed my workout routine! The progress tracking is incredible.",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Personal Trainer",
      content: "I recommend this to all my clients. The analytics help optimize their training.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Gym Owner",
      content: "Perfect for our gym members. Easy to use and very comprehensive.",
      rating: 5
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Dumbbell className="w-8 h-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">GymLogger</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/login" className="text-gray-700 hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Started
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">
                {" "}Fitness Journey
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              variants={itemVariants}
            >
              The most intelligent gym logging app that adapts to your workout style. 
              Track progress, set goals, and achieve results faster than ever before.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Link 
                to="/register"
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl text-lg font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-all">
                Watch Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Hero Image/Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: <Users className="w-8 h-8" />, number: "10K+", label: "Active Users" },
              { icon: <Zap className="w-8 h-8" />, number: "1M+", label: "Workouts Logged" },
              { icon: <Trophy className="w-8 h-8" />, number: "50K+", label: "Goals Achieved" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-indigo-600 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to help you track, analyze, and optimize your fitness journey.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-indigo-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-cyan-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Choose GymLogger?
              </h2>
              <div className="space-y-4">
                {[
                  "AI-powered workout recommendations",
                  "Real-time progress tracking",
                  "Comprehensive exercise database",
                  "Social features and challenges",
                  "Cross-platform synchronization",
                  "Expert-designed workout programs"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center text-white"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="w-6 h-6 mr-3 text-cyan-300" />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-white/10 backdrop-blur-md rounded-2xl p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-center">
                <Shield className="w-16 h-16 text-cyan-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">Secure & Private</h3>
                <p className="text-cyan-100 mb-6">
                  Your workout data is encrypted and stored securely. We respect your privacy 
                  and never share your personal information.
                </p>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-3xl font-bold text-white">256-bit</div>
                  <div className="text-cyan-200">SSL Encryption</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Fitness Enthusiasts
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about their experience.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Transform Your Workouts?
            </h2>
            <p className="text-xl text-indigo-100 mb-8">
              Join thousands of fitness enthusiasts who have already improved their results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="bg-white text-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Dumbbell className="w-8 h-8 text-indigo-400" />
                <span className="text-xl font-bold">GymLogger</span>
              </div>
              <p className="text-gray-400">
                The intelligent fitness tracking app that helps you achieve your goals faster.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 GymLogger. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
