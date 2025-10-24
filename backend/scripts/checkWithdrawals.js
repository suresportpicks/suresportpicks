const mongoose = require('mongoose');
const WithdrawalRequest = require('../models/WithdrawalRequest');
const User = require('../models/User');
require('dotenv').config();

async function checkWithdrawals() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const withdrawals = await WithdrawalRequest.find({}).populate('user', 'username email');
    console.log(`Found ${withdrawals.length} withdrawal requests:`);
    
    withdrawals.forEach((withdrawal, index) => {
      console.log(`\n${index + 1}. Withdrawal Request:`);
      console.log(`   ID: ${withdrawal._id}`);
      console.log(`   User: ${withdrawal.user ? withdrawal.user.username || withdrawal.user.email : 'Unknown'}`);
      console.log(`   Amount: $${withdrawal.amount}`);
      console.log(`   Method: ${withdrawal.paymentMethod}`);
      console.log(`   Status: ${withdrawal.status}`);
      console.log(`   Created: ${withdrawal.createdAt}`);
      console.log(`   Active: ${withdrawal.isActive}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkWithdrawals();