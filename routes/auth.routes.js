const express = require('express');
const router = express.Router();
const passport = require('passport');
const { googleAuth } = require('../controllers/googleAuth.controller');

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



router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleAuth
);


module.exports = router;