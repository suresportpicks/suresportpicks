const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Referral = require('../models/Referral');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private (User)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -resetPasswordToken -resetPasswordExpire');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      message: 'Failed to fetch profile',
      error: 'FETCH_PROFILE_ERROR'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { limit = 50, page = 1, search, plan, role } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (plan) query.plan = plan;
    if (role) query.role = role;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    // Get user statistics
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
          freeUsers: { $sum: { $cond: [{ $eq: ['$plan', 'free'] }, 1, 0] } },
          silverUsers: { $sum: { $cond: [{ $eq: ['$plan', 'silver'] }, 1, 0] } },
          goldUsers: { $sum: { $cond: [{ $eq: ['$plan', 'gold'] }, 1, 0] } },
          adminUsers: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: stats[0] || {}
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      message: 'Failed to fetch users',
      error: 'FETCH_USERS_ERROR'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get single user (Admin only)
// @access  Private (Admin)
router.get('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpire');

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    res.json({
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Failed to fetch user',
      error: 'FETCH_USER_ERROR'
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('plan')
    .optional()
    .isIn(['free', 'silver', 'gold'])
    .withMessage('Invalid plan'),
  body('role')
    .optional()
    .isIn(['user', 'admin'])
    .withMessage('Invalid role'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Prevent admin from demoting themselves
    if (user._id.toString() === req.user._id.toString() && req.body.role === 'user') {
      return res.status(400).json({
        message: 'Cannot demote yourself from admin role',
        error: 'CANNOT_DEMOTE_SELF'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'email', 'plan', 'role', 'isActive', 'planExpiry'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const updatedUser = await User.findById(user._id)
      .select('-password -resetPasswordToken -resetPasswordExpire');

    res.json({
      message: 'User updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      message: 'Failed to update user',
      error: 'UPDATE_USER_ERROR'
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: 'Cannot delete your own account',
        error: 'CANNOT_DELETE_SELF'
      });
    }

    // Soft delete
    user.isActive = false;
    await user.save();

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      message: 'Failed to delete user',
      error: 'DELETE_USER_ERROR'
    });
  }
});

// @route   GET /api/users/referral-data
// @desc    Get user's referral data
// @access  Private (User)
router.get('/referral-data', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Generate referral code if user doesn't have one
    if (!user.referralCode) {
      await user.generateReferralCode();
    }

    // Get referral history
    const referralHistory = await Referral.find({ referrer: user._id })
      .populate('referredUser', 'email createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    // Calculate totals
    const totalReferrals = referralHistory.length;
    const totalEarnings = user.referralEarnings.total || 0;
    const pendingEarnings = user.referralEarnings.pending || 0;

    res.json({
      referralCode: user.referralCode,
      totalReferrals,
      totalEarnings,
      pendingEarnings,
      referralHistory: referralHistory.map(ref => ({
        _id: ref._id,
        referredUser: ref.referredUser,
        status: ref.status,
        earnings: ref.earnings,
        earningsType: ref.earningsType,
        createdAt: ref.createdAt
      }))
    });
  } catch (error) {
    console.error('Get referral data error:', error);
    res.status(500).json({
      message: 'Failed to fetch referral data',
      error: 'FETCH_REFERRAL_ERROR'
    });
  }
});

// @route   POST /api/users/generate-referral-code
// @desc    Generate or regenerate referral code
// @access  Private (User)
router.post('/generate-referral-code', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    const referralCode = await user.generateReferralCode();

    res.json({
      referralCode,
      message: 'Referral code generated successfully'
    });
  } catch (error) {
    console.error('Generate referral code error:', error);
    res.status(500).json({
      message: 'Failed to generate referral code',
      error: 'GENERATE_REFERRAL_ERROR'
    });
  }
});

// @route   GET /api/users/validate-referral/:code
// @desc    Validate referral code
// @access  Public
router.get('/validate-referral/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    const referrer = await User.findOne({ referralCode: code })
      .select('name email referralCode');

    if (!referrer) {
      return res.status(404).json({
        valid: false,
        message: 'Invalid referral code'
      });
    }

    res.json({
      valid: true,
      referrer: {
        name: referrer.name,
        referralCode: referrer.referralCode
      }
    });
  } catch (error) {
    console.error('Validate referral code error:', error);
    res.status(500).json({
      valid: false,
      message: 'Failed to validate referral code',
      error: 'VALIDATE_REFERRAL_ERROR'
    });
  }
});

module.exports = router;