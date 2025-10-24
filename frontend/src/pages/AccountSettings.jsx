import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const AccountSettings = () => {
  const { user, token, updateUser } = useContext(AuthContext)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  // Sync tab with route path
  useEffect(() => {
    if (location.pathname.endsWith('/password')) {
      setActiveTab('password')
    } else if (location.pathname.endsWith('/2fa')) {
      setActiveTab('2fa')
    } else {
      setActiveTab('profile')
    }
  }, [location.pathname])

  // Profile form
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timezone: '',
    notifications: {
      email: true,
      sms: false,
      picks: true,
      marketing: false
    }
  })

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // 2FA form
  const [twoFAData, setTwoFAData] = useState({
    enabled: false,
    qrCode: '',
    secret: '',
    verificationCode: ''
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        timezone: user.timezone || 'America/New_York',
        notifications: user.notifications || {
          email: true,
          sms: false,
          picks: true,
          marketing: false
        }
      })
      setTwoFAData(prev => ({ ...prev, enabled: user.twoFactorEnabled || false }))
    }
  }, [user])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Profile updated successfully!')
        updateUser(data.user)
      } else {
        setError(data.message || 'Failed to update profile')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE}/users/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Password changed successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setError(data.message || 'Failed to change password')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEnable2FA = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_BASE}/users/2fa/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setTwoFAData(prev => ({
          ...prev,
          qrCode: data.qrCode,
          secret: data.secret
        }))
      } else {
        setError(data.message || 'Failed to setup 2FA')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify2FA = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE}/users/2fa/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: twoFAData.verificationCode
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Two-factor authentication enabled successfully!')
        setTwoFAData(prev => ({
          ...prev,
          enabled: true,
          qrCode: '',
          secret: '',
          verificationCode: ''
        }))
        updateUser({ ...user, twoFactorEnabled: true })
      } else {
        setError(data.message || 'Invalid verification code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDisable2FA = async () => {
    if (!window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE}/users/2fa/disable`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Two-factor authentication disabled successfully!')
        setTwoFAData(prev => ({ ...prev, enabled: false }))
        updateUser({ ...user, twoFactorEnabled: false })
      } else {
        setError(data.message || 'Failed to disable 2FA')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold theme-text-primary mb-6">Account Settings</h1>

        {/* Tab Navigation */}
        <div className="border-b theme-border-primary mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => navigate('/dashboard/settings/profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => navigate('/dashboard/settings/password')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'password'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => navigate('/dashboard/settings/2fa')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === '2fa'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              Two-Factor Authentication
            </button>
          </nav>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="theme-bg-primary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 theme-text-primary">Profile Information</h2>
            
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium theme-text-primary mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium theme-text-primary mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  Timezone
                </label>
                <select
                  value={profileData.timezone}
                  onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                  className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                >
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Chicago">Central Time (CT)</option>
                  <option value="America/Denver">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Paris">Paris (CET)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>

              {/* Notification Preferences */}
              <div>
                <h3 className="text-lg font-medium theme-text-primary mb-3">Notification Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.notifications.email}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        notifications: { ...profileData.notifications, email: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 theme-border-primary rounded"
                    />
                    <span className="ml-2 text-sm theme-text-primary">Email notifications</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.notifications.sms}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        notifications: { ...profileData.notifications, sms: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 theme-border-primary rounded"
                    />
                    <span className="ml-2 text-sm theme-text-primary">SMS notifications</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.notifications.picks}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        notifications: { ...profileData.notifications, picks: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 theme-border-primary rounded"
                    />
                    <span className="ml-2 text-sm theme-text-primary">New picks notifications</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={profileData.notifications.marketing}
                      onChange={(e) => setProfileData({
                        ...profileData,
                        notifications: { ...profileData.notifications, marketing: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 theme-border-primary rounded"
                    />
                    <span className="ml-2 text-sm theme-text-primary">Marketing emails</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Password Change Tab */}
        {activeTab === 'password' && (
          <div className="theme-bg-primary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 theme-text-primary">Change Password</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                  minLength={8}
                  required
                />
                <p className="text-sm theme-text-muted mt-1">Must be at least 8 characters long</p>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>

            {/* Password Security Tips */}
            <div className="mt-6 p-4 theme-bg-secondary rounded-lg">
              <h3 className="font-medium theme-text-primary mb-2">Password Security Tips</h3>
              <ul className="text-sm theme-text-muted space-y-1">
                <li>• Use a combination of letters, numbers, and symbols</li>
                <li>• Avoid using personal information</li>
                <li>• Don't reuse passwords from other accounts</li>
                <li>• Consider using a password manager</li>
              </ul>
            </div>
          </div>
        )}

        {/* Two-Factor Authentication Tab */}
        {activeTab === '2fa' && (
          <div className="theme-bg-primary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 theme-text-primary">Two-Factor Authentication</h2>
            
            {!twoFAData.enabled ? (
              <div>
                <div className="mb-6">
                  <p className="theme-text-muted mb-4">
                    Two-factor authentication adds an extra layer of security to your account by requiring a verification code from your phone in addition to your password.
                  </p>
                  
                  {!twoFAData.qrCode ? (
                    <button
                      onClick={handleEnable2FA}
                      disabled={loading}
                      className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {loading ? 'Setting up...' : 'Enable 2FA'}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium theme-text-primary mb-2">Step 1: Scan QR Code</h3>
                        <p className="text-sm theme-text-muted mb-3">
                          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>
                        <div className="theme-bg-primary p-4 border theme-border-primary rounded-lg inline-block">
                          <img src={twoFAData.qrCode} alt="2FA QR Code" className="w-48 h-48" />
                        </div>
                        <p className="text-xs theme-text-muted mt-2">
                          Manual entry key: <code className="theme-bg-secondary px-1 rounded">{twoFAData.secret}</code>
                        </p>
                      </div>

                      <form onSubmit={handleVerify2FA}>
                        <div>
                          <h3 className="font-medium theme-text-primary mb-2">Step 2: Enter Verification Code</h3>
                          <input
                            type="text"
                            value={twoFAData.verificationCode}
                            onChange={(e) => setTwoFAData({...twoFAData, verificationCode: e.target.value})}
                            className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={loading || twoFAData.verificationCode.length !== 6}
                          className="mt-3 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                          {loading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-green-100 rounded-full mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium theme-text-primary">Two-Factor Authentication is Enabled</h3>
                    <p className="text-sm theme-text-muted">Your account is protected with 2FA</p>
                  </div>
                </div>

                <button
                  onClick={handleDisable2FA}
                  disabled={loading}
                  className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                >
                  {loading ? 'Disabling...' : 'Disable 2FA'}
                </button>
              </div>
            )}

            {/* 2FA Info */}
            <div className="mt-6 p-4 theme-bg-secondary rounded-lg">
              <h3 className="font-medium theme-text-primary mb-2">Important Notes</h3>
              <ul className="text-sm theme-text-muted space-y-1">
                <li>• Keep your authenticator app backed up</li>
                <li>• Save backup codes in a secure location</li>
                <li>• Contact support if you lose access to your authenticator</li>
                <li>• 2FA is required for high-value transactions</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AccountSettings