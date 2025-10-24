const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pick = require('../models/Pick');
const Transaction = require('../models/Transaction');
const SupportTicket = require('../models/SupportTicket');
const PaymentRequest = require('../models/PaymentRequest');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const DashboardConfig = require('../models/DashboardConfig');
const PaymentOption = require('../models/PaymentOption');
const Plan = require('../models/Plan');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Apply authentication and admin check to all routes
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/dashboard - Admin dashboard stats
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ plan: { $ne: 'free' } }),
      Pick.countDocuments(),
      Transaction.countDocuments(),
      SupportTicket.countDocuments({ status: 'open' }),
      PaymentRequest.countDocuments({ status: 'pending' })
    ]);

    const [
      totalUsers,
      activeUsers,
      adminUsers,
      paidUsers,
      totalPicks,
      totalTransactions,
      openTickets,
      pendingPayments
    ] = stats;

    // Get recent users (last 7 days)
    const recentUsers = await User.find({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    }).select('firstName lastName email plan createdAt').sort({ createdAt: -1 }).limit(10);

    // Get revenue this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: 'completed',
          type: 'payment'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' }
        }
      }
    ]);

    res.json({
      totalUsers,
      activeUsers,
      adminUsers,
      paidUsers,
      totalPicks,
      totalTransactions,
      openTickets,
      pendingPayments,
      recentUsers,
      monthlyRevenue: monthlyRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/admin/dashboard/config - Get current dashboard configuration
router.get('/dashboard/config', async (req, res) => {
  try {
    const config = await DashboardConfig.getSingleton()
    res.json({ config })
  } catch (error) {
    console.error('Get dashboard config error:', error)
    res.status(500).json({ message: 'Failed to fetch dashboard config' })
  }
})

// PUT /api/admin/dashboard/config - Update dashboard configuration
router.put('/dashboard/config', async (req, res) => {
  try {
    const { modules, hero } = req.body
    const config = await DashboardConfig.getSingleton()

    if (modules) {
      config.modules = { ...config.modules.toObject(), ...modules }
    }
    if (hero) {
      config.hero = { ...config.hero.toObject(), ...hero }
    }
    config.updatedBy = req.user._id
    config.updatedAt = new Date()
    await config.save()

    res.json({ message: 'Dashboard config updated', config })
  } catch (error) {
    console.error('Update dashboard config error:', error)
    res.status(500).json({ message: 'Failed to update dashboard config' })
  }
})

// GET /api/admin/users - Get all users with pagination and filters
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    if (req.query.plan) filter.plan = req.query.plan;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// GET /api/admin/users/:id - Get specific user details
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's transactions
    const transactions = await Transaction.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(10);

    // Get user's support tickets
    const tickets = await SupportTicket.find({ userId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      user,
      transactions,
      tickets
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// PUT /api/admin/users/:id - Update user details
router.put('/users/:id', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, plan, role, isActive, planExpiry } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user fields
    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (plan !== undefined) user.plan = plan;
    if (role !== undefined) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    if (planExpiry !== undefined) user.planExpiry = planExpiry;

    await user.save();

    res.json({ 
      message: 'User updated successfully',
      user: await User.findById(req.params.id).select('-password')
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// DELETE /api/admin/users/:id - Delete user account
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting other admin users
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot delete other admin users' });
    }

    // Delete user and related data
    await Promise.all([
      User.findByIdAndDelete(req.params.id),
      Transaction.deleteMany({ userId: req.params.id }),
      SupportTicket.deleteMany({ userId: req.params.id }),
      PaymentRequest.deleteMany({ userId: req.params.id })
    ]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// POST /api/admin/users/:id/activate - Activate user account
router.post('/users/:id/activate', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'User activated successfully',
      user
    });
  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ message: 'Failed to activate user' });
  }
});

// POST /api/admin/users/:id/deactivate - Deactivate user account
router.post('/users/:id/deactivate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deactivating other admin users
    if (user.role === 'admin' && user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Cannot deactivate other admin users' });
    }

    user.isActive = false;
    await user.save();

    res.json({ 
      message: 'User deactivated successfully',
      user: await User.findById(req.params.id).select('-password')
    });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Failed to deactivate user' });
  }
});

