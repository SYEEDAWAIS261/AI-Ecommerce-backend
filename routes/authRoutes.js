const express = require('express');
const router = express.Router();
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Signup route
router.post('/signup', signup);

// Login route
router.post('/login', login);

// Get profile (Protected)
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);



module.exports = router;
