const jwt = require('jsonwebtoken');

const tokenUtils = {
  generateToken: (userId, expiresIn = '24h') => {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET,
      { expiresIn }
    );
  },

  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  decodeToken: (token) => {
    return jwt.decode(token);
  },

  isTokenExpired: (token) => {
    try {
      const decoded = jwt.decode(token);
      if (!decoded || !decoded.exp) return true;
      return Date.now() >= decoded.exp * 1000;
    } catch (error) {
      return true;
    }
  }
};

module.exports = tokenUtils;