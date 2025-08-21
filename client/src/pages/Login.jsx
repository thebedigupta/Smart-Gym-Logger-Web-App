import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showGoogleOnly, setShowGoogleOnly] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  // Load Google Sign-In script
  useEffect(() => {
    // Global callback function for Google One Tap
    window.handleGoogleCredentialResponse = handleGoogleSignIn

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    script.onload = () => {
      console.log('Google script loaded')
      if (window.google) {
        console.log('Initializing Google Sign-In with client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID)
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '303844320925-h1i988fvh7bin9s3hfi2bfrdo9udivq9.apps.googleusercontent.com',
          callback: handleGoogleSignIn,
          auto_select: false,
        })
        console.log('Google Sign-In initialized successfully')
      } else {
        console.error('Google object not found')
      }
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
      // Clean up global callback
      delete window.handleGoogleCredentialResponse
    }
  }, [])

  const handleGoogleSignIn = async (response) => {
    console.log('Google Sign-In callback triggered', response)
    try {
      setLoading(true)
      setError('')

      console.log('Sending credential to backend:', response.credential)
      const result = await authAPI.googleAuth(response.credential)

      console.log('Backend response:', result)
      if (result.data.success) {
        // Store token and user data
        localStorage.setItem('token', result.data.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.data.user))
        
        // Redirect to dashboard
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      setError(error.response?.data?.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authAPI.login(formData)
      
      if (response.data.success) {
        // Store token and user data
        localStorage.setItem('token', response.data.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.data.user))
        
        // Redirect to dashboard
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      
      if (error.response?.data?.requiresGoogleAuth) {
        setShowGoogleOnly(true)
        setError(error.response.data.message)
      } else {
        setError(error.response?.data?.message || 'Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const renderGoogleButton = () => {
    return (
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full">
          {/* Google One Tap */}
          <div id="g_id_onload"
               data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID || '303844320925-h1i988fvh7bin9s3hfi2bfrdo9udivq9.apps.googleusercontent.com'}
               data-context="signin"
               data-ux_mode="popup"
               data-callback="handleGoogleCredentialResponse"
               data-auto_prompt="false">
          </div>
          
          {/* Custom Google Sign-In Button */}
          <button
            onClick={() => {
              console.log('Google button clicked')
              if (window.google) {
                console.log('Prompting Google Sign-In')
                window.google.accounts.id.prompt()
              } else {
                console.error('Google object not available')
              }
            }}
            disabled={loading}
            className="w-full inline-flex justify-center items-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Signing in...' : 'Continue with Google'}
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <Dumbbell className="w-10 h-10 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">GymLogger</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="text-gray-600 mt-2">Sign in to continue your fitness journey</p>
        </div>

        {/* Login Form */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {error && (
            <motion.div
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {showGoogleOnly ? (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Google Account Required
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  This email is associated with a Google account. Please sign in with Google.
                </p>
              </div>
              
              {renderGoogleButton()}
              
              <div className="text-center">
                <button
                  onClick={() => setShowGoogleOnly(false)}
                  className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                >
                  ← Back to login options
                </button>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={loading ? {} : { scale: 1.02 }}
                  whileTap={loading ? {} : { scale: 0.98 }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </motion.button>
              </form>

              {/* Divider */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* Google Sign-In */}
              <div className="mt-6">
                {renderGoogleButton()}
              </div>

              {/* Sign Up Link */}
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                  Create account
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Login
