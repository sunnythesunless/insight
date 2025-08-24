const express = require('express');
const router = express.Router();

const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  refreshToken,
  logout,
} = require('../controllers/auth.controller');

const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

const { loginLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth')

router.post('/register', registerValidator, register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', loginLimiter, loginValidator, login);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidator, resetPassword);
router.post('/refresh', refreshToken);
router.post('/logout',protect, logout);

module.exports = router;