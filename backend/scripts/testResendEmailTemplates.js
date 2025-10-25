const { sendEmail, testEmailConfig } = require('../utils/email');

async function testAllEmailTemplates() {
  console.log('🧪 Testing Resend Email Templates...\n');

  try {
    // Test email configuration first
    console.log('1. Testing email configuration...');
    const configValid = await testEmailConfig();
    if (!configValid) {
      console.error('❌ Email configuration test failed');
      return;
    }
    console.log('✅ Email configuration test passed\n');

    // Test data for different email templates
    const testData = {
      welcome: {
        name: 'John Doe',
        loginUrl: 'https://suresportpicks.com/login'
      },
      emailVerification: {
        name: 'John Doe',
        otpCode: '123456',
        verifyUrl: 'https://suresportpicks.com/verify-email'
      },
      passwordReset: {
        name: 'John Doe',
        resetUrl: 'https://suresportpicks.com/reset-password?token=abc123',
        expiryTime: '15 minutes'
      },
      paymentRequest: {
        name: 'John Doe',
        email: 'john@example.com',
        plan: 'professional',
        amount: '49.99',
        message: 'I would like to upgrade to the Professional plan.'
      },
      contact: {
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Question about your service',
        message: 'I have a question about your sports picks service. Can you help me understand how it works?'
      }
    };

    // Test each email template
    const templates = ['welcome', 'emailVerification', 'passwordReset', 'paymentRequest', 'contact'];
    
    for (const template of templates) {
      console.log(`2.${templates.indexOf(template) + 1} Testing ${template} email template...`);
      
      try {
        const result = await sendEmail({
          to: 'info@suresportpicks.com',
          template: template,
          data: testData[template]
        });
        
        console.log(`✅ ${template} email sent successfully!`);
        console.log(`   Email ID: ${result.messageId}`);
        console.log('');
      } catch (error) {
        console.error(`❌ Failed to send ${template} email:`, error.message);
        console.log('');
      }
    }

    // Test custom email (without template)
    console.log('3. Testing custom email (without template)...');
    try {
      const result = await sendEmail({
        to: 'info@suresportpicks.com',
        subject: 'Custom Test Email - SureSport Picks',
        html: '<h1>Custom Email Test</h1><p>This is a custom email sent via Resend API.</p>',
        text: 'Custom Email Test - This is a custom email sent via Resend API.'
      });
      
      console.log('✅ Custom email sent successfully!');
      console.log(`   Email ID: ${result.messageId}`);
    } catch (error) {
      console.error('❌ Failed to send custom email:', error.message);
    }

    console.log('\n🎉 Email template testing completed!');
    
  } catch (error) {
    console.error('❌ Email testing failed:', error);
  }
}

testAllEmailTemplates();