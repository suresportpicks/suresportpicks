import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Withdraw = () => {
  const { user, token } = useContext(AuthContext)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('withdraw')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawMethod, setWithdrawMethod] = useState('paypal')
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '',
    routingNumber: '',
    accountName: ''
  })
  const [paymentDetails, setPaymentDetails] = useState({
    paypal: { email: '' },
    venmo: { username: '' },
    zelle: { email: '', phone: '' },
    cashapp: { username: '' },
    applepay: { email: '', phone: '' },
    googlepay: { email: '', phone: '' },
    wise: { email: '' },
    skrill: { email: '' },
    neteller: { email: '' },
    westernunion: { firstName: '', lastName: '', country: '', city: '' },
    moneygram: { firstName: '', lastName: '', country: '', city: '' },
    crypto: { walletAddress: '', currency: 'BTC' }
  })
  const [withdrawHistory, setWithdrawHistory] = useState([])
  const [availableBalance, setAvailableBalance] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  // Sync tab with route path
  useEffect(() => {
    if (location.pathname.endsWith('/history')) {
      setActiveTab('history')
    } else {
      setActiveTab('withdraw')
    }
  }, [location.pathname])

  // Fetch balance and withdraw history
  useEffect(() => {
    fetchBalance()
    if (activeTab === 'history') {
      fetchWithdrawHistory()
    }
  }, [activeTab])

  // Helper function to update payment details
  const updatePaymentDetails = (method, field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }))
  }

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${API_BASE}/payments/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const transactions = data.transactions || []
        
        // Calculate balance from completed transactions only
        const balance = transactions.reduce((acc, transaction) => {
          if (transaction.status === 'completed') {
            if (transaction.type === 'deposit') return acc + transaction.amount
            if (transaction.type === 'withdraw') return acc - transaction.amount
          }
          return acc
        }, 0)
        
        setAvailableBalance(Math.max(0, balance)) // Ensure balance is never negative
      } else {
        console.error('Error fetching balance')
        setAvailableBalance(0)
      }
    } catch (err) {
      console.error('Error fetching balance:', err)
      setAvailableBalance(0)
    }
  }

  const fetchWithdrawHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/payments/withdrawals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('Withdrawal history data received:', data)
        console.log('Withdrawals array:', data.withdrawals)
        // Log rejected withdrawals specifically
        const rejectedWithdrawals = (data.withdrawals || []).filter(w => w.status === 'rejected')
        console.log('Rejected withdrawals:', rejectedWithdrawals)
        rejectedWithdrawals.forEach((w, index) => {
          console.log(`Rejected withdrawal ${index}:`, {
            id: w.id,
            status: w.status,
            rejectionReason: w.rejectionReason,
            hasRejectionReason: !!w.rejectionReason
          })
        })
        setWithdrawHistory(data.withdrawals || [])
      } else {
        const errorData = await response.json()
        console.error('Error fetching withdraw history:', errorData.message)
      }
    } catch (err) {
      console.error('Error fetching withdraw history:', err)
    } finally {
      setLoading(false)
    }
  }

  const validatePaymentDetails = () => {
    const details = paymentDetails[withdrawMethod]
    
    switch (withdrawMethod) {
      case 'paypal':
      case 'wise':
      case 'skrill':
      case 'neteller':
        return details.email && details.email.includes('@')
      
      case 'venmo':
      case 'cashapp':
        return details.username && details.username.length > 0
      
      case 'zelle':
        return (details.email && details.email.includes('@')) || (details.phone && details.phone.length > 0)
      
      case 'applepay':
      case 'googlepay':
        return details.email && details.email.includes('@') && details.phone && details.phone.length > 0
      
      case 'westernunion':
      case 'moneygram':
        return details.firstName && details.lastName && details.country && details.city
      
      case 'crypto':
        return details.walletAddress && details.walletAddress.length > 0 && details.currency
      
      case 'bank':
        return bankDetails.accountName && bankDetails.accountNumber && bankDetails.routingNumber
      
      default:
        return false
    }
  }

  const handleWithdraw = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const amount = parseFloat(withdrawAmount)

    if (amount > availableBalance) {
      setError('Insufficient balance')
      setLoading(false)
      return
    }

    if (amount < minWithdraw) {
      setError(`Minimum withdrawal amount is $${minWithdraw}`)
      setLoading(false)
      return
    }

    if (amount > maxWithdraw) {
      setError(`Maximum withdrawal amount is $${maxWithdraw.toFixed(2)}`)
      setLoading(false)
      return
    }

    if (!validatePaymentDetails()) {
      setError('Please fill in all required payment details')
      setLoading(false)
      return
    }

    try {
      const withdrawalData = {
        amount,
        withdrawMethod: withdrawMethod
      }

      // Add appropriate payment details based on method
      if (withdrawMethod === 'bank') {
        withdrawalData.bankDetails = bankDetails
      } else {
        withdrawalData.paymentDetails = paymentDetails[withdrawMethod]
      }

      const response = await fetch(`${API_BASE}/payments/withdraw`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(withdrawalData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Withdrawal request submitted successfully! Processing time: 1-3 business days.')
        setWithdrawAmount('')
        setBankDetails({ accountNumber: '', routingNumber: '', accountName: '' })
        // Reset payment details for the current method
        setPaymentDetails(prev => ({
          ...prev,
          [withdrawMethod]: {
            paypal: { email: '' },
            venmo: { username: '' },
            zelle: { email: '', phone: '' },
            cashapp: { username: '' },
            applepay: { email: '', phone: '' },
            googlepay: { email: '', phone: '' },
            wise: { email: '' },
            skrill: { email: '' },
            neteller: { email: '' },
            westernunion: { firstName: '', lastName: '', country: '', city: '' },
            moneygram: { firstName: '', lastName: '', country: '', city: '' },
            crypto: { walletAddress: '', currency: 'BTC' }
          }[withdrawMethod]
        }))
        // Refresh balance after successful withdrawal
        fetchBalance()
      } else {
        setError(data.message || 'Withdrawal failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const minWithdraw = 20
  const maxWithdraw = Math.min(availableBalance, 5000)

  return (
    <div className="p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold theme-text-primary mb-4 sm:mb-6">Withdraw</h1>

        {/* Tab Navigation */}
        <div className="border-b theme-border-primary mb-4 sm:mb-6">
          <nav className="-mb-px flex space-x-4 sm:space-x-8">
            <button
              onClick={() => navigate('/dashboard/withdraw')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                activeTab === 'withdraw'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              Withdraw Now
            </button>
            <button
              onClick={() => navigate('/dashboard/withdraw/history')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              Withdrawal History
            </button>
          </nav>
        </div>

        {/* Withdraw Now Tab */}
        {activeTab === 'withdraw' && (
          <div className="theme-bg-primary rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 theme-text-primary">Request Withdrawal</h2>
            
            {/* Current Balance */}
            <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <span className="theme-text-muted text-sm sm:text-base">Available Balance:</span>
                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  ${availableBalance.toFixed(2)}
                </span>
              </div>
            </div>

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

            <form onSubmit={handleWithdraw} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted">$</span>
                  <input
                    type="number"
                    min={minWithdraw}
                    max={maxWithdraw}
                    step="0.01"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pl-8 w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-sm theme-text-muted mt-1">
                  Minimum: ${minWithdraw}, Maximum: ${maxWithdraw.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-primary mb-2">
                  Withdrawal Method
                </label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                  className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                >
                  <option value="paypal">PayPal</option>
                  <option value="venmo">Venmo</option>
                  <option value="zelle">Zelle</option>
                  <option value="cashapp">Cash App</option>
                  <option value="applepay">Apple Pay</option>
                  <option value="googlepay">Google Pay</option>
                  <option value="bank">Bank Transfer (ACH)</option>
                  <option value="wise">Wise (formerly TransferWise)</option>
                  <option value="skrill">Skrill</option>
                  <option value="neteller">Neteller</option>
                  <option value="westernunion">Western Union</option>
                  <option value="moneygram">MoneyGram</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
              </div>

              {/* Dynamic Payment Details Forms */}
              {withdrawMethod !== 'bank' && (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 theme-bg-secondary rounded-lg">
                  <h3 className="font-medium theme-text-primary text-sm sm:text-base">
                    {withdrawMethod.charAt(0).toUpperCase() + withdrawMethod.slice(1)} Details
                  </h3>
                  
                  {/* PayPal */}
                  {withdrawMethod === 'paypal' && (
                    <div>
                      <label className="block text-sm font-medium theme-text-primary mb-1">
                        PayPal Email Address
                      </label>
                      <input
                        type="email"
                        value={paymentDetails.paypal.email}
                        onChange={(e) => updatePaymentDetails('paypal', 'email', e.target.value)}
                        className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                        placeholder="your-email@example.com"
                        required
                      />
                    </div>
                  )}

                  {/* Venmo */}
                  {withdrawMethod === 'venmo' && (
                    <div>
                      <label className="block text-sm font-medium theme-text-primary mb-1">
                        Venmo Username
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.venmo.username}
                        onChange={(e) => updatePaymentDetails('venmo', 'username', e.target.value)}
                        className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                        placeholder="@username"
                        required
                      />
                    </div>
                  )}

                  {/* Zelle */}
                  {withdrawMethod === 'zelle' && (
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium theme-text-primary mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={paymentDetails.zelle.email}
                          onChange={(e) => updatePaymentDetails('zelle', 'email', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary text-sm"
                          placeholder="your-email@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium theme-text-primary mb-1">
                          Phone Number (Alternative)
                        </label>
                        <input
                          type="tel"
                          value={paymentDetails.zelle.phone}
                          onChange={(e) => updatePaymentDetails('zelle', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary text-sm"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                      <p className="text-xs sm:text-sm theme-text-muted">Provide either email or phone number</p>
                    </div>
                  )}

                  {/* Cash App */}
                  {withdrawMethod === 'cashapp' && (
                    <div>
                      <label className="block text-sm font-medium theme-text-primary mb-1">
                        Cash App Username
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cashapp.username}
                        onChange={(e) => updatePaymentDetails('cashapp', 'username', e.target.value)}
                        className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                        placeholder="$username"
                        required
                      />
                    </div>
                  )}

                  {/* Apple Pay */}
                  {withdrawMethod === 'applepay' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          Apple ID Email
                        </label>
                        <input
                          type="email"
                          value={paymentDetails.applepay.email}
                          onChange={(e) => updatePaymentDetails('applepay', 'email', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          placeholder="your-apple-id@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={paymentDetails.applepay.phone}
                          onChange={(e) => updatePaymentDetails('applepay', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Google Pay */}
                  {withdrawMethod === 'googlepay' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          Google Account Email
                        </label>
                        <input
                          type="email"
                          value={paymentDetails.googlepay.email}
                          onChange={(e) => updatePaymentDetails('googlepay', 'email', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          placeholder="your-gmail@gmail.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={paymentDetails.googlepay.phone}
                          onChange={(e) => updatePaymentDetails('googlepay', 'phone', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Wise */}
                  {withdrawMethod === 'wise' && (
                    <div>
                      <label className="block text-sm font-medium theme-text-primary mb-1">
                        Wise Account Email
                      </label>
                      <input
                        type="email"
                        value={paymentDetails.wise.email}
                        onChange={(e) => updatePaymentDetails('wise', 'email', e.target.value)}
                        className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                        placeholder="your-wise-email@example.com"
                        required
                      />
                    </div>
                  )}

                  {/* Skrill */}
                  {withdrawMethod === 'skrill' && (
                    <div>
                      <label className="block text-sm font-medium theme-text-primary mb-1">
                        Skrill Account Email
                      </label>
                      <input
                        type="email"
                        value={paymentDetails.skrill.email}
                        onChange={(e) => updatePaymentDetails('skrill', 'email', e.target.value)}
                        className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                        placeholder="your-skrill-email@example.com"
                        required
                      />
                    </div>
                  )}

                  {/* Neteller */}
                  {withdrawMethod === 'neteller' && (
                    <div>
                      <label className="block text-sm font-medium theme-text-primary mb-1">
                        Neteller Account Email
                      </label>
                      <input
                        type="email"
                        value={paymentDetails.neteller.email}
                        onChange={(e) => updatePaymentDetails('neteller', 'email', e.target.value)}
                        className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                        placeholder="your-neteller-email@example.com"
                        required
                      />
                    </div>
                  )}

                  {/* Western Union */}
                  {withdrawMethod === 'westernunion' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium theme-text-primary mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.westernunion.firstName}
                            onChange={(e) => updatePaymentDetails('westernunion', 'firstName', e.target.value)}
                            className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium theme-text-primary mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.westernunion.lastName}
                            onChange={(e) => updatePaymentDetails('westernunion', 'lastName', e.target.value)}
                            className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.westernunion.country}
                          onChange={(e) => updatePaymentDetails('westernunion', 'country', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.westernunion.city}
                          onChange={(e) => updatePaymentDetails('westernunion', 'city', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* MoneyGram */}
                  {withdrawMethod === 'moneygram' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium theme-text-primary mb-1">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.moneygram.firstName}
                            onChange={(e) => updatePaymentDetails('moneygram', 'firstName', e.target.value)}
                            className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium theme-text-primary mb-1">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={paymentDetails.moneygram.lastName}
                            onChange={(e) => updatePaymentDetails('moneygram', 'lastName', e.target.value)}
                            className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.moneygram.country}
                          onChange={(e) => updatePaymentDetails('moneygram', 'country', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.moneygram.city}
                          onChange={(e) => updatePaymentDetails('moneygram', 'city', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Cryptocurrency */}
                  {withdrawMethod === 'crypto' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          Cryptocurrency
                        </label>
                        <select
                          value={paymentDetails.crypto.currency}
                          onChange={(e) => updatePaymentDetails('crypto', 'currency', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                        >
                          <option value="BTC">Bitcoin (BTC)</option>
                          <option value="ETH">Ethereum (ETH)</option>
                          <option value="USDT">Tether (USDT)</option>
                          <option value="USDC">USD Coin (USDC)</option>
                          <option value="LTC">Litecoin (LTC)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium theme-text-primary mb-1">
                          Wallet Address
                        </label>
                        <input
                          type="text"
                          value={paymentDetails.crypto.walletAddress}
                          onChange={(e) => updatePaymentDetails('crypto', 'walletAddress', e.target.value)}
                          className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                          placeholder="Enter your wallet address"
                          required
                        />
                      </div>
                      <p className="text-sm theme-text-muted">
                        ⚠️ Please double-check your wallet address. Incorrect addresses may result in permanent loss of funds.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bank Details for Bank Transfer */}
              {withdrawMethod === 'bank' && (
                <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 theme-bg-secondary rounded-lg">
                  <h3 className="font-medium theme-text-primary text-sm sm:text-base">Bank Account Details</h3>
                  <div>
                    <label className="block text-sm font-medium theme-text-primary mb-1">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                      className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium theme-text-primary mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                      className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium theme-text-primary mb-1">
                      Routing Number
                    </label>
                    <input
                      type="text"
                      value={bankDetails.routingNumber}
                      onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                      className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-xs sm:text-sm font-medium theme-text-primary mb-2">
                  Quick Amounts
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[50, 100, 250, 500].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setWithdrawAmount(amount.toString())}
                      disabled={amount > availableBalance}
                      className="px-2 sm:px-4 py-2 border theme-border-primary rounded-md hover:theme-bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed theme-bg-primary theme-text-primary text-xs sm:text-sm"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawAmount(availableBalance.toString())}
                  className="mt-2 text-xs sm:text-sm text-blue-600 hover:text-blue-800"
                >
                  Withdraw All (${availableBalance.toFixed(2)})
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !withdrawAmount || parseFloat(withdrawAmount) < minWithdraw}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : `Withdraw $${withdrawAmount || '0.00'}`}
              </button>
            </form>

            {/* Processing Info */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-900 mb-2 text-sm sm:text-base">Processing Information</h3>
              <ul className="text-xs sm:text-sm text-yellow-800 space-y-1">
                <li>• PayPal, Venmo, Zelle, Cash App: 1-2 business days</li>
                <li>• Apple Pay, Google Pay: 1-3 business days</li>
                <li>• Bank transfers (ACH): 1-3 business days</li>
                <li>• Wise, Skrill, Neteller: 1-2 business days</li>
                <li>• Western Union, MoneyGram: 1-4 business days</li>
                <li>• Cryptocurrency: 1-24 hours</li>
                <li>• Withdrawal fee: $2.50 for amounts under $100</li>
              </ul>
            </div>
          </div>
        )}

        {/* Withdrawal History Tab */}
        {activeTab === 'history' && (
          <div className="theme-bg-primary rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 theme-text-primary">Withdrawal History</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 theme-text-muted">Loading withdrawal history...</p>
              </div>
            ) : withdrawHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="theme-text-muted">No withdrawals found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y theme-border-primary">
                  <thead className="theme-bg-secondary">
                    <tr>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider hidden sm:table-cell">
                        Method
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider hidden md:table-cell">
                        Transaction ID
                      </th>
                      <th className="px-2 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider hidden lg:table-cell">
                        Reason
                      </th>
                    </tr>
                  </thead>
                  <tbody className="theme-bg-primary divide-y theme-border-primary">
                    {withdrawHistory.map((withdrawal) => (
                      <tr key={withdrawal.id} className="hover:theme-bg-secondary">
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm theme-text-primary">
                          {formatDate(withdrawal.createdAt)}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium theme-text-primary">
                          ${withdrawal.amount.toFixed(2)}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm theme-text-muted capitalize hidden sm:table-cell">
                          {withdrawal.withdrawMethod || withdrawal.paymentMethod}
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-1 sm:px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(withdrawal.status)}`}>
                            {withdrawal.status}
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm theme-text-muted font-mono hidden md:table-cell">
                          {withdrawal.status === 'rejected' ? 'N/A' : 
                           withdrawal.status === 'pending' ? 'Pending' :
                           withdrawal.transactionId || 'N/A'}
                        </td>
                        <td className="px-2 sm:px-6 py-4 text-xs sm:text-sm theme-text-muted max-w-xs hidden lg:table-cell">
                          {withdrawal.status === 'rejected' && (withdrawal.rejectionReason || withdrawal.adminNotes) ? (
                            <button
                              onClick={() => {
                                const reasonText = withdrawal.rejectionReason || withdrawal.adminNotes;
                                setSelectedReason(reasonText)
                                setShowReasonModal(true)
                              }}
                              className="text-red-600 bg-red-50 px-1 sm:px-2 py-1 rounded text-xs hover:bg-red-100 cursor-pointer transition-colors"
                            >
                              {(withdrawal.rejectionReason || withdrawal.adminNotes).length > 30 
                                ? `${(withdrawal.rejectionReason || withdrawal.adminNotes).substring(0, 30)}...` 
                                : (withdrawal.rejectionReason || withdrawal.adminNotes)
                              }
                            </button>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Rejection Reason Modal */}
        {showReasonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="theme-bg-primary rounded-lg p-4 sm:p-6 max-w-md w-full">
              <h3 className="text-base sm:text-lg font-semibold theme-text-primary mb-4">Rejection Reason</h3>
              <div className="theme-bg-secondary p-3 sm:p-4 rounded-lg mb-4">
                <p className="theme-text-primary text-xs sm:text-sm">{selectedReason}</p>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowReasonModal(false)
                    setSelectedReason('')
                  }}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Withdraw