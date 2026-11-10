const mongoose = require('mongoose');

const pickSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: [true, 'Sport is required'],
    enum: ['basketball', 'football', 'soccer', 'baseball', 'hockey', 'tennis'],
    lowercase: true
  },
  league: {
    type: String,
    required: [true, 'League is required'],
    trim: true
  },
  homeTeam: {
    type: String,
    required: [true, 'Home team is required'],
    trim: true
  },
  awayTeam: {
    type: String,
    required: [true, 'Away team is required'],
    trim: true
  },
  matchDate: {
    type: Date,
    required: [true, 'Match date is required']
  },
  prediction: {
    type: String,
    required: [true, 'Prediction is required'],
    enum: ['home', 'away', 'draw', 'over', 'under'],
    lowercase: true
  },
  odds: {
    home: {
      type: Number,
      required: true,
      min: 1.01
    },
    away: {
      type: Number,
      required: true,
      min: 1.01
    },
    draw: {
      type: Number,
      default: null,
      min: 1.01
    }
  },
  confidence: {
    type: Number,
    required: [true, 'Confidence level is required'],
    min: [1, 'Confidence must be at least 1%'],
    max: [100, 'Confidence cannot exceed 100%']
  },
  aiConfidence: {
    type: Number,
    min: 1,
    max: 100,
    default: function() {
      return this.confidence;
    }
  },
  stake: {
    type: Number,
    required: [true, 'Stake amount is required'],
    min: [1, 'Stake must be at least $1']
  },
  potentialReturn: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'won', 'lost', 'void', 'postponed'],
    default: 'pending'
  },
  result: {
    homeScore: {
      type: Number,
      default: null
    },
    awayScore: {
      type: Number,
      default: null
    },
    actualResult: {
      type: String,
      enum: ['home', 'away', 'draw'],
      default: null
    }
  },
  accessLevel: {
    type: String,
    enum: ['free', 'silver', 'gold'],
    required: [true, 'Access level is required'],
    default: 'free'
  },
  tags: [{
    type: String,
    trim: true
  }],
  analysis: {
    type: String,
    maxlength: [1000, 'Analysis cannot exceed 1000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate potential return before saving
pickSchema.pre('save', function(next) {
  if (this.isModified('stake') || this.isModified('odds') || this.isModified('prediction')) {
    let selectedOdds;
    switch (this.prediction) {
      case 'home':
        selectedOdds = this.odds.home;
        break;
      case 'away':
        selectedOdds = this.odds.away;
        break;
      case 'draw':
        selectedOdds = this.odds.draw || 3.0;
        break;
      default:
        selectedOdds = this.odds.home; // fallback
    }
    this.potentialReturn = this.stake * selectedOdds;
  }
  next();
});

// Index for efficient queries
pickSchema.index({ matchDate: -1 });
pickSchema.index({ sport: 1, status: 1 });
pickSchema.index({ accessLevel: 1, isActive: 1 });
pickSchema.index({ createdAt: -1 });

// Static method to get picks by access level
pickSchema.statics.getPicksByAccess = function(accessLevel, limit = 10) {
  const accessLevels = {
    'free': ['free'],
    'silver': ['free', 'silver'],
    'gold': ['free', 'silver', 'gold'],
    'admin': ['free', 'silver', 'gold']
  };
  
  return this.find({
    accessLevel: { $in: accessLevels[accessLevel] || ['free'] },
    isActive: true
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('createdBy', 'name');
};

// Method to check if pick is accessible to user
pickSchema.methods.isAccessibleTo = function(userAccessLevel) {
  const hierarchy = {
    'free': 0,
    'silver': 1,
    'gold': 2,
    'admin': 3
  };
  
  return hierarchy[userAccessLevel] >= hierarchy[this.accessLevel];
};

module.exports = mongoose.model('Pick', pickSchema);