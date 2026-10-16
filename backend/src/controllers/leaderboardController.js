const User = require('../models/User');
const Plant = require('../models/Plant');
const CareActivity = require('../models/CareActivity');

// @desc    Get ranked leaderboard
// @route   GET /api/leaderboard
// @access  Public / Private
const getLeaderboard = async (req, res) => {
  try {
    const { timeframe, filterType, filterValue } = req.query;

    let query = {};
    if (filterType === 'college' && filterValue) {
      query.college = { $regex: filterValue, $options: 'i' };
    } else if (filterType === 'city' && filterValue) {
      query.city = { $regex: filterValue, $options: 'i' };
    }

    const users = await User.find(query)
      .select('name email profileImage xp level levelTitle streak college city createdAt')
      .sort({ xp: -1 })
      .limit(100);

    // Populate plant counts and care activity counts for leaderboard display
    const userIds = users.map((u) => u._id);

    const [plantCounts, careCounts] = await Promise.all([
      Plant.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
      ]),
      CareActivity.aggregate([
        { $match: { userId: { $in: userIds } } },
        { $group: { _id: '$userId', count: { $sum: 1 } } },
      ]),
    ]);

    const plantCountMap = {};
    plantCounts.forEach((p) => {
      plantCountMap[p._id.toString()] = p.count;
    });

    const careCountMap = {};
    careCounts.forEach((c) => {
      careCountMap[c._id.toString()] = c.count;
    });

    const leaderboard = users.map((u, index) => ({
      rank: index + 1,
      _id: u._id,
      name: u.name,
      profileImage: u.profileImage,
      xp: u.xp,
      level: u.level,
      levelTitle: u.levelTitle,
      streak: u.streak,
      college: u.college,
      city: u.city,
      plantsCount: plantCountMap[u._id.toString()] || 0,
      careActivitiesCount: careCountMap[u._id.toString()] || 0,
    }));

    // Find current user's ranking if logged in
    let currentUserRank = null;
    if (req.user) {
      const foundRank = leaderboard.find((item) => item._id.toString() === req.user.id.toString());
      if (foundRank) {
        currentUserRank = foundRank;
      }
    }

    res.status(200).json({
      success: true,
      count: leaderboard.length,
      leaderboard,
      currentUserRank,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getLeaderboard };
