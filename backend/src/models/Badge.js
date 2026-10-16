const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['plantation', 'care', 'growth', 'streak', 'level', 'special'],
      default: 'plantation',
    },
    requirementType: {
      type: String,
      enum: [
        'plants_count',
        'watering_count',
        'growth_photos',
        'streak_days',
        'xp_level',
        'species_count',
        'total_care',
      ],
      required: true,
    },
    requirementValue: {
      type: Number,
      required: true,
    },
    xpReward: {
      type: Number,
      default: 50,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Badge', badgeSchema);
