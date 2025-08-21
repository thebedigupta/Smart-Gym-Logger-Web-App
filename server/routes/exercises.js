const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const auth = require('../middleware/auth');

// @route   GET /api/exercises
// @desc    Get all exercises with optional filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search, muscleGroup } = req.query;
    let query = {};

    // Add filters if provided
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (muscleGroup) query.muscleGroups = { $in: [muscleGroup] };
    if (search) {
      query.$text = { $search: search };
    }

    const exercises = await Exercise.find(query)
      .select('-instructions -tips') // Exclude detailed fields for list view
      .sort({ name: 1 });

    res.json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/exercises
// @desc    Create a new custom exercise
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      muscleGroups,
      equipment,
      difficulty,
      instructions,
      tips,
      metrics
    } = req.body;

    // Check if exercise already exists
    const existingExercise = await Exercise.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });

    if (existingExercise) {
      return res.status(400).json({
        success: false,
        message: 'Exercise with this name already exists'
      });
    }

    const exercise = new Exercise({
      name,
      description,
      category,
      muscleGroups,
      equipment,
      difficulty: difficulty || 'beginner',
      instructions,
      tips,
      metrics,
      isCustom: true,
      createdBy: req.user.id
    });

    await exercise.save();

    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Error creating exercise:', error);
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

// @route   GET /api/exercises/:id
// @desc    Get exercise by ID with full details
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id)
      .populate('createdBy', 'name');

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Error fetching exercise:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/exercises/categories/list
// @desc    Get all exercise categories
// @access  Public
router.get('/categories/list', (req, res) => {
  const categories = [
    'chest', 'back', 'shoulders', 'arms', 'legs', 
    'core', 'cardio', 'full_body', 'stretching'
  ];
  
  res.json({
    success: true,
    data: categories
  });
});

module.exports = router;
