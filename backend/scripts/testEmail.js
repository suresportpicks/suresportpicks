const mongoose = require('mongoose');
const { sendEmail, testEmailConfig } = require('../utils/email');
require('dotenv').config();

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

const testEmailSetup = async () => {
  try {
    await connectDB();
    
    console.log('🧪 Testing Email Configuration...\n');
    
    // Test 1: Verify email configuration
    console.log('1️⃣ Testing email transporter configuration...');
    const configValid = await testEmailConfig();
    
    if (!configValid) {
      console.log('❌ Email configuration test failed!');
      console.log('Please check your EMAIL_PASS environment variable.');
      return;
    }
    
    console.log('✅ Email configuration is valid!\n');
    
    // Test 2: Send a test welcome email
    console.log('2️⃣ Sending test welcome email...');
    
    const testEmailResult = await sendEmail({
      to: 'test@example.com', // Change this to your test email
      template: 'welcome',
      data: {
        name: 'Test User',
        loginUrl: `${process.env.FRONTEND_URL}/login`
      }
    });
    
    if (testEmailResult.success) {
      console.log('✅ Test welcome email sent successfully!');
      console.log(`📧 Message ID: ${testEmailResult.messageId}\n`);
    }
    
    // Test 3: Send a test OTP email (custom template)
    console.log('3️⃣ Sending test OTP email...');
    
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const otpEmailResult = await sendEmail({
      to: 'test@example.com', // Change this to your test email
      subject: 'Your SureSport Picks Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; border-radius: 10px; overflow: hidden;">
          <div style="padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔐 Verification Code</h1>
            <p style="margin: 20px 0; font-size: 18px; opacity: 0.9;">SureSport Picks</p>
          </div>
          
          <div style="background: white; color: #333; padding: 40px 30px; text-align: center;">
            <h2 style="color: #1e3a8a; margin-bottom: 20px;">Your Verification Code</h2>
            
            <div style="background: #f8fafc; border: 2px dashed #1e3a8a; border-radius: 8px; padding: 30px; margin: 20px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #1e3a8a; letter-spacing: 8px; font-family: monospace;">
                ${otpCode}
              </div>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Enter this code to complete your registration. This code will expire in 10 minutes.
            </p>
            
            <p style="font-size: 14px; color: #666; margin-top: 30px;">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
          
          <div style="background: #1e3a8a; padding: 20px 30px; text-align: center;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              © 2025 SureSport Picks. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: `Your SureSport Picks verification code is: ${otpCode}. This code will expire in 10 minutes.`
    });
    
    if (otpEmailResult.success) {
      console.log('✅ Test OTP email sent successfully!');
      console.log(`📧 Message ID: ${otpEmailResult.messageId}`);
      console.log(`🔢 Test OTP Code: ${otpCode}\n`);
    }
    
    console.log('🎉 All email tests completed successfully!');
    console.log('\n📋 Email Configuration Summary:');
    console.log(`📧 From: ${process.env.EMAIL_FROM}`);
    console.log(`🌐 Host: ${process.env.EMAIL_HOST}`);
    console.log(`🔌 Port: ${process.env.EMAIL_PORT} (SSL: ${process.env.EMAIL_PORT === '465' ? 'Yes' : 'No'})`);
    console.log(`👤 User: ${process.env.EMAIL_USER}`);
    
  } catch (error) {
    console.error('❌ Email test error:', error);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Troubleshooting Tips:');
      console.log('1. Check that EMAIL_PASS is set correctly in your .env file');
      console.log('2. Verify the email account password is correct');
      console.log('3. Ensure the email account allows SMTP access');
    }
  } finally {
    mongoose.connection.close();
  }
};

// Run the test
testEmailSetup();

module.exports = { testEmailSetup };