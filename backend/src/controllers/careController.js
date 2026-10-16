const CareActivity = require('../models/CareActivity');
const Plant = require('../models/Plant');
const { awardXpAndCheckGamification } = require('../utils/xpSystem');

const XP_MAP = {
  watered: 10,
  fertilized: 10,
  pruned: 10,
  checked_health: 5,
  photo_uploaded: 15,
  mulching: 10,
  soil_aerated: 10,
};

// @desc    Log a plant care activity
// @route   POST /api/plants/:id/care
// @access  Private
const logCareActivity = async (req, res) => {
  try {
    const { activityType, notes, date } = req.body;
    const plantId = req.params.id;

    if (!activityType) {
      return res.status(400).json({ success: false, message: 'Activity type is required.' });
    }

    const plant = await Plant.findOne({ _id: plantId, userId: req.user.id });
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    const xpEarned = XP_MAP[activityType] || 10;
    const activityDate = date ? new Date(date) : new Date();

    const careActivity = await CareActivity.create({
      plantId: plant._id,
      userId: req.user.id,
      activityType,
      date: activityDate,
      xpEarned,
      notes: notes || `Logged ${activityType.replace('_', ' ')} routine.`,
    });

    // Update specific plant timestamps
    if (activityType === 'watered') {
      plant.lastWatered = activityDate;
      if (plant.healthStatus === 'Needs Care') {
        plant.healthStatus = 'Healthy';
      }
    } else if (activityType === 'fertilized') {
      plant.lastFertilized = activityDate;
    } else if (activityType === 'pruned') {
      plant.lastPruned = activityDate;
    }

    plant.totalCareCount += 1;
    await plant.save();

    // Award Gamification XP
    const activityLabel = activityType.replace('_', ' ').toUpperCase();
    const gamification = await awardXpAndCheckGamification(
      req.user.id,
      xpEarned,
      `${activityLabel} on "${plant.name}" (+${xpEarned} XP)`,
      plant._id
    );

    res.status(201).json({
      success: true,
      message: `${activityType.replace('_', ' ')} recorded successfully! +${xpEarned} Eco XP 🌱`,
      careActivity,
      plant,
      gamification,
    });
  } catch (error) {
    console.error('Care activity error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get care activities for a plant or all user's plants
// @route   GET /api/plants/:id/care or GET /api/care
// @access  Private
const getCareActivities = async (req, res) => {
  try {
    const query = { userId: req.user.id };
    if (req.params.id) {
      query.plantId = req.params.id;
    }

    const careActivities = await CareActivity.find(query)
      .populate('plantId', 'name type image location')
      .sort({ date: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: careActivities.length,
      careActivities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  logCareActivity,
  getCareActivities,
};
