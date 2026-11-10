const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error', 'promotion'],
    default: 'info'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'free', 'silver', 'gold', 'admin'],
    default: 'all'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  metadata: {
    link: {
      type: String,
      trim: true
    },
    linkText: {
      type: String,
      trim: true,
      default: 'Learn More'
    },
    icon: {
      type: String,
      trim: true
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
announcementSchema.index({ isActive: 1, createdAt: -1 });
announcementSchema.index({ targetAudience: 1, isActive: 1 });
announcementSchema.index({ isPinned: 1, priority: 1 });
announcementSchema.index({ expiresAt: 1 });

// Static method to get active announcements for user
announcementSchema.statics.getForUser = function(userPlan = 'free') {
  const now = new Date();
  const targetAudiences = ['all', userPlan];
  
  return this.find({
    isActive: true,
    targetAudience: { $in: targetAudiences },
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: now } }
    ]
  })
  .sort({ isPinned: -1, priority: -1, createdAt: -1 })
  .populate('createdBy', 'name')
  .limit(10);
};

// Static method to get pinned announcements
announcementSchema.statics.getPinned = function() {
  const now = new Date();
  
  return this.find({
    isActive: true,
    isPinned: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: now } }
    ]
  })
  .sort({ priority: -1, createdAt: -1 })
  .populate('createdBy', 'name');
};

// Method to mark as read by user
announcementSchema.methods.markAsRead = async function(userId) {
  const alreadyRead = this.readBy.some(read => read.user.toString() === userId.toString());
  
  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
    await this.save();
  }
  
  return this;
};

// Method to check if user has read announcement
announcementSchema.methods.isReadBy = function(userId) {
  return this.readBy.some(read => read.user.toString() === userId.toString());
};

// Virtual for read count
announcementSchema.virtual('readCount').get(function() {
  return this.readBy.length;
});

// Virtual for time since creation
announcementSchema.virtual('timeAgo').get(function() {
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

// Virtual for status badge
announcementSchema.virtual('statusBadge').get(function() {
  const badges = {
    'info': { color: 'blue', icon: 'ℹ️' },
    'success': { color: 'green', icon: '✅' },
    'warning': { color: 'yellow', icon: '⚠️' },
    'error': { color: 'red', icon: '❌' },
    'promotion': { color: 'purple', icon: '🎉' }
  };
  
  return badges[this.type] || badges.info;
});

// Ensure virtual fields are serialized
announcementSchema.set('toJSON', { virtuals: true });
announcementSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Announcement', announcementSchema);