// GET /api/admin/transactions - Get all transactions
router.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const transactions = await Transaction.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

// GET /api/admin/support-tickets - Get all support tickets
router.get('/support-tickets', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tickets = await SupportTicket.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SupportTicket.countDocuments(filter);

    res.json({
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get support tickets error:', error);
    res.status(500).json({ message: 'Failed to fetch support tickets' });
  }
});

// PUT /api/admin/support-tickets/:id - Update support ticket
router.put('/support-tickets/:id', async (req, res) => {
  try {
    const { status, priority, response } = req.body;
    
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ message: 'Support ticket not found' });
    }

    if (status !== undefined) ticket.status = status;
    if (priority !== undefined) ticket.priority = priority;
    
    // Add admin response to the responses array if provided
    if (response !== undefined && response.trim()) {
      ticket.responses.push({
        message: response.trim(),
        isAdmin: true,
        createdAt: new Date()
      });
    }

    await ticket.save();

    const updatedTicket = await SupportTicket.findById(req.params.id)
      .populate('userId', 'firstName lastName email');

    res.json({ 
      message: 'Support ticket updated successfully',
      ticket: updatedTicket
    });
  } catch (error) {
    console.error('Update support ticket error:', error);
    res.status(500).json({ message: 'Failed to update support ticket' });
  }
});

