# Production Email Setup with Resend

## 🚀 Production Deployment Checklist

### 1. **Resend Account Setup**
- [ ] Create a Resend account at https://resend.com
- [ ] Verify your domain `suresportpicks.com` in Resend dashboard
- [ ] Generate a production API key

### 2. **Domain Verification**
To send emails from `@suresportpicks.com`, you must:

1. **Add DNS Records** in your domain provider:
   ```
   Type: TXT
   Name: _resend
   Value: [provided by Resend dashboard]
   ```

2. **Verify Domain** in Resend dashboard:
   - Go to Domains section
   - Add `suresportpicks.com`
   - Follow verification steps

### 3. **Environment Variables**
Set these in your production environment:

```bash
# Required
RESEND_API_KEY=re_your_production_api_key_here

# Recommended
EMAIL_FROM=SureSport Picks <noreply@suresportpicks.com>
EMAIL_REPLY_TO=info@suresportpicks.com
PAYMENTS_EMAIL=payments@suresportpicks.com
```

### 4. **Email Templates Available**
- ✅ Registration verification
- ✅ Password reset
- ✅ Welcome email
- ✅ OTP verification
- ✅ Contact form notifications
- ✅ Payment notifications

### 5. **Testing Production Setup**
```bash
# Test email configuration
node scripts/testEmailConfig.js

# Test all email flows
node scripts/testRegistrationFlow.js
node scripts/testOtpFlow.js
node scripts/testAdditionalEmails.js
```

## ⚠️ Important Notes

1. **Domain Verification is Required**: Without domain verification, emails will fail in production
2. **API Key Security**: Never commit production API keys to version control
3. **Rate Limits**: Resend has rate limits - monitor usage in production
4. **Deliverability**: Verify SPF/DKIM records are properly configured

## 🔧 Troubleshooting

### Common Issues:
- **Domain not verified**: Check DNS records and Resend dashboard
- **API key invalid**: Regenerate key in Resend dashboard
- **Rate limit exceeded**: Implement email queuing for high volume

### Support:
- Resend Documentation: https://resend.com/docs
- Resend Support: https://resend.com/support