const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Pick = require('../models/Pick');
const { authenticateToken, requireAdmin, requirePlan, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validatePick = [
  body('sport')
    .isIn(['basketball', 'football', 'soccer', 'baseball', 'hockey', 'tennis'])
    .withMessage('Invalid sport'),
  body('league')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('League must be between 2 and 50 characters'),
  body('homeTeam')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Home team must be between 2 and 50 characters'),
  body('awayTeam')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Away team must be between 2 and 50 characters'),
  body('matchDate')
    .isISO8601()
    .withMessage('Invalid match date'),
  body('prediction')
    .isIn(['home', 'away', 'draw', 'over', 'under'])
    .withMessage('Invalid prediction'),
  body('odds.home')
    .isFloat({ min: 1.01 })
    .withMessage('Home odds must be at least 1.01'),
  body('odds.away')
    .isFloat({ min: 1.01 })
    .withMessage('Away odds must be at least 1.01'),
  body('confidence')
    .isInt({ min: 1, max: 100 })
    .withMessage('Confidence must be between 1 and 100'),
  body('stake')
    .isFloat({ min: 1 })
    .withMessage('Stake must be at least $1'),
  body('accessLevel')
    .isIn(['free', 'silver', 'gold'])
    .withMessage('Invalid access level')
];

// @route   GET /api/picks
// @desc    Get picks based on user access level
// @access  Public (with optional auth for better filtering)
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('sport').optional().isIn(['basketball', 'football', 'soccer', 'baseball', 'hockey', 'tennis']),
  query('status').optional().isIn(['pending', 'won', 'lost', 'void', 'postponed']),
  query('accessLevel').optional().isIn(['free', 'silver', 'gold'])
], optionalAuth, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { limit = 10, sport, status, accessLevel } = req.query;
    
    // Determine user's access level
    const userAccessLevel = req.user ? req.user.getAccessLevel() : 'free';
    
    // Build query
    const query = { isActive: true };
    
    if (sport) query.sport = sport;
    if (status) query.status = status;
    
    // Filter by access level
    const accessLevels = {
      'free': ['free'],
      'silver': ['free', 'silver'],
      'gold': ['free', 'silver', 'gold'],
      'admin': ['free', 'silver', 'gold']
    };
    
    const allowedLevels = accessLevels[userAccessLevel] || ['free'];
    if (accessLevel && allowedLevels.includes(accessLevel)) {
      query.accessLevel = accessLevel;
    } else {
      query.accessLevel = { $in: allowedLevels };
    }

    const picks = await Pick.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('createdBy', 'name')
      .select('-__v');

    // Calculate statistics
    const stats = await Pick.aggregate([
      { $match: { isActive: true, accessLevel: { $in: allowedLevels } } },
      {
        $group: {
          _id: null,
          totalPicks: { $sum: 1 },
          wonPicks: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } },
          lostPicks: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } },
          pendingPicks: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          voidPicks: { $sum: { $cond: [{ $eq: ['$status', 'void'] }, 1, 0] } },
          totalStake: { $sum: '$stake' },
          totalReturn: { 
            $sum: { 
              $cond: [
                { $eq: ['$status', 'won'] }, 
                '$potentialReturn', 
                0
              ] 
            } 
          }
        }
      }
    ]);

    const pickStats = stats[0] || {
      totalPicks: 0,
      wonPicks: 0,
      lostPicks: 0,
      pendingPicks: 0,
      voidPicks: 0,
      totalStake: 0,
      totalReturn: 0
    };

    const winRate = pickStats.totalPicks > 0 ? 
      ((pickStats.wonPicks / (pickStats.wonPicks + pickStats.lostPicks)) * 100).toFixed(1) : 0;
    
    const roi = pickStats.totalStake > 0 ? 
      (((pickStats.totalReturn - pickStats.totalStake) / pickStats.totalStake) * 100).toFixed(1) : 0;

    res.json({
      picks,
      stats: {
        ...pickStats,
        winRate: parseFloat(winRate),
        roi: parseFloat(roi)
      },
      pagination: {
        limit: parseInt(limit),
        total: picks.length,
        hasMore: picks.length === parseInt(limit)
      },
      userAccess: {
        level: userAccessLevel,
        allowedLevels
      }
    });
  } catch (error) {
    console.error('Get picks error:', error);
    res.status(500).json({
      message: 'Failed to fetch picks',
      error: 'FETCH_PICKS_ERROR'
    });
  }
});

// @route   GET /api/picks/featured
// @desc    Get featured picks for homepage
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredPicks = await Pick.find({
      isActive: true,
      accessLevel: 'free',
      confidence: { $gte: 80 }
    })
    .sort({ confidence: -1, createdAt: -1 })
    .limit(6)
    .populate('createdBy', 'name')
    .select('sport league homeTeam awayTeam matchDate prediction odds confidence status createdAt');

    res.json({
      picks: featuredPicks,
      message: 'Featured picks retrieved successfully'
    });
  } catch (error) {
    console.error('Get featured picks error:', error);
    res.status(500).json({
      message: 'Failed to fetch featured picks',
      error: 'FETCH_FEATURED_ERROR'
    });
  }
});

// @route   GET /api/picks/analytics
// @desc    Get analytics data for charts
// @access  Private (Silver+)
router.get('/analytics', authenticateToken, requirePlan('silver'), async (req, res) => {
  try {
    const userAccessLevel = req.user.getAccessLevel();
    const accessLevels = {
      'silver': ['free', 'silver'],
      'gold': ['free', 'silver', 'gold'],
      'admin': ['free', 'silver', 'gold']
    };
    
    const allowedLevels = accessLevels[userAccessLevel] || ['free'];

    // ROI trend over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const roiTrend = await Pick.aggregate([
      {
        $match: {
          isActive: true,
          accessLevel: { $in: allowedLevels },
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: ['won', 'lost'] }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalStake: { $sum: '$stake' },
          totalReturn: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'won'] }, '$potentialReturn', 0] 
            } 
          },
          picks: { $sum: 1 }
        }
      },
      {
        $project: {
          date: '$_id',
          roi: {
            $multiply: [
              { $divide: [{ $subtract: ['$totalReturn', '$totalStake'] }, '$totalStake'] },
              100
            ]
          },
          picks: 1
        }
      },
      { $sort: { date: 1 } }
    ]);

    // Win rate by sport
    const winRateBySport = await Pick.aggregate([
      {
        $match: {
          isActive: true,
          accessLevel: { $in: allowedLevels },
          status: { $in: ['won', 'lost'] }
        }
      },
      {
        $group: {
          _id: '$sport',
          totalPicks: { $sum: 1 },
          wonPicks: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } }
        }
      },
      {
        $project: {
          sport: '$_id',
          winRate: {
            $multiply: [{ $divide: ['$wonPicks', '$totalPicks'] }, 100]
          },
          totalPicks: 1
        }
      }
    ]);

    // Monthly performance
    const monthlyPerformance = await Pick.aggregate([
      {
        $match: {
          isActive: true,
          accessLevel: { $in: allowedLevels },
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } // This year
        }
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          totalPicks: { $sum: 1 },
          wonPicks: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } },
          lostPicks: { $sum: { $cond: [{ $eq: ['$status', 'lost'] }, 1, 0] } },
          totalStake: { $sum: '$stake' },
          totalReturn: { 
            $sum: { 
              $cond: [{ $eq: ['$status', 'won'] }, '$potentialReturn', 0] 
            } 
          }
        }
      },
      {
        $project: {
          month: '$_id.month',
          year: '$_id.year',
          totalPicks: 1,
          winRate: {
            $cond: [
              { $gt: [{ $add: ['$wonPicks', '$lostPicks'] }, 0] },
              { $multiply: [{ $divide: ['$wonPicks', { $add: ['$wonPicks', '$lostPicks'] }] }, 100] },
              0
            ]
          },
          roi: {
            $cond: [
              { $gt: ['$totalStake', 0] },
              { $multiply: [{ $divide: [{ $subtract: ['$totalReturn', '$totalStake'] }, '$totalStake'] }, 100] },
              0
            ]
          },
          profit: { $subtract: ['$totalReturn', '$totalStake'] }
        }
      },
      { $sort: { year: 1, month: 1 } }
    ]);

    res.json({
      roiTrend,
      winRateBySport,
      monthlyPerformance,
      message: 'Analytics data retrieved successfully'
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      message: 'Failed to fetch analytics data',
      error: 'FETCH_ANALYTICS_ERROR'
    });
  }
});

// @route   GET /api/picks/:id
// @desc    Get single pick by ID
// @access  Public (with access level check)
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const pick = await Pick.findById(req.params.id)
      .populate('createdBy', 'name')
      .select('-__v');

    if (!pick || !pick.isActive) {
      return res.status(404).json({
        message: 'Pick not found',
        error: 'PICK_NOT_FOUND'
      });
    }

    // Check access level
    const userAccessLevel = req.user ? req.user.getAccessLevel() : 'free';
    
    if (!pick.isAccessibleTo(userAccessLevel)) {
      return res.status(403).json({
        message: 'Access denied. Upgrade your plan to view this pick.',
        error: 'ACCESS_DENIED',
        requiredLevel: pick.accessLevel,
        userLevel: userAccessLevel
      });
    }

    res.json({
      pick,
      message: 'Pick retrieved successfully'
    });
  } catch (error) {
    console.error('Get pick error:', error);
    res.status(500).json({
      message: 'Failed to fetch pick',
      error: 'FETCH_PICK_ERROR'
    });
  }
});

// @route   POST /api/picks
// @desc    Create new pick (Admin only)
// @access  Private (Admin)
router.post('/', authenticateToken, requireAdmin, validatePick, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const pickData = {
      ...req.body,
      createdBy: req.user._id
    };

    const pick = new Pick(pickData);
    await pick.save();

    await pick.populate('createdBy', 'name');

    res.status(201).json({
      pick,
      message: 'Pick created successfully'
    });
  } catch (error) {
    console.error('Create pick error:', error);
    res.status(500).json({
      message: 'Failed to create pick',
      error: 'CREATE_PICK_ERROR'
    });
  }
});

// @route   PUT /api/picks/:id
// @desc    Update pick (Admin only)
// @access  Private (Admin)
router.put('/:id', authenticateToken, requireAdmin, validatePick, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const pick = await Pick.findById(req.params.id);
    
    if (!pick) {
      return res.status(404).json({
        message: 'Pick not found',
        error: 'PICK_NOT_FOUND'
      });
    }

    Object.assign(pick, req.body);
    await pick.save();

    await pick.populate('createdBy', 'name');

    res.json({
      pick,
      message: 'Pick updated successfully'
    });
  } catch (error) {
    console.error('Update pick error:', error);
    res.status(500).json({
      message: 'Failed to update pick',
      error: 'UPDATE_PICK_ERROR'
    });
  }
});

// @route   DELETE /api/picks/:id
// @desc    Delete pick (Admin only)
// @access  Private (Admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const pick = await Pick.findById(req.params.id);
    
    if (!pick) {
      return res.status(404).json({
        message: 'Pick not found',
        error: 'PICK_NOT_FOUND'
      });
    }

    // Soft delete
    pick.isActive = false;
    await pick.save();

    res.json({
      message: 'Pick deleted successfully'
    });
  } catch (error) {
    console.error('Delete pick error:', error);
    res.status(500).json({
      message: 'Failed to delete pick',
      error: 'DELETE_PICK_ERROR'
    });
  }
});

module.exports = router;