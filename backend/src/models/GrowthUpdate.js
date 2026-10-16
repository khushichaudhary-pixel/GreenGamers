const mongoose = require('mongoose');

const growthUpdateSchema = new mongoose.Schema(
  {
    plantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Plant',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    height: {
      type: Number,
      required: true,
    },
    growthPercentage: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    healthStatus: {
      type: String,
      enum: ['Healthy', 'Needs Care', 'Thriving', 'Dormant'],
      default: 'Healthy',
    },
    image: {
      type: String,
    },
    notes: {
      type: String,
      trim: true,
    },
    xpEarned: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('GrowthUpdate', growthUpdateSchema);
