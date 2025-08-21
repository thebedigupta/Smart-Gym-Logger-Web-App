const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  exercises: [{
    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    name: {
      type: String,
      required: true
    },
    sets: [{
      reps: Number,
      weight: Number, // in kg or lbs
      duration: Number, // for time-based exercises like plank
      distance: Number, // for cardio exercises
      restTime: Number, // in seconds
      notes: String
    }],
    notes: String
  }],
  caloriesBurned: {
    type: Number,
    default: 0
  },
  tags: [String],
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateName: String,
  visibility: {
    type: String,
    enum: ['private', 'friends', 'public'],
    default: 'private'
  }
}, {
  timestamps: true
});

// Index for faster queries
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, isTemplate: 1 });

module.exports = mongoose.model('Workout', workoutSchema);
