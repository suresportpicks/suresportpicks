const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/suresport');
    console.log('MongoDB connected for creating test transactions...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Create test transactions
const createTestTransactions = async () => {
  try {
    // Find or create a test user
    let testUser = await User.findOne({ email: 'john@example.com' });
    
    if (!testUser) {
      console.log('Creating test user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('password123', 12);
      testUser = await User.create({
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        role: 'user',
        plan: 'silver',
        isActive: true
      });
    }

    console.log('Creating test transactions...');
    
    // Clear existing transactions for this user
    await Transaction.deleteMany({ userId: testUser._id });

    // Create sample transactions
    const testTransactions = [
      {
        userId: testUser._id,
        type: 'deposit',
        amount: 100.00,
        currency: 'USD',
        status: 'completed',
        description: 'PayPal deposit',
        paymentMethod: 'paypal',
        transactionId: 'TXN_DEP_001',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
      },
      {
        userId: testUser._id,
        type: 'deposit',
        amount: 250.00,
        currency: 'USD',
        status: 'completed',
        description: 'Credit card deposit',
        paymentMethod: 'credit_card',
        transactionId: 'TXN_DEP_002',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
      },
      {
        userId: testUser._id,
        type: 'withdraw',
        amount: 50.00,
        currency: 'USD',
        status: 'completed',
        description: 'Bank transfer withdrawal',
        withdrawMethod: 'bank_transfer',
        transactionId: 'TXN_WTH_001',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId: testUser._id,
        type: 'referral',
        amount: 25.00,
        currency: 'USD',
        status: 'completed',
        description: 'Referral bonus from user signup',
        transactionId: 'TXN_REF_001',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: testUser._id,
        type: 'subscription',
        amount: 29.99,
        currency: 'USD',
        status: 'completed',
        description: 'Monthly subscription payment',
        paymentMethod: 'credit_card',
        transactionId: 'TXN_SUB_001',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userId: testUser._id,
        type: 'deposit',
        amount: 75.00,
        currency: 'USD',
        status: 'pending',
        description: 'Pending PayPal deposit',
        paymentMethod: 'paypal',
        transactionId: 'TXN_DEP_003',
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
      },
      {
        userId: testUser._id,
        type: 'withdraw',
        amount: 120.00,
        currency: 'USD',
        status: 'failed',
        description: 'Failed withdrawal - insufficient funds',
        withdrawMethod: 'paypal',
        transactionId: 'TXN_WTH_002',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
      },
      {
        userId: testUser._id,
        type: 'deposit',
        amount: 500.00,
        currency: 'USD',
        status: 'processing',
        description: 'Large deposit - under review',
        paymentMethod: 'bank_transfer',
        transactionId: 'TXN_DEP_004',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ];

    const createdTransactions = await Transaction.insertMany(testTransactions);

    console.log('✅ Test transactions created successfully!');
    console.log(`Created ${createdTransactions.length} transactions for user: ${testUser.email}`);
    console.log('\nTransaction types created:');
    console.log('- Deposits: 4 (3 completed, 1 pending, 1 processing)');
    console.log('- Withdrawals: 2 (1 completed, 1 failed)');
    console.log('- Referral: 1 (completed)');
    console.log('- Subscription: 1 (completed)');
    console.log('\nYou can now test the transactions page with various filters!');

  } catch (error) {
    console.error('Error creating test transactions:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
connectDB().then(createTestTransactions);