const express = require('express');
const { body, validationResult } = require('express-validator');
const PaymentRequest = require('../models/PaymentRequest');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Referral = require('../models/Referral');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendPaymentNotification } = require('../utils/email');
const Transaction = require('../models/Transaction');
const WithdrawalRequest = require('../models/WithdrawalRequest');

const router = express.Router();

// Helper function to process referral earnings
async function processReferralEarnings(user, paymentAmount) {
  try {
    const referrer = await User.findById(user.referredBy);
    if (!referrer) return;

    // Calculate referral earnings (10% of payment amount)
    const earningsAmount = Math.round(paymentAmount * 0.10 * 100) / 100; // Round to 2 decimal places

    // Find the referral record
    const referralRecord = await Referral.findOne({
      referrer: referrer._id,
      referredUser: user._id
    });

    if (referralRecord) {
      // Update referral record
      referralRecord.status = 'active';
      referralRecord.earnings = earningsAmount;
      referralRecord.earningsType = 'subscription';
      await referralRecord.save();

      // Update referrer's earnings
      if (!referrer.referralEarnings) {
        referrer.referralEarnings = { total: 0, pending: 0, paid: 0 };
      }
      
      referrer.referralEarnings.total += earningsAmount;
      referrer.referralEarnings.pending += earningsAmount;
      await referrer.save();

      console.log(`Referral earnings processed: $${earningsAmount} for referrer ${referrer.email}`);
    }
  } catch (error) {
    console.error('Error processing referral earnings:', error);
  }
}

// Generate unique transaction ID
const generateTransactionId = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp.slice(-6)}${random}`;
};

// Validation middleware
const validatePaymentRequest = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('plan')
    .isIn(['silver', 'gold'])
    .withMessage('Invalid plan selected'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters')
];

// @route   POST /api/payments/request
// @desc    Submit payment request
// @access  Public
router.post('/request', validatePaymentRequest, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, plan, message } = req.body;

    // Get plan details to determine amount
    const planDetails = await Plan.findOne({ name: plan, isActive: true });
    if (!planDetails) {
      return res.status(400).json({
        message: 'Invalid plan selected',
        error: 'INVALID_PLAN'
      });
    }

    // Check if user exists and link the request
    const existingUser = await User.findOne({ email });

    // Create payment request
    const paymentRequest = new PaymentRequest({
      name,
      email,
      plan,
      message,
      amount: planDetails.price,
      userId: existingUser ? existingUser._id : null,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await paymentRequest.save();

    // Send notification email to admin
    try {
      await sendPaymentNotification({
        name,
        email,
        plan,
        message,
        amount: planDetails.price
      });
    } catch (emailError) {
      console.error('Payment notification email failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      message: 'Payment request submitted successfully',
      paymentRequest: {
        id: paymentRequest._id,
        name: paymentRequest.name,
        email: paymentRequest.email,
        plan: paymentRequest.plan,
        amount: paymentRequest.amount,
        status: paymentRequest.status,
        createdAt: paymentRequest.createdAt
      }
    });
  } catch (error) {
    console.error('Payment request error:', error);
    res.status(500).json({
      message: 'Failed to submit payment request',
      error: 'PAYMENT_REQUEST_ERROR'
    });
  }
});

// @route   GET /api/payments/requests
// @desc    Get all payment requests (Admin only)
// @access  Private (Admin)
router.get('/requests', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;

    const query = { isActive: true };
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const paymentRequests = await PaymentRequest.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('userId', 'name email plan')
      .populate('processedBy', 'name email');

    const total = await PaymentRequest.countDocuments(query);

    // Get summary statistics
    const stats = await PaymentRequest.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const summary = {
      pending: 0,
      approved: 0,
      rejected: 0,
      processing: 0,
      totalRevenue: 0
    };

    stats.forEach(stat => {
      summary[stat._id] = stat.count;
      if (stat._id === 'approved') {
        summary.totalRevenue = stat.totalAmount;
      }
    });

    res.json({
      paymentRequests,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      summary
    });
  } catch (error) {
    console.error('Get payment requests error:', error);
    res.status(500).json({
      message: 'Failed to fetch payment requests',
      error: 'FETCH_REQUESTS_ERROR'
    });
  }
});

// @route   GET /api/payments/requests/:id
// @desc    Get single payment request (Admin only)
// @access  Private (Admin)
router.get('/requests/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paymentRequest = await PaymentRequest.findById(req.params.id)
      .populate('userId', 'name email plan planExpiry stats')
      .populate('processedBy', 'name email');

    if (!paymentRequest) {
      return res.status(404).json({
        message: 'Payment request not found',
        error: 'REQUEST_NOT_FOUND'
      });
    }

    res.json({
      paymentRequest
    });
  } catch (error) {
    console.error('Get payment request error:', error);
    res.status(500).json({
      message: 'Failed to fetch payment request',
      error: 'FETCH_REQUEST_ERROR'
    });
  }
});

// @route   PUT /api/payments/requests/:id/approve
// @desc    Approve payment request (Admin only)
// @access  Private (Admin)
router.put('/requests/:id/approve', authenticateToken, requireAdmin, [
  body('transactionId')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Transaction ID cannot exceed 100 characters'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { transactionId, notes } = req.body;

    const paymentRequest = await PaymentRequest.findById(req.params.id);
    if (!paymentRequest) {
      return res.status(404).json({
        message: 'Payment request not found',
        error: 'REQUEST_NOT_FOUND'
      });
    }

    if (paymentRequest.status !== 'pending') {
      return res.status(400).json({
        message: 'Payment request has already been processed',
        error: 'ALREADY_PROCESSED'
      });
    }

    // Approve the payment request
    await paymentRequest.approve(req.user._id, transactionId, notes);

    // Update user's plan if user exists
    if (paymentRequest.userId) {
      const user = await User.findById(paymentRequest.userId);
      if (user) {
        const planDetails = await Plan.findOne({ name: paymentRequest.plan });
        if (planDetails) {
          user.plan = paymentRequest.plan;
          user.planExpiry = new Date(Date.now() + planDetails.duration * 24 * 60 * 60 * 1000);
          await user.save();

          // Process referral earnings if user was referred
          if (user.referredBy) {
            await processReferralEarnings(user, paymentRequest.amount);
          }
        }
      }
    } else {
      // Create new user account if email doesn't exist
      const existingUser = await User.findOne({ email: paymentRequest.email });
      if (!existingUser) {
        const planDetails = await Plan.findOne({ name: paymentRequest.plan });
        if (planDetails) {
          const newUser = new User({
            name: paymentRequest.name,
            email: paymentRequest.email,
            password: 'TempPassword123!', // User will need to reset
            plan: paymentRequest.plan,
            planExpiry: new Date(Date.now() + planDetails.duration * 24 * 60 * 60 * 1000)
          });
          await newUser.save();
          
          // Update payment request with new user ID
          paymentRequest.userId = newUser._id;
          await paymentRequest.save();

          // Process referral earnings if user was referred
          if (newUser.referredBy) {
            await processReferralEarnings(newUser, paymentRequest.amount);
          }
        }
      }
    }

    await paymentRequest.populate('userId', 'name email plan planExpiry');
    await paymentRequest.populate('processedBy', 'name email');

    res.json({
      message: 'Payment request approved successfully',
      paymentRequest
    });
  } catch (error) {
    console.error('Approve payment error:', error);
    res.status(500).json({
      message: 'Failed to approve payment request',
      error: 'APPROVE_ERROR'
    });
  }
});

// @route   PUT /api/payments/requests/:id/reject
// @desc    Reject payment request (Admin only)
// @access  Private (Admin)
router.put('/requests/:id/reject', authenticateToken, requireAdmin, [
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reason cannot exceed 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { reason } = req.body;

    const paymentRequest = await PaymentRequest.findById(req.params.id);
    if (!paymentRequest) {
      return res.status(404).json({
        message: 'Payment request not found',
        error: 'REQUEST_NOT_FOUND'
      });
    }

    if (paymentRequest.status !== 'pending') {
      return res.status(400).json({
        message: 'Payment request has already been processed',
        error: 'ALREADY_PROCESSED'
      });
    }

    // Reject the payment request
    await paymentRequest.reject(req.user._id, reason);

    await paymentRequest.populate('userId', 'name email plan');
    await paymentRequest.populate('processedBy', 'name email');

    res.json({
      message: 'Payment request rejected',
      paymentRequest
    });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({
      message: 'Failed to reject payment request',
      error: 'REJECT_ERROR'
    });
  }
});

// @route   GET /api/payments/my-requests
// @desc    Get user's payment requests
// @access  Private
router.get('/my-requests', authenticateToken, async (req, res) => {
  try {
    const paymentRequests = await PaymentRequest.find({
      $or: [
        { userId: req.user._id },
        { email: req.user.email }
      ],
      isActive: true
    })
    .sort({ createdAt: -1 })
    .select('-ipAddress -userAgent -adminNotes')
    .populate('processedBy', 'name');

    res.json({
      paymentRequests
    });
  } catch (error) {
    console.error('Get my payment requests error:', error);
    res.status(500).json({
      message: 'Failed to fetch your payment requests',
      error: 'FETCH_MY_REQUESTS_ERROR'
    });
  }
});

// @route   DELETE /api/payments/requests/:id
// @desc    Delete payment request (Admin only)
// @access  Private (Admin)
router.delete('/requests/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const paymentRequest = await PaymentRequest.findById(req.params.id);
    
    if (!paymentRequest) {
      return res.status(404).json({
        message: 'Payment request not found',
        error: 'REQUEST_NOT_FOUND'
      });
    }

    // Soft delete
    paymentRequest.isActive = false;
    await paymentRequest.save();

    res.json({
      message: 'Payment request deleted successfully'
    });
  } catch (error) {
    console.error('Delete payment request error:', error);
    res.status(500).json({
      message: 'Failed to delete payment request',
      error: 'DELETE_REQUEST_ERROR'
    });
  }
});

// Deposit endpoints
router.post('/deposit', authenticateToken, [
body('amount').isFloat({ min: 10 }).withMessage('Minimum deposit is $10'),
body('paymentMethod').isIn(['paypal','venmo','zelle','cashapp','applepay','googlepay','bank','wise','skrill','neteller','westernunion','moneygram','crypto']).withMessage('Invalid payment method')
], async (req, res) => {
try {
const errors = validationResult(req)
if (!errors.isEmpty()) {
return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
}

const { amount, paymentMethod } = req.body

const deposit = await Transaction.create({
userId: req.user._id,
type: 'deposit',
amount,
currency: 'USD',
paymentMethod,
status: 'pending',
description: `Deposit via ${paymentMethod}`,
transactionId: generateTransactionId()
})

res.status(201).json({
message: 'Deposit initiated successfully',
deposit
})
} catch (error) {
console.error('Deposit error:', error)
res.status(500).json({ message: 'Deposit failed', error: 'DEPOSIT_ERROR' })
}
})

router.get('/deposits', authenticateToken, async (req, res) => {
try {
const deposits = await Transaction.find({ userId: req.user._id, type: 'deposit' })
.sort({ createdAt: -1 })
res.json({ deposits })
} catch (error) {
console.error('Fetch deposits error:', error)
res.status(500).json({ message: 'Failed to fetch deposits', error: 'FETCH_DEPOSITS_ERROR' })
}
})

// Withdraw endpoints
router.post('/withdraw', authenticateToken, [
body('amount').isFloat({ min: 20 }).withMessage('Minimum withdrawal is $20'),
body('withdrawMethod').isIn(['paypal','venmo','zelle','cashapp','applepay','googlepay','bank','wise','skrill','neteller','westernunion','moneygram','crypto']).withMessage('Invalid withdraw method'),
body('paymentDetails').optional().isObject(),
body('bankDetails.accountName').optional({ values: 'falsy' }).isString(),
body('bankDetails.accountNumber').optional({ values: 'falsy' }).isString(),
body('bankDetails.routingNumber').optional({ values: 'falsy' }).isString()
], async (req, res) => {
try {
const errors = validationResult(req)
if (!errors.isEmpty()) {
return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
}

const { amount, withdrawMethod, bankDetails, paymentDetails } = req.body

// Check user balance
const user = await User.findById(req.user._id)
if (user.balance < amount) {
return res.status(400).json({ 
message: 'Insufficient balance', 
error: 'INSUFFICIENT_BALANCE',
availableBalance: user.balance,
requestedAmount: amount
})
}

// Prepare payment details based on method
let finalPaymentDetails = {}

if (withdrawMethod === 'bank') {
if (!bankDetails || !bankDetails.accountName || !bankDetails.accountNumber || !bankDetails.routingNumber) {
return res.status(400).json({ message: 'Bank details are required for bank transfer', error: 'BANK_DETAILS_REQUIRED' })
}
finalPaymentDetails = {
accountName: bankDetails.accountName,
accountNumber: bankDetails.accountNumber,
routingNumber: bankDetails.routingNumber,
bankName: bankDetails.bankName || 'Not specified'
}
} else if (paymentDetails) {
finalPaymentDetails = paymentDetails
}

// Create withdrawal request
    const withdrawalRequest = await WithdrawalRequest.create({
      user: req.user._id,
      amount,
      paymentMethod: withdrawMethod,
      paymentDetails: finalPaymentDetails,
      status: 'imf_required',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    })

res.status(201).json({
message: 'Withdrawal request submitted successfully',
withdrawalRequest: {
id: withdrawalRequest._id,
amount: withdrawalRequest.amount,
paymentMethod: withdrawalRequest.paymentMethod,
status: withdrawalRequest.status,
requestedAt: withdrawalRequest.requestedAt
}
})
} catch (error) {
console.error('Withdraw error:', error)
res.status(500).json({ message: 'Withdrawal failed', error: 'WITHDRAW_ERROR' })
}
})

router.get('/withdrawals', authenticateToken, async (req, res) => {
try {
// Get withdrawal requests for this user
  const withdrawalRequests = await WithdrawalRequest.find({ user: req.user._id, isActive: true })
    .sort({ createdAt: -1 })
    .populate('processedBy', 'username email')
  
  // Debug: Log withdrawal requests to see rejectionReason values
  console.log('Withdrawal requests from DB:', withdrawalRequests.map(req => ({
    id: req._id,
    status: req.status,
    rejectionReason: req.rejectionReason,
    hasRejectionReason: !!req.rejectionReason
  })))

// Get completed withdrawal transactions for this user
const withdrawalTransactions = await Transaction.find({ 
userId: req.user._id, 
type: 'withdraw' 
})
.sort({ createdAt: -1 })

// Helper function to calculate time ago
const getTimeAgo = (date) => {
const now = new Date();
const diff = now - new Date(date);
const minutes = Math.floor(diff / 60000);
const hours = Math.floor(minutes / 60);
const days = Math.floor(hours / 24);

if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
return 'Just now';
};

// Format withdrawal requests
const formattedRequests = withdrawalRequests.map(request => ({
id: request._id,
type: 'request',
user: {
  _id: request.user,
  email: req.user.email
},
amount: request.amount,
currency: request.currency,
paymentMethod: request.paymentMethod,
paymentDetails: request.paymentDetails,
status: request.status,
rejectionReason: request.rejectionReason,
adminNotes: request.adminNotes,
transactionId: request.transactionId,
createdAt: request.createdAt,
updatedAt: request.updatedAt,
processedBy: request.processedBy,
processedAt: request.processedAt,
requestedAt: request.requestedAt,
netAmount: request.netAmount,
formattedAmount: `${request.currency} $${request.amount.toFixed(2)}`,
formattedNetAmount: `${request.currency} $${request.netAmount.toFixed(2)}`,
timeAgo: getTimeAgo(request.createdAt)
}));

// Format withdrawal transactions
const formattedTransactions = withdrawalTransactions.map(transaction => ({
id: transaction._id,
type: 'transaction',
user: {
_id: transaction.userId,
email: req.user.email
},
amount: transaction.amount,
currency: transaction.currency || 'USD',
paymentMethod: transaction.withdrawMethod || 'N/A',
paymentDetails: transaction.bankDetails || {},
status: transaction.status,
createdAt: transaction.createdAt,
updatedAt: transaction.updatedAt,
transactionId: transaction.transactionId,
description: transaction.description,
formattedAmount: `${transaction.currency || 'USD'} $${transaction.amount.toFixed(2)}`,
timeAgo: getTimeAgo(transaction.createdAt)
}));

// Combine and sort by creation date (newest first)
const combinedWithdrawals = [...formattedRequests, ...formattedTransactions]
.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

res.json({ withdrawals: combinedWithdrawals })
} catch (error) {
console.error('Fetch withdrawals error:', error)
res.status(500).json({ message: 'Failed to fetch withdrawals', error: 'FETCH_WITHDRAWALS_ERROR' })
}
})

// Transactions history with filters and pagination
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, dateRange, search } = req.query

    const query = { userId: req.user._id }

if (type) {
query.type = type
}

// Date range filter
if (dateRange) {
const now = new Date()
let start
switch (dateRange) {
case 'today':
start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
break
case 'week':
start = new Date(now)
start.setDate(start.getDate() - 7)
break
case 'month':
start = new Date(now)
start.setMonth(start.getMonth() - 1)
break
case 'year':
start = new Date(now)
start.setFullYear(start.getFullYear() - 1)
break
default:
start = null
}
if (start) {
query.createdAt = { $gte: start }
}
}

// Search filter
if (search) {
const regex = new RegExp(search, 'i')
query.$or = [
{ description: regex },
{ transactionId: regex },
{ paymentMethod: regex },
{ withdrawMethod: regex }
]
}

const skip = (parseInt(page) - 1) * parseInt(limit)

const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(query)
    ])

    res.json({
      transactions,
      total,
      totalPages: Math.ceil(total / parseInt(limit))
    })
} catch (error) {
console.error('Fetch transactions error:', error)
res.status(500).json({ message: 'Failed to fetch transactions', error: 'FETCH_TRANSACTIONS_ERROR' })
}
})

// @route   POST /api/payments/withdrawal/:id/vat-code
// @desc    Submit VAT code for withdrawal verification
// @access  Private
router.post('/withdrawal/:id/vat-code', authenticateToken, async (req, res) => {
  try {
    const { vatCode } = req.body;
    
    if (!vatCode || !vatCode.trim()) {
      return res.status(400).json({ message: 'VAT code is required' });
    }

    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id);
    
    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    // Check if the withdrawal belongs to the authenticated user
    if (withdrawalRequest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if withdrawal is in the correct status
    if (withdrawalRequest.status !== 'imf_required') {
      return res.status(400).json({ message: 'VAT code can only be submitted for withdrawals requiring IMF verification' });
    }

    // Update withdrawal with VAT code
    withdrawalRequest.vatCode = {
      code: vatCode.trim(),
      submittedAt: new Date()
    };
    withdrawalRequest.status = 'vat_pending';
    
    await withdrawalRequest.save();

    res.json({
      message: 'VAT code submitted successfully. Waiting for admin confirmation.',
      withdrawalRequest
    });
  } catch (error) {
    console.error('VAT code submission error:', error);
    res.status(500).json({ message: 'Failed to submit VAT code' });
  }
});

// @route   POST /api/payments/withdrawal/:id/bot-code
// @desc    Submit BOT code for withdrawal verification
// @access  Private
router.post('/withdrawal/:id/bot-code', authenticateToken, async (req, res) => {
  try {
    const { botCode } = req.body;
    
    if (!botCode || !botCode.trim()) {
      return res.status(400).json({ message: 'BOT code is required' });
    }

    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id);
    
    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    // Check if the withdrawal belongs to the authenticated user
    if (withdrawalRequest.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if withdrawal is in the correct status
    if (withdrawalRequest.status !== 'bot_required') {
      return res.status(400).json({ message: 'BOT code can only be submitted for withdrawals requiring BOT verification' });
    }

    // Update withdrawal with BOT code
    withdrawalRequest.botCode = {
      code: botCode.trim(),
      submittedAt: new Date()
    };
    withdrawalRequest.status = 'bot_pending';
    
    await withdrawalRequest.save();

    res.json({
      message: 'BOT code submitted successfully. Your withdrawal will be processed shortly.',
      withdrawalRequest
    });
  } catch (error) {
    console.error('BOT code submission error:', error);
    res.status(500).json({ message: 'Failed to submit BOT code' });
  }
});

module.exports = router;