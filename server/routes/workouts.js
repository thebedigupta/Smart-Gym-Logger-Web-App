const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const auth = require('../middleware/auth');

// @route   GET /api/workouts
// @desc    Get all workouts for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, isTemplate = false } = req.query;
    const skip = (page - 1) * limit;

    const query = { 
      user: req.user.id,
      isTemplate: isTemplate === 'true'
    };

    const workouts = await Workout.find(query)
      .populate('exercises.exerciseId', 'name category')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Workout.countDocuments(query);

    res.json({
      success: true,
      data: workouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/workouts
// @desc    Create a new workout
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      exercises,
      duration,
      caloriesBurned,
      tags,
      rating,
      notes,
      isTemplate,
      templateName
    } = req.body;

    // Validate exercises exist
    if (exercises && exercises.length > 0) {
      for (const exercise of exercises) {
        if (exercise.exerciseId) {
          const existingExercise = await Exercise.findById(exercise.exerciseId);
          if (!existingExercise) {
            return res.status(400).json({
              success: false,
              message: `Exercise with ID ${exercise.exerciseId} not found`
            });
          }
        }
      }
    }

    const workout = new Workout({
      user: req.user.id,
      name,
      description,
      exercises: exercises || [],
      duration,
      caloriesBurned: caloriesBurned || 0,
      tags: tags || [],
      rating,
      notes,
      isTemplate: isTemplate || false,
      templateName
    });

    await workout.save();
    
    // Populate exercise details before sending response
    await workout.populate('exercises.exerciseId', 'name category');

    res.status(201).json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error('Error creating workout:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get workout by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('exercises.exerciseId', 'name category muscleGroups equipment');

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error('Error fetching workout:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update workout
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    const {
      name,
      description,
      exercises,
      duration,
      caloriesBurned,
      tags,
      rating,
      notes
    } = req.body;

    // Update fields if provided
    if (name !== undefined) workout.name = name;
    if (description !== undefined) workout.description = description;
    if (exercises !== undefined) workout.exercises = exercises;
    if (duration !== undefined) workout.duration = duration;
    if (caloriesBurned !== undefined) workout.caloriesBurned = caloriesBurned;
    if (tags !== undefined) workout.tags = tags;
    if (rating !== undefined) workout.rating = rating;
    if (notes !== undefined) workout.notes = notes;

    await workout.save();
    await workout.populate('exercises.exerciseId', 'name category');

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error('Error updating workout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    res.json({
      success: true,
      message: 'Workout deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/workouts/:id/exercises
// @desc    Add exercise to existing workout
// @access  Private
router.post('/:id/exercises', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!workout) {
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    const { exerciseId, name, sets, notes } = req.body;

    // Validate exercise exists if exerciseId provided
    if (exerciseId) {
      const exercise = await Exercise.findById(exerciseId);
      if (!exercise) {
        return res.status(400).json({
          success: false,
          message: 'Exercise not found'
        });
      }
    }

    workout.exercises.push({
      exerciseId,
      name,
      sets: sets || [],
      notes
    });

    await workout.save();
    await workout.populate('exercises.exerciseId', 'name category');

    res.json({
      success: true,
      data: workout
    });
  } catch (error) {
    console.error('Error adding exercise to workout:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
