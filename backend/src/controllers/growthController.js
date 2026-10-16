const GrowthUpdate = require('../models/GrowthUpdate');
const Plant = require('../models/Plant');
const { awardXpAndCheckGamification } = require('../utils/xpSystem');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Add a new growth measurement/photo update
// @route   POST /api/plants/:id/growth
// @access  Private
const addGrowthUpdate = async (req, res) => {
  try {
    const { height, growthPercentage, healthStatus, notes, date, image: imageUrl } = req.body;
    const plantId = req.params.id;

    const plant = await Plant.findOne({ _id: plantId, userId: req.user.id });
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    let finalImageUrl = imageUrl || '';

    if (req.file) {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'green_gamers'
      ) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'green_gamers_growth',
          });
          finalImageUrl = result.secure_url;
          fs.unlinkSync(req.file.path);
        } catch (uploadErr) {
          finalImageUrl = `/uploads/${req.file.filename}`;
        }
      } else {
        finalImageUrl = `/uploads/${req.file.filename}`;
      }
    }

    const newHeight = Number(height) || plant.height;
    const newGrowthPercent = Number(growthPercentage) || plant.growthPercentage;
    const newHealth = healthStatus || plant.healthStatus;

    // Calculate XP: 20 XP for growth update + 15 XP if photo provided
    const xpGain = finalImageUrl ? 35 : 20;

    const growthUpdate = await GrowthUpdate.create({
      plantId: plant._id,
      userId: req.user.id,
      date: date || Date.now(),
      height: newHeight,
      growthPercentage: newGrowthPercent,
      healthStatus: newHealth,
      image: finalImageUrl || plant.image,
      notes: notes || 'Periodic growth observation.',
      xpEarned: xpGain,
    });

    // Update Plant status
    plant.height = newHeight;
    plant.growthPercentage = newGrowthPercent;
    plant.healthStatus = newHealth;
    if (finalImageUrl) {
      plant.image = finalImageUrl;
    }
    await plant.save();

    // Award Gamification XP
    const gamification = await awardXpAndCheckGamification(
      req.user.id,
      xpGain,
      `Logged growth update for "${plant.name}" (+${xpGain} XP)`,
      plant._id
    );

    res.status(201).json({
      success: true,
      message: `Growth update recorded! +${xpGain} Eco XP earned 🌿`,
      growthUpdate,
      gamification,
      plant,
    });
  } catch (error) {
    console.error('Error adding growth update:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get growth history for a plant
// @route   GET /api/plants/:id/growth
// @access  Private
const getGrowthHistory = async (req, res) => {
  try {
    const growthUpdates = await GrowthUpdate.find({
      plantId: req.params.id,
      userId: req.user.id,
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: growthUpdates.length,
      growthUpdates,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addGrowthUpdate,
  getGrowthHistory,
};
