const axios = require('axios');

// Test registration flow with Resend
async function testRegistrationFlow() {
  try {
    console.log('🧪 Testing Registration Flow with Resend...\n');

    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'TestPass123'
    };

    console.log('📧 Attempting to register user:', testUser.email);

    // Make registration request
    const response = await axios.post('http://localhost:3001/api/auth/register', testUser);

    console.log('✅ Registration Response:');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message);
    console.log('Requires Verification:', response.data.requiresVerification);
    console.log('Email:', response.data.email);

    console.log('\n🎉 Registration flow test completed successfully!');
    console.log('📧 Check your email for the verification code sent via Resend.');

  } catch (error) {
    console.error('❌ Registration flow test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
      console.error('Error:', error.response.data.error);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Test forgot password flow
async function testForgotPasswordFlow() {
  try {
    console.log('\n🔐 Testing Forgot Password Flow with Resend...\n');

    const testEmail = 'test@example.com';

    console.log('📧 Attempting forgot password for:', testEmail);

    // Make forgot password request
    const response = await axios.post('http://localhost:3001/api/auth/forgot-password', {
      email: testEmail
    });

    console.log('✅ Forgot Password Response:');
    console.log('Status:', response.status);
    console.log('Message:', response.data.message);

    console.log('\n🎉 Forgot password flow test completed successfully!');
    console.log('📧 Check your email for the password reset link sent via Resend.');

  } catch (error) {
    console.error('❌ Forgot password flow test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message);
      console.error('Error:', error.response.data.error);
    } else {
      console.error('Error:', error.message);
    }
  }
}

// Run tests
async function runTests() {
  await testRegistrationFlow();
  await testForgotPasswordFlow();
}

runTests();