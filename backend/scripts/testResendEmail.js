const { Resend } = require('resend');

const resend = new Resend('re_J8548WCF_GCbj23dTY3fsXjwWu5ZmTMUW');

async function sendTestEmail() {
  try {
    console.log('Sending test email with Resend...');
    
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'info@suresportpicks.com',
      subject: 'Hello World - SureSport Picks Test Email',
      html: '<p>Congrats on sending your <strong>first email</strong> with Resend!</p><p>This is a test email from SureSport Picks application.</p>'
    });

    console.log('Email sent successfully!');
    console.log('Email ID:', data.id);
    console.log('Response:', data);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

sendTestEmail();