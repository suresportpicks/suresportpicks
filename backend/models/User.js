const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  plan: {
    type: String,
    enum: ['free', 'silver', 'gold'],
    default: 'free'
  },
  planExpiry: {
    type: Date,
    default: null
  },
  stats: {
    winRate: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalPicks: {
      type: Number,
      default: 0,
      min: 0
    },
    profit: {
      type: Number,
      default: 0
    },
    roi: {
      type: Number,
      default: 0
    },
    wonBets: {
      type: Number,
      default: 0,
      min: 0
    },
    lostBets: {
      type: Number,
      default: 0,
      min: 0
    },
    refundedBets: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  // Referral system fields
  referralCode: {
    type: String,
    unique: true,
    sparse: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  referralEarnings: {
    total: {
      type: Number,
      default: 0
    },
    pending: {
      type: Number,
      default: 0
    },
    paid: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if user has active plan
userSchema.methods.hasActivePlan = function() {
  if (this.plan === 'free') return true;
  return this.planExpiry && this.planExpiry > new Date();
};

// Get user's accessible picks based on plan
userSchema.methods.getAccessLevel = function() {
  if (this.role === 'admin') return 'admin';
  if (this.plan === 'free') return 'free';
  if (this.hasActivePlan()) return this.plan;
  return 'free'; // Expired plan defaults to free
};

// Generate unique referral code
userSchema.methods.generateReferralCode = async function() {
  if (this.referralCode) return this.referralCode;
  
  const crypto = require('crypto');
  let referralCode;
  let isUnique = false;
  
  while (!isUnique) {
    // Generate a 8-character alphanumeric code
    referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    
    // Check if this code already exists
    const existingUser = await mongoose.model('User').findOne({ referralCode });
    if (!existingUser) {
      isUnique = true;
    }
  }
  
  this.referralCode = referralCode;
  await this.save();
  return referralCode;
};

module.exports = mongoose.model('User', userSchema);