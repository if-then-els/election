const User = require("../models/users");

// Admin login controller
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied: Admin privileges required" });
    }

    // Verify password (plain text comparison for now)
    const isMatch = password === user.password;
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create session for admin
    req.session.userId = user._id;
    req.session.isAdmin = true;

    // Save session before responding
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: "Session error" });
      }

      console.log('Session created for admin:', {
        userId: req.session.userId,
        isAdmin: req.session.isAdmin,
        sessionId: req.sessionID
      });

      res.status(200).json({ 
        message: "Admin login successful",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// Admin logout controller
exports.adminLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({ message: "Server error during logout" });
  }
};