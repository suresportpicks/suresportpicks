const express = require('express')
const { body, validationResult } = require('express-validator')
const { authenticateToken } = require('../middleware/auth')
const SupportTicket = require('../models/SupportTicket')

const router = express.Router()

// GET /api/support/tickets - list tickets for current user
router.get('/tickets', authenticateToken, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ userId: req.user._id, isActive: true })
      .sort({ createdAt: -1 })
      .select('-__v')

    res.json({ tickets })
  } catch (error) {
    console.error('Fetch tickets error:', error)
    res.status(500).json({ message: 'Failed to fetch tickets', error: 'FETCH_TICKETS_ERROR' })
  }
})

// POST /api/support/tickets - create a new support ticket
router.post('/tickets', authenticateToken, [
  body('subject').isLength({ min: 3, max: 200 }).withMessage('Subject must be 3-200 characters'),
  body('category').optional().isIn(['general', 'account', 'payment', 'technical', 'picks', 'subscription', 'refund']).withMessage('Invalid category'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('description').isLength({ min: 10, max: 5000 }).withMessage('Description must be 10-5000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const ticketNumber = await SupportTicket.generateTicketNumber()

    const ticket = await SupportTicket.create({
      ticketNumber,
      subject: req.body.subject,
      category: req.body.category || 'general',
      priority: req.body.priority || 'medium',
      description: req.body.description,
      userId: req.user._id
    })

    res.status(201).json({ ticket, message: 'Support ticket created successfully' })
  } catch (error) {
    console.error('Create ticket error:', error)
    res.status(500).json({ message: 'Failed to create ticket', error: 'CREATE_TICKET_ERROR' })
  }
})

module.exports = router