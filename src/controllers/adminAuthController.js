const User = require("../models/users");

// Admin login controller
exports.adminLogin = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    const normalizedPhone = phoneNumber.replace(/[\s\-\(\)]/g, "");
    const user = await User.findOne({ phoneNumber: normalizedPhone });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied: Admin privileges required" });
    }

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    req.session.userId = user._id;
    req.session.isAdmin = true;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: "Session error" });
      }

      res.status(200).json({ 
        message: "Admin login successful",
        user: {
          id: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
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