// GET /api/admin/deposits - Get all deposit requests
router.get('/deposits', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = { type: 'deposit' };
    if (status) {
      filter.status = status;
    }

    const deposits = await Transaction.find(filter)
      .populate('userId', 'username email firstName lastName')
      .populate('adminPaymentDetails.updatedBy', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      deposits,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/deposits/:id/payment-details - Add payment details to deposit
router.put('/deposits/:id/payment-details', async (req, res) => {
  try {
    const { id } = req.params;
    const { instructions, accountInfo, reference, notes } = req.body;

    if (!instructions || !accountInfo) {
      return res.status(400).json({ message: 'Instructions and account info are required' });
    }

    const deposit = await Transaction.findOne({ _id: id, type: 'deposit' });
    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    if (deposit.status !== 'pending') {
      return res.status(400).json({ message: 'Can only add payment details to pending deposits' });
    }

    const updatedDeposit = await Transaction.findByIdAndUpdate(
      id,
      {
        status: 'waiting_for_deposit',
        adminPaymentDetails: {
          instructions,
          accountInfo,
          reference,
          notes,
          updatedBy: req.user.id,
          updatedAt: new Date()
        }
      },
      { new: true }
    ).populate('userId', 'username email firstName lastName');

    res.json({ 
      message: 'Payment details added successfully',
      deposit: updatedDeposit
    });
  } catch (error) {
    console.error('Error adding payment details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/deposits/:id/approve - Approve deposit
router.put('/deposits/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    const { transactionId, notes } = req.body;

    const deposit = await Transaction.findOne({ _id: id, type: 'deposit' });
    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    if (deposit.status !== 'waiting_for_deposit') {
      return res.status(400).json({ message: 'Can only approve deposits that are waiting for deposit' });
    }

    // Update user balance
    const user = await User.findById(deposit.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.balance += deposit.amount;
    await user.save();

    // Update transaction
    const updatedDeposit = await Transaction.findByIdAndUpdate(
      id,
      {
        status: 'completed',
        transactionId: transactionId || `DEP-${Date.now()}`,
        'adminPaymentDetails.notes': notes || deposit.adminPaymentDetails?.notes,
        'adminPaymentDetails.updatedBy': req.user.id,
        'adminPaymentDetails.updatedAt': new Date()
      },
      { new: true }
    ).populate('userId', 'username email firstName lastName');

    res.json({ 
      message: 'Deposit approved successfully',
      deposit: updatedDeposit,
      newBalance: user.balance
    });
  } catch (error) {
    console.error('Error approving deposit:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/deposits/:id/reject - Reject deposit
router.put('/deposits/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const deposit = await Transaction.findOne({ _id: id, type: 'deposit' });
    if (!deposit) {
      return res.status(404).json({ message: 'Deposit not found' });
    }

    if (deposit.status === 'completed') {
      return res.status(400).json({ message: 'Cannot reject completed deposits' });
    }

    const updatedDeposit = await Transaction.findByIdAndUpdate(
      id,
      {
        status: 'failed',
        description: reason || 'Deposit rejected by admin',
        'adminPaymentDetails.notes': reason,
        'adminPaymentDetails.updatedBy': req.user.id,
        'adminPaymentDetails.updatedAt': new Date()
      },
      { new: true }
    ).populate('userId', 'username email firstName lastName');

    res.json({ 
      message: 'Deposit rejected successfully',
      deposit: updatedDeposit
    });
  } catch (error) {
    console.error('Error rejecting deposit:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/admin/users/:id/betting-stats - Update user betting statistics
router.put('/users/:id/betting-stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { wonBets, lostBets, refundedBets } = req.body;

    // Validate input
    if (wonBets !== undefined && (typeof wonBets !== 'number' || wonBets < 0)) {
      return res.status(400).json({ message: 'Won bets must be a non-negative number' });
    }
    if (lostBets !== undefined && (typeof lostBets !== 'number' || lostBets < 0)) {
      return res.status(400).json({ message: 'Lost bets must be a non-negative number' });
    }
    if (refundedBets !== undefined && (typeof refundedBets !== 'number' || refundedBets < 0)) {
      return res.status(400).json({ message: 'Refunded bets must be a non-negative number' });
    }

    const updateData = {};
    if (wonBets !== undefined) updateData['stats.wonBets'] = wonBets;
    if (lostBets !== undefined) updateData['stats.lostBets'] = lostBets;
    if (refundedBets !== undefined) updateData['stats.refundedBets'] = refundedBets;

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('name email stats');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Betting statistics updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        stats: user.stats
      }
    });
  } catch (error) {
    console.error('Error updating betting statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/admin/users/:id/add-balance - Add money to user balance
router.post('/users/:id/add-balance', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    // Validate input
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a transaction record for the balance addition
    const transaction = new Transaction({
      userId: id,
      type: 'deposit',
      amount: amount,
      status: 'completed',
      description: description || `Admin balance addition - $${amount}`,
      adminPaymentDetails: {
        method: 'admin_credit',
        notes: `Balance added by admin: ${req.user.name || req.user.email}`,
        updatedBy: req.user.id,
        updatedAt: new Date()
      }
    });

    await transaction.save();

    res.json({
      message: 'Balance added successfully',
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        description: transaction.description,
        createdAt: transaction.createdAt
      }
    });
  } catch (error) {
    console.error('Error adding balance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ============ PAYMENT OPTIONS MANAGEMENT ============

// GET /api/admin/payment-options - Get all payment options
router.get('/payment-options', async (req, res) => {
  try {
    const { type } = req.query;
    let paymentOptions;
    
    if (type && ['deposit', 'withdrawal', 'both'].includes(type)) {
      paymentOptions = await PaymentOption.getActiveByType(type);
    } else {
      paymentOptions = await PaymentOption.find().sort({ sortOrder: 1, name: 1 });
    }

    res.json({
      paymentOptions,
      total: paymentOptions.length
    });
  } catch (error) {
    console.error('Error fetching payment options:', error);
    res.status(500).json({ message: 'Failed to fetch payment options' });
  }
});

// POST /api/admin/payment-options - Create new payment option
router.post('/payment-options', async (req, res) => {
  try {
    const paymentOption = new PaymentOption(req.body);
    await paymentOption.save();

    res.status(201).json({
      message: 'Payment option created successfully',
      paymentOption
    });
  } catch (error) {
    console.error('Error creating payment option:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Payment option code already exists' });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      res.status(500).json({ message: 'Failed to create payment option' });
    }
  }
});

// PUT /api/admin/payment-options/:id - Update payment option
router.put('/payment-options/:id', async (req, res) => {
  try {
    const paymentOption = await PaymentOption.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!paymentOption) {
      return res.status(404).json({ message: 'Payment option not found' });
    }

    res.json({
      message: 'Payment option updated successfully',
      paymentOption
    });
  } catch (error) {
    console.error('Error updating payment option:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Payment option code already exists' });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      res.status(500).json({ message: 'Failed to update payment option' });
    }
  }
});

// DELETE /api/admin/payment-options/:id - Delete payment option
router.delete('/payment-options/:id', async (req, res) => {
  try {
    const paymentOption = await PaymentOption.findByIdAndDelete(req.params.id);

    if (!paymentOption) {
      return res.status(404).json({ message: 'Payment option not found' });
    }

    res.json({
      message: 'Payment option deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment option:', error);
    res.status(500).json({ message: 'Failed to delete payment option' });
  }
});

// PUT /api/admin/payment-options/:id/toggle - Toggle payment option active status
router.put('/payment-options/:id/toggle', async (req, res) => {
  try {
    const paymentOption = await PaymentOption.findById(req.params.id);

    if (!paymentOption) {
      return res.status(404).json({ message: 'Payment option not found' });
    }

    paymentOption.isActive = !paymentOption.isActive;
    await paymentOption.save();

    res.json({
      message: `Payment option ${paymentOption.isActive ? 'activated' : 'deactivated'} successfully`,
      paymentOption
    });
  } catch (error) {
    console.error('Error toggling payment option:', error);
    res.status(500).json({ message: 'Failed to toggle payment option' });
  }
});

// ===== WITHDRAWAL MANAGEMENT =====

// GET /api/admin/withdrawal-requests - Get all withdrawal requests and completed withdrawals
router.get('/withdrawal-requests', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    // Get withdrawal requests
    let requestQuery = { isActive: true };
    if (status && ['pending', 'approved', 'rejected', 'processing'].includes(status)) {
      requestQuery.status = status;
    }

    // Get completed withdrawal transactions
    let transactionQuery = { type: 'withdraw' };
    if (status === 'completed') {
      transactionQuery.status = 'completed';
    }

    const [withdrawalRequests, withdrawalTransactions] = await Promise.all([
      WithdrawalRequest.find(requestQuery)
        .sort({ createdAt: -1 })
        .populate('user', 'username email balance')
        .populate('processedBy', 'username email'),
      Transaction.find(transactionQuery)
        .sort({ createdAt: -1 })
        .populate('userId', 'username email balance')
    ]);

    // Combine and format the data
    const combinedData = [];

    // Add withdrawal requests
    withdrawalRequests.forEach(request => {
      combinedData.push({
        id: request._id,
        type: 'request',
        user: request.user,
        amount: request.amount,
        currency: request.currency,
        paymentMethod: request.paymentMethod,
        paymentDetails: request.paymentDetails,
        status: request.status,
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
        processedBy: request.processedBy,
        processedAt: request.processedAt,
        rejectionReason: request.rejectionReason,
        adminNotes: request.adminNotes,
        transactionId: request.transactionId,
        formattedAmount: `${request.currency} $${request.amount.toFixed(2)}`,
        timeAgo: getTimeAgo(request.createdAt)
      });
    });

    // Add completed withdrawal transactions
    withdrawalTransactions.forEach(transaction => {
      combinedData.push({
        id: transaction._id,
        type: 'transaction',
        user: transaction.userId,
        amount: transaction.amount,
        currency: transaction.currency,
        paymentMethod: transaction.withdrawMethod || 'N/A',
        paymentDetails: transaction.bankDetails || {},
        status: transaction.status,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
        transactionId: transaction.transactionId,
        description: transaction.description,
        formattedAmount: `${transaction.currency} $${transaction.amount.toFixed(2)}`,
        timeAgo: getTimeAgo(transaction.createdAt)
      });
    });

    // Sort combined data by creation date (newest first)
    combinedData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination to combined data
    const total = combinedData.length;
    const paginatedData = combinedData.slice(skip, skip + parseInt(limit));

    res.json({
      withdrawalRequests: paginatedData,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching withdrawal requests:', error);
    res.status(500).json({ message: 'Failed to fetch withdrawal requests' });
  }
});

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
}

// GET /api/admin/withdrawal-requests/:id - Get specific withdrawal request
router.get('/withdrawal-requests/:id', async (req, res) => {
  try {
    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id)
      .populate('user', 'username email balance')
      .populate('processedBy', 'username email');

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    res.json({ withdrawalRequest });
  } catch (error) {
    console.error('Error fetching withdrawal request:', error);
    res.status(500).json({ message: 'Failed to fetch withdrawal request' });
  }
});

// PUT /api/admin/withdrawal-requests/:id/approve - Approve withdrawal request
router.put('/withdrawal-requests/:id/approve', async (req, res) => {
  try {
    const { transactionId, adminNotes } = req.body;
    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id)
      .populate('user', 'username email balance');

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    if (withdrawalRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending withdrawal requests can be approved' });
    }

    // Check if user has sufficient balance
    if (withdrawalRequest.user.balance < withdrawalRequest.amount) {
      return res.status(400).json({ 
        message: 'User has insufficient balance for this withdrawal',
        userBalance: withdrawalRequest.user.balance,
        requestedAmount: withdrawalRequest.amount
      });
    }

    // Approve the withdrawal request
    await withdrawalRequest.approve(req.user._id, transactionId, adminNotes);

    // Deduct amount from user's balance
    withdrawalRequest.user.balance -= withdrawalRequest.amount;
    await withdrawalRequest.user.save();

    // Create transaction record
    await Transaction.create({
      userId: withdrawalRequest.user._id,
      type: 'withdraw',
      amount: withdrawalRequest.amount,
      status: 'completed',
      description: `Withdrawal approved - ${withdrawalRequest.paymentMethod}`,
      transactionId: transactionId || `WD-${Date.now()}`,
      adminNotes
    });

    res.json({
      message: 'Withdrawal request approved successfully',
      withdrawalRequest: await WithdrawalRequest.findById(req.params.id)
        .populate('user', 'username email balance')
        .populate('processedBy', 'username email')
    });
  } catch (error) {
    console.error('Error approving withdrawal request:', error);
    res.status(500).json({ message: 'Failed to approve withdrawal request' });
  }
});

// PUT /api/admin/withdrawal-requests/:id/reject - Reject withdrawal request
router.put('/withdrawal-requests/:id/reject', async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason || rejectionReason.trim() === '') {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id)
      .populate('user', 'username email balance');

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    if (withdrawalRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending withdrawal requests can be rejected' });
    }

    // Reject the withdrawal request
    await withdrawalRequest.reject(req.user._id, rejectionReason);

    res.json({
      message: 'Withdrawal request rejected successfully',
      withdrawalRequest: await WithdrawalRequest.findById(req.params.id)
        .populate('user', 'username email balance')
        .populate('processedBy', 'username email')
    });
  } catch (error) {
    console.error('Error rejecting withdrawal request:', error);
    res.status(500).json({ message: 'Failed to reject withdrawal request' });
  }
});

// PUT /api/admin/withdrawal-requests/:id/process - Mark withdrawal as processing
router.put('/withdrawal-requests/:id/process', async (req, res) => {
  try {
    const { adminNotes } = req.body;
    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id)
      .populate('user', 'username email balance');

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    if (withdrawalRequest.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending withdrawal requests can be marked as processing' });
    }

    // Mark as processing
    await withdrawalRequest.markAsProcessing(req.user._id, adminNotes);

    res.json({
      message: 'Withdrawal request marked as processing',
      withdrawalRequest: await WithdrawalRequest.findById(req.params.id)
        .populate('user', 'username email balance')
        .populate('processedBy', 'username email')
    });
  } catch (error) {
    console.error('Error marking withdrawal as processing:', error);
    res.status(500).json({ message: 'Failed to mark withdrawal as processing' });
  }
});

