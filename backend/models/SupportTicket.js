const mongoose = require('mongoose')

const responseSchema = new mongoose.Schema({
  message: { type: String, required: true, trim: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { _id: false })

const supportTicketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  subject: { type: String, required: true, trim: true, maxlength: 200 },
  category: {
    type: String,
    enum: ['general', 'account', 'payment', 'technical', 'picks', 'subscription', 'refund'],
    default: 'general'
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  responses: { type: [responseSchema], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true })

supportTicketSchema.index({ userId: 1, createdAt: -1 })
supportTicketSchema.index({ status: 1 })

// Helper to generate a readable ticket number
supportTicketSchema.statics.generateTicketNumber = async function () {
  const today = new Date()
  const y = today.getFullYear()
  const m = String(today.getMonth() + 1).padStart(2, '0')
  const d = String(today.getDate()).padStart(2, '0')
  // Try up to 5 attempts to avoid collision
  for (let i = 0; i < 5; i++) {
    const rand = Math.floor(1000 + Math.random() * 9000)
    const candidate = `SP-${y}${m}${d}-${rand}`
    const exists = await this.exists({ ticketNumber: candidate })
    if (!exists) return candidate
  }
  // Fallback to ObjectId-based
  return `SP-${y}${m}${d}-${new mongoose.Types.ObjectId().toString().slice(-6)}`
}

module.exports = mongoose.model('SupportTicket', supportTicketSchema)