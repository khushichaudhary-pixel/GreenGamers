const express = require('express');
const router = express.Router();
const {
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  getAllPlants,
  createChallenge,
  deleteChallenge,
  deleteCommunityPost,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Protect all admin routes with both JWT and admin role check
router.use(protect, adminOnly);

router.get('/overview', getAdminOverview);
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserRole);
router.get('/plants', getAllPlants);
router.post('/challenges', createChallenge);
router.delete('/challenges/:id', deleteChallenge);
router.delete('/posts/:id', deleteCommunityPost);

module.exports = router;
