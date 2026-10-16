const mongoose = require('mongoose');

const careActivitySchema = new mongoose.Schema(
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
    activityType: {
      type: String,
      enum: [
        'watered',
        'fertilized',
        'pruned',
        'checked_health',
        'photo_uploaded',
        'mulching',
        'soil_aerated',
      ],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    xpEarned: {
      type: Number,
      default: 10,
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

module.exports = mongoose.model('CareActivity', careActivitySchema);
