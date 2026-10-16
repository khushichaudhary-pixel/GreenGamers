const User = require('../models/User');
const Plant = require('../models/Plant');
const CareActivity = require('../models/CareActivity');
const Challenge = require('../models/Challenge');
const CommunityPost = require('../models/CommunityPost');

// @desc    Get admin platform analytics overview
// @route   GET /api/admin/overview
// @access  Private (Admin Only)
const getAdminOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPlants,
      totalCareActivities,
      totalChallenges,
      totalCommunityPosts,
    ] = await Promise.all([
      User.countDocuments(),
      Plant.countDocuments(),
      CareActivity.countDocuments(),
      Challenge.countDocuments(),
      CommunityPost.countDocuments(),
    ]);

    // Active users in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      lastActiveDate: { $gte: sevenDaysAgo },
    });

    const recentUsers = await User.find()
      .select('name email role xp level college city createdAt')
      .sort({ createdAt: -1 })
      .limit(8);

    const recentPlants = await Plant.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalPlants,
        totalCareActivities,
        totalChallenges,
        totalCommunityPosts,
        activeUsers,
        estimatedTotalCO2SavedKg: (totalPlants * 18.5).toFixed(1),
      },
      recentUsers,
      recentPlants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users (with pagination / search)
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role / status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin Only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all plants across the platform
// @route   GET /api/admin/plants
// @access  Private (Admin Only)
const getAllPlants = async (req, res) => {
  try {
    const plants = await Plant.find()
      .populate('userId', 'name email college')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: plants.length,
      plants,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new challenge
// @route   POST /api/admin/challenges
// @access  Private (Admin Only)
const createChallenge = async (req, res) => {
  try {
    const { title, description, icon, category, targetCount, rewardXP, durationDays } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const challenge = await Challenge.create({
      title,
      description,
      icon: icon || '🏆',
      category: category || 'care',
      targetCount: Number(targetCount) || 7,
      rewardXP: Number(rewardXP) || 100,
      durationDays: Number(durationDays) || 14,
      startDate: new Date(),
      endDate: new Date(Date.now() + (Number(durationDays) || 14) * 24 * 60 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: 'Challenge created successfully!',
      challenge,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a challenge
// @route   DELETE /api/admin/challenges/:id
// @access  Private (Admin Only)
const deleteChallenge = async (req, res) => {
  try {
    await Challenge.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Challenge deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a community post (moderation)
// @route   DELETE /api/admin/posts/:id
// @access  Private (Admin Only)
const deleteCommunityPost = async (req, res) => {
  try {
    await CommunityPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Post removed by administrator.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminOverview,
  getAllUsers,
  updateUserRole,
  getAllPlants,
  createChallenge,
  deleteChallenge,
  deleteCommunityPost,
};
