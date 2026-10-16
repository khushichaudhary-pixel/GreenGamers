const express = require('express');
const router = express.Router();
const {
  getFeed,
  createPost,
  likePost,
  addComment,
  sharePost,
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'greengamers_super_secure_jwt_secret_key_2026'
      );
      req.user = await User.findById(decoded.id).select('-password');
    } catch (err) {}
  }
  next();
};

router.get('/', optionalAuth, getFeed);
router.post('/', protect, upload.single('image'), createPost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.post('/:id/share', protect, sharePost);

module.exports = router;
