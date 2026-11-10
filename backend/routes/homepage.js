const express = require('express')
const router = express.Router()
const HomepageContent = require('../models/HomepageContent')
const ContactInquiry = require('../models/ContactInquiry')
const { authenticateToken, requireAdmin } = require('../middleware/auth')

// Public route to get homepage content
router.get('/content', async (req, res) => {
  try {
    const content = await HomepageContent.getSingleton()
    res.json(content)
  } catch (error) {
    console.error('Get homepage content error:', error)
    res.status(500).json({ message: 'Failed to fetch homepage content' })
  }
})

// Admin route to update homepage content
router.put('/content', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const content = await HomepageContent.getSingleton()
    
    // Update fields if provided
    if (req.body.hero) {
      content.hero = { ...content.hero.toObject(), ...req.body.hero }
    }
    if (req.body.sections) {
      content.sections = req.body.sections
    }
    if (req.body.features) {
      content.features = { ...content.features.toObject(), ...req.body.features }
    }
    if (req.body.about) {
      content.about = { ...content.about.toObject(), ...req.body.about }
    }
    if (req.body.testimonials) {
      content.testimonials = { ...content.testimonials.toObject(), ...req.body.testimonials }
    }
    if (req.body.contact) {
      content.contact = { ...content.contact.toObject(), ...req.body.contact }
    }
    if (req.body.seo) {
      content.seo = { ...content.seo.toObject(), ...req.body.seo }
    }
    
    content.updatedBy = req.user._id
    content.updatedAt = new Date()
    
    await content.save()
    
    res.json({ message: 'Homepage content updated successfully', content })
  } catch (error) {
    console.error('Update homepage content error:', error)
    res.status(500).json({ message: 'Failed to update homepage content' })
  }
})

// Public route to submit contact inquiry
router.post('/contact', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      inquiryType,
      subject,
      message,
      interestedPlan,
      budget,
      timeline,
      specificRequirements
    } = req.body

    // Validation
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ 
        message: 'Please fill in all required fields' 
      })
    }

    // Create inquiry
    const inquiry = new ContactInquiry({
      firstName,
      lastName,
      email,
      phone,
      inquiryType: inquiryType || 'general_inquiry',
      subject,
      message,
      interestedPlan,
      budget,
      timeline,
      specificRequirements,
      userAgent: req.get('User-Agent'),
      ipAddress: req.ip || req.connection.remoteAddress
    })

    await inquiry.save()

    res.status(201).json({ 
      message: 'Your inquiry has been submitted successfully. We will get back to you soon!',
      inquiryId: inquiry._id
    })
  } catch (error) {
    console.error('Submit contact inquiry error:', error)
    res.status(500).json({ message: 'Failed to submit inquiry. Please try again.' })
  }
})

// Admin route to get all inquiries
router.get('/inquiries', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20
    const skip = (page - 1) * limit
    
    const filter = {}
    if (req.query.status) filter.status = req.query.status
    if (req.query.inquiryType) filter.inquiryType = req.query.inquiryType
    if (req.query.priority) filter.priority = req.query.priority
    
    const inquiries = await ContactInquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('respondedBy', 'firstName lastName email')
    
    const total = await ContactInquiry.countDocuments(filter)
    
    res.json({
      inquiries,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get inquiries error:', error)
    res.status(500).json({ message: 'Failed to fetch inquiries' })
  }
})

// Admin route to get single inquiry
router.get('/inquiries/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const inquiry = await ContactInquiry.findById(req.params.id)
      .populate('respondedBy', 'firstName lastName email')
      .populate('internalNotes.addedBy', 'firstName lastName email')
    
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' })
    }
    
    res.json(inquiry)
  } catch (error) {
    console.error('Get inquiry error:', error)
    res.status(500).json({ message: 'Failed to fetch inquiry' })
  }
})

// Admin route to update inquiry status
router.put('/inquiries/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, priority, followUpRequired, followUpDate, followUpNotes } = req.body
    
    const inquiry = await ContactInquiry.findById(req.params.id)
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' })
    }
    
    if (status) inquiry.status = status
    if (priority) inquiry.priority = priority
    if (followUpRequired !== undefined) inquiry.followUpRequired = followUpRequired
    if (followUpDate) inquiry.followUpDate = followUpDate
    if (followUpNotes) inquiry.followUpNotes = followUpNotes
    
    await inquiry.save()
    
    res.json({ message: 'Inquiry updated successfully', inquiry })
  } catch (error) {
    console.error('Update inquiry status error:', error)
    res.status(500).json({ message: 'Failed to update inquiry' })
  }
})

// Admin route to respond to inquiry
router.post('/inquiries/:id/respond', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { response } = req.body
    
    if (!response) {
      return res.status(400).json({ message: 'Response is required' })
    }
    
    const inquiry = await ContactInquiry.findById(req.params.id)
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' })
    }
    
    await inquiry.respond(response, req.user._id)
    
    res.json({ message: 'Response sent successfully', inquiry })
  } catch (error) {
    console.error('Respond to inquiry error:', error)
    res.status(500).json({ message: 'Failed to send response' })
  }
})

// Admin route to add internal note
router.post('/inquiries/:id/notes', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { note } = req.body
    
    if (!note) {
      return res.status(400).json({ message: 'Note is required' })
    }
    
    const inquiry = await ContactInquiry.findById(req.params.id)
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' })
    }
    
    await inquiry.addInternalNote(note, req.user._id)
    
    res.json({ message: 'Note added successfully', inquiry })
  } catch (error) {
    console.error('Add note error:', error)
    res.status(500).json({ message: 'Failed to add note' })
  }
})

// Admin route to get plan requests specifically
router.get('/plan-requests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const planRequests = await ContactInquiry.getPlanRequests(50)
    res.json(planRequests)
  } catch (error) {
    console.error('Get plan requests error:', error)
    res.status(500).json({ message: 'Failed to fetch plan requests' })
  }
})

module.exports = router