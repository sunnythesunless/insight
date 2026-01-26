const User = require('../models/User');
const Token = require('../models/Token');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/generateToken');

exports.googleAuth = async (req, res) => {
  const { email, name, googleId } = req.user;

  let user = await User.findOne({ email });

  // If user does NOT exist → create Google user
  if (!user) {
    user = await User.create({
      name,
      email,
      provider: 'google',
      providerId: googleId,
      isVerified: true, // 🔥 KEY POINT
    });
  }

  // Issue tokens SAME AS LOCAL LOGIN
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

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
};
