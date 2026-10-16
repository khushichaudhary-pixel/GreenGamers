const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional auth middleware
const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'greengamers_super_secure_jwt_secret_key_2026'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {
      // Ignore invalid token in optional auth
    }
  }
  next();
};

router.get('/', optionalAuth, getLeaderboard);

module.exports = router;
