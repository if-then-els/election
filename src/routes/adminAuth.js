const express = require('express');
const router = express.Router();
const { adminLogin, adminLogout } = require('../controllers/adminAuthController');

// Admin login route
router.post('/login', adminLogin);

// Admin logout route  
router.post('/logout', adminLogout);

module.exports = router;