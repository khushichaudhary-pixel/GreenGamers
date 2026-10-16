const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getProgressReport,
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/progress-report', getProgressReport);

module.exports = router;
