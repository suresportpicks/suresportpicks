const nodemailer = require('nodemailer');
const axios = require('axios');

// Create transporter
const createTransporter = () => {
  // Use Brevo (formerly Sendinblue) for production, fallback for development
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && process.env.BREVO_SMTP_KEY) {
    // Brevo SMTP configuration
    return nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // STARTTLS
      auth: {
        user: process.env.BREVO_SMTP_USER || process.env.EMAIL_USER,
        pass: process.env.BREVO_SMTP_KEY
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else {
    // Fallback configuration for development or custom SMTP
    const port = parseInt(process.env.EMAIL_PORT) || 587;
    const isSecure = port === 465; // Use SSL for port 465
    
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: port,
      secure: isSecure, // true for 465 (SSL), false for other ports (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false,
        // Additional TLS options for better compatibility
        ciphers: 'SSLv3'
      },
      // Connection timeout and socket timeout
      connectionTimeout: 60000,
      socketTimeout: 60000,
      // Enable debug logging in development
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    });
  }
};

// Email templates
const emailTemplates = {
  welcome: (data) => ({
    subject: 'Welcome to SureSport Picks! 🏀',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; border-radius: 10px; overflow: hidden;">
        <div style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🏀 Welcome to SureSport Picks!</h1>
          <p style="margin: 20px 0; font-size: 18px; opacity: 0.9;">Predict. Analyze. Win.</p>
        </div>
        
        <div style="background: white; color: #333; padding: 40px 30px;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Welcome to the premier sports analytics platform! You've just joined thousands of successful bettors who trust our data-driven predictions.
          </p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-bottom: 15px;">🎯 What's Next?</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Explore our free daily picks</li>
              <li style="margin-bottom: 8px;">Check out our 94% win rate analytics</li>
              <li style="margin-bottom: 8px;">Consider upgrading for VIP predictions</li>
              <li>Join our community of winners!</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.loginUrl}" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Start Winning Now 🚀
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; text-align: center; margin-top: 30px;">
            Questions? Reply to this email or contact our support team.
          </p>
        </div>
        
        <div style="background: #1e3a8a; padding: 20px 30px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">
            © 2025 SureSport Picks. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `Welcome to SureSport Picks, ${data.name}! Start your winning journey at ${data.loginUrl}`
  }),

  emailVerification: (data) => ({
    subject: 'Verify Your Email - SureSport Picks 🔐',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; border-radius: 10px; overflow: hidden;">
        <div style="padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🔐 Email Verification</h1>
          <p style="margin: 20px 0; font-size: 18px; opacity: 0.9;">SureSport Picks</p>
        </div>
        
        <div style="background: white; color: #333; padding: 40px 30px; text-align: center;">
          <h2 style="color: #1e3a8a; margin-bottom: 20px;">Hi ${data.name}! 👋</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Thank you for registering with SureSport Picks! Please verify your email address to complete your registration.
          </p>
          
          <div style="background: #f8fafc; border: 2px dashed #1e3a8a; border-radius: 8px; padding: 30px; margin: 20px 0;">
            <h3 style="color: #1e3a8a; margin-bottom: 15px;">Your Verification Code:</h3>
            <div style="font-size: 36px; font-weight: bold; color: #1e3a8a; letter-spacing: 8px; font-family: monospace;">
              ${data.otpCode}
            </div>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">
            Enter this code on the verification page to activate your account. This code will expire in <strong>10 minutes</strong>.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verifyUrl}" style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify Email Now 🚀
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            If you didn't create an account with us, please ignore this email.
          </p>
        </div>
        
        <div style="background: #1e3a8a; padding: 20px 30px; text-align: center;">
          <p style="margin: 0; font-size: 14px; opacity: 0.8;">
            © 2025 SureSport Picks. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `Hi ${data.name}! Your SureSport Picks verification code is: ${data.otpCode}. This code will expire in 10 minutes. Verify at: ${data.verifyUrl}`
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset Request - SureSport Picks',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">🔐 Password Reset Request</h1>
        </div>
        
        <div style="padding: 40px 30px; color: #333;">
          <h2 style="color: #dc2626; margin-bottom: 20px;">Hi ${data.name},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your SureSport Picks account.
          </p>
          
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #dc2626;">⚠️ Security Notice</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">This reset link will expire in ${data.expiryTime}.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetUrl}" style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset My Password
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
          </p>
          
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            For security reasons, this link can only be used once and will expire soon.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            © 2025 SureSport Picks. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `Password reset requested for ${data.name}. Reset your password at: ${data.resetUrl} (expires in ${data.expiryTime})`
  }),

  paymentRequest: (data) => ({
    subject: `💰 New Payment Request - ${data.plan.toUpperCase()} Plan`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">💰 New Payment Request</h1>
        </div>
        
        <div style="padding: 40px 30px; color: #333;">
          <h2 style="color: #059669; margin-bottom: 20px;">Payment Request Details</h2>
          
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #059669;">Customer Name:</td>
                <td style="padding: 8px 0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #059669;">Email:</td>
                <td style="padding: 8px 0;">${data.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #059669;">Plan:</td>
                <td style="padding: 8px 0; text-transform: uppercase; font-weight: bold;">${data.plan}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #059669;">Amount:</td>
                <td style="padding: 8px 0; font-weight: bold; font-size: 18px;">$${data.amount}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #059669;">Request Time:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          ${data.message ? `
            <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #059669; margin-bottom: 10px;">💬 Customer Message:</h3>
              <p style="margin: 0; font-style: italic; line-height: 1.6;">"${data.message}"</p>
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/admin/payments" style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Review in Admin Panel
            </a>
          </div>
          
          <p style="font-size: 14px; color: #666; text-align: center;">
            Please process this payment request as soon as possible.
          </p>
        </div>
        
        <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            © 2025 SureSport Picks. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `New payment request: ${data.name} (${data.email}) wants to subscribe to ${data.plan} plan for $${data.amount}. Message: ${data.message || 'None'}`
  }),

  contact: (data) => ({
    subject: `📧 New Contact Form Submission from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">📧 New Contact Message</h1>
        </div>
        
        <div style="padding: 40px 30px; color: #333;">
          <div style="background: #faf5ff; border: 1px solid #d8b4fe; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #7c3aed;">Name:</td>
                <td style="padding: 8px 0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #7c3aed;">Email:</td>
                <td style="padding: 8px 0;">${data.email}</td>
              </tr>
              ${data.subject ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #7c3aed;">Subject:</td>
                  <td style="padding: 8px 0;">${data.subject}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #7c3aed;">Submitted:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #7c3aed; margin-bottom: 15px;">💬 Message:</h3>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${data.email}" style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reply to ${data.name}
            </a>
          </div>
        </div>
        
        <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 14px; color: #666;">
            © 2025 SureSport Picks. All rights reserved.
          </p>
        </div>
      </div>
    `,
    text: `New contact form submission from ${data.name} (${data.email}): ${data.message}`
  })
};

