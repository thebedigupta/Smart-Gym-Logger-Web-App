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
      if (window.google && window.google.accounts && window.google.accounts.id) {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '303844320925-h1i988fvh7bin9s3hfi2bfrdo9udivq9.apps.googleusercontent.com'
        
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
            auto_select: false,
            cancel_on_tap_outside: true,
          })
          
          // Try to render the Google button after a short delay
          setTimeout(() => {
            const buttonContainer = document.getElementById('google-signin-button')
            if (buttonContainer && window.google.accounts.id.renderButton) {
              try {
                window.google.accounts.id.renderButton(
                  buttonContainer,
                  {
                    theme: 'outline',
                    size: 'large',
                    width: buttonContainer.offsetWidth,
                    text: 'continue_with',
                    shape: 'rounded'
                  }
                )
              } catch (renderError) {
                console.error('Error rendering Google button:', renderError)
              }
            }
          }, 100)
          
        } catch (initError) {
          console.error('Error initializing Google Sign-In:', initError)
        }
      } else {
        console.error('Google accounts API not available')
      }
    }

    script.onerror = (error) => {
      console.error('Failed to load Google script:', error)
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
    try {
      setLoading(true)
      setError('')

      const result = await authAPI.googleAuth(response.credential)

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
          
          {/* Google Sign-In Button Container */}
          <div id="google-signin-button" className="w-full"></div>
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
