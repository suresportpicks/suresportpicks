const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        error: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database to ensure they still exist and are active
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        error: 'TOKEN_EXPIRED'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      message: 'Authentication error',
      error: 'AUTH_ERROR'
    });
  }
};

// Check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      error: 'NO_AUTH'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      message: 'Admin access required',
      error: 'INSUFFICIENT_PERMISSIONS'
    });
  }

  next();
};

// Check if user has specific plan or higher
const requirePlan = (requiredPlan) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'NO_AUTH'
      });
    }

    const planHierarchy = {
      'free': 0,
      'silver': 1,
      'gold': 2,
      'admin': 3
    };

    const userLevel = req.user.role === 'admin' ? 3 : planHierarchy[req.user.plan] || 0;
    const requiredLevel = planHierarchy[requiredPlan] || 0;

    if (userLevel < requiredLevel) {
      return res.status(403).json({ 
        message: `${requiredPlan} plan or higher required`,
        error: 'INSUFFICIENT_PLAN',
        currentPlan: req.user.plan,
        requiredPlan
      });
    }

    // Check if paid plan is still active
    if (req.user.plan !== 'free' && req.user.role !== 'admin') {
      if (!req.user.hasActivePlan()) {
        return res.status(403).json({ 
          message: 'Plan has expired. Please renew your subscription.',
          error: 'PLAN_EXPIRED',
          currentPlan: req.user.plan,
          planExpiry: req.user.planExpiry
        });
      }
    }

    next();
  };
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail for optional auth
    console.log('Optional auth failed:', error.message);
  }
  
  next();
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
};

// Generate refresh token (longer expiry)
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' } // Refresh token expires in 30 days
  );
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requirePlan,
  optionalAuth,
  generateToken,
  generateRefreshToken
};