// Main send email function
const sendEmail = async ({ to, subject, template, data, html, text }) => {
  try {
    let emailContent;
    
    if (template && emailTemplates[template]) {
      emailContent = emailTemplates[template](data);
    } else {
      emailContent = { subject, html, text };
    }

    // Use MailerSend for OTP emails when configured
    if (template === 'emailVerification' && process.env.MAILERSEND_API_KEY) {
      return await sendWithMailerSend({
        to,
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text
      });
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"SureSport Picks" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully:', {
      to,
      subject: emailContent.subject,
      messageId: result.messageId
    });

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('❌ Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Send via MailerSend (used for OTP emails)
const sendWithMailerSend = async ({ to, subject, html, text }) => {
  const apiKey = process.env.MAILERSEND_API_KEY;
  const senderEmail = process.env.MAILERSEND_SENDER_EMAIL || process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const senderName = process.env.MAILERSEND_SENDER_NAME || 'SureSport Picks';

  if (!apiKey || !senderEmail) {
    throw new Error('MailerSend configuration missing (MAILERSEND_API_KEY or MAILERSEND_SENDER_EMAIL)');
  }

  const payload = {
    from: { email: senderEmail, name: senderName },
    to: [{ email: to }],
    subject,
    html,
    text
  };

  const res = await axios.post('https://api.mailersend.com/v1/email', payload, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    timeout: 15000
  });

  console.log('✅ MailerSend email sent:', {
    to,
    subject,
    messageId: res.data?.message_id || res.data?.id
  });

  return {
    success: true,
    messageId: res.data?.message_id || res.data?.id
  };
};

// Send payment notification to admin
const sendPaymentNotification = async (paymentData) => {
  return await sendEmail({
    to: process.env.PAYMENTS_EMAIL || 'payments@suresport.com',
    template: 'paymentRequest',
    data: paymentData
  });
};

// Send contact form notification
const sendContactNotification = async (contactData) => {
  return await sendEmail({
    to: process.env.EMAIL_USER,
    template: 'contact',
    data: contactData
  });
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email configuration is valid');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendPaymentNotification,
  sendContactNotification,
  testEmailConfig
};