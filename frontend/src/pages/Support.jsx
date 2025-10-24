import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLocation, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Support = () => {
  const { user, token } = useContext(AuthContext)
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('new')
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  
  // New ticket form
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    description: ''
  })
  const [submitLoading, setSubmitLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const location = useLocation()
  const navigate = useNavigate()

  // Sync tab with route path
  useEffect(() => {
    if (location.pathname.endsWith('/tickets')) {
      setActiveTab('tickets')
    } else {
      setActiveTab('new')
    }
  }, [location.pathname])

  useEffect(() => {
    if (activeTab === 'tickets') {
      fetchTickets()
    }
  }, [activeTab])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE}/support/tickets`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTickets(data.tickets || [])
      } else {
        const errorData = await response.json()
        console.error('Error fetching tickets:', errorData.message)
      }
    } catch (err) {
      console.error('Error fetching tickets:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTicket = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE}/support/tickets`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTicket)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Support ticket created successfully! We\'ll get back to you within 24 hours.')
        setNewTicket({
          subject: '',
          category: 'general',
          priority: 'medium',
          description: ''
        })
      } else {
        setError(data.message || 'Failed to create ticket')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitLoading(false)
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
      case 'open': return 'text-blue-600 bg-blue-100'
      case 'in_progress': return 'text-yellow-600 bg-yellow-100'
      case 'resolved': return 'text-green-600 bg-green-100'
      case 'closed': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold theme-text-primary mb-6">Support Center</h1>

        {/* Tab Navigation */}
        <div className="border-b theme-border-primary mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => navigate('/dashboard/support/new')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'new'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              Open New Ticket
            </button>
            <button
              onClick={() => navigate('/dashboard/support/tickets')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'tickets'
                  ? 'border-blue-500 text-blue-600 theme-bg-primary'
                  : 'border-transparent theme-text-primary hover:theme-text-muted hover:border-gray-300 theme-bg-secondary'
              }`}
            >
              My Tickets
            </button>
          </nav>
        </div>

        {/* New Ticket Tab */}
        {activeTab === 'new' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ticket Form */}
            <div className="lg:col-span-2">
              <div className="theme-bg-primary rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 theme-text-primary">Create Support Ticket</h2>
                
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

                <form onSubmit={handleSubmitTicket} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium theme-text-primary mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={newTicket.subject}
                      onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                      className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium theme-text-primary mb-2">
                        Category
                      </label>
                      <select
                        value={newTicket.category}
                        onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                        className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="account">Account Issues</option>
                        <option value="payment">Payment & Billing</option>
                        <option value="technical">Technical Support</option>
                        <option value="picks">Picks & Predictions</option>
                        <option value="subscription">Subscription</option>
                        <option value="refund">Refund Request</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium theme-text-primary mb-2">
                        Priority
                      </label>
                      <select
                        value={newTicket.priority}
                        onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                        className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium theme-text-primary mb-2">
                      Description *
                    </label>
                    <textarea
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                      rows={6}
                      className="w-full px-3 py-2 border theme-border-primary rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-primary theme-text-primary"
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? 'Creating Ticket...' : 'Create Ticket'}
                  </button>
                </form>
              </div>
            </div>

            {/* Help & FAQ */}
            <div className="space-y-6">
              <div className="theme-bg-primary rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 theme-text-primary">Quick Help</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium theme-text-primary">Response Times</h4>
                    <ul className="text-sm theme-text-muted mt-1 space-y-1">
                      <li>• High Priority: 2-4 hours</li>
                      <li>• Medium Priority: 12-24 hours</li>
                      <li>• Low Priority: 24-48 hours</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium theme-text-primary">Contact Info</h4>
                    <p className="text-sm theme-text-muted mt-1">
                      Email: support@suresportpicks.com<br />
                      Phone: 1-800-PICKS-24
                    </p>
                  </div>
                </div>
              </div>

              <div className="theme-bg-primary rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 theme-text-primary">Common Issues</h3>
                <div className="space-y-3">
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-medium theme-text-primary">Can't access picks?</h4>
                    <p className="text-sm theme-text-muted">Check your subscription status and ensure payment is up to date.</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-3">
                    <h4 className="font-medium theme-text-primary">Payment failed?</h4>
                    <p className="text-sm theme-text-muted">Verify your payment method and try again, or contact your bank.</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-3">
                    <h4 className="font-medium theme-text-primary">Account locked?</h4>
                    <p className="text-sm theme-text-muted">Use the password reset feature or contact support immediately.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="theme-bg-primary rounded-lg shadow-md">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 theme-text-muted">Loading tickets...</p>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 theme-text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="theme-text-muted">No support tickets found</p>
                <p className="text-sm theme-text-muted mt-1">Create your first ticket to get help</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y theme-border-primary">
                  <thead className="theme-bg-secondary">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium theme-text-muted uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="theme-bg-primary divide-y theme-border-primary">
                    {tickets.map((ticket) => (
                      <tr key={ticket._id} className="hover:theme-bg-secondary">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium theme-text-primary">
                              #{ticket.ticketNumber}
                            </div>
                            <div className="text-sm theme-text-muted truncate max-w-xs">
                              {ticket.subject}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-muted capitalize">
                          {ticket.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-muted">
                          {formatDate(ticket.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedTicket(ticket)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
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

        {/* Ticket Detail Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border theme-border-primary w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md theme-bg-primary">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold theme-text-primary">
                  Ticket #{selectedTicket.ticketNumber}
                </h3>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="theme-text-muted hover:theme-text-primary"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium theme-text-primary">{selectedTicket.subject}</h4>
                  <div className="flex space-x-4 mt-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority} priority
                    </span>
                    <span className="text-xs theme-text-muted">
                      {formatDate(selectedTicket.createdAt)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium theme-text-primary mb-2">Description:</h5>
                  <p className="theme-text-muted whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>

                {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                  <div>
                    <h5 className="font-medium theme-text-primary mb-2">Responses:</h5>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedTicket.responses.map((response, index) => (
                        <div key={index} className={`p-3 rounded-lg ${response.isAdmin ? 'bg-blue-50' : 'theme-bg-secondary'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-black">
                              {response.isAdmin ? 'Support Team' : 'You'}
                            </span>
                            <span className="text-xs text-black">
                              {formatDate(response.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-black">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Support