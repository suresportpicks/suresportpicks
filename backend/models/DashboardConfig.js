const mongoose = require('mongoose')

const ModulesSchema = new mongoose.Schema({
  showQuickActions: { type: Boolean, default: true },
  showBalance: { type: Boolean, default: true },
  showStats: { type: Boolean, default: true },
  showRecentPicks: { type: Boolean, default: true },
  showAnnouncements: { type: Boolean, default: true }
}, { _id: false })

const HeroSchema = new mongoose.Schema({
  enabled: { type: Boolean, default: false },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' }
}, { _id: false })

const DashboardConfigSchema = new mongoose.Schema({
  modules: { type: ModulesSchema, default: () => ({}) },
  hero: { type: HeroSchema, default: () => ({}) },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

// Ensure single document in collection
DashboardConfigSchema.statics.getSingleton = async function() {
  let doc = await this.findOne()
  if (!doc) {
    doc = await this.create({})
  }
  return doc
}

module.exports = mongoose.model('DashboardConfig', DashboardConfigSchema)