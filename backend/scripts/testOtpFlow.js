const axios = require('axios');

// Test OTP verification flow
async function testOtpFlow() {
  try {
    console.log('🔐 Testing OTP Verification Flow with Resend...\n');

    // First, let's test resending verification email
    const testEmail = 'test@example.com';

    console.log('📧 Testing resend verification email for:', testEmail);

    // Test resend verification
    const resendResponse = await axios.post('http://localhost:3001/api/auth/resend-verification', {
      email: testEmail
    });

    console.log('✅ Resend Verification Response:');
    console.log('Status:', resendResponse.status);
    console.log('Message:', resendResponse.data.message);

    console.log('\n🎉 OTP resend flow test completed successfully!');
    console.log('📧 Check your email for the new verification code sent via Resend.');

    // Note: We can't test the actual OTP verification without the real OTP code
    console.log('\n📝 Note: To test OTP verification, you would need to:');
    console.log('1. Check your email for the 6-digit OTP code');
    console.log('2. Use POST /api/auth/verify-email with email and otpCode');
    console.log('3. This will activate the account and send a welcome email via Resend');

  } catch (error) {
    console.error('❌ OTP flow test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
      console.error('Error:', error.response.data.error);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Test welcome email flow (simulated)
async function testWelcomeEmailFlow() {
  try {
    console.log('\n🎊 Testing Welcome Email Flow...\n');

    // We'll use our email utility directly to test the welcome template
    const { sendEmail } = require('../utils/email');

    await sendEmail({
      to: 'test@example.com',
      template: 'welcome',
      data: {
        name: 'Test User',
        loginUrl: 'http://localhost:5173/login'
      }
    });

    console.log('✅ Welcome email sent successfully via Resend!');

  } catch (error) {
    console.error('❌ Welcome email test failed:', error.message);
  }
}

// Run all OTP-related tests
async function runOtpTests() {
  await testOtpFlow();
  await testWelcomeEmailFlow();
}

runOtpTests();