// PUT /api/admin/withdrawal-requests/:id/complete - Mark withdrawal as completed
router.put('/withdrawal-requests/:id/complete', async (req, res) => {
  try {
    const { transactionId, adminNotes } = req.body;
    const withdrawalRequest = await WithdrawalRequest.findById(req.params.id)
      .populate('user', 'username email balance');

    if (!withdrawalRequest) {
      return res.status(404).json({ message: 'Withdrawal request not found' });
    }

    if (!['approved', 'processing'].includes(withdrawalRequest.status)) {
      return res.status(400).json({ message: 'Only approved or processing withdrawal requests can be completed' });
    }

    // Mark as completed
    await withdrawalRequest.markAsCompleted(req.user._id, transactionId, adminNotes);

    // Update transaction record if exists
    const transaction = await Transaction.findOne({
      userId: withdrawalRequest.user._id,
      type: 'withdraw',
      amount: withdrawalRequest.amount,
      description: { $regex: `Withdrawal approved.*${withdrawalRequest.paymentMethod}` }
    });

    if (transaction) {
      transaction.status = 'completed';
      transaction.transactionId = transactionId || transaction.transactionId;
      if (adminNotes) transaction.adminNotes = adminNotes;
      await transaction.save();
    }

    res.json({
      message: 'Withdrawal request completed successfully',
      withdrawalRequest: await WithdrawalRequest.findById(req.params.id)
        .populate('user', 'username email balance')
        .populate('processedBy', 'username email')
    });
  } catch (error) {
    console.error('Error completing withdrawal request:', error);
    res.status(500).json({ message: 'Failed to complete withdrawal request' });
  }
});

