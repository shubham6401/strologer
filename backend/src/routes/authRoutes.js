const express = require('express');
const router = express.Router();
const {
  executiveRegister,
  executiveLogin,
  userRegister,
  userLogin,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Executive Auth Routes
router.post('/executive/register', authLimiter, executiveRegister);
router.post('/executive/login', authLimiter, executiveLogin);

// Customer (Normal User) Auth Routes
router.post('/user/register', authLimiter, userRegister);
router.post('/user/login', authLimiter, userLogin);

// Password recovery
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Profile
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);

module.exports = router;
