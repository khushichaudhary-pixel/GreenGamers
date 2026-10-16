const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    xp: {
      type: Number,
      default: 50, // Welcome bonus
    },
    level: {
      type: Number,
      default: 1,
    },
    levelTitle: {
      type: String,
      default: 'Seedling',
    },
    streak: {
      type: Number,
      default: 1,
    },
    lastActiveDate: {
      type: Date,
      default: Date.now,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    college: {
      type: String,
      default: 'Green Tech Institute',
    },
    city: {
      type: String,
      default: 'Bangalore',
    },
    bio: {
      type: String,
      default: 'Passionate green enthusiast & urban planter.',
    },
    badges: [
      {
        slug: String,
        name: String,
        description: String,
        icon: String,
        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    settings: {
      emailNotifications: { type: Boolean, default: true },
      careReminders: { type: Boolean, default: true },
      challengeAlerts: { type: Boolean, default: true },
      communityUpdates: { type: Boolean, default: true },
      measurementUnit: { type: String, enum: ['cm', 'inch'], default: 'cm' },
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
