const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const { awardXpAndCheckGamification } = require('../utils/xpSystem');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get community posts feed
// @route   GET /api/community
// @access  Public / Private
const getFeed = async (req, res) => {
  try {
    const { activityType } = req.query;
    let query = {};
    if (activityType && activityType !== 'all') {
      query.activityType = activityType;
    }

    const posts = await CommunityPost.find(query)
      .populate('userId', 'name profileImage level levelTitle college city')
      .populate('plantId', 'name type')
      .sort({ createdAt: -1 })
      .limit(50);

    const currentUserId = req.user ? req.user.id.toString() : null;

    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      user: post.userId,
      plant: post.plantId,
      image: post.image,
      caption: post.caption,
      plantTag: post.plantTag,
      activityType: post.activityType,
      likesCount: post.likes.length,
      isLiked: currentUserId ? post.likes.some((id) => id.toString() === currentUserId) : false,
      comments: post.comments,
      sharesCount: post.sharesCount,
      createdAt: post.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: formattedPosts.length,
      posts: formattedPosts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new community post
// @route   POST /api/community
// @access  Private
const createPost = async (req, res) => {
  try {
    const { caption, plantTag, activityType, plantId, image: imageUrl } = req.body;

    if (!caption) {
      return res.status(400).json({ success: false, message: 'Caption is required.' });
    }

    let finalImageUrl = imageUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80';

    if (req.file) {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_CLOUD_NAME !== 'green_gamers'
      ) {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'green_gamers_community',
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

    const post = await CommunityPost.create({
      userId: req.user.id,
      plantId: plantId || undefined,
      image: finalImageUrl,
      caption,
      plantTag: plantTag || 'General Plantation',
      activityType: activityType || 'plantation',
      likes: [],
      comments: [],
    });

    await post.populate('userId', 'name profileImage level levelTitle college city');

    // Award +15 XP for community sharing
    const gamification = await awardXpAndCheckGamification(
      req.user.id,
      15,
      `Shared update to the Green Gamers community (+15 XP)`
    );

    res.status(201).json({
      success: true,
      message: 'Post published to the community! +15 Eco XP earned 🌱',
      post: {
        _id: post._id,
        user: post.userId,
        plant: post.plantId,
        image: post.image,
        caption: post.caption,
        plantTag: post.plantTag,
        activityType: post.activityType,
        likesCount: 0,
        isLiked: false,
        comments: [],
        sharesCount: 0,
        createdAt: post.createdAt,
      },
      gamification,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like / unlike a post
// @route   POST /api/community/:id/like
// @access  Private
const likePost = async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const userIdStr = req.user.id.toString();
    const alreadyLikedIndex = post.likes.findIndex((id) => id.toString() === userIdStr);

    let isLiked = false;
    if (alreadyLikedIndex > -1) {
      post.likes.splice(alreadyLikedIndex, 1);
      isLiked = false;
    } else {
      post.likes.push(req.user.id);
      isLiked = true;
    }

    await post.save();

    res.status(200).json({
      success: true,
      isLiked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add comment to a post
// @route   POST /api/community/:id/comment
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text is required.' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found.' });
    }

    const newComment = {
      userId: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.profileImage,
      userLevel: req.user.level || 1,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({
      success: true,
      message: 'Comment added.',
      comments: post.comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Share a post
// @route   POST /api/community/:id/share
// @access  Private
const sharePost = async (req, res) => {
  try {
    const post = await CommunityPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { sharesCount: 1 } },
      { new: true }
    );
    res.status(200).json({ success: true, sharesCount: post ? post.sharesCount : 0 });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFeed,
  createPost,
  likePost,
  addComment,
  sharePost,
};
