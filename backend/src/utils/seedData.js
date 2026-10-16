const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Plant = require('../models/Plant');
const GrowthUpdate = require('../models/GrowthUpdate');
const CareActivity = require('../models/CareActivity');
const Challenge = require('../models/Challenge');
const UserChallenge = require('../models/UserChallenge');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');
const CommunityPost = require('../models/CommunityPost');

const seedBadges = [
  {
    slug: 'first_plant',
    name: 'First Plant',
    description: 'Awarded for registering your very first plant on Green Gamers.',
    icon: '🌱',
    category: 'plantation',
    requirementType: 'plants_count',
    requirementValue: 1,
    xpReward: 50,
  },
  {
    slug: 'water_keeper',
    name: 'Water Keeper',
    description: 'Awarded after completing 10 watering care activities.',
    icon: '💧',
    category: 'care',
    requirementType: 'watering_count',
    requirementValue: 10,
    xpReward: 75,
  },
  {
    slug: 'growth_tracker',
    name: 'Growth Tracker',
    description: 'Awarded after submitting 5 verified growth photo updates.',
    icon: '📸',
    category: 'growth',
    requirementType: 'growth_photos',
    requirementValue: 5,
    xpReward: 100,
  },
  {
    slug: 'green_streak',
    name: 'Green Streak',
    description: 'Awarded for maintaining 7 consecutive days of plant care.',
    icon: '🔥',
    category: 'streak',
    requirementType: 'streak_days',
    requirementValue: 7,
    xpReward: 150,
  },
  {
    slug: 'plant_protector',
    name: 'Plant Protector',
    description: 'Awarded for completing 30 total plant care maintenance sessions.',
    icon: '🌳',
    category: 'care',
    requirementType: 'total_care',
    requirementValue: 30,
    xpReward: 200,
  },
  {
    slug: 'green_champion',
    name: 'Green Champion',
    description: 'Awarded for reaching Level 5 (Eco Steward) or higher.',
    icon: '🏆',
    category: 'level',
    requirementType: 'xp_level',
    requirementValue: 5,
    xpReward: 300,
  },
  {
    slug: 'biodiversity_advocate',
    name: 'Biodiversity Advocate',
    description: 'Awarded for planting and nurturing at least 4 distinct plant species.',
    icon: '🌿',
    category: 'plantation',
    requirementType: 'species_count',
    requirementValue: 4,
    xpReward: 150,
  },
  {
    slug: 'carbon_neutralizer',
    name: 'Carbon Neutralizer',
    description: 'Awarded for reaching 10 registered growing plants.',
    icon: '🌍',
    category: 'special',
    requirementType: 'plants_count',
    requirementValue: 10,
    xpReward: 250,
  },
];

const seedChallenges = [
  {
    title: '30-Day Plant Care Marathon',
    description: 'Nurture and log care activities across 30 days to build a permanent sustainability habit.',
    icon: '🌟',
    category: 'care',
    targetCount: 30,
    rewardXP: 300,
    durationDays: 30,
  },
  {
    title: '7-Day Green Care Routine',
    description: 'Complete daily care checks on your registered plants for 7 consecutive days.',
    icon: '🔥',
    category: 'streak',
    targetCount: 7,
    rewardXP: 150,
    durationDays: 7,
  },
  {
    title: 'Plant 3 Trees Campus Drive',
    description: 'Register and plant 3 new saplings on campus or at home to support SDG 15: Life on Land.',
    icon: '🌳',
    category: 'plantation',
    targetCount: 3,
    rewardXP: 250,
    durationDays: 14,
  },
  {
    title: 'Upload 5 Growth Updates',
    description: 'Measure heights and record visual progression updates for any of your plants.',
    icon: '📸',
    category: 'growth',
    targetCount: 5,
    rewardXP: 100,
    durationDays: 14,
  },
  {
    title: 'Water Your Plants for 14 Days',
    description: 'Keep your flora hydrated and thriving with consistent watering schedules.',
    icon: '💧',
    category: 'care',
    targetCount: 14,
    rewardXP: 200,
    durationDays: 14,
  },
  {
    title: 'Monsoon Green Surge',
    description: 'Plant native rain-hardy saplings and record soil nourishment activities.',
    icon: '🌧️',
    category: 'care',
    targetCount: 10,
    rewardXP: 180,
    durationDays: 20,
  },
];

