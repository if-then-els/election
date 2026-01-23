const User = require('../src/models/users');
const { authenticateToken } = require('./jwtAuth');

const requireAdmin = async (req, res, next) => {
  try {
    // First authenticate the user
    await authenticateToken(req, res, async () => {
      // Then check if they're an admin
      const user = await User.findById(req.user._id);
      
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
      }

      req.adminUser = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during admin verification' });
  }
};

// Alternative for session-based auth
const requireAdminSession = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized: User not logged in' });
  }

  User.findById(req.session.userId)
    .then(user => {
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admin privileges required' });
      }

      req.adminUser = user;
      next();
    })
    .catch(error => {
      res.status(500).json({ message: 'Server error during admin verification' });
    });
};

module.exports = {
  requireAdmin,
  requireAdminSession
};