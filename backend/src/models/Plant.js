const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a plant name'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Please specify the plant species or type'],
      trim: true,
    },
    plantingDate: {
      type: Date,
      default: Date.now,
    },
    location: {
      type: String,
      default: 'Home Garden',
      trim: true,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
    },
    height: {
      type: Number,
      default: 15, // in cm
    },
    initialHeight: {
      type: Number,
      default: 15,
    },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Needs Care', 'Thriving', 'Dormant'],
      default: 'Healthy',
    },
    growthPercentage: {
      type: Number,
      default: 15,
      min: 0,
      max: 100,
    },
    lastWatered: {
      type: Date,
      default: Date.now,
    },
    lastFertilized: {
      type: Date,
    },
    lastPruned: {
      type: Date,
    },
    totalCareCount: {
      type: Number,
      default: 1,
    },
    xpEarned: {
      type: Number,
      default: 50,
    },
    description: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Plant', plantSchema);