const seedData = async () => {
  try {
    console.log('🌱 Starting Green Gamers database seeding...');

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Plant.deleteMany({}),
      GrowthUpdate.deleteMany({}),
      CareActivity.deleteMany({}),
      Challenge.deleteMany({}),
      UserChallenge.deleteMany({}),
      Badge.deleteMany({}),
      Notification.deleteMany({}),
      CommunityPost.deleteMany({}),
    ]);

    console.log('🧹 Cleared existing data.');

    // 1. Insert Badges
    const createdBadges = await Badge.insertMany(seedBadges);
    console.log(`✅ Seeded ${createdBadges.length} Badges.`);

    // 2. Insert Challenges
    const createdChallenges = await Challenge.insertMany(seedChallenges);
    console.log(`✅ Seeded ${createdChallenges.length} Challenges.`);

    // 3. Create Users
    const passwordHash = await bcrypt.hash('user123', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    const userAarav = new User({
      name: 'Aarav Patel',
      email: 'user@greengamers.org',
      password: 'user123', // Will be hashed via pre-save hook
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      xp: 1680,
      level: 5,
      levelTitle: 'Eco Steward',
      streak: 18,
      role: 'user',
      college: 'Indian Institute of Technology (IIT) Bombay',
      city: 'Mumbai',
      bio: 'Environmental engineering student building a self-sustaining urban rooftop garden and mentoring campus plantation drives.',
      badges: [
        {
          slug: 'first_plant',
          name: 'First Plant',
          description: 'Awarded for registering your very first plant on Green Gamers.',
          icon: '🌱',
          earnedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        },
        {
          slug: 'water_keeper',
          name: 'Water Keeper',
          description: 'Awarded after completing 10 watering care activities.',
          icon: '💧',
          earnedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
        {
          slug: 'growth_tracker',
          name: 'Growth Tracker',
          description: 'Awarded after submitting 5 verified growth photo updates.',
          icon: '📸',
          earnedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        },
        {
          slug: 'green_streak',
          name: 'Green Streak',
          description: 'Awarded for maintaining 7 consecutive days of plant care.',
          icon: '🔥',
          earnedAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        },
        {
          slug: 'plant_protector',
          name: 'Plant Protector',
          description: 'Awarded for completing 30 total plant care maintenance sessions.',
          icon: '🌳',
          earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        },
      ],
    });
    await userAarav.save();

    const userAdmin = new User({
      name: 'Dr. Ananya Sharma',
      email: 'admin@greengamers.org',
      password: 'admin123',
      profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
      xp: 3450,
      level: 7,
      levelTitle: 'Earth Guardian',
      streak: 42,
      role: 'admin',
      college: 'Faculty of Forestry & Environmental Sciences',
      city: 'Bangalore',
      bio: 'Faculty lead & sustainability coordinator overseeing community reforestation and academic greening initiatives.',
      badges: seedBadges.map((b) => ({
        slug: b.slug,
        name: b.name,
        description: b.description,
        icon: b.icon,
        earnedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
      })),
    });
    await userAdmin.save();

    // Additional leaderboard competitor users
    const competitors = [
      {
        name: 'Kavya Reddy',
        email: 'kavya@greengamers.org',
        password: 'user123',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
        xp: 2450,
        level: 6,
        levelTitle: 'Green Champion',
        streak: 26,
        college: 'BITS Pilani',
        city: 'Hyderabad',
      },
      {
        name: 'Rohan Verma',
        email: 'rohan@greengamers.org',
        password: 'user123',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        xp: 1420,
        level: 5,
        levelTitle: 'Eco Steward',
        streak: 14,
        college: 'Delhi Technological University (DTU)',
        city: 'Delhi',
      },
      {
        name: 'Sneha Mukherjee',
        email: 'sneha@greengamers.org',
        password: 'user123',
        profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        xp: 980,
        level: 4,
        levelTitle: 'Eco Warrior',
        streak: 9,
        college: 'Jadavpur University',
        city: 'Kolkata',
      },
      {
        name: 'Vikram Nair',
        email: 'vikram@greengamers.org',
        password: 'user123',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        xp: 620,
        level: 3,
        levelTitle: 'Plant Protector',
        streak: 5,
        college: 'NIT Calicut',
        city: 'Kochi',
      },
    ];

    const createdCompetitors = [];
    for (const comp of competitors) {
      const u = new User(comp);
      await u.save();
      createdCompetitors.push(u);
    }
    console.log(`✅ Seeded ${createdCompetitors.length + 2} Users.`);

    // 4. Seed Plants for Aarav Patel
    const aaravPlantsData = [
      {
        userId: userAarav._id,
        name: 'Holy Basil (Krishna Tulsi)',
        type: 'Medicinal / Herb (Ocimum tenuiflorum)',
        plantingDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        location: 'Balcony East Corner, Flat 402',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
        height: 38,
        initialHeight: 12,
        healthStatus: 'Thriving',
        growthPercentage: 78,
        lastWatered: new Date(Date.now() - 4 * 60 * 60 * 1000),
        lastFertilized: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        totalCareCount: 16,
        xpEarned: 240,
        description: 'Sacred Tulsi plant with dark purple leaves, placed for optimal morning sunlight.',
        notes: 'Water once every 2 days; enjoys organic compost.',
      },
      {
        userId: userAarav._id,
        name: 'Indian Lilac (Neem Sapling)',
        type: 'Tree (Azadirachta indica)',
        plantingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        location: 'Campus Botanical Zone, Plot B',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        height: 65,
        initialHeight: 25,
        healthStatus: 'Healthy',
        growthPercentage: 62,
        lastWatered: new Date(Date.now() - 28 * 60 * 60 * 1000),
        lastFertilized: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        totalCareCount: 12,
        xpEarned: 190,
        description: 'Hardy native tree sapling planted during the World Environment Day university drive.',
        notes: 'Needs deep watering twice a week during dry spells.',
      },
      {
        userId: userAarav._id,
        name: 'Sacred Peepal Sapling',
        type: 'Tree (Ficus religiosa)',
        plantingDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        location: 'Community Park Perimeter',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
        height: 52,
        initialHeight: 20,
        healthStatus: 'Healthy',
        growthPercentage: 55,
        lastWatered: new Date(Date.now() - 10 * 60 * 60 * 1000),
        totalCareCount: 9,
        xpEarned: 150,
        description: 'High oxygen-generating keystone species.',
      },
      {
        userId: userAarav._id,
        name: 'Golden Pothos (Money Plant)',
        type: 'Indoor Climber (Epipremnum aureum)',
        plantingDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        location: 'Study Desk Terracotta Pot',
        image: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?w=600&auto=format&fit=crop&q=80',
        height: 44,
        initialHeight: 18,
        healthStatus: 'Thriving',
        growthPercentage: 70,
        lastWatered: new Date(Date.now() - 8 * 60 * 60 * 1000),
        totalCareCount: 11,
        xpEarned: 170,
        description: 'Air-purifying trailing vine on moss pole.',
      },
      {
        userId: userAarav._id,
        name: 'Desi Gulab (Fragrant Rose)',
        type: 'Flowering Shrub (Rosa indica)',
        plantingDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        location: 'Terrace Planter Bed #3',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
        height: 32,
        initialHeight: 15,
        healthStatus: 'Needs Care',
        growthPercentage: 40,
        lastWatered: new Date(Date.now() - 48 * 60 * 60 * 1000),
        totalCareCount: 6,
        xpEarned: 110,
        description: 'Requires pruning and mild organic neem spray against aphids.',
      },
      {
        userId: userAarav._id,
        name: 'Sansevieria (Snake Plant)',
        type: 'Air Purifier (Dracaena trifasciata)',
        plantingDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        location: 'Living Room Window Sill',
        image: 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=600&auto=format&fit=crop&q=80',
        height: 28,
        initialHeight: 16,
        healthStatus: 'Healthy',
        growthPercentage: 35,
        lastWatered: new Date(Date.now() - 72 * 60 * 60 * 1000),
        totalCareCount: 4,
        xpEarned: 90,
        description: 'Low-light tolerant drought-hardy succulent.',
      },
      {
        userId: userAarav._id,
        name: 'Alphonso Mango Grafted Sapling',
        type: 'Fruit Tree (Mangifera indica)',
        plantingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        location: 'Campus Agriculture Patch',
        image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&auto=format&fit=crop&q=80',
        height: 58,
        initialHeight: 35,
        healthStatus: 'Healthy',
        growthPercentage: 48,
        lastWatered: new Date(Date.now() - 14 * 60 * 60 * 1000),
        totalCareCount: 7,
        xpEarned: 130,
        description: 'Premium mango variety grafted for fruit bearing in 3 years.',
      },
      {
        userId: userAarav._id,
        name: 'Aloe Vera Medicinal',
        type: 'Succulent (Aloe barbadensis miller)',
        plantingDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
        location: 'Balcony Herb Shelf',
        image: 'https://images.unsplash.com/photo-1567689265664-1c48de61db0b?w=600&auto=format&fit=crop&q=80',
        height: 22,
        initialHeight: 10,
        healthStatus: 'Thriving',
        growthPercentage: 65,
        lastWatered: new Date(Date.now() - 36 * 60 * 60 * 1000),
        totalCareCount: 8,
        xpEarned: 130,
        description: 'Healing succulent with thick gel-filled leaves.',
      },
    ];

    const createdPlants = await Plant.insertMany(aaravPlantsData);
    console.log(`✅ Seeded ${createdPlants.length} Plants for primary user.`);

    // 5. Seed Growth Updates for Tulsi and Neem
    const tulsi = createdPlants[0];
    const neem = createdPlants[1];

    const growthUpdatesData = [
      {
        plantId: tulsi._id,
        userId: userAarav._id,
        date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
        height: 16,
        growthPercentage: 15,
        healthStatus: 'Healthy',
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80',
        notes: 'Initial sapling settled into terracotta pot with nutrient-rich compost mix.',
        xpEarned: 20,
      },
      {
        plantId: tulsi._id,
        userId: userAarav._id,
        date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        height: 22,
        growthPercentage: 35,
        healthStatus: 'Healthy',
        image: 'https://images.unsplash.com/photo-1545241047-6083a3684587?w=600&auto=format&fit=crop&q=80',
        notes: 'First set of lateral branches emerging nicely after top pinching.',
        xpEarned: 20,
      },
      {
        plantId: tulsi._id,
        userId: userAarav._id,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        height: 30,
        growthPercentage: 55,
        healthStatus: 'Thriving',
        image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?w=600&auto=format&fit=crop&q=80',
        notes: 'Aromatic fragrance intense; flowers beginning to form at the crown.',
        xpEarned: 20,
      },
      {
        plantId: tulsi._id,
        userId: userAarav._id,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        height: 38,
        growthPercentage: 78,
        healthStatus: 'Thriving',
        image: 'https://images.unsplash.com/photo-1512428813834-c702c7702b78?w=600&auto=format&fit=crop&q=80',
        notes: 'Bushy foliage and lush dark green texture. Thriving in summer light.',
        xpEarned: 20,
      },
      // Neem updates
      {
        plantId: neem._id,
        userId: userAarav._id,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        height: 30,
        growthPercentage: 20,
        healthStatus: 'Healthy',
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&auto=format&fit=crop&q=80',
        notes: 'Planted on campus ground with vermicompost bedding.',
        xpEarned: 20,
      },
      {
        plantId: neem._id,
        userId: userAarav._id,
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        height: 48,
        growthPercentage: 45,
        healthStatus: 'Healthy',
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
        notes: 'Stem hardening into wood; clear vertical leader branch.',
        xpEarned: 20,
      },
      {
        plantId: neem._id,
        userId: userAarav._id,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        height: 65,
        growthPercentage: 62,
        healthStatus: 'Healthy',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
        notes: 'Robust bark development and new canopy shoot tips.',
        xpEarned: 20,
      },
    ];

    await GrowthUpdate.insertMany(growthUpdatesData);
    console.log(`✅ Seeded ${growthUpdatesData.length} Growth Updates.`);

    // 6. Seed Care Activities
    const careActivities = [
      {
        plantId: tulsi._id,
        userId: userAarav._id,
        activityType: 'watered',
        date: new Date(Date.now() - 4 * 60 * 60 * 1000),
        xpEarned: 10,
        notes: 'Morning watering with rain-collected water.',
      },
      {
        plantId: tulsi._id,
        userId: userAarav._id,
        activityType: 'fertilized',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        xpEarned: 10,
        notes: 'Added a scoop of seaweed organic granule fertilizer.',
      },
      {
        plantId: tulsi._id,
        userId: userAarav._id,
        activityType: 'pruned',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        xpEarned: 10,
        notes: 'Punched top flower seeds to encourage lateral bushy growth.',
      },
      {
        plantId: neem._id,
        userId: userAarav._id,
        activityType: 'watered',
        date: new Date(Date.now() - 28 * 60 * 60 * 1000),
        xpEarned: 10,
        notes: 'Deep 5-liter root soaking.',
      },
      {
        plantId: neem._id,
        userId: userAarav._id,
        activityType: 'checked_health',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        xpEarned: 5,
        notes: 'Inspected under-leaves for pests; clean and green.',
      },
    ];
    await CareActivity.insertMany(careActivities);
    console.log(`✅ Seeded ${careActivities.length} Care Activities.`);

    // 7. Seed User Challenges
    const marathonChallenge = createdChallenges[0]; // 30-Day
    const streakChallenge = createdChallenges[1]; // 7-Day

    await UserChallenge.create([
      {
        userId: userAarav._id,
        challengeId: marathonChallenge._id,
        progress: 18,
        target: 30,
        status: 'active',
        joinedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      },
      {
        userId: userAarav._id,
        challengeId: streakChallenge._id,
        progress: 7,
        target: 7,
        status: 'completed',
        joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ]);

    // 8. Seed Notifications
    const notificationsData = [
      {
        userId: userAarav._id,
        title: 'Time to water your Desi Gulab (Rose) plant.',
        message: 'Your Desi Gulab has not received hydration for 48 hours. Give it some fresh water today!',
        type: 'reminder',
        link: `/plants/${createdPlants[4]._id}`,
        icon: '💧',
        read: false,
      },
      {
        userId: userAarav._id,
        title: 'Plant growth update is due!',
        message: 'It has been 10 days since you logged Holy Basil height. Measure and capture a new photo.',
        type: 'growth',
        link: `/plants/${tulsi._id}`,
        icon: '📸',
        read: false,
      },
      {
        userId: userAarav._id,
        title: 'You completed a challenge!',
        message: 'Great job! You finished "7-Day Green Care Routine" and claimed +150 Eco XP.',
        type: 'challenge',
        link: '/challenges',
        icon: '🎉',
        read: true,
      },
      {
        userId: userAarav._id,
        title: 'You moved up to Rank #4 on the Leaderboard!',
        message: 'Keep up your daily care streak to break into the Top 3 podium!',
        type: 'leaderboard',
        link: '/leaderboard',
        icon: '🏅',
        read: true,
      },
    ];
    await Notification.insertMany(notificationsData);
    console.log(`✅ Seeded ${notificationsData.length} Notifications.`);

    // 9. Seed Community Posts
    const communityPostsData = [
      {
        userId: userAarav._id,
        plantId: tulsi._id,
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80',
        caption: 'My Holy Basil (Krishna Tulsi) has reached 38cm height! Pruning top flower spikes really accelerated lateral leaf development 🌱 #GreenGamers #UrbanPlantation',
        plantTag: 'Holy Basil (Tulsi)',
        activityType: 'growth',
        likes: [createdCompetitors[0]._id, createdCompetitors[1]._id, userAdmin._id],
        comments: [
          {
            userId: createdCompetitors[0]._id,
            userName: 'Kavya Reddy',
            userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
            userLevel: 6,
            text: 'Looks incredibly healthy Aarav! What compost mix are you using?',
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          },
          {
            userId: userAarav._id,
            userName: 'Aarav Patel',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
            userLevel: 5,
            text: 'Thanks Kavya! 60% garden soil, 30% vermicompost and 10% cocopeat for moisture retention.',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          },
        ],
        sharesCount: 3,
      },
      {
        userId: userAdmin._id,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
        caption: 'Over 150 native tree saplings planted during this weekend’s Green Campus Drive under SDG 13 & 15. Every student can now link their adopted sapling in Green Gamers!',
        plantTag: 'Campus Reforestation',
        activityType: 'plantation',
        likes: [userAarav._id, createdCompetitors[0]._id, createdCompetitors[1]._id, createdCompetitors[2]._id],
        comments: [
          {
            userId: userAarav._id,
            userName: 'Aarav Patel',
            userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
            userLevel: 5,
            text: 'Proud to have registered my Neem sapling from Plot B on the platform today!',
            createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
          },
        ],
        sharesCount: 12,
      },
      {
        userId: createdCompetitors[0]._id,
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',
        caption: 'Day 26 of my green streak! Checked all 8 terrace plants and prepared organic mulch before the hot afternoon sun ☀️🌿',
        plantTag: 'Terrace Garden Care',
        activityType: 'care',
        likes: [userAarav._id, createdCompetitors[2]._id],
        comments: [],
        sharesCount: 1,
      },
    ];

    await CommunityPost.insertMany(communityPostsData);
    console.log(`✅ Seeded ${communityPostsData.length} Community Posts.`);

    console.log('🎉 Green Gamers database seeding completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
};

// Allow standalone execution via `npm run seed`
if (require.main === module) {
  const { connectDB, disconnectDB } = require('../config/db');
  require('dotenv').config();

  connectDB().then(async () => {
    await seedData();
    await disconnectDB();
    process.exit(0);
  });
}

module.exports = seedData;
