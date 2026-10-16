const User = require('../models/User');
const Plant = require('../models/Plant');
const CareActivity = require('../models/CareActivity');
const GrowthUpdate = require('../models/GrowthUpdate');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Seedling', minXp: 0, maxXp: 199 },
  { level: 2, title: 'Green Starter', minXp: 200, maxXp: 499 },
  { level: 3, title: 'Plant Protector', minXp: 500, maxXp: 899 },
  { level: 4, title: 'Eco Warrior', minXp: 900, maxXp: 1399 },
  { level: 5, title: 'Eco Steward', minXp: 1400, maxXp: 1999 },
  { level: 6, title: 'Green Champion', minXp: 2000, maxXp: 2999 },
  { level: 7, title: 'Earth Guardian', minXp: 3000, maxXp: 999999 },
];

const calculateLevel = (xp) => {
  const currentThreshold =
    LEVEL_THRESHOLDS.find((t) => xp >= t.minXp && xp <= t.maxXp) ||
    LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];

  const currentLevel = currentThreshold.level;
  const currentTitle = currentThreshold.title;
  const levelMin = currentThreshold.minXp;
  const levelMax = currentThreshold.maxXp === 999999 ? xp + 500 : currentThreshold.maxXp + 1;

  const xpIntoLevel = xp - levelMin;
  const xpNeededForLevel = levelMax - levelMin;
  const progressPercent = Math.min(100, Math.round((xpIntoLevel / xpNeededForLevel) * 100));

  return {
    level: currentLevel,
    levelTitle: currentTitle,
    currentXp: xp,
    minXp: levelMin,
    maxXp: levelMax,
    progressPercent,
    xpToNextLevel: Math.max(0, levelMax - xp),
  };
};

const awardXpAndCheckGamification = async (userId, xpGain, reason = '', plantId = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const oldLevel = user.level;
    user.xp += xpGain;

    const levelInfo = calculateLevel(user.xp);
    user.level = levelInfo.level;
    user.levelTitle = levelInfo.levelTitle;

    // Check Streak
    const now = new Date();
    const lastActive = user.lastActiveDate ? new Date(user.lastActiveDate) : null;
    if (lastActive) {
      const diffTime = Math.abs(now - lastActive);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.lastActiveDate = now;

    // Award Plant XP if plantId provided
    if (plantId) {
      await Plant.findByIdAndUpdate(plantId, {
        $inc: { xpEarned: xpGain, totalCareCount: 1 },
      });
    }

    const newBadgesEarned = [];

    // Check Badges
    const allBadges = await Badge.find();
    const userPlantCount = await Plant.countDocuments({ userId });
    const userWateringCount = await CareActivity.countDocuments({
      userId,
      activityType: 'watered',
    });
    const userGrowthPhotos = await GrowthUpdate.countDocuments({
      userId,
      image: { $exists: true, $ne: '' },
    });
    const userTotalCare = await CareActivity.countDocuments({ userId });

    const distinctSpecies = await Plant.distinct('type', { userId });
    const speciesCount = distinctSpecies.length;

    for (const badge of allBadges) {
      const alreadyEarned = user.badges.some((b) => b.slug === badge.slug);
      if (alreadyEarned) continue;

      let qualifies = false;
      if (badge.requirementType === 'plants_count' && userPlantCount >= badge.requirementValue) {
        qualifies = true;
      } else if (badge.requirementType === 'watering_count' && userWateringCount >= badge.requirementValue) {
        qualifies = true;
      } else if (badge.requirementType === 'growth_photos' && userGrowthPhotos >= badge.requirementValue) {
        qualifies = true;
      } else if (badge.requirementType === 'streak_days' && user.streak >= badge.requirementValue) {
        qualifies = true;
      } else if (badge.requirementType === 'xp_level' && user.level >= badge.requirementValue) {
        qualifies = true;
      } else if (badge.requirementType === 'species_count' && speciesCount >= badge.requirementValue) {
        qualifies = true;
      } else if (badge.requirementType === 'total_care' && userTotalCare >= badge.requirementValue) {
        qualifies = true;
      }

      if (qualifies) {
        user.badges.push({
          slug: badge.slug,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          earnedAt: new Date(),
        });
        newBadgesEarned.push(badge);

        // Create Badge Notification
        await Notification.create({
          userId,
          title: `🏆 Badge Unlocked: ${badge.name}!`,
          message: `Congratulations! You unlocked the "${badge.name}" badge. ${badge.description}`,
          type: 'badge',
          link: '/achievements',
          icon: badge.icon,
        });
      }
    }

    // Check Level Up Notification
    let leveledUp = false;
    if (user.level > oldLevel) {
      leveledUp = true;
      await Notification.create({
        userId,
        title: `⚡ Level Up: ${user.levelTitle} (Level ${user.level})!`,
        message: `Outstanding! You have advanced to Level ${user.level} – ${user.levelTitle}! Keep growing.`,
        type: 'xp',
        link: '/profile',
        icon: '🌟',
      });
    }

    // Notification for XP Gain
    if (xpGain > 0) {
      await Notification.create({
        userId,
        title: `+${xpGain} Eco XP Earned!`,
        message: reason || `You earned ${xpGain} XP for your plantation care activity.`,
        type: 'xp',
        link: '/dashboard',
        icon: '🌱',
      });
    }

    await user.save();

    return {
      user,
      xpGain,
      levelInfo,
      leveledUp,
      newBadgesEarned,
    };
  } catch (error) {
    console.error('Gamification evaluation error:', error);
    return null;
  }
};

module.exports = {
  LEVEL_THRESHOLDS,
  calculateLevel,
  awardXpAndCheckGamification,
};
