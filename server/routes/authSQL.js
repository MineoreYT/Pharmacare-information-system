const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/UserSQL');

const router = express.Router();

// Register user
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['pharmacist', 'pharmacy_tech', 'admin', 'doctor']).withMessage('Invalid role'),
  body('profile.firstName').trim().notEmpty().withMessage('First name is required'),
  body('profile.lastName').trim().notEmpty().withMessage('Last name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password, role, profile } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      where: {
        [require('sequelize').Op.or]: [
          { email },
          { username }
        ]
      }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Set default permissions based on role
    let permissions = [];
    switch (role) {
      case 'pharmacist':
        permissions = ['view_inventory', 'manage_inventory', 'dispense_medication', 'view_prescriptions'];
        break;
      case 'pharmacy_tech':
        permissions = ['view_inventory', 'view_prescriptions'];
        break;
      case 'admin':
        permissions = ['view_inventory', 'manage_inventory', 'dispense_medication', 'view_prescriptions', 'manage_users', 'generate_reports'];
        break;
      case 'doctor':
        permissions = ['view_prescriptions'];
        break;
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
      firstName: profile.firstName,
      lastName: profile.lastName,
      licenseNumber: profile.licenseNumber,
      phone: profile.phone,
      permissions
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          licenseNumber: user.licenseNumber,
          phone: user.phone
        },
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific database errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ 
        message: 'Username or email already exists' 
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ 
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { username },
          { email: username }
        ],
        isActive: true
      }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: {
          firstName: user.firstName,
          lastName: user.lastName,
          licenseNumber: user.licenseNumber,
          phone: user.phone
        },
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        licenseNumber: user.licenseNumber,
        phone: user.phone
      },
      permissions: user.permissions
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;