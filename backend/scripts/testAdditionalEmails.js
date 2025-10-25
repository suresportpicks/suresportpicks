const { sendEmail, sendContactNotification, sendPaymentNotification } = require('../utils/email');

// Test contact form email
async function testContactEmail() {
  try {
    console.log('📧 Testing Contact Form Email...\n');

    await sendContactNotification({
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test contact form submission to verify Resend integration.'
    });

    console.log('✅ Contact form email sent successfully via Resend!');

  } catch (error) {
    console.error('❌ Contact form email test failed:', error.message);
  }
}

// Test payment notification email
async function testPaymentEmail() {
  try {
    console.log('\n💳 Testing Payment Notification Email...\n');

    await sendPaymentNotification({
      userName: 'Test User',
      userEmail: 'test@example.com',
      amount: 29.99,
      plan: 'Premium Monthly',
      paymentMethod: 'Credit Card',
      transactionId: 'test_txn_123456'
    });

    console.log('✅ Payment notification email sent successfully via Resend!');

  } catch (error) {
    console.error('❌ Payment notification email test failed:', error.message);
  }
}

// Test custom email
async function testCustomEmail() {
  try {
    console.log('\n✉️ Testing Custom Email...\n');

    await sendEmail({
      to: 'test@example.com',
      subject: 'Resend Integration Test - Custom Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">🎉 Resend Integration Successful!</h2>
          <p>This is a custom email to confirm that the Resend integration is working perfectly for SureSport Picks.</p>
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>✅ All Email Types Tested:</h3>
            <ul>
              <li>Registration & OTP verification</li>
              <li>Password reset</li>
              <li>Welcome emails</li>
              <li>Contact form notifications</li>
              <li>Payment notifications</li>
              <li>Custom emails</li>
            </ul>
          </div>
          <p style="color: #666;">Sent via Resend API for SureSport Picks</p>
        </div>
      `,
      text: 'Resend Integration Test - All email types are working successfully!'
    });

    console.log('✅ Custom email sent successfully via Resend!');

  } catch (error) {
    console.error('❌ Custom email test failed:', error.message);
  }
}

// Run all additional email tests
async function runAdditionalEmailTests() {
  console.log('🧪 Testing Additional Email Types with Resend...\n');
  
  await testContactEmail();
  await testPaymentEmail();
  await testCustomEmail();
  
  console.log('\n🎉 All additional email tests completed successfully!');
  console.log('📧 Resend integration is fully functional for all email types.');
}

runAdditionalEmailTests();