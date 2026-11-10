const { testEmailConfig } = require('../utils/email');

async function runEmailConfigTest() {
  console.log('🧪 Testing Email Configuration...\n');
  
  try {
    // Test basic email configuration
    const result = await testEmailConfig();
    
    if (result.success) {
      console.log('✅ Email configuration test passed!');
      console.log(`📧 Test email sent with ID: ${result.messageId}`);
      console.log('📝 Check your inbox for the test email');
    } else {
      console.log('❌ Email configuration test failed!');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Email configuration test failed with error:');
    console.error(error.message);
    
    // Provide helpful debugging information
    console.log('\n🔍 Debugging Information:');
    console.log('- RESEND_API_KEY set:', !!process.env.RESEND_API_KEY);
    console.log('- EMAIL_FROM set:', !!process.env.EMAIL_FROM);
    console.log('- EMAIL_REPLY_TO set:', !!process.env.EMAIL_REPLY_TO);
    
    if (!process.env.RESEND_API_KEY) {
      console.log('\n⚠️ Missing RESEND_API_KEY environment variable');
      console.log('Please set it in your .env file or environment');
    }
  }
}

// Run the test
runEmailConfigTest();