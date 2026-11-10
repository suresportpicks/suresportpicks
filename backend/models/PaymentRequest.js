const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  plan: {
    type: String,
    required: [true, 'Plan is required'],
    enum: ['silver', 'gold'],
    lowercase: true
  },
  message: {
    type: String,
    trim: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [1, 'Amount must be at least $1']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'processing'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['paypal', 'venmo', 'zelle', 'cashapp', 'applepay', 'googlepay', 'bank', 'wise', 'skrill', 'neteller', 'westernunion', 'moneygram', 'crypto', 'other'],
    default: 'other'
  },
  transactionId: {
    type: String,
    trim: true,
    sparse: true // allows multiple null values
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  processedAt: {
    type: Date,
    default: null
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Admin notes cannot exceed 500 characters']
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
paymentRequestSchema.index({ status: 1, createdAt: -1 });
paymentRequestSchema.index({ email: 1 });
paymentRequestSchema.index({ userId: 1 });
paymentRequestSchema.index({ createdAt: -1 });

// Static method to get pending requests
paymentRequestSchema.statics.getPendingRequests = function() {
  return this.find({ status: 'pending', isActive: true })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .populate('processedBy', 'name email');
};

// Static method to get requests by status
paymentRequestSchema.statics.getByStatus = function(status) {
  return this.find({ status, isActive: true })
    .sort({ createdAt: -1 })
    .populate('userId', 'name email')
    .populate('processedBy', 'name email');
};

// Method to approve payment request
paymentRequestSchema.methods.approve = async function(adminId, transactionId = null, notes = null) {
  this.status = 'approved';
  this.processedBy = adminId;
  this.processedAt = new Date();
  if (transactionId) this.transactionId = transactionId;
  if (notes) this.adminNotes = notes;
  
  return await this.save();
};

// Method to reject payment request
paymentRequestSchema.methods.reject = async function(adminId, reason = null) {
  this.status = 'rejected';
  this.processedBy = adminId;
  this.processedAt = new Date();
  if (reason) this.adminNotes = reason;
  
  return await this.save();
};

// Virtual for formatted amount
paymentRequestSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} $${this.amount.toFixed(2)}`;
});

// Virtual for time since creation
paymentRequestSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Ensure virtual fields are serialized
paymentRequestSchema.set('toJSON', { virtuals: true });
paymentRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('PaymentRequest', paymentRequestSchema);