import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Deposit = () => {
  const { user, token } = useContext(AuthContext)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('deposit')
  const [depositAmount, setDepositAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('paypal')
  const [depositHistory, setDepositHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  // Sync tab with route path
  useEffect(() => {
    if (location.pathname.endsWith('/history')) {
      setActiveTab('history')
    } else {
      setActiveTab('deposit')
    }
  }, [location.pathname])

  // Fetch deposit history
  useEffect(() => {
    if (activeTab === 'history') {
      fetchDepositHistory()
    }
  }, [activeTab])

  const fetchDepositHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/payments/transactions?type=deposit`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDepositHistory(data.transactions || [])
      } else {
        const errorData = await response.json()
        console.error('Error fetching deposit history:', errorData.message)
      }
    } catch (err) {
      console.error('Error fetching deposit history:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeposit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE}/payments/deposit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: parseFloat(depositAmount),
          paymentMethod
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Deposit request submitted successfully! An admin will review your request and provide payment instructions shortly.')
        setDepositAmount('')
        // Refresh deposit history to show the new request
        fetchDepositHistory()
      } else {
        setError(data.message || 'Deposit failed')
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
      case 'waiting_for_deposit': return 'text-blue-600 bg-blue-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'pending': return 'Pending Review'
      case 'waiting_for_deposit': return 'Awaiting Payment'
      case 'failed': return 'Failed'
      default: return status
    }
  }

  const viewTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction)
    setShowDetailsModal(true)
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold theme-text-primary mb-4 sm:mb-6">Deposit</h1>

        {/* Tab Navigation */}
        <div className="border-b theme-border-primary mb-4 sm:mb-6">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => navigate('/dashboard/deposit')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'deposit'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              Deposit Now
            </button>
            <button
              onClick={() => navigate('/dashboard/deposit/history')}
              className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              Deposit History
            </button>
          </nav>
        </div>

        {/* Deposit Now Tab */}
        {activeTab === 'deposit' && (
          <div className="theme-bg-primary rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 theme-text-primary">Make a Deposit</h2>
            
            {/* Current Balance */}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-between">
                <span className="theme-text-muted text-sm sm:text-base">Current Balance:</span>
                <span className="text-xl sm:text-2xl font-bold text-blue-600">
                  ${user?.balance?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-3 sm:mb-4 text-sm sm:text-base">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded mb-3 sm:mb-4 text-sm sm:text-base">
                {success}
              </div>
            )}

            <form onSubmit={handleDeposit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium theme-text-primary mb-1 sm:mb-2">
                  Deposit Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 theme-text-muted text-sm sm:text-base">$</span>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    step="0.01"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="pl-8 w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary text-sm sm:text-base"
                    placeholder="0.00"
                    required
                  />
                </div>
                <p className="text-xs sm:text-sm theme-text-muted mt-1">Minimum: $10, Maximum: $10,000</p>
              </div>

              <div>
                <label className="block text-sm font-medium theme-text-primary mb-1 sm:mb-2">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary text-sm sm:text-base"
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

              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-medium theme-text-primary mb-1 sm:mb-2">
                  Quick Amounts
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[25, 50, 100, 250].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setDepositAmount(amount.toString())}
                      className="px-3 sm:px-4 py-2 border theme-border-primary rounded-md hover:theme-bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary text-sm sm:text-base"
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !depositAmount}
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
              >
                {loading ? 'Processing...' : `Deposit $${depositAmount || '0.00'}`}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 theme-bg-secondary rounded-lg">
              <h3 className="font-medium theme-text-primary mb-2 text-sm sm:text-base">Security & Processing</h3>
              <ul className="text-xs sm:text-sm theme-text-muted space-y-1">
                <li>• All transactions are secured with 256-bit SSL encryption</li>
                <li>• Deposits are typically processed within 5-15 minutes</li>
                <li>• Bank transfers may take 1-3 business days</li>
                <li>• No fees for deposits under $1,000</li>
              </ul>
            </div>
          </div>
        )}

        {/* Deposit History Tab */}
        {activeTab === 'history' && (
          <div className="theme-bg-primary rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 theme-text-primary">Deposit History</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 theme-text-muted text-sm sm:text-base">Loading deposit history...</p>
              </div>
            ) : depositHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="theme-text-muted text-sm sm:text-base">No deposits found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Mobile Card View */}
                <div className="block sm:hidden space-y-3">
                  {depositHistory.map((deposit) => (
                    <div key={deposit._id} className="theme-bg-secondary rounded-lg p-3 border theme-border-primary">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium theme-text-primary text-sm">${deposit.amount.toFixed(2)}</p>
                          <p className="text-xs theme-text-muted">{formatDate(deposit.createdAt)}</p>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                          {getStatusText(deposit.status)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs theme-text-muted capitalize">{deposit.paymentMethod}</p>
                          <p className="text-xs theme-text-muted font-mono">{deposit.transactionId || 'N/A'}</p>
                        </div>
                        <button
                          onClick={() => viewTransactionDetails(deposit)}
                          className="text-blue-600 hover:text-blue-900 font-medium text-xs"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <table className="hidden sm:table min-w-full divide-y theme-border-primary">
                  <thead className="theme-bg-secondary">
                    <tr>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="theme-bg-primary divide-y theme-border-primary">
                    {depositHistory.map((deposit) => (
                      <tr key={deposit._id} className="hover:theme-bg-secondary">
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm theme-text-primary">
                          {formatDate(deposit.createdAt)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm font-medium theme-text-primary">
                          ${deposit.amount.toFixed(2)}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm theme-text-muted capitalize">
                          {deposit.paymentMethod}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                            {getStatusText(deposit.status)}
                          </span>
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm theme-text-muted font-mono">
                          {deposit.transactionId || 'N/A'}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm">
                          <button
                            onClick={() => viewTransactionDetails(deposit)}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {showDetailsModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="theme-bg-primary rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold theme-text-primary">Transaction Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium theme-text-muted">Transaction ID</label>
                  <p className="mt-1 text-xs sm:text-sm theme-text-primary font-mono break-all">{selectedTransaction.transactionId || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium theme-text-muted">Amount</label>
                  <p className="mt-1 text-sm sm:text-base theme-text-primary font-semibold">${selectedTransaction.amount.toFixed(2)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium theme-text-muted">Payment Method</label>
                  <p className="mt-1 text-xs sm:text-sm theme-text-primary capitalize">{selectedTransaction.paymentMethod}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium theme-text-muted">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTransaction.status)}`}>
                    {getStatusText(selectedTransaction.status)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium theme-text-muted">Date</label>
                  <p className="mt-1 text-xs sm:text-sm theme-text-primary">{formatDate(selectedTransaction.createdAt)}</p>
                </div>

                {/* Payment Instructions (only show if admin has provided details) */}
                {selectedTransaction.adminPaymentDetails && (
                  <div className="border-t theme-border-primary pt-3 sm:pt-4">
                    <h4 className="font-medium theme-text-primary mb-2 sm:mb-3 text-sm sm:text-base">Payment Instructions</h4>
                    
                    {selectedTransaction.adminPaymentDetails.instructions && (
                      <div className="mb-2 sm:mb-3">
                        <label className="block text-sm font-medium theme-text-muted">Instructions</label>
                        <p className="mt-1 text-xs sm:text-sm theme-text-primary">{selectedTransaction.adminPaymentDetails.instructions}</p>
                      </div>
                    )}

                    {selectedTransaction.adminPaymentDetails.accountInfo && (
                      <div className="mb-2 sm:mb-3">
                        <label className="block text-sm font-medium theme-text-muted">Account Information</label>
                        <p className="mt-1 text-xs sm:text-sm theme-text-primary font-mono break-all">{selectedTransaction.adminPaymentDetails.accountInfo}</p>
                      </div>
                    )}

                    {selectedTransaction.adminPaymentDetails.reference && (
                      <div className="mb-2 sm:mb-3">
                        <label className="block text-sm font-medium theme-text-muted">Reference</label>
                        <p className="mt-1 text-xs sm:text-sm theme-text-primary font-mono break-all">{selectedTransaction.adminPaymentDetails.reference}</p>
                      </div>
                    )}

                    {selectedTransaction.adminPaymentDetails.notes && (
                      <div className="mb-2 sm:mb-3">
                        <label className="block text-sm font-medium theme-text-muted">Additional Notes</label>
                        <p className="mt-1 text-xs sm:text-sm theme-text-primary">{selectedTransaction.adminPaymentDetails.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Show message if no payment details yet */}
                {!selectedTransaction.adminPaymentDetails && selectedTransaction.status === 'pending' && (
                  <div className="border-t theme-border-primary pt-3 sm:pt-4">
                    <p className="text-xs sm:text-sm theme-text-muted">Payment instructions will be provided once your request is reviewed by our team.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 sm:mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Deposit