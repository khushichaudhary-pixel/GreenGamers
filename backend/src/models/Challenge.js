const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: '🏆',
    },
    category: {
      type: String,
      enum: ['care', 'plantation', 'growth', 'streak', 'community'],
      default: 'care',
    },
    targetCount: {
      type: Number,
      required: true,
      default: 7,
    },
    rewardXP: {
      type: Number,
      required: true,
      default: 100,
    },
    durationDays: {
      type: Number,
      default: 7,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Challenge', challengeSchema);
