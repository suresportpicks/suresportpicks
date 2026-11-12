const crypto = require('crypto');
const ValidationCode = require('../models/ValidationCode');

// Generate a random code of specified length
const generateUniqueCode = async (length = 8) => {
  while (true) {
    // Generate random bytes and convert to base32 (using only uppercase letters and numbers)
    const buffer = crypto.randomBytes(length);
    const code = buffer.toString('base32').substring(0, length).replace(/[^A-Z2-7]/g, '');
    
    // Check if code already exists
    const existingCode = await ValidationCode.findOne({ code });
    if (!existingCode) {
      return code;
    }
  }
};

// Generate a new validation code for a withdrawal
const generateValidationCode = async (userId, withdrawalAmount, type) => {
  const code = await generateUniqueCode();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // Code expires in 24 hours

  const validationCode = new ValidationCode({
    code,
    type,
    userId,
    withdrawalAmount,
    expiresAt
  });

  await validationCode.save();
  return validationCode;
};

// Validate a code
const validateCode = async (userId, code, withdrawalAmount, type) => {
  const validationCode = await ValidationCode.findOne({
    code,
    userId,
    type,
    used: false,
    expiresAt: { $gt: new Date() }
  });

  if (!validationCode) {
    throw new Error('Invalid or expired code');
  }

  if (validationCode.withdrawalAmount !== withdrawalAmount) {
    throw new Error('Code does not match withdrawal amount');
  }

  // Mark code as used
  validationCode.used = true;
  await validationCode.save();

  return true;
};

module.exports = {
  generateValidationCode,
  validateCode
};