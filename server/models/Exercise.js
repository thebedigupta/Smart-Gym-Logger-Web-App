const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'chest', 
      'back', 
      'shoulders', 
      'arms', 
      'legs', 
      'core', 
      'cardio', 
      'full_body',
      'stretching'
    ]
  },
  muscleGroups: [{
    type: String,
    enum: [
      'pectorals', 'latissimus_dorsi', 'rhomboids', 'trapezius',
      'deltoids', 'biceps', 'triceps', 'forearms',
      'quadriceps', 'hamstrings', 'calves', 'glutes',
      'abdominals', 'obliques', 'lower_back',
      'heart', 'full_body'
    ]
  }],
  equipment: [{
    type: String,
    enum: [
      'barbell', 'dumbbell', 'kettlebell', 'resistance_band',
      'pull_up_bar', 'bench', 'machine', 'cable',
      'bodyweight', 'treadmill', 'bike', 'elliptical',
      'none'
    ]
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  instructions: [String],
  tips: [String],
  imageUrl: String,
  videoUrl: String,
  isCustom: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.isCustom;
    }
  },
  metrics: {
    primaryMetric: {
      type: String,
      enum: ['reps', 'time', 'distance'],
      default: 'reps'
    },
    hasWeight: {
      type: Boolean,
      default: true
    },
    hasReps: {
      type: Boolean,
      default: true
    },
    hasTime: {
      type: Boolean,
      default: false
    },
    hasDistance: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for faster searches
exerciseSchema.index({ name: 'text', description: 'text' });
exerciseSchema.index({ category: 1 });
exerciseSchema.index({ difficulty: 1 });
exerciseSchema.index({ muscleGroups: 1 });

module.exports = mongoose.model('Exercise', exerciseSchema);
