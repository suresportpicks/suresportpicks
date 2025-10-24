import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyEmail = () => {
  const [otpCode, setOtpCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email || !otpCode) {
      setError('Please enter both email and verification code');
      return;
    }

    if (otpCode.length !== 6) {
      setError('Verification code must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otpCode }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess('Email verified successfully! Redirecting to dashboard...');
        // Login the user with the token
        await loginWithToken(data.token);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (countdown > 0) {
      setError(`Please wait ${countdown} seconds before requesting a new code`);
      return;
    }

    setResendLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Verification code sent successfully!');
        setCountdown(60); // 60 second cooldown
      } else {
        setError(data.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend error:', error);
      setError('Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtpCode(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to your email address
            </p>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleVerifyEmail} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email address"
                required
              />
            </div>

            {/* OTP Input */}
            <div>
              <label htmlFor="otpCode" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otpCode"
                value={otpCode}
                onChange={handleOtpChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Verify Button */}
            <button
              type="submit"
              disabled={loading || !email || !otpCode || otpCode.length !== 6}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </div>
              ) : (
                'Verify Email'
              )}
            </button>
          </form>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-3">Didn't receive the code?</p>
            <button
              onClick={handleResendCode}
              disabled={resendLoading || countdown > 0}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                'Sending...'
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                'Resend Code'
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
            >
              ← Back to Login
            </button>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-blue-100 text-sm">
            Check your spam folder if you don't see the email in your inbox
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;