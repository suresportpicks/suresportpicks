const mongoose = require('mongoose')

const ContactInquirySchema = new mongoose.Schema({
  // Contact Information
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  
  // Inquiry Details
  inquiryType: { 
    type: String, 
    required: true,
    enum: ['plan_request', 'general_inquiry', 'support', 'partnership', 'other'],
    default: 'general_inquiry'
  },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true },
  
  // Plan-specific fields (when inquiryType is 'plan_request')
  interestedPlan: { 
    type: String,
    enum: ['basic', 'premium', 'vip', 'custom'],
    required: function() { return this.inquiryType === 'plan_request' }
  },
  budget: { type: String, trim: true },
  timeline: { type: String, trim: true },
  specificRequirements: { type: String },
  
  // Status tracking
  status: {
    type: String,
    enum: ['new', 'in_progress', 'responded', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Admin response
  adminResponse: { type: String },
  respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  respondedAt: { type: Date },
  
  // Additional metadata
  source: { type: String, default: 'website' }, // website, referral, etc.
  userAgent: { type: String },
  ipAddress: { type: String },
  
  // Internal notes
  internalNotes: [{ 
    note: { type: String, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Follow-up tracking
  followUpRequired: { type: Boolean, default: false },
  followUpDate: { type: Date },
  followUpNotes: { type: String }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Virtual for full name
ContactInquirySchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Index for efficient querying
ContactInquirySchema.index({ status: 1, createdAt: -1 })
ContactInquirySchema.index({ inquiryType: 1, createdAt: -1 })
ContactInquirySchema.index({ email: 1 })

// Static method to get inquiries by status
ContactInquirySchema.statics.getByStatus = function(status, limit = 50) {
  return this.find({ status })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('respondedBy', 'firstName lastName email')
}

// Static method to get plan requests
ContactInquirySchema.statics.getPlanRequests = function(limit = 50) {
  return this.find({ inquiryType: 'plan_request' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('respondedBy', 'firstName lastName email')
}

// Instance method to add internal note
ContactInquirySchema.methods.addInternalNote = function(note, userId) {
  this.internalNotes.push({
    note,
    addedBy: userId,
    addedAt: new Date()
  })
  return this.save()
}

// Instance method to respond to inquiry
ContactInquirySchema.methods.respond = function(response, userId) {
  this.adminResponse = response
  this.respondedBy = userId
  this.respondedAt = new Date()
  this.status = 'responded'
  return this.save()
}

module.exports = mongoose.model('ContactInquiry', ContactInquirySchema)