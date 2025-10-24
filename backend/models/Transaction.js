const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['deposit', 'withdraw', 'referral', 'subscription'], required: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'USD', uppercase: true },
  status: { type: String, enum: ['completed', 'pending', 'processing', 'failed', 'cancelled', 'waiting_for_deposit'], default: 'pending' },
  description: { type: String, trim: true, maxlength: 500 },
  transactionId: { type: String, trim: true },
  paymentMethod: { type: String, trim: true },
  withdrawMethod: { type: String, trim: true },
  bankDetails: {
    accountNumber: { type: String, trim: true },
    routingNumber: { type: String, trim: true },
    accountName: { type: String, trim: true }
  },
  // Admin payment details for deposits
  adminPaymentDetails: {
    instructions: { type: String, trim: true, maxlength: 1000 },
    accountInfo: { type: String, trim: true, maxlength: 500 },
    reference: { type: String, trim: true, maxlength: 100 },
    notes: { type: String, trim: true, maxlength: 500 },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    updatedAt: { type: Date }
  },
  meta: { type: Object, default: {} }
}, { timestamps: true })

transactionSchema.index({ userId: 1, createdAt: -1 })
transactionSchema.index({ type: 1, status: 1 })

module.exports = mongoose.model('Transaction', transactionSchema)