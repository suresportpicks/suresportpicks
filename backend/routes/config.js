const express = require('express')
const router = express.Router()
const DashboardConfig = require('../models/DashboardConfig')
const { authenticateToken } = require('../middleware/auth')

// Users fetch dashboard config to decide what to render
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const config = await DashboardConfig.getSingleton()
    // Only expose necessary fields
    res.json({
      modules: config.modules,
      hero: config.hero,
      updatedAt: config.updatedAt
    })
  } catch (error) {
    console.error('User dashboard config error:', error)
    res.status(500).json({ message: 'Failed to fetch dashboard config' })
  }
})

module.exports = router