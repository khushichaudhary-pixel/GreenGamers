const express = require('express');
const router = express.Router();
const {
  getChallenges,
  joinChallenge,
  updateChallengeProgress,
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getChallenges);
router.post('/:id/join', joinChallenge);
router.put('/:id/progress', updateChallengeProgress);

module.exports = router;
