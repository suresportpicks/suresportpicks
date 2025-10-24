const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'email name role createdAt');
    console.log('\n=== Users in Database ===');
    console.log(`Total users: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}, Name: ${user.name}, Role: ${user.role}, Created: ${user.createdAt}`);
    });
    
    // Check specifically for our test user
    const testUser = await User.findOne({ email: 'john@example.com' });
    if (testUser) {
      console.log('\n✅ Test user found:', testUser.email);
    } else {
      console.log('\n❌ Test user not found');
    }
    
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();