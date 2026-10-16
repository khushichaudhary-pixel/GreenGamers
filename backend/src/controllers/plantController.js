const Plant = require('../models/Plant');
const GrowthUpdate = require('../models/GrowthUpdate');
const CareActivity = require('../models/CareActivity');
const { awardXpAndCheckGamification } = require('../utils/xpSystem');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get all plants for logged in user
// @route   GET /api/plants
// @access  Private
const getPlants = async (req, res) => {
  try {
    const { filter, search, sort } = req.query;
    let query = { userId: req.user.id };

    if (filter && filter !== 'All') {
      if (filter === 'Healthy') query.healthStatus = 'Healthy';
      else if (filter === 'Needs Care') query.healthStatus = 'Needs Care';
      else if (filter === 'Thriving') query.healthStatus = 'Thriving';
      else if (filter === 'Dormant') query.healthStatus = 'Dormant';
      else if (filter === 'Growing') query.growthPercentage = { $gt: 0, $lt: 90 };
      else if (filter === 'Completed') query.growthPercentage = { $gte: 90 };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    else if (sort === 'growth_high') sortOption = { growthPercentage: -1 };
    else if (sort === 'xp_high') sortOption = { xpEarned: -1 };
    else if (sort === 'name') sortOption = { name: 1 };

    const plants = await Plant.find(query).sort(sortOption);

    res.status(200).json({
      success: true,
      count: plants.length,
      plants,
    });
  } catch (error) {
    console.error('Error fetching plants:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single plant details with history
// @route   GET /api/plants/:id
// @access  Private
const getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found or unauthorized access.',
      });
    }

    const growthUpdates = await GrowthUpdate.find({ plantId: plant._id }).sort({ date: -1 });
    const careActivities = await CareActivity.find({ plantId: plant._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      plant,
      growthUpdates,
      careActivities,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register a new plant
// @route   POST /api/plants
// @access  Private
const createPlant = async (req, res) => {
  try {
    const { name, type, plantingDate, location, height, description, notes, image: imageUrl } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Plant name and type/species are required.',
      });
    }

    let finalImageUrl = imageUrl || 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80';

    // Handle file upload if present
    if (req.file) {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'green_gamers'
      ) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'green_gamers_plants',
          });
          finalImageUrl = result.secure_url;
          fs.unlinkSync(req.file.path); // remove temp local file
        } catch (uploadErr) {
          console.warn('Cloudinary upload fallback to local path:', uploadErr.message);
          finalImageUrl = `/uploads/${req.file.filename}`;
        }
      } else {
        finalImageUrl = `/uploads/${req.file.filename}`;
      }
    }

    const plantHeight = Number(height) || 15;

    const plant = await Plant.create({
      userId: req.user.id,
      name,
      type,
      plantingDate: plantingDate || Date.now(),
      location: location || 'Home Garden',
      height: plantHeight,
      initialHeight: plantHeight,
      image: finalImageUrl,
      healthStatus: 'Healthy',
      growthPercentage: 15,
      lastWatered: new Date(),
      totalCareCount: 1,
      xpEarned: 50,
      description,
      notes,
    });

    // Create initial growth update entry
    await GrowthUpdate.create({
      plantId: plant._id,
      userId: req.user.id,
      date: plant.plantingDate,
      height: plantHeight,
      growthPercentage: 15,
      healthStatus: 'Healthy',
      image: finalImageUrl,
      notes: 'Initial plant registration and sapling placement.',
      xpEarned: 50,
    });

    // Create initial care log
    await CareActivity.create({
      plantId: plant._id,
      userId: req.user.id,
      activityType: 'watered',
      date: new Date(),
      xpEarned: 10,
      notes: 'Initial planting hydration.',
    });

    // Award +50 XP for plant registration
    const gamification = await awardXpAndCheckGamification(
      req.user.id,
      50,
      `Registered new plant: "${plant.name}" (+50 XP)`,
      plant._id
    );

    res.status(201).json({
      success: true,
      message: 'Plant registered successfully! +50 Eco XP awarded 🌱',
      plant,
      gamification,
    });
  } catch (error) {
    console.error('Create plant error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update plant details
// @route   PUT /api/plants/:id
// @access  Private
const updatePlant = async (req, res) => {
  try {
    const { name, type, location, height, healthStatus, growthPercentage, description, notes, image } = req.body;

    let plant = await Plant.findOne({ _id: req.params.id, userId: req.user.id });
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    if (name) plant.name = name;
    if (type) plant.type = type;
    if (location) plant.location = location;
    if (height !== undefined) plant.height = Number(height);
    if (healthStatus) plant.healthStatus = healthStatus;
    if (growthPercentage !== undefined) plant.growthPercentage = Number(growthPercentage);
    if (description !== undefined) plant.description = description;
    if (notes !== undefined) plant.notes = notes;
    if (image) plant.image = image;

    if (req.file) {
      plant.image = `/uploads/${req.file.filename}`;
    }

    await plant.save();

    res.status(200).json({
      success: true,
      message: 'Plant details updated successfully!',
      plant,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a plant
// @route   DELETE /api/plants/:id
// @access  Private
const deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    await GrowthUpdate.deleteMany({ plantId: plant._id });
    await CareActivity.deleteMany({ plantId: plant._id });

    res.status(200).json({
      success: true,
      message: 'Plant and its history removed.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
};
