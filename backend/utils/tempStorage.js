/**
 * Temporary storage for unverified user registrations
 * Uses in-memory storage with automatic cleanup
 */

class TempStorage {
  constructor() {
    this.storage = new Map();
    this.cleanupInterval = 10 * 60 * 1000; // 10 minutes
    
    // Start cleanup process
    this.startCleanup();
  }

  /**
   * Store temporary user data
   * @param {string} email - User email (used as key)
   * @param {Object} userData - User registration data
   * @param {string} otpCode - OTP verification code
   * @param {number} expiryTime - Expiry timestamp
   */
  store(email, userData, otpCode, expiryTime) {
    this.storage.set(email, {
      userData,
      otpCode,
      expiryTime,
      createdAt: Date.now()
    });
  }

  /**
   * Retrieve temporary user data
   * @param {string} email - User email
   * @returns {Object|null} - User data or null if not found/expired
   */
  get(email) {
    const data = this.storage.get(email);
    
    if (!data) {
      return null;
    }

    // Check if expired
    if (Date.now() > data.expiryTime) {
      this.storage.delete(email);
      return null;
    }

    return data;
  }

  /**
   * Verify OTP and return user data
   * @param {string} email - User email
   * @param {string} otpCode - OTP code to verify
   * @returns {Object|null} - User data if OTP is valid, null otherwise
   */
  verifyOTP(email, otpCode) {
    const data = this.get(email);
    
    if (!data) {
      return null;
    }

    if (data.otpCode !== otpCode) {
      return null;
    }

    // OTP is valid, remove from temp storage
    this.storage.delete(email);
    return data.userData;
  }

  /**
   * Remove temporary user data
   * @param {string} email - User email
   */
  remove(email) {
    this.storage.delete(email);
  }

  /**
   * Update OTP for existing temporary user
   * @param {string} email - User email
   * @param {string} newOtpCode - New OTP code
   * @param {number} newExpiryTime - New expiry timestamp
   */
  updateOTP(email, newOtpCode, newExpiryTime) {
    const data = this.storage.get(email);
    if (data) {
      data.otpCode = newOtpCode;
      data.expiryTime = newExpiryTime;
      this.storage.set(email, data);
      return true;
    }
    return false;
  }

  /**
   * Start automatic cleanup of expired entries
   */
  startCleanup() {
    setInterval(() => {
      const now = Date.now();
      for (const [email, data] of this.storage.entries()) {
        if (now > data.expiryTime) {
          this.storage.delete(email);
          console.log(`🧹 Cleaned up expired temp user: ${email}`);
        }
      }
    }, this.cleanupInterval);
  }

  /**
   * Get storage statistics
   */
  getStats() {
    return {
      totalEntries: this.storage.size,
      entries: Array.from(this.storage.keys())
    };
  }
}

// Create singleton instance
const tempStorage = new TempStorage();

module.exports = tempStorage;