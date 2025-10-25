const express = require('express');
const { body, validationResult } = require('express-validator');
const crypto = require('crypto');
const User = require('../models/User');
const Referral = require('../models/Referral');
const { generateToken, authenticateToken } = require('../middleware/auth');
const { sendEmail } = require('../utils/email');
const PendingRegistration = require('../models/PendingRegistration');

const router = express.Router();

// Validation middleware
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, referralCode } = req.body;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists in database
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        message: 'User already exists with this email',
        error: 'USER_EXISTS'
      });
    }

    // Validate referral code if provided
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (!referrer) {
        return res.status(400).json({
          message: 'Invalid referral code',
          error: 'INVALID_REFERRAL_CODE'
        });
      }
    }

    // Generate OTP code and expiry
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Check if there's an existing pending registration
    const existingPending = await PendingRegistration.findOne({ email: normalizedEmail });

    if (existingPending) {
      existingPending.name = name;
      existingPending.password = password;
      existingPending.otpCode = otpCode;
      existingPending.expiresAt = expiresAt;
      existingPending.referredBy = referrer ? referrer._id : null;
      existingPending.referralCode = referralCode || null;
      await existingPending.save();
    } else {
      const pending = new PendingRegistration({
        email: normalizedEmail,
        name,
        password,
        otpCode,
        expiresAt,
        referredBy: referrer ? referrer._id : null,
        referralCode: referralCode || null
      });
      await pending.save();
    }

    // Send verification email
    try {
      await sendEmail({
        to: normalizedEmail,
        template: 'emailVerification',
        data: {
          name: name,
          otpCode: otpCode,
          verifyUrl: `${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(normalizedEmail)}`
        }
      });

      res.status(201).json({
        message: 'Registration initiated! Please check your email for verification code.',
        requiresVerification: true,
        email: normalizedEmail
      });
    } catch (emailError) {
      console.error('Verification email failed:', emailError);
      // If email fails, keep the pending entry but inform the user
      res.status(500).json({
        message: 'Registration failed. Could not send verification email.',
        error: 'EMAIL_SEND_ERROR'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: 'Registration failed',
      error: 'REGISTRATION_ERROR'
    });
  }
});

// @route   POST /api/auth/verify-email
// @desc    Verify email with OTP
// @access  Public
router.post('/verify-email', async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    if (!email || !otpCode) {
      return res.status(400).json({
        message: 'Email and verification code are required'
      });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user is already verified in database
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return res.status(400).json({
          message: 'Email is already verified. Please login.',
          error: 'ALREADY_VERIFIED'
        });
      }
    }

    // Load pending registration
    const pending = await PendingRegistration.findOne({ email: normalizedEmail });
    if (!pending) {
      return res.status(400).json({
        message: 'Registration session expired. Please register again.'
      });
    }

    // Validate OTP and expiry
    if (pending.otpCode !== otpCode || pending.expiresAt <= new Date()) {
      return res.status(400).json({
        message: 'Invalid or expired verification code'
      });
    }

    // Create user in database
    const user = new User({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      isActive: true,
      isEmailVerified: true,
      referredBy: pending.referredBy
    });

    await user.save();

    // Create referral record if user was referred
    if (pending.referredBy) {
      const referralRecord = new Referral({
        referrer: pending.referredBy,
        referredUser: user._id,
        status: 'pending',
        earnings: 0,
        earningsType: 'signup'
      });
      await referralRecord.save();
    }

    // Remove pending registration
    await PendingRegistration.deleteOne({ _id: pending._id });

    // Generate token for immediate login
    const token = generateToken(user._id);

    // Send welcome email (non-blocking)
    try {
      await sendEmail({
        to: user.email,
        template: 'welcome',
        data: {
          name: user.name,
          loginUrl: `${process.env.FRONTEND_URL}/login`
        }
      });
    } catch (emailError) {
      console.error('Welcome email failed:', emailError);
    }

    res.json({
      message: 'Email verified successfully! Welcome to SureSport Picks!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        stats: user.stats
      }
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      message: 'Server error during email verification'
    });
  }
});

// @route   POST /api/auth/resend-verification
// @desc    Resend verification email
// @access  Public
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    // Find unverified user
    const user = await User.findOne({
      email: email.toLowerCase(),
      isEmailVerified: false
    });

    if (!user) {
      return res.status(400).json({
        message: 'User not found or already verified'
      });
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.emailVerificationToken = otpCode;
    user.emailVerificationExpire = otpExpiry;
    await user.save();

    // Send verification email
    await sendEmail({
      to: user.email,
      template: 'emailVerification',
      data: {
        name: user.name,
        otpCode: otpCode,
        verifyUrl: `${process.env.FRONTEND_URL}/verify-email?email=${encodeURIComponent(user.email)}`
      }
    });

    res.json({
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      message: 'Failed to resend verification email'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Account is deactivated. Please contact support.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Invalid email or password',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Check if email is verified (skip for admin users)
    if (!user.isEmailVerified && user.role !== 'admin') {
      return res.status(401).json({
        message: 'Please verify your email address before logging in',
        requiresVerification: true,
        email: user.email
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan,
        planExpiry: user.planExpiry,
        stats: user.stats,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Login failed',
      error: 'LOGIN_ERROR'
    });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Please provide a valid email',
        errors: errors.array()
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - SureSport Picks',
        template: 'passwordReset',
        data: {
          name: user.name,
          resetUrl,
          expiryTime: '10 minutes'
        }
      });

      res.json({
        message: 'Password reset email sent successfully'
      });
    } catch (emailError) {
      console.error('Password reset email failed:', emailError);
      
      // Clear reset token if email fails
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      res.status(500).json({
        message: 'Email could not be sent. Please try again later.',
        error: 'EMAIL_SEND_ERROR'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: 'Password reset request failed',
      error: 'RESET_REQUEST_ERROR'
    });
  }
});

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Password validation failed',
        errors: errors.array()
      });
    }

    const { token } = req.params;
    const { password } = req.body;

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset token',
        error: 'INVALID_TOKEN'
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // Generate new login token
    const loginToken = generateToken(user._id);

    res.json({
      message: 'Password reset successful',
      token: loginToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        plan: user.plan
      }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: 'Password reset failed',
      error: 'RESET_ERROR'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        plan: req.user.plan,
        planExpiry: req.user.planExpiry,
        stats: req.user.stats,
        lastLogin: req.user.lastLogin,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      message: 'Failed to get user information',
      error: 'GET_USER_ERROR'
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify if token is valid
// @access  Private
router.post('/verify-token', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    valid: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      plan: req.user.plan
    }
  });
});

module.exports = router;