const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const client = require('../config/redis'); // ✅ Connect to Redis
const redisKeys = require('../utils/redisKeys'); // ✅ Key patterns

const protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.warn('🔐 No token provided');
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    // 👇 Check Redis: is token blacklisted?
    const isBlacklisted = await client.get(redisKeys.blacklistToken(token));
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: 'Token has been logged out' });
    }

    // 👇 Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    next();
  } catch (err) {
    logger.error('Token verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};



// Admin-only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin access required' });
  }
};

module.exports = { protect, adminOnly };





