const mongoose = require('mongoose');

const paymentOptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Payment option name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Payment option code is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9_]+$/, 'Code can only contain lowercase letters, numbers, and underscores']
  },
  type: {
    type: String,
    required: [true, 'Payment type is required'],
    enum: ['deposit', 'withdrawal', 'both'],
    default: 'both'
  },
  category: {
    type: String,
    required: [true, 'Payment category is required'],
    enum: ['digital_wallet', 'bank_transfer', 'cryptocurrency', 'money_transfer', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    trim: true,
    default: 'CreditCard'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // minAmount removed
  maxAmount: {
    type: Number,
    default: 10000,
    min: [1, 'Maximum amount must be at least $1']
  },
  processingTime: {
    type: String,
    default: '1-3 business days',
    trim: true
  },
  fees: {
    percentage: {
      type: Number,
      default: 0,
      min: [0, 'Fee percentage cannot be negative'],
      max: [100, 'Fee percentage cannot exceed 100%']
    },
    fixed: {
      type: Number,
      default: 0,
      min: [0, 'Fixed fee cannot be negative']
    }
  },
  requiredFields: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['text', 'email', 'tel', 'select', 'textarea'],
      default: 'text'
    },
    placeholder: {
      type: String,
      trim: true
    },
    required: {
      type: Boolean,
      default: true
    },
    options: [{
      value: String,
      label: String
    }]
  }],
  adminInstructions: {
    type: String,
    trim: true,
    maxlength: [1000, 'Admin instructions cannot exceed 1000 characters']
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
paymentOptionSchema.index({ type: 1, isActive: 1, sortOrder: 1 });
paymentOptionSchema.index({ code: 1 });
paymentOptionSchema.index({ category: 1 });

// Static method to get active payment options by type
paymentOptionSchema.statics.getActiveByType = function(type) {
  const query = type === 'both' 
    ? { isActive: true, $or: [{ type: 'both' }, { type }] }
    : { isActive: true, $or: [{ type: 'both' }, { type }] };
  
  return this.find(query).sort({ sortOrder: 1, name: 1 });
};

// Static method to get all active payment options
paymentOptionSchema.statics.getAllActive = function() {
  return this.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
};

// Method to validate amount against limits
paymentOptionSchema.methods.validateAmount = function(amount) {
  // Minimum withdrawal check removed
  if (amount > this.maxAmount) {
    return { valid: false, message: `Maximum amount is $${this.maxAmount}` };
  }
  return { valid: true };
};

// Method to calculate fees
paymentOptionSchema.methods.calculateFees = function(amount) {
  const percentageFee = (amount * this.fees.percentage) / 100;
  const totalFee = percentageFee + this.fees.fixed;
  return {
    percentage: percentageFee,
    fixed: this.fees.fixed,
    total: totalFee
  };
};

module.exports = mongoose.model('PaymentOption', paymentOptionSchema);