// ==================== PLAN MANAGEMENT ROUTES ====================

// GET /api/admin/plans - Get all plans for admin management
router.get('/plans', async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ message: 'Failed to fetch plans' });
  }
});

// POST /api/admin/plans - Create a new plan
router.post('/plans', async (req, res) => {
  try {
    const {
      name,
      price,
      duration,
      features,
      limits,
      description,
      isActive = true,
      isPopular = false
    } = req.body;

    // Validate required fields
    if (!name || !price || !duration || !features || !limits) {
      return res.status(400).json({ 
        message: 'Name, price, duration, features, and limits are required' 
      });
    }

    // Check if plan name already exists
    const existingPlan = await Plan.findOne({ name: name.toLowerCase() });
    if (existingPlan) {
      return res.status(400).json({ message: 'Plan with this name already exists' });
    }

    const plan = new Plan({
      name: name.toLowerCase(),
      price,
      duration,
      features,
      limits,
      description,
      isActive,
      isPopular
    });

    await plan.save();
    res.status(201).json({ message: 'Plan created successfully', plan });
  } catch (error) {
    console.error('Error creating plan:', error);
    res.status(500).json({ message: 'Failed to create plan' });
  }
});

// PUT /api/admin/plans/:id - Update a plan
router.put('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      duration,
      features,
      limits,
      description,
      isActive,
      isPopular
    } = req.body;

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if new name conflicts with existing plan (excluding current plan)
    if (name && name.toLowerCase() !== plan.name) {
      const existingPlan = await Plan.findOne({ 
        name: name.toLowerCase(),
        _id: { $ne: id }
      });
      if (existingPlan) {
        return res.status(400).json({ message: 'Plan with this name already exists' });
      }
    }

    // Update plan fields
    if (name) plan.name = name.toLowerCase();
    if (price !== undefined) plan.price = price;
    if (duration) plan.duration = duration;
    if (features) plan.features = features;
    if (limits) plan.limits = limits;
    if (description !== undefined) plan.description = description;
    if (isActive !== undefined) plan.isActive = isActive;
    if (isPopular !== undefined) plan.isPopular = isPopular;

    await plan.save();
    res.json({ message: 'Plan updated successfully', plan });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ message: 'Failed to update plan' });
  }
});

// DELETE /api/admin/plans/:id - Delete a plan
router.delete('/plans/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if any users are currently on this plan
    const usersWithPlan = await User.countDocuments({ plan: plan.name });
    if (usersWithPlan > 0) {
      return res.status(400).json({ 
        message: `Cannot delete plan. ${usersWithPlan} users are currently subscribed to this plan.`,
        usersCount: usersWithPlan
      });
    }

    await Plan.findByIdAndDelete(id);
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting plan:', error);
    res.status(500).json({ message: 'Failed to delete plan' });
  }
});

// PATCH /api/admin/plans/:id/toggle-status - Toggle plan active status
router.patch('/plans/:id/toggle-status', async (req, res) => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    plan.isActive = !plan.isActive;
    await plan.save();

    res.json({ 
      message: `Plan ${plan.isActive ? 'activated' : 'deactivated'} successfully`, 
      plan 
    });
  } catch (error) {
    console.error('Error toggling plan status:', error);
    res.status(500).json({ message: 'Failed to toggle plan status' });
  }
});

module.exports = router;