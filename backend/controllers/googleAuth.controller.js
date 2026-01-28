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

  // REDIRECT TO FRONTEND
  // We pass the tokens in the URL. In a highly secure app, we might use cookies or a temporary code.
  // For this MVP, URL params are acceptable but tokens should be short-lived.
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
  res.redirect(`${clientUrl}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(JSON.stringify({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }))}`);
};
