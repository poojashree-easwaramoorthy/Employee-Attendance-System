// backend/routes/users.js
const express = require('express');
const User = require('../models/User');
const { auth, requireManager } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all employees (manager only)
router.get('/', auth, requireManager, async (req, res) => {
  try {
    const users = await User.find({ role: 'employee' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get employee by ID
router.get('/:id', auth, requireManager, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;