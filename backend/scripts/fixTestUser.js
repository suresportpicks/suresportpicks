const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function fixTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find the test user
    const testUser = await User.findOne({ email: 'john@example.com' });
    if (!testUser) {
      console.log('Test user not found');
      return;
    }
    
    console.log('Current password hash:', testUser.password);
    
    // Test the current password
    const currentPasswordValid = await testUser.comparePassword('password123');
    console.log('Current password valid:', currentPasswordValid);
    
    // Update the password using the User model's pre-save hook
    testUser.password = 'password123';
    await testUser.save();
    
    console.log('Password updated. New hash:', testUser.password);
    
    // Test the new password
    const newPasswordValid = await testUser.comparePassword('password123');
    console.log('New password valid:', newPasswordValid);
    
    await mongoose.disconnect();
    console.log('✅ Test user password fixed!');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixTestUser();