module.exports = {
  // Blacklist JWT on logout
  blacklistToken: (token) => `blacklist:${token}`,

  // Store refresh token per user
  refreshToken: (userId) => `refresh:${userId}`,

  // Rate limit by IP
  rateLimit: (identifier) => `rl:${identifier}`,

  // Cache user profile
  cacheUser: (userId) => `cache:user:${userId}`
};