import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  googleAuth: (token) => api.post('/auth/google', { token }),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  logout: () => api.post('/auth/logout'),
}

// Workouts API
export const workoutAPI = {
  getWorkouts: () => api.get('/workouts'),
  createWorkout: (workoutData) => api.post('/workouts', workoutData),
  getWorkout: (id) => api.get(`/workouts/${id}`),
  updateWorkout: (id, workoutData) => api.put(`/workouts/${id}`, workoutData),
  deleteWorkout: (id) => api.delete(`/workouts/${id}`),
}

// Exercises API
export const exerciseAPI = {
  getExercises: () => api.get('/exercises'),
  createExercise: (exerciseData) => api.post('/exercises', exerciseData),
  getExercise: (id) => api.get(`/exercises/${id}`),
}

// Users API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getStats: () => api.get('/users/stats'),
}

// Health check
export const healthCheck = () => api.get('/health')

export default api
