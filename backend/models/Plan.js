const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plan name is required'],
    unique: true,
    trim: true,
    enum: ['free', 'silver', 'gold']
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration in days is required'],
    min: [1, 'Duration must be at least 1 day']
  },
  features: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    included: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      trim: true
    }
  }],
  limits: {
    picksPerDay: {
      type: Number,
      default: null // null means unlimited
    },
    accessLevel: {
      type: String,
      enum: ['free', 'silver', 'gold'],
      required: true
    },
    supportLevel: {
      type: String,
      enum: ['basic', 'priority', 'premium'],
      default: 'basic'
    }
  },
  badge: {
    color: {
      type: String,
      default: '#6B7280' // gray
    },
    icon: {
      type: String,
      default: '⭐'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
planSchema.index({ order: 1, isActive: 1 });
planSchema.index({ name: 1 });

// Static method to get all active plans
planSchema.statics.getActivePlans = function() {
  return this.find({ isActive: true }).sort({ order: 1 });
};

// Method to check if plan allows access to specific content
planSchema.methods.allowsAccess = function(requiredLevel) {
  const hierarchy = {
    'free': 0,
    'silver': 1,
    'gold': 2
  };
  
  return hierarchy[this.limits.accessLevel] >= hierarchy[requiredLevel];
};

// Virtual for formatted price
planSchema.virtual('formattedPrice').get(function() {
  if (this.price === 0) return 'Free';
  return `$${this.price}/${this.duration === 30 ? 'month' : this.duration + ' days'}`;
});

// Ensure virtual fields are serialized
planSchema.set('toJSON', { virtuals: true });
planSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Plan', planSchema);