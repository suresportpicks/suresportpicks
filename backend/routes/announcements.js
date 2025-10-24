const express = require('express');
const { body, validationResult } = require('express-validator');
const Announcement = require('../models/Announcement');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateAnnouncement = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  body('type')
    .isIn(['info', 'warning', 'success', 'error'])
    .withMessage('Invalid announcement type'),
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority level'),
  body('targetAudience')
    .isIn(['all', 'free', 'silver', 'gold', 'admin'])
    .withMessage('Invalid target audience'),
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Invalid expiration date')
];

// @route   GET /api/announcements
// @desc    Get announcements for user
// @access  Public (filtered by user plan)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userPlan = req.user?.plan || 'free';
    const userId = req.user?._id;

    // Build query based on user's plan
    const query = {
      isActive: true,
      $or: [
        { targetAudience: 'all' },
        { targetAudience: userPlan }
      ],
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ isPinned: -1, priority: -1, createdAt: -1 })
      .limit(20);

    // Mark announcements as read for authenticated users
    if (userId) {
      const unreadAnnouncements = announcements.filter(
        announcement => !announcement.readBy.includes(userId)
      );

      if (unreadAnnouncements.length > 0) {
        await Promise.all(
          unreadAnnouncements.map(announcement => 
            announcement.markAsRead(userId)
          )
        );
      }
    }

    res.json({
      announcements,
      message: 'Announcements retrieved successfully'
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      message: 'Failed to fetch announcements',
      error: 'FETCH_ANNOUNCEMENTS_ERROR'
    });
  }
});

// @route   GET /api/announcements/admin
// @desc    Get all announcements (Admin only)
// @access  Private (Admin)
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 50, page = 1, type, priority, targetAudience } = req.query;

    const query = {};
    if (type) query.type = type;
    if (priority) query.priority = priority;
    if (targetAudience) query.targetAudience = targetAudience;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Announcement.countDocuments(query);

    res.json({
      announcements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get admin announcements error:', error);
    res.status(500).json({
      message: 'Failed to fetch announcements',
      error: 'FETCH_ANNOUNCEMENTS_ERROR'
    });
  }
});

// @route   POST /api/announcements
// @desc    Create announcement (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, validateAnnouncement, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const announcement = new Announcement({
      ...req.body,
      createdBy: req.user._id
    });

    await announcement.save();
    await announcement.populate('createdBy', 'name email');

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      message: 'Failed to create announcement',
      error: 'CREATE_ANNOUNCEMENT_ERROR'
    });
  }
});

// @route   PUT /api/announcements/:id
// @desc    Update announcement (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, validateAnnouncement, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!announcement) {
      return res.status(404).json({
        message: 'Announcement not found',
        error: 'ANNOUNCEMENT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Announcement updated successfully',
      announcement
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      message: 'Failed to update announcement',
      error: 'UPDATE_ANNOUNCEMENT_ERROR'
    });
  }
});

// @route   DELETE /api/announcements/:id
// @desc    Delete announcement (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: 'Announcement not found',
        error: 'ANNOUNCEMENT_NOT_FOUND'
      });
    }

    res.json({
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      message: 'Failed to delete announcement',
      error: 'DELETE_ANNOUNCEMENT_ERROR'
    });
  }
});

// @route   PUT /api/announcements/:id/pin
// @desc    Toggle pin status (Admin only)
// @access  Private (Admin)
router.put('/:id/pin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        message: 'Announcement not found',
        error: 'ANNOUNCEMENT_NOT_FOUND'
      });
    }

    announcement.isPinned = !announcement.isPinned;
    await announcement.save();

    res.json({
      message: `Announcement ${announcement.isPinned ? 'pinned' : 'unpinned'} successfully`,
      announcement
    });
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({
      message: 'Failed to toggle pin status',
      error: 'TOGGLE_PIN_ERROR'
    });
  }
});

module.exports = router;