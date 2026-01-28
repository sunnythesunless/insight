const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    logger.warn('🔐 No token provided');
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    logger.error('Token verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Token invalid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  return res.status(403).json({ success: false, message: 'Admin access required' });
};

const verifyWorkspace = (req, res, next) => {
  // Add the optional chaining (?.) to prevent the "Cannot read properties of undefined" crash
  const workspaceId = req.body?.workspaceId || req.query?.workspaceId || req.headers['x-workspace-id'];
  
  if (!workspaceId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Workspace ID is required' 
    });
  }
  req.workspaceId = workspaceId; 
  next();
};

module.exports = { protect, adminOnly, verifyWorkspace };