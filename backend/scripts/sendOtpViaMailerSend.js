require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

(async () => {
  try {
    const { sendEmail } = require('../utils/email');
    const to = process.env.EMAIL_USER || process.env.PAYMENTS_EMAIL || 'test@example.com';
    const otpCode = '123456';
    const verifyUrl = (process.env.FRONTEND_URL || 'http://localhost:5173') + '/verify-email?email=' + encodeURIComponent(to);

    console.log('Sending MailerSend OTP test to:', to);

    const res = await sendEmail({
      to,
      template: 'emailVerification',
      data: {
        name: 'Test User',
        otpCode,
        verifyUrl
      }
    });

    console.log('Result:', res);
    process.exit(0);
  } catch (err) {
    console.error('Error sending MailerSend OTP test:', err);
    process.exit(1);
  }
})();