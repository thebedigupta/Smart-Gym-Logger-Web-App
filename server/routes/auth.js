const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { generateToken, verifyGoogleToken } = require('../utils/auth');
const router = express.Router();

// Validation middleware
const validateRegister = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      authProvider: 'local'
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Return user data (without password)
    const userProfile = user.getPublicProfile();

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: userProfile,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'Unable to create account. Please try again.'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if user used Google auth
    if (user.authProvider === 'google') {
      return res.status(400).json({
        error: 'Google account detected',
        message: 'Please sign in with Google',
        requiresGoogleAuth: true
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(400).json({
        error: 'Account deactivated',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Return user data
    const userProfile = user.getPublicProfile();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userProfile,
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'Unable to sign in. Please try again.'
    });
  }
});

// @route   POST /api/auth/google
// @desc    Google OAuth login/register
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Token required',
        message: 'Google token is required'
      });
    }

    // Verify Google token
    const googleUser = await verifyGoogleToken(token);

    // Check if user exists
    let user = await User.findOne({ 
      $or: [
        { email: googleUser.email },
        { googleId: googleUser.googleId }
      ]
    });

    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleUser.googleId;
        user.authProvider = 'google';
        user.isEmailVerified = googleUser.emailVerified;
        if (googleUser.avatar && !user.avatar) {
          user.avatar = googleUser.avatar;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        googleId: googleUser.googleId,
        avatar: googleUser.avatar,
        authProvider: 'google',
        isEmailVerified: googleUser.emailVerified
      });
      await user.save();
    }

    // Generate JWT token
    const jwtToken = generateToken(user._id);

    // Return user data
    const userProfile = user.getPublicProfile();

    res.json({
      success: true,
      message: user.isNew ? 'Account created successfully' : 'Login successful',
      data: {
        user: userProfile,
        token: jwtToken
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).json({
      error: 'Google authentication failed',
      message: error.message || 'Unable to authenticate with Google'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User account not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'Failed to fetch user',
      message: 'Unable to retrieve user information'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('profile.age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('profile.weight').optional().isFloat({ min: 20 }).withMessage('Weight must be a positive number'),
  body('profile.height').optional().isFloat({ min: 50 }).withMessage('Height must be a positive number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input',
        details: errors.array()
      });
    }

    const allowedUpdates = ['name', 'profile', 'preferences'];
    const updates = {};

    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.getPublicProfile()
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'Profile update failed',
      message: 'Unable to update profile'
    });
  }
});

module.exports = router;
