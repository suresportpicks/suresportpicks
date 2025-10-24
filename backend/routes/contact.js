const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendContactNotification } = require('../utils/email');

const router = express.Router();

// Validation middleware
const validateContact = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('subject')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Subject cannot exceed 200 characters'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters')
];

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post('/', validateContact, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, subject, message } = req.body;

    // Send notification email
    try {
      await sendContactNotification({
        name,
        email,
        subject,
        message
      });

      res.json({
        message: 'Thank you for your message! We\'ll get back to you soon.',
        success: true
      });
    } catch (emailError) {
      console.error('Contact notification email failed:', emailError);
      
      res.status(500).json({
        message: 'Failed to send your message. Please try again later.',
        error: 'EMAIL_SEND_ERROR'
      });
    }
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      message: 'Failed to submit contact form',
      error: 'CONTACT_ERROR'
    });
  }
});

module.exports = router;