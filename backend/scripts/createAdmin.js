const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/suresport-picks');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@suresport.com' });
    if (existingAdmin) {
      console.log('✅ Admin user already exists!');
      console.log('📧 Email: admin@suresport.com');
      console.log('🔑 Password: Admin123!');
      return;
    }

    // Create Admin User
    console.log('Creating admin user...');
    // Don't hash password here - let the User model's pre-save middleware handle it
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@suresport.com',
      password: 'Admin123!',
      role: 'admin',
      plan: 'gold',
      planExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      isActive: true,
      isEmailVerified: true, // Admin users don't need email verification
      stats: {
        winRate: 95,
        totalPicks: 500,
        profit: 50000,
        roi: 25.5
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Admin Login Credentials:');
    console.log('Email: admin@suresport.com');
    console.log('Password: Admin123!');
    console.log('\n🎯 You can now log in to the admin panel with these credentials.');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createAdmin();

module.exports = { createAdmin };