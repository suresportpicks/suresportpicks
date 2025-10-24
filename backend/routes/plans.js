const express = require('express');
const Plan = require('../models/Plan');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/plans
// @desc    Get all active plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find({ isActive: true }).sort({ order: 1 });
    
    res.json({
      plans,
      message: 'Plans retrieved successfully'
    });
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({
      message: 'Failed to fetch plans',
      error: 'FETCH_PLANS_ERROR'
    });
  }
});

// @route   GET /api/plans/:name
// @desc    Get single plan by name
// @access  Public
router.get('/:name', async (req, res) => {
  try {
    const plan = await Plan.findOne({ 
      name: req.params.name.toLowerCase(), 
      isActive: true 
    });

    if (!plan) {
      return res.status(404).json({
        message: 'Plan not found',
        error: 'PLAN_NOT_FOUND'
      });
    }

    res.json({
      plan,
      message: 'Plan retrieved successfully'
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({
      message: 'Failed to fetch plan',
      error: 'FETCH_PLAN_ERROR'
    });
  }
});

module.exports = router;