const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId; // Password required only if not Google user
    }
  },
  googleId: {
    type: String,
    sparse: true // Allows multiple null values
  },
  avatar: {
    type: String,
    default: null
  },
  authProvider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  profile: {
    age: Number,
    weight: Number,
    height: Number,
    fitnessLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    goals: [{
      type: String,
      enum: ['weight_loss', 'muscle_gain', 'strength', 'endurance', 'general_fitness']
    }]
  },
  preferences: {
    units: {
      type: String,
      enum: ['metric', 'imperial'],
      default: 'metric'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    privacy: {
      profileVisible: { type: Boolean, default: false },
      workoutsVisible: { type: Boolean, default: false }
    }
  },
  stats: {
    totalWorkouts: { type: Number, default: 0 },
    totalExercises: { type: Number, default: 0 },
    totalCaloriesBurned: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastWorkoutDate: Date
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified and user is not using Google auth
  if (!this.isModified('password') || this.authProvider === 'google') return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.emailVerificationToken;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  return userObject;
};

// Update user stats
userSchema.methods.updateStats = function(workoutData) {
  this.stats.totalWorkouts += 1;
  this.stats.totalExercises += workoutData.exerciseCount || 0;
  this.stats.totalCaloriesBurned += workoutData.caloriesBurned || 0;
  this.stats.totalTimeSpent += workoutData.duration || 0;
  
  // Update streak
  const today = new Date();
  const lastWorkout = this.stats.lastWorkoutDate;
  
  if (lastWorkout) {
    const daysDiff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));
    if (daysDiff === 1) {
      this.stats.currentStreak += 1;
    } else if (daysDiff > 1) {
      this.stats.currentStreak = 1;
    }
  } else {
    this.stats.currentStreak = 1;
  }
  
  // Update longest streak
  if (this.stats.currentStreak > this.stats.longestStreak) {
    this.stats.longestStreak = this.stats.currentStreak;
  }
  
  this.stats.lastWorkoutDate = today;
};

module.exports = mongoose.model('User', userSchema);
