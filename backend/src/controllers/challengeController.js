const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const { awardXpAndCheckGamification } = require('../utils/xpSystem');
const Notification = require('../models/Notification');

// @desc    Get all challenges with user progress
// @route   GET /api/challenges
// @access  Private
const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).sort({ createdAt: -1 });
    const userChallenges = await UserChallenge.find({ userId: req.user.id });

    const userChallengeMap = {};
    userChallenges.forEach((uc) => {
      userChallengeMap[uc.challengeId.toString()] = uc;
    });

    const combined = challenges.map((challenge) => {
      const userStatus = userChallengeMap[challenge._id.toString()];
      return {
        _id: challenge._id,
        title: challenge.title,
        description: challenge.description,
        icon: challenge.icon,
        category: challenge.category,
        targetCount: challenge.targetCount,
        rewardXP: challenge.rewardXP,
        durationDays: challenge.durationDays,
        startDate: challenge.startDate,
        endDate: challenge.endDate,
        isJoined: !!userStatus,
        progress: userStatus ? userStatus.progress : 0,
        status: userStatus ? userStatus.status : 'not_joined',
        userChallengeId: userStatus ? userStatus._id : null,
      };
    });

    res.status(200).json({
      success: true,
      count: combined.length,
      challenges: combined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join a challenge
// @route   POST /api/challenges/:id/join
// @access  Private
const joinChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    let userChallenge = await UserChallenge.findOne({
      userId: req.user.id,
      challengeId: challenge._id,
    });

    if (userChallenge) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this challenge.',
      });
    }

    userChallenge = await UserChallenge.create({
      userId: req.user.id,
      challengeId: challenge._id,
      progress: 0,
      target: challenge.targetCount,
      status: 'active',
      joinedAt: new Date(),
    });

    await Notification.create({
      userId: req.user.id,
      title: `🎯 Joined Challenge: ${challenge.title}`,
      message: `You started "${challenge.title}". Complete ${challenge.targetCount} tasks to earn +${challenge.rewardXP} XP!`,
      type: 'challenge',
      link: '/challenges',
      icon: challenge.icon || '🎯',
    });

    res.status(201).json({
      success: true,
      message: `Joined "${challenge.title}"! Give it your best 🌱`,
      userChallenge,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update progress on a challenge
// @route   PUT /api/challenges/:id/progress
// @access  Private
const updateChallengeProgress = async (req, res) => {
  try {
    const { incrementBy } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }

    let userChallenge = await UserChallenge.findOne({
      userId: req.user.id,
      challengeId: challenge._id,
    });

    if (!userChallenge) {
      // Auto-enroll if not joined yet
      userChallenge = await UserChallenge.create({
        userId: req.user.id,
        challengeId: challenge._id,
        progress: 0,
        target: challenge.targetCount,
        status: 'active',
      });
    }

    if (userChallenge.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'You have already completed this challenge!',
      });
    }

    const step = incrementBy ? Number(incrementBy) : 1;
    userChallenge.progress = Math.min(challenge.targetCount, userChallenge.progress + step);

    let gamification = null;
    let completed = false;

    if (userChallenge.progress >= challenge.targetCount) {
      userChallenge.status = 'completed';
      userChallenge.completedAt = new Date();
      completed = true;

      // Award Reward XP
      gamification = await awardXpAndCheckGamification(
        req.user.id,
        challenge.rewardXP,
        `Completed Challenge: "${challenge.title}" (+${challenge.rewardXP} XP)`
      );

      await Notification.create({
        userId: req.user.id,
        title: `🏆 Challenge Completed: ${challenge.title}!`,
        message: `Incredible achievement! You completed "${challenge.title}" and unlocked +${challenge.rewardXP} Eco XP!`,
        type: 'challenge',
        link: '/challenges',
        icon: '🎉',
      });
    }

    await userChallenge.save();

    res.status(200).json({
      success: true,
      message: completed
        ? `🎉 Challenge Completed! +${challenge.rewardXP} Eco XP rewarded!`
        : `Progress updated: ${userChallenge.progress}/${challenge.targetCount}`,
      userChallenge,
      completed,
      gamification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getChallenges,
  joinChallenge,
  updateChallengeProgress,
};
