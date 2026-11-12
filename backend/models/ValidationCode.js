const mongoose = require('mongoose');

const validationCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['VAT', 'BOT'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  withdrawalAmount: {
    type: Number,
    required: true
  },
  used: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Document will be automatically deleted when expiresAt is reached
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
validationCodeSchema.index({ userId: 1, used: 1 });

const ValidationCode = mongoose.model('ValidationCode', validationCodeSchema);

module.exports = ValidationCode;