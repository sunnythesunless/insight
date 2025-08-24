const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const sendEmail = require('../services/email.service');
const crypto = require('crypto');
const logger = require('../utils/logger');
const redisKeys = require('../utils/redisKeys')
const client = require('../config/redis')

// @desc    Register user
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = verifyToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    console.log('verify', verifyToken)

    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email/${verifyToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `<p>Please verify your email by clicking:</p><a href="${verificationUrl}">Verify Email</a>`,
    });

    res.status(201).json({
      success: true,
      message: 'User registered. Please check your email to verify your account.',
    });
  } catch (err) {
    logger.error('Register error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully!' });
  } catch (err) {
    logger.error('Email verification error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in DB
    await Token.create({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    logger.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(200).json({ success: true, message: 'If email exists, a reset link was sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.BASE_URL}/api/auth/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Reset your password:</p><a href="${resetUrl}">Reset Password</a>`,
    });

    res.json({ success: true, message: 'Password reset link sent to email.' });
  } catch (err) {
    logger.error('Forgot password error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = req.body.newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    logger.error('Reset password error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Refresh Access Token
// @route   POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const tokenRecord = await Token.findOne({
      token: refreshToken,
      userId: decoded.userId,
      blacklisted: false,
      expiresAt: { $gt: new Date() },
    });

    if (!tokenRecord) {
      return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ success: true, accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
};



// @desc    Logout (blacklist access token)
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // 1. Get access token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token required',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Decode token to get expiry time (don't verify again)
    const decoded = jwt.decode(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    const exp = decoded.exp;
    const now = Math.floor(Date.now() / 1000);
    const ttl = exp - now;

    // 3. Only blacklist if token hasn't expired yet
    if (ttl > 0) {
      await client.setEx(redisKeys.blacklistToken(token), ttl, '1');
    }

    // 4. Respond
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout',
    });
  }
};