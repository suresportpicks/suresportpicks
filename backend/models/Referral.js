const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'paid', 'cancelled'],
    default: 'pending'
  },
  earnings: {
    type: Number,
    default: 0
  },
  earningsType: {
    type: String,
    enum: ['signup_bonus', 'subscription_commission', 'deposit_bonus'],
    required: true
  },
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null
  },
  payoutDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
referralSchema.index({ referrer: 1, createdAt: -1 });
referralSchema.index({ referredUser: 1 });
referralSchema.index({ status: 1 });

// Static method to calculate referral earnings
referralSchema.statics.calculateEarnings = function(earningsType, amount) {
  switch (earningsType) {
    case 'signup_bonus':
      return 5; // Fixed $5 signup bonus
    case 'subscription_commission':
      return amount * 0.20; // 20% of first month subscription
    case 'deposit_bonus':
      return amount * 0.05; // 5% of lifetime deposits
    default:
      return 0;
  }
};

// Method to mark referral as paid
referralSchema.methods.markAsPaid = function() {
  this.status = 'paid';
  this.payoutDate = new Date();
  return this.save();
};

module.exports = mongoose.model('Referral', referralSchema);