import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { 
  Users, Bell, Save, Search, Pin, PinOff, BarChart3, DollarSign, 
  FileText, MessageSquare, Settings, TrendingUp, Eye, Edit, Trash2,
  Plus, CheckCircle, XCircle, Clock, AlertTriangle, Star, Target,
  CreditCard, Download, Upload, Filter, Calendar, Mail, Phone,
  ArrowRight, ArrowLeft, User, MapPin, LogOut
} from 'lucide-react'
import HomepageContentManager from '../components/admin/HomepageContentManager'
import ContactInquiriesManager from '../components/admin/ContactInquiriesManager'
import { adminApi } from '../api/adminApi'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function AdminPanel() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  
  // Get initial tab from URL params or default to dashboard
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabFromUrl = urlParams.get('tab')
    const validTabs = ['dashboard', 'users', 'financial', 'content', 'plans', 'support', 'settings']
    return validTabs.includes(tabFromUrl) ? tabFromUrl : 'dashboard'
  }
  
  // State management
  const [activeTab, setActiveTab] = useState(getInitialTab())
  const [loading, setLoading] = useState(true)
  
  // Handle tab change with URL update
  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    const url = new URL(window.location)
    url.searchParams.set('tab', tabId)
    window.history.pushState({}, '', url)
  }
  
  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getInitialTab())
    }
    
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Handle logout
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [savingConfig, setSavingConfig] = useState(false)

  // Data states
  const [users, setUsers] = useState([])
  const [userStats, setUserStats] = useState({ total: 0, gold: 0, silver: 0, free: 0 })
  const [announcements, setAnnouncements] = useState([])
  const [transactions, setTransactions] = useState([])
  const [supportTickets, setSupportTickets] = useState([])
  const [picks, setPicks] = useState([])
  const [dashboardStats, setDashboardStats] = useState({})
  const [dashboardConfig, setDashboardConfig] = useState({})
  const [depositRequests, setDepositRequests] = useState([])
  const [selectedDeposit, setSelectedDeposit] = useState(null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState({
    instructions: '',
    accountInfo: '',
    reference: '',
    notes: ''
  })
  const [paymentOptions, setPaymentOptions] = useState([])
  const [showPaymentOptionModal, setShowPaymentOptionModal] = useState(false)
  const [selectedPaymentOption, setSelectedPaymentOption] = useState(null)
  const [paymentOptionForm, setPaymentOptionForm] = useState({
    name: '',
    code: '',
    type: 'both',
    category: 'digital_wallet',
    description: '',
    icon: '',
    isActive: true,
    minAmount: 0,
    maxAmount: 10000,
    processingTime: '1-3 business days',
    fees: { fixed: 0, percentage: 0 },
    requiredFields: [],
    adminInstructions: '',
    sortOrder: 0
  })
  const [withdrawalRequests, setWithdrawalRequests] = useState([])
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  
  // VAT and BOT code confirmation states
  const [vatCode, setVatCode] = useState('')
  const [botCode, setBotCode] = useState('')
  const [transactionId, setTransactionId] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [isConfirmingVat, setIsConfirmingVat] = useState(false)
  const [isConfirmingBot, setIsConfirmingBot] = useState(false)
  const [isRejectingVat, setIsRejectingVat] = useState(false)
  const [isRejectingBot, setIsRejectingBot] = useState(false)
  const [vatRejectionReason, setVatRejectionReason] = useState('')
  const [botRejectionReason, setBotRejectionReason] = useState('')
  
  // Plan management states
  const [plans, setPlans] = useState([])
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: 30,
    features: [],
    isActive: true,
    maxPicks: '',
    accessLevel: 'premium'
  })
  const [newFeature, setNewFeature] = useState('')
  
  // Support ticket modal states
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showTicketModal, setShowTicketModal] = useState(false)
  const [newResponse, setNewResponse] = useState('')
  const [sendingResponse, setSendingResponse] = useState(false)

  // UI states
  const [search, setSearch] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showUserModal, setShowUserModal] = useState(false)
  const [form, setForm] = useState({
    title: '', message: '', type: 'info', priority: 'medium', targetAudience: 'all'
  })

  // Form states for new content
  const [newPick, setNewPick] = useState({
    sport: '', league: '', homeTeam: '', awayTeam: '', matchDate: '',
    prediction: '', odds: '', confidence: 'medium', stake: '', accessLevel: 'free'
  })

  useEffect(() => {
    if (token) {
      loadData()
    }
  }, [token])

  async function loadData(searchQuery = '') {
    setLoading(true)
    setError('')
    try {
      const [usersRes, announcementsRes, configRes, transactionsRes, ticketsRes, picksRes, statsRes, depositsRes, paymentOptionsRes, withdrawalsRes, plansRes] = await Promise.all([
        fetch(`${API_BASE}/admin/users?search=${searchQuery}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/announcements`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/dashboard/config`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/transactions`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/support-tickets`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/picks`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/deposits`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/payment-options`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/withdrawal-requests`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/admin/plans`, { headers: { Authorization: `Bearer ${token}` } })
      ])

      const [usersData, announcementsData, configData, transactionsData, ticketsData, picksData, statsData, depositsData, paymentOptionsData, withdrawalsData, plansData] = await Promise.all([
        usersRes.json(), announcementsRes.json(), configRes.json(), 
        transactionsRes.json(), ticketsRes.json(), picksRes.json(), statsRes.json(), depositsRes.json(), paymentOptionsRes.json(), withdrawalsRes.json(), plansRes.json()
      ])

      // Debug withdrawal requests
      console.log('Withdrawals Response Status:', withdrawalsRes.ok, withdrawalsRes.status)
      console.log('Withdrawals Data:', withdrawalsData)

      if (usersRes.ok) {
        setUsers(usersData.users || [])
        setUserStats({
          total: usersData.users?.length || 0,
          gold: usersData.users?.filter(u => u.plan === 'gold').length || 0,
          silver: usersData.users?.filter(u => u.plan === 'silver').length || 0,
          free: usersData.users?.filter(u => u.plan === 'free').length || 0
        })
      }
      if (announcementsRes.ok) setAnnouncements(announcementsData.announcements || [])
      if (configRes.ok) setDashboardConfig(configData.config || {})
      if (transactionsRes.ok) setTransactions(transactionsData.transactions || [])
      if (ticketsRes.ok) setSupportTickets(ticketsData.tickets || [])
      if (picksRes.ok) setPicks(picksData.picks || [])
      if (statsRes.ok) setDashboardStats(statsData || {})
      if (depositsRes.ok) setDepositRequests(depositsData.deposits || [])
      if (paymentOptionsRes.ok) setPaymentOptions(paymentOptionsData.paymentOptions || [])
      if (withdrawalsRes.ok) {
        setWithdrawalRequests(withdrawalsData.withdrawalRequests || [])
      }
      if (plansRes.ok) setPlans(plansData.plans || [])

    } catch (err) {
      setError('Failed to load admin data: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function createAnnouncement(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch(`${API_BASE}/announcements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to create announcement')
      setAnnouncements((prev) => [data.announcement, ...prev])
      setForm({ title: '', message: '', type: 'info', priority: 'medium', targetAudience: 'all' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function togglePin(id) {
    try {
      const res = await fetch(`${API_BASE}/announcements/${id}/pin`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to toggle pin')
      setAnnouncements((prev) => prev.map((a) => (a._id === id ? data.announcement : a)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function saveDashboardConfig() {
    setSavingConfig(true)
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(dashboardConfig),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to save configuration')
      setDashboardConfig(data.config)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingConfig(false)
    }
  }

  async function updateUser(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to update user')
      setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to delete user')
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  async function viewUserDetails(id) {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch user details')
      setSelectedUser(data)
      setShowUserModal(true)
    } catch (err) {
      setError(err.message)
    }
  }

  // Deposit Management Functions
  async function addPaymentDetails(depositId) {
    try {
      const res = await fetch(`${API_BASE}/admin/deposits/${depositId}/payment-details`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(paymentDetails),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to add payment details')
      
      // Update the deposit in the list
      setDepositRequests(prev => prev.map(deposit => 
        deposit._id === depositId ? data.deposit : deposit
      ))
      
      // Close modal and reset form
      setShowDepositModal(false)
      setSelectedDeposit(null)
      setPaymentDetails({ instructions: '', accountInfo: '', reference: '', notes: '' })
      
      // Reload data to get updated status
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  // Betting Statistics Management
  async function updateBettingStats(userId) {
    try {
      const wonBets = document.getElementById('wonBets').value
      const lostBets = document.getElementById('lostBets').value
      const refundedBets = document.getElementById('refundedBets').value
      
      const updateData = {}
      if (wonBets !== '') updateData.wonBets = parseInt(wonBets)
      if (lostBets !== '') updateData.lostBets = parseInt(lostBets)
      if (refundedBets !== '') updateData.refundedBets = parseInt(refundedBets)
      
      if (Object.keys(updateData).length === 0) {
        alert('Please enter at least one betting statistic to update')
        return
      }
      
      const res = await fetch(`${API_BASE}/admin/users/${userId}/betting-stats`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(updateData)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to update betting statistics')
      
      // Update the selected user data
      setSelectedUser(prev => ({
        ...prev,
        user: {
          ...prev.user,
          stats: {
            ...prev.user.stats,
            ...updateData
          }
        }
      }))
      
      // Clear the input fields
      document.getElementById('wonBets').value = ''
      document.getElementById('lostBets').value = ''
      document.getElementById('refundedBets').value = ''
      
      alert('Betting statistics updated successfully!')
    } catch (err) {
      setError(err.message)
      alert('Error updating betting statistics: ' + err.message)
    }
  }

  // Balance Management
  async function addUserBalance(userId) {
    try {
      const amount = parseFloat(document.getElementById('balanceAmount').value)
      const description = document.getElementById('balanceDescription').value
      
      if (!amount || amount <= 0) {
        alert('Please enter a valid amount greater than 0')
        return
      }
      
      const res = await fetch(`${API_BASE}/admin/users/${userId}/add-balance`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ amount, description })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to add balance')
      
      // Clear the input fields
      document.getElementById('balanceAmount').value = ''
      document.getElementById('balanceDescription').value = ''
      
      alert(`Successfully added $${amount} to user's balance!`)
      
      // Reload user details to show updated balance
      viewUserDetails(userId)
    } catch (err) {
      setError(err.message)
      alert('Error adding balance: ' + err.message)
    }
  }

  async function approveDeposit(depositId) {
    if (!confirm('Are you sure you want to approve this deposit? This will update the user\'s balance.')) return
    try {
      const res = await fetch(`${API_BASE}/admin/deposits/${depositId}/approve`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({})
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to approve deposit')
      
      // Update the deposit in the list
      setDepositRequests(prev => prev.map(deposit => 
        deposit._id === depositId ? data.deposit : deposit
      ))
      
      // Reload data to get updated status
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  async function rejectDeposit(depositId) {
    const reason = prompt('Please provide a reason for rejecting this deposit:')
    if (!reason) return
    try {
      const res = await fetch(`${API_BASE}/admin/deposits/${depositId}/reject`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to reject deposit')
      
      // Update the deposit in the list
      setDepositRequests(prev => prev.map(deposit => 
        deposit._id === depositId ? data.deposit : deposit
      ))
      
      // Reload data to get updated status
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  function openDepositModal(deposit) {
    setSelectedDeposit(deposit)
    setPaymentDetails({
      instructions: deposit.adminPaymentDetails?.instructions || '',
      accountInfo: deposit.adminPaymentDetails?.accountInfo || '',
      reference: deposit.adminPaymentDetails?.reference || '',
      notes: deposit.adminPaymentDetails?.notes || ''
    })
    setShowDepositModal(true)
  }

  async function updateTransaction(id, status) {
    try {
      const res = await fetch(`${API_BASE}/admin/transactions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to update transaction')
      setTransactions((prev) => prev.map((t) => (t._id === id ? data.transaction : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function updateSupportTicket(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/admin/support-tickets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to update ticket')
      setSupportTickets((prev) => prev.map((t) => (t._id === id ? data.ticket : t)))
    } catch (err) {
      setError(err.message)
    }
  }

  // Support ticket modal functions
  function openTicketModal(ticket) {
    setSelectedTicket(ticket)
    setNewResponse('')
    setShowTicketModal(true)
  }

  function closeTicketModal() {
    setSelectedTicket(null)
    setNewResponse('')
    setShowTicketModal(false)
  }

  async function sendTicketResponse() {
    if (!newResponse.trim()) {
      setError('Please enter a response message')
      return
    }

    setSendingResponse(true)
    try {
      const res = await fetch(`${API_BASE}/admin/support-tickets/${selectedTicket._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ response: newResponse.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to send response')
      
      // Update the ticket in the list and selected ticket
      setSupportTickets((prev) => prev.map((t) => (t._id === selectedTicket._id ? data.ticket : t)))
      setSelectedTicket(data.ticket)
      setNewResponse('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSendingResponse(false)
    }
  }

  async function createPick(e) {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/picks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newPick),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to create pick')
      setPicks((prev) => [data.pick, ...prev])
      setNewPick({
        sport: '', league: '', homeTeam: '', awayTeam: '', matchDate: '',
        prediction: '', odds: '', confidence: 'medium', stake: '', accessLevel: 'free'
      })
    } catch (err) {
      setError(err.message)
    }
  }

  async function updatePick(id, updates) {
    try {
      const res = await fetch(`${API_BASE}/picks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to update pick')
      setPicks((prev) => prev.map((p) => (p._id === id ? data.pick : p)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function deletePick(id) {
    if (!confirm('Are you sure you want to delete this pick?')) return
    try {
      const res = await fetch(`${API_BASE}/picks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to delete pick')
      setPicks((prev) => prev.filter((p) => p._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  // Payment Options Management Functions
  function openPaymentOptionModal(paymentOption = null) {
    if (paymentOption) {
      setSelectedPaymentOption(paymentOption)
      setPaymentOptionForm({
        name: paymentOption.name,
        code: paymentOption.code,
        type: paymentOption.type,
        category: paymentOption.category,
        description: paymentOption.description,
        icon: paymentOption.icon,
        isActive: paymentOption.isActive,
        minAmount: paymentOption.minAmount,
        maxAmount: paymentOption.maxAmount,
        processingTime: paymentOption.processingTime,
        fees: paymentOption.fees,
        requiredFields: paymentOption.requiredFields,
        adminInstructions: paymentOption.adminInstructions,
        sortOrder: paymentOption.sortOrder
      })
    } else {
      setSelectedPaymentOption(null)
      setPaymentOptionForm({
        name: '',
        code: '',
        type: 'both',
        category: 'digital_wallet',
        description: '',
        icon: '',
        isActive: true,
        minAmount: 0,
        maxAmount: 10000,
        processingTime: '1-3 business days',
        fees: { fixed: 0, percentage: 0 },
        requiredFields: [],
        adminInstructions: '',
        sortOrder: 0
      })
    }
    setShowPaymentOptionModal(true)
  }

  async function savePaymentOption() {
    try {
      setSaving(true)
      const method = selectedPaymentOption ? 'PUT' : 'POST'
      const url = selectedPaymentOption 
        ? `${API_BASE}/admin/payment-options/${selectedPaymentOption._id}`
        : `${API_BASE}/admin/payment-options`

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(paymentOptionForm)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to save payment option')

      // Update the payment options list
      if (selectedPaymentOption) {
        setPaymentOptions(prev => prev.map(option => 
          option._id === selectedPaymentOption._id ? data.paymentOption : option
        ))
      } else {
        setPaymentOptions(prev => [...prev, data.paymentOption])
      }

      setShowPaymentOptionModal(false)
      setSelectedPaymentOption(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function deletePaymentOption(id) {
    if (!confirm('Are you sure you want to delete this payment option?')) return
    try {
      const res = await fetch(`${API_BASE}/admin/payment-options/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to delete payment option')

      setPaymentOptions(prev => prev.filter(option => option._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  async function togglePaymentOption(id) {
    try {
      const res = await fetch(`${API_BASE}/admin/payment-options/${id}/toggle`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to toggle payment option')

      setPaymentOptions(prev => prev.map(option => 
        option._id === id ? data.paymentOption : option
      ))
    } catch (err) {
      setError(err.message)
    }
  }

  // Withdrawal Management Functions
  function openWithdrawalModal(withdrawal) {
    console.log('Opening withdrawal modal with:', withdrawal);
    console.log('Withdrawal ID:', withdrawal?.id);
    console.log('Withdrawal keys:', Object.keys(withdrawal || {}));
    
    // Visible debugging
    alert(`DEBUG: Opening withdrawal modal\nID: ${withdrawal?.id}\nKeys: ${Object.keys(withdrawal || {}).join(', ')}\nStatus: ${withdrawal?.status}`);
    
    setSelectedWithdrawal(withdrawal)
    setRejectionReason('')
    setShowWithdrawalModal(true)
  }

  async function approveWithdrawal(id) {
    if (!confirm('Are you sure you want to approve this withdrawal? This action cannot be undone.')) return
    try {
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to approve withdrawal')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(withdrawal => 
        withdrawal.id === id ? { ...withdrawal, status: 'approved', processedBy: user._id, processedAt: new Date() } : withdrawal
      ))
      
      setSuccess('Withdrawal approved successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  async function rejectWithdrawal(id, reason) {
    if (!id) {
      setError('Invalid withdrawal request - missing ID')
      return
    }
    
    if (!reason.trim()) {
      setError('Please provide a rejection reason')
      return
    }
    
    try {
      setIsRejecting(true)
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/reject`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ rejectionReason: reason })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to reject withdrawal')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(withdrawal => 
        withdrawal.id === id ? { 
          ...withdrawal, 
          status: 'rejected', 
          processedBy: user._id, 
          processedAt: new Date(),
          rejectionReason: reason 
        } : withdrawal
      ))
      
      setShowWithdrawalModal(false)
      setRejectionReason('')
      setSuccess('Withdrawal rejected successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRejecting(false)
    }
  }

  async function markWithdrawalAsProcessing(id) {
    try {
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/process`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to mark withdrawal as processing')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(withdrawal => 
        withdrawal.id === id ? { ...withdrawal, status: 'processing', processedBy: user._id, processedAt: new Date() } : withdrawal
      ))
      
      setSuccess('Withdrawal marked as processing')
    } catch (err) {
      setError(err.message)
    }
  }

  async function markWithdrawalAsCompleted(id) {
    try {
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/complete`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to mark withdrawal as completed')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(withdrawal => 
        withdrawal.id === id ? { ...withdrawal, status: 'completed', processedBy: user._id, processedAt: new Date() } : withdrawal
      ))
      
      setSuccess('Withdrawal marked as completed')
    } catch (err) {
      setError(err.message)
    }
  }

  // VAT Code Confirmation
  async function confirmVatCode(id) {
    if (!vatCode.trim()) {
      setError('Please enter a VAT code')
      return
    }

    try {
      setIsConfirmingVat(true)
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/confirm-vat`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ vatCode: vatCode.trim() })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to confirm VAT code')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(withdrawal => 
        withdrawal.id === id ? { 
          ...withdrawal, 
          status: 'bot_pending',
          vatCode: {
            ...withdrawal.vatCode,
            adminGenerated: vatCode.trim(),
            adminConfirmedAt: new Date(),
            adminConfirmedBy: user._id
          }
        } : withdrawal
      ))

      // Update selected withdrawal
      setSelectedWithdrawal(prev => ({
        ...prev,
        status: 'bot_pending',
        vatCode: {
          ...prev.vatCode,
          adminGenerated: vatCode.trim(),
          adminConfirmedAt: new Date(),
          adminConfirmedBy: user._id
        }
      }))
      
      setVatCode('')
      setSuccess('VAT code confirmed successfully. BOT code is now required.')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsConfirmingVat(false)
    }
  }

  // Approve User-Submitted VAT Code
  async function approveUserVatCode(id) {
    const withdrawal = selectedWithdrawal
    if (!withdrawal?.vatCode?.userSubmitted) {
      setError('No user-submitted VAT code found')
      return
    }

    try {
      setIsConfirmingVat(true)
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/confirm-vat`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ vatCode: withdrawal.vatCode.userSubmitted })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to approve VAT code')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(w => 
        w.id === id ? { 
          ...w, 
          status: 'bot_required',
          vatCode: {
            ...w.vatCode,
            adminGenerated: withdrawal.vatCode.userSubmitted,
            adminConfirmedAt: new Date(),
            adminConfirmedBy: user._id
          }
        } : w
      ))

      // Update selected withdrawal
      setSelectedWithdrawal(prev => ({
        ...prev,
        status: 'bot_required',
        vatCode: {
          ...prev.vatCode,
          adminGenerated: withdrawal.vatCode.userSubmitted,
          adminConfirmedAt: new Date(),
          adminConfirmedBy: user._id
        }
      }))
      
      setSuccess('User-submitted VAT code approved successfully. BOT code is now required.')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsConfirmingVat(false)
    }
  }

  // VAT Code Rejection
  async function rejectVatCode(id) {
    if (!vatRejectionReason.trim()) {
      setError('Please enter a rejection reason')
      return
    }

    try {
      setIsRejectingVat(true)
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/reject-vat`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: vatRejectionReason.trim() })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to reject VAT code')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(withdrawal => 
        withdrawal.id === id ? { 
          ...withdrawal, 
          status: 'vat_rejected',
          vatCode: {
            ...withdrawal.vatCode,
            rejectedAt: new Date(),
            rejectedBy: user._id,
            rejectionReason: vatRejectionReason.trim()
          }
        } : withdrawal
      ))

      // Update selected withdrawal
      setSelectedWithdrawal(prev => ({
        ...prev,
        status: 'vat_rejected',
        vatCode: {
          ...prev.vatCode,
          rejectedAt: new Date(),
          rejectedBy: user._id,
          rejectionReason: vatRejectionReason.trim()
        }
      }))
      
      setVatRejectionReason('')
      setSuccess('VAT code rejected successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRejectingVat(false)
    }
  }

  // BOT Code Rejection
  async function rejectBotCode(id) {
    if (!botRejectionReason.trim()) {
      setError('Please enter a rejection reason')
      return
    }

    try {
      setIsRejectingBot(true)
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/reject-bot`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: botRejectionReason.trim() })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to reject BOT code')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(withdrawal => 
        withdrawal.id === id ? { 
          ...withdrawal, 
          status: 'bot_rejected',
          botCode: {
            ...withdrawal.botCode,
            rejectedAt: new Date(),
            rejectedBy: user._id,
            rejectionReason: botRejectionReason.trim()
          }
        } : withdrawal
      ))

      // Update selected withdrawal
      setSelectedWithdrawal(prev => ({
        ...prev,
        status: 'bot_rejected',
        botCode: {
          ...prev.botCode,
          rejectedAt: new Date(),
          rejectedBy: user._id,
          rejectionReason: botRejectionReason.trim()
        }
      }))
      
      setBotRejectionReason('')
      setSuccess('BOT code rejected successfully.')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsRejectingBot(false)
    }
  }

  // BOT Code Confirmation
  async function confirmBotCode(id) {
    if (!botCode.trim()) {
      setError('Please enter a BOT code')
      return
    }

    try {
      setIsConfirmingBot(true)
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/confirm-bot`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          botCode: botCode.trim(),
          transactionId: transactionId.trim() || undefined,
          adminNotes: adminNotes.trim() || undefined
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to confirm BOT code')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(withdrawal => 
        withdrawal.id === id ? { 
          ...withdrawal, 
          status: 'approved',
          botCode: {
            ...withdrawal.botCode,
            adminGenerated: botCode.trim(),
            adminConfirmedAt: new Date(),
            adminConfirmedBy: user._id
          },
          processedBy: user._id,
          processedAt: new Date()
        } : withdrawal
      ))

      // Update selected withdrawal
      setSelectedWithdrawal(prev => ({
        ...prev,
        status: 'approved',
        botCode: {
          ...prev.botCode,
          adminGenerated: botCode.trim(),
          adminConfirmedAt: new Date(),
          adminConfirmedBy: user._id
        },
        processedBy: user._id,
        processedAt: new Date()
      }))
      
      setBotCode('')
      setTransactionId('')
      setAdminNotes('')
      setSuccess('BOT code confirmed and withdrawal approved successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsConfirmingBot(false)
    }
  }

  // Approve User-Submitted BOT Code
  async function approveUserBotCode(id) {
    const withdrawal = selectedWithdrawal
    if (!withdrawal?.botCode?.userSubmitted) {
      setError('No user-submitted BOT code found')
      return
    }

    try {
      setIsConfirmingBot(true)
      const res = await fetch(`${API_BASE}/admin/withdrawal-requests/${id}/confirm-bot`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          botCode: withdrawal.botCode.userSubmitted,
          transactionId: transactionId.trim() || undefined,
          adminNotes: adminNotes.trim() || undefined
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to approve BOT code')

      // Update the withdrawal in the list
      setWithdrawalRequests(prev => prev.map(w => 
        w.id === id ? { 
          ...w, 
          status: 'approved',
          botCode: {
            ...w.botCode,
            adminGenerated: withdrawal.botCode.userSubmitted,
            adminConfirmedAt: new Date(),
            adminConfirmedBy: user._id
          },
          processedBy: user._id,
          processedAt: new Date()
        } : w
      ))

      // Update selected withdrawal
      setSelectedWithdrawal(prev => ({
        ...prev,
        status: 'approved',
        botCode: {
          ...prev.botCode,
          adminGenerated: withdrawal.botCode.userSubmitted,
          adminConfirmedAt: new Date(),
          adminConfirmedBy: user._id
        },
        processedBy: user._id,
        processedAt: new Date()
      }))
      
      setTransactionId('')
      setAdminNotes('')
      setSuccess('User-submitted BOT code approved and withdrawal approved successfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsConfirmingBot(false)
    }
  }

  if (user?.role !== 'admin') {
    return (
      <main className="min-h-screen theme-bg-primary theme-text-primary">
        <div className="max-w-5xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold">Access Restricted</h1>
          <p className="theme-text-muted mt-2">You do not have permission to access this area.</p>
        </div>
      </main>
    )
  }

  // Return the main UI
  if (user?.role !== 'admin') {
    return (
      <main className="min-h-screen theme-bg-primary theme-text-primary">
        <div className="max-w-5xl mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold">Access Restricted</h1>
          <p className="theme-text-muted mt-2">You do not have permission to access this area.</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow">
          <div className="px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm sm:text-base text-gray-600">Complete system management and control</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm font-medium text-gray-900">{user?.name || user?.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                title="Logout"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 px-3 sm:px-6 overflow-x-auto scrollbar-hide">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'financial', label: 'Financial', icon: DollarSign },
                { id: 'content', label: 'Content', icon: FileText },
                { id: 'plans', label: 'Plans', icon: Target },
                { id: 'support', label: 'Support', icon: MessageSquare },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline lg:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="p-3 sm:p-6">{renderTabContent()}</div>
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg p-3 sm:p-6 max-w-2xl w-full max-h-[95vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-lg sm:text-xl font-bold">User Details</h3>
              <button onClick={() => setShowUserModal(false)} className="text-gray-500 hover:text-gray-700">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.user?.firstName} {selectedUser.user?.lastName}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900 break-all">{selectedUser.user?.email}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Plan</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{selectedUser.user?.plan}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">Status</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedUser.user?.isActive ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
              
              {/* Betting Statistics Controls */}
              <div className="border-t pt-3 sm:pt-4">
                <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Betting Statistics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Won Bets</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.user?.stats?.wonBets || 0}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Lost Bets</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.user?.stats?.lostBets || 0}</p>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">Refunded Bets</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedUser.user?.stats?.refundedBets || 0}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="number"
                    placeholder="Won Bets"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    id="wonBets"
                  />
                  <input
                    type="number"
                    placeholder="Lost Bets"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    id="lostBets"
                  />
                  <input
                    type="number"
                    placeholder="Refunded Bets"
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                    id="refundedBets"
                  />
                </div>
                <button
                  onClick={() => updateBettingStats(selectedUser.user._id)}
                  className="mt-2 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Update Betting Stats
                </button>
              </div>
              
              {/* Balance Management */}
              <div className="border-t pt-3 sm:pt-4">
                <h4 className="font-medium text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Balance Management</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="number"
                    placeholder="Amount to add"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                    id="balanceAmount"
                    step="0.01"
                    min="0"
                  />
                  <button
                    onClick={() => addUserBalance(selectedUser.user._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm whitespace-nowrap"
                  >
                    Add Balance
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Description (optional)"
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  id="balanceDescription"
                />
              </div>
              
              {selectedUser.transactions?.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Recent Transactions</h4>
                  <div className="space-y-2">
                    {selectedUser.transactions.slice(0, 5).map((transaction) => (
                      <div key={transaction._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">${transaction.amount}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Deposit Modal */}
      {showDepositModal && selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[95vh] flex flex-col">
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-base sm:text-lg font-semibold">Manage Deposit Request</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4">
              <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">User</label>
                <p className="text-sm text-gray-900">{selectedDeposit.user?.username || 'Unknown'}</p>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Amount</label>
                <p className="text-sm text-gray-900">${selectedDeposit.amount}</p>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <p className="text-sm text-gray-900">{selectedDeposit.paymentMethod}</p>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                <p className="text-sm text-gray-900">{selectedDeposit.status}</p>
              </div>

              {selectedDeposit.status === 'pending' && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Add Payment Instructions</h4>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <textarea
                      value={paymentDetails.instructions}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, instructions: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows="3"
                      placeholder="Enter payment instructions for the user..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Account Information</label>
                    <input
                      type="text"
                      value={paymentDetails.accountInfo}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, accountInfo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Account number, wallet address, etc."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Reference</label>
                    <input
                      type="text"
                      value={paymentDetails.reference}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, reference: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Reference number or code"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={paymentDetails.notes}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows="2"
                      placeholder="Additional notes..."
                    />
                  </div>
                </div>
              )}
              </div>
            </div>

            <div className="px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                onClick={() => setShowDepositModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
              
              {selectedDeposit.status === 'pending' && (
                <button
                  onClick={() => addPaymentDetails(selectedDeposit._id)}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {saving ? 'Adding...' : 'Add Payment Details'}
                </button>
              )}
              
              {selectedDeposit.status === 'waiting_for_deposit' && (
                <button
                  onClick={() => approveDeposit(selectedDeposit._id)}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                >
                  {saving ? 'Approving...' : 'Approve Deposit'}
                </button>
              )}
              
              <button
                onClick={() => rejectDeposit(selectedDeposit._id)}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 text-sm"
              >
                {saving ? 'Rejecting...' : 'Reject'}
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Option Modal */}
      {showPaymentOptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[95vh] flex flex-col">
            <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-base sm:text-lg font-semibold">
                {selectedPaymentOption ? 'Edit Payment Option' : 'Add Payment Option'}
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={paymentOptionForm.name}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., PayPal"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input
                    type="text"
                    value={paymentOptionForm.code}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., PAYPAL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={paymentOptionForm.type}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="both">Both</option>
                    <option value="deposit">Deposit Only</option>
                    <option value="withdrawal">Withdrawal Only</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={paymentOptionForm.category}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="digital_wallet">Digital Wallet</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cryptocurrency">Cryptocurrency</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
                  <input
                    type="number"
                    value={paymentOptionForm.minAmount}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, minAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
                  <input
                    type="number"
                    value={paymentOptionForm.maxAmount}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, maxAmount: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                  <input
                    type="text"
                    value={paymentOptionForm.processingTime}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, processingTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Instant, 1-3 business days"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={paymentOptionForm.sortOrder}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={paymentOptionForm.description}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Brief description of the payment method"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon URL</label>
                  <input
                    type="url"
                    value={paymentOptionForm.icon}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/icon.png"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Structure</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="number"
                      value={paymentOptionForm.fees.fixed}
                      onChange={(e) => setPaymentOptionForm(prev => ({ 
                        ...prev, 
                        fees: { ...prev.fees, fixed: parseFloat(e.target.value) || 0 }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Fixed fee"
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={paymentOptionForm.fees.percentage}
                      onChange={(e) => setPaymentOptionForm(prev => ({ 
                        ...prev, 
                        fees: { ...prev.fees, percentage: parseFloat(e.target.value) || 0 }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Percentage (%)"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                    <input
                      type="number"
                      value={paymentOptionForm.fees.max}
                      onChange={(e) => setPaymentOptionForm(prev => ({ 
                        ...prev, 
                        fees: { ...prev.fees, max: parseFloat(e.target.value) || 0 }
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Max fee"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Fixed fee + Percentage (capped at Max fee)</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Required Input Fields</label>
                  <textarea
                    value={paymentOptionForm.requiredFields.join(', ')}
                    onChange={(e) => setPaymentOptionForm(prev => ({ 
                      ...prev, 
                      requiredFields: e.target.value.split(',').map(field => field.trim()).filter(field => field)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    placeholder="account_number, phone_number, email (comma-separated)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Fields users need to provide when using this payment method</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Admin Instructions</label>
                  <textarea
                    value={paymentOptionForm.adminInstructions}
                    onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, adminInstructions: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Instructions for admins when processing payments with this method"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={paymentOptionForm.isActive}
                      onChange={(e) => setPaymentOptionForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPaymentOptionModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={savePaymentOption}
                  disabled={saving || !paymentOptionForm.name || !paymentOptionForm.code}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : selectedPaymentOption ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Withdrawal Modal */}
      {showWithdrawalModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Withdrawal Request Details
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                    <p className="text-sm text-gray-900">{selectedWithdrawal.user?.firstName} {selectedWithdrawal.user?.lastName}</p>
                    <p className="text-sm text-gray-500">{selectedWithdrawal.user?.email}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <p className="text-sm text-gray-900">${selectedWithdrawal.amount}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <p className="text-sm text-gray-900 capitalize">{selectedWithdrawal.paymentMethod}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedWithdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                      selectedWithdrawal.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                      selectedWithdrawal.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      selectedWithdrawal.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedWithdrawal.status}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                    <p className="text-sm text-gray-900">{new Date(selectedWithdrawal.createdAt).toLocaleString()}</p>
                  </div>
                  
                  {selectedWithdrawal.processedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Processed Date</label>
                      <p className="text-sm text-gray-900">{new Date(selectedWithdrawal.processedAt).toLocaleString()}</p>
                    </div>
                  )}
                </div>

                {/* Payment Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Details</label>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedWithdrawal.type === 'transaction' ? (
                      <div className="text-sm text-gray-900">
                        <p><span className="font-medium">Type:</span> Completed Transaction</p>
                        <p><span className="font-medium">Transaction ID:</span> {selectedWithdrawal.transactionId || 'N/A'}</p>
                        <p><span className="font-medium">Description:</span> {selectedWithdrawal.description || 'Withdrawal transaction'}</p>
                        <p className="text-gray-600 mt-2 italic">
                          This is a completed withdrawal transaction. Original payment details were processed during approval.
                        </p>
                      </div>
                    ) : selectedWithdrawal.paymentDetails && Object.keys(selectedWithdrawal.paymentDetails).length > 0 ? (
                      // For WithdrawalRequest entries with payment details, show formatted details
                      <div className="text-sm text-gray-900 space-y-2">
                        {selectedWithdrawal.paymentDetails.email && (
                          <p><span className="font-medium">Email:</span> {selectedWithdrawal.paymentDetails.email}</p>
                        )}
                        {selectedWithdrawal.paymentDetails.username && (
                          <p><span className="font-medium">Username:</span> {selectedWithdrawal.paymentDetails.username}</p>
                        )}
                        {selectedWithdrawal.paymentDetails.phoneNumber && (
                          <p><span className="font-medium">Phone:</span> {selectedWithdrawal.paymentDetails.phoneNumber}</p>
                        )}
                        {selectedWithdrawal.paymentDetails.accountNumber && (
                          <p><span className="font-medium">Account Number:</span> {selectedWithdrawal.paymentDetails.accountNumber}</p>
                        )}
                        {selectedWithdrawal.paymentDetails.routingNumber && (
                          <p><span className="font-medium">Routing Number:</span> {selectedWithdrawal.paymentDetails.routingNumber}</p>
                        )}
                        {selectedWithdrawal.paymentDetails.bankName && (
                          <p><span className="font-medium">Bank Name:</span> {selectedWithdrawal.paymentDetails.bankName}</p>
                        )}
                        {selectedWithdrawal.paymentDetails.accountName && (
                          <p><span className="font-medium">Account Name:</span> {selectedWithdrawal.paymentDetails.accountName}</p>
                        )}
                        {selectedWithdrawal.paymentDetails.walletAddress && (
                          <p><span className="font-medium">Wallet Address:</span> {selectedWithdrawal.paymentDetails.walletAddress}</p>
                        )}
                        {selectedWithdrawal.paymentDetails.additionalInfo && (
                          <p><span className="font-medium">Additional Info:</span> {selectedWithdrawal.paymentDetails.additionalInfo}</p>
                        )}
                      </div>
                    ) : (
                      // For entries without payment details
                      <p className="text-sm text-gray-500 italic">
                        No payment details available for this {selectedWithdrawal.paymentMethod} withdrawal.
                      </p>
                    )}
                  </div>
                </div>

                {/* Display of VAT and BOT Codes */}
                <div className="space-y-4">
                  {(selectedWithdrawal.vatCode?.userSubmitted || 
                    selectedWithdrawal.userVatCode || 
                    selectedWithdrawal.vatCode?.code || 
                    selectedWithdrawal.vatCode || 
                    selectedWithdrawal.vatNumber || 
                    selectedWithdrawal.vatId) && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">User VAT Code</label>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm font-mono">{selectedWithdrawal.vatCode?.userSubmitted || 
                           selectedWithdrawal.userVatCode || 
                           selectedWithdrawal.vatCode?.code || 
                           selectedWithdrawal.vatCode || 
                           selectedWithdrawal.vatNumber || 
                           selectedWithdrawal.vatId}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Submitted: {new Date(selectedWithdrawal.vatCode?.userSubmittedAt || 
                                            selectedWithdrawal.vatSubmittedAt || 
                                            selectedWithdrawal.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {(selectedWithdrawal.botCode?.userSubmitted || 
                    selectedWithdrawal.userBotCode || 
                    selectedWithdrawal.botCode?.code || 
                    selectedWithdrawal.botCode || 
                    selectedWithdrawal.botNumber || 
                    selectedWithdrawal.botId) && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">User BOT Code</label>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm font-mono">{selectedWithdrawal.botCode?.userSubmitted || 
                           selectedWithdrawal.userBotCode || 
                           selectedWithdrawal.botCode?.code || 
                           selectedWithdrawal.botCode || 
                           selectedWithdrawal.botNumber || 
                           selectedWithdrawal.botId}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Submitted: {new Date(selectedWithdrawal.botCode?.userSubmittedAt || 
                                            selectedWithdrawal.botSubmittedAt || 
                                            selectedWithdrawal.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {selectedWithdrawal.rejectionReason && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{selectedWithdrawal.rejectionReason}</p>
                  </div>
                )}
                
                {selectedWithdrawal.adminNotes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes</label>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md">{selectedWithdrawal.adminNotes}</p>
                  </div>
                )}

                {/* VAT Code Admin Actions Section */}
                <div className="border-t pt-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">VAT Code Verification</h4>
                  {(selectedWithdrawal.status === 'vat_pending') && (
                    <div className="mt-2">
                      <button
                        onClick={() => approveUserVatCode(selectedWithdrawal.id)}
                        disabled={isConfirmingVat}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 mr-2"
                      >
                        {isConfirmingVat ? 'Approving...' : 'Approve User VAT Code'}
                      </button>
                    </div>
                  )}
                  {(selectedWithdrawal.status === 'imf_required' || selectedWithdrawal.status === 'vat_pending') && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Generate Admin VAT Code</label>
                        <input
                          type="text"
                          value={vatCode}
                          onChange={(e) => setVatCode(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter VAT code to confirm..."
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => confirmVatCode(selectedWithdrawal.id)}
                          disabled={!vatCode.trim() || isConfirmingVat}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                          {isConfirmingVat ? 'Confirming...' : 'Confirm VAT Code'}
                        </button>
                      </div>
                      <div className="border-t pt-3 mt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Or Reject VAT Code</h5>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                          <textarea
                            value={vatRejectionReason}
                            onChange={(e) => setVatRejectionReason(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Enter reason for rejecting VAT code..."
                            rows="3"
                          />
                        </div>
                        <button
                          onClick={() => rejectVatCode(selectedWithdrawal.id)}
                          disabled={!vatRejectionReason.trim() || isRejectingVat}
                          className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                          {isRejectingVat ? 'Rejecting...' : 'Reject VAT Code'}
                        </button>
                      </div>
                    </div>
                  )}
                  {selectedWithdrawal.vatCode?.adminGenerated && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Generated VAT Code</label>
                      <p className="text-sm text-green-900 bg-green-50 p-3 rounded-md font-mono">
                        {selectedWithdrawal.vatCode.adminGenerated}
                      </p>
                      {selectedWithdrawal.vatCode.adminConfirmedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Confirmed: {new Date(selectedWithdrawal.vatCode.adminConfirmedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}
                  {selectedWithdrawal.vatCode?.rejectedAt && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">VAT Code Rejection</label>
                      <div className="bg-red-50 p-3 rounded-md">
                        <p className="text-sm text-red-900 font-medium">Rejected</p>
                        {selectedWithdrawal.vatCode.rejectionReason && (
                          <p className="text-sm text-red-700 mt-1">{selectedWithdrawal.vatCode.rejectionReason}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Rejected: {new Date(selectedWithdrawal.vatCode.rejectedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                </div>

                {/* BOT Code Section */}
                {(selectedWithdrawal.status === 'bot_required' || selectedWithdrawal.status === 'bot_pending' || selectedWithdrawal.status === 'bot_submitted' || selectedWithdrawal.status === 'approved' || selectedWithdrawal.status === 'bot_rejected') && (
                  <div className="border-t pt-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">BOT Code Verification</h4>
                    
                    {selectedWithdrawal.botCode?.userSubmitted && (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">User Submitted BOT Code</label>
                        <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md font-mono">{selectedWithdrawal.botCode.userSubmitted}</p>
                        <p className="text-xs text-gray-500 mt-1">Submitted: {new Date(selectedWithdrawal.botCode.userSubmittedAt).toLocaleString()}</p>
                        
                        {(selectedWithdrawal.status === 'bot_pending' || selectedWithdrawal.status === 'bot_submitted') && (
                          <div className="mt-2">
                            <button
                              onClick={() => approveUserBotCode(selectedWithdrawal.id)}
                              disabled={isConfirmingBot}
                              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 mr-2"
                            >
                              {isConfirmingBot ? 'Approving...' : 'Approve User BOT Code'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {(selectedWithdrawal.status === 'bot_required' || selectedWithdrawal.status === 'bot_pending' || selectedWithdrawal.status === 'bot_submitted') && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Generate Admin BOT Code</label>
                          <input
                            type="text"
                            value={botCode}
                            onChange={(e) => setBotCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter BOT code to confirm..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID (Optional)</label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter transaction ID..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notes (Optional)</label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="2"
                            placeholder="Enter any admin notes..."
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => confirmBotCode(selectedWithdrawal.id)}
                            disabled={!botCode.trim() || isConfirmingBot}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                          >
                            {isConfirmingBot ? 'Confirming...' : 'Confirm BOT Code & Approve Withdrawal'}
                          </button>
                        </div>
                        
                        <div className="border-t pt-3 mt-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Or Reject BOT Code</h5>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                            <textarea
                              value={botRejectionReason}
                              onChange={(e) => setBotRejectionReason(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Enter reason for rejecting BOT code..."
                              rows="3"
                            />
                          </div>
                          <button
                            onClick={() => rejectBotCode(selectedWithdrawal.id)}
                            disabled={!botRejectionReason.trim() || isRejectingBot}
                            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                          >
                            {isRejectingBot ? 'Rejecting...' : 'Reject BOT Code'}
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedWithdrawal.botCode?.adminGenerated ? (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Admin Generated BOT Code</label>
                        <p className="text-sm text-green-900 bg-green-50 p-3 rounded-md font-mono">{selectedWithdrawal.botCode.adminGenerated}</p>
                        <p className="text-xs text-gray-500 mt-1">Confirmed: {new Date(selectedWithdrawal.botCode.adminConfirmedAt).toLocaleString()}</p>
                      </div>
                    ) : null}

                    {selectedWithdrawal.botCode?.rejectedAt ? (
                      <div className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">BOT Code Rejection</label>
                        <div className="bg-red-50 p-3 rounded-md">
                          <p className="text-sm text-red-900 font-medium">Rejected</p>
                          <p className="text-sm text-red-700 mt-1">{selectedWithdrawal.botCode.rejectionReason}</p>
                          <p className="text-xs text-gray-500 mt-1">Rejected: {new Date(selectedWithdrawal.botCode.rejectedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
                
                {selectedWithdrawal.status === 'pending' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => {
                        console.log('Rejection reason changing:', e.target.value);
                        setRejectionReason(e.target.value);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      rows="3"
                      placeholder="Enter reason for rejection..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
              <div className="flex justify-between">
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Close
                </button>
                
                {selectedWithdrawal?.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => rejectWithdrawal(selectedWithdrawal?.id, rejectionReason)}
                      disabled={!rejectionReason.trim() || isRejecting}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {isRejecting ? 'Rejecting...' : 'Reject Withdrawal'}
                    </button>
                    <button
                      onClick={() => {
                        markWithdrawalAsProcessing(selectedWithdrawal.id);
                        setShowWithdrawalModal(false);
                      }}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    >
                      Mark as Processing
                    </button>
                    <button
                      onClick={() => {
                        approveWithdrawal(selectedWithdrawal.id);
                        setShowWithdrawalModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
      )}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Support Ticket #{selectedTicket.ticketNumber}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedTicket.subject}</p>
                </div>
                <button
                  onClick={closeTicketModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                    <p className="text-sm text-gray-900">{`${selectedTicket.user?.firstName || ''} ${selectedTicket.user?.lastName || ''}`}</p>
                    <p className="text-sm text-gray-500">{selectedTicket.user?.email || ''}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      value={selectedTicket.priority}
                      onChange={(e) => updateSupportTicket(selectedTicket._id, { priority: e.target.value })}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => updateSupportTicket(selectedTicket._id, { status: e.target.value })}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                {/* Original Message */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Original Message</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-800">{selectedTicket.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Responses */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Responses</h4>
                  <div className="space-y-3">
                    {selectedTicket.responses && selectedTicket.responses.length > 0 ? (
                      selectedTicket.responses.map((response, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            response.isAdmin 
                              ? 'bg-green-50 border-l-4 border-green-400' 
                              : 'bg-gray-50 border-l-4 border-gray-400'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-black">
                              {response.isAdmin ? 'Support Team' : 'User'}
                            </span>
                            <span className="text-xs text-black">
                              {new Date(response.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-black">{response.message}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 italic">No responses yet</p>
                    )}
                  </div>
                </div>

                {/* Add Response */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-2">Add Response</h4>
                  <div className="space-y-3">
                    <textarea
                      value={newResponse}
                      onChange={(e) => setNewResponse(e.target.value)}
                      placeholder="Enter your response..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={sendTicketResponse}
                      disabled={!newResponse.trim() || sendingResponse}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {sendingResponse ? 'Sending...' : 'Send Response'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  // Plan Management Functions
  async function handleCreatePlan(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    try {
      const planData = {
        ...planForm,
        price: parseFloat(planForm.price),
        maxPicks: planForm.maxPicks ? parseInt(planForm.maxPicks) : null
      }
      
      const result = await adminApi.createPlan(token, planData)
      setPlans(prev => [...prev, result.plan])
      setShowPlanModal(false)
      resetPlanForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdatePlan(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    
    try {
      const planData = {
        ...planForm,
        price: parseFloat(planForm.price),
        maxPicks: planForm.maxPicks ? parseInt(planForm.maxPicks) : null
      }
      
      const result = await adminApi.updatePlan(token, selectedPlan._id, planData)
      setPlans(prev => prev.map(p => p._id === selectedPlan._id ? result.plan : p))
      setShowPlanModal(false)
      resetPlanForm()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDeletePlan(planId) {
    if (!confirm('Are you sure you want to delete this plan? This action cannot be undone.')) return
    
    setSaving(true)
    setError('')
    
    try {
      await adminApi.deletePlan(token, planId)
      setPlans(prev => prev.filter(p => p._id !== planId))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleTogglePlanStatus(planId) {
    setSaving(true)
    setError('')
    
    try {
      const result = await adminApi.togglePlanStatus(token, planId)
      setPlans(prev => prev.map(p => p._id === planId ? result.plan : p))
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function openPlanModal(plan = null) {
    setSelectedPlan(plan)
    if (plan) {
      setPlanForm({
        name: plan.name,
        description: plan.description,
        price: plan.price.toString(),
        duration: plan.duration,
        features: plan.features || [],
        isActive: plan.isActive,
        maxPicks: plan.maxPicks ? plan.maxPicks.toString() : '',
        accessLevel: plan.accessLevel
      })
    } else {
      resetPlanForm()
    }
    setShowPlanModal(true)
  }

  function resetPlanForm() {
    setPlanForm({
      name: '',
      description: '',
      price: '',
      duration: 30,
      features: [],
      isActive: true,
      maxPicks: '',
      accessLevel: 'premium'
    })
    setSelectedPlan(null)
  }

  function addFeature() {
    if (newFeature.trim()) {
      setPlanForm(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  function removeFeature(index) {
    setPlanForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  function renderPlanManagement() {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Plan Management</h2>
          <button
            onClick={() => openPlanModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Plan</span>
          </button>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan._id} className="bg-white rounded-lg shadow border">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                      plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-sm font-medium text-gray-900">${plan.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium text-gray-900">{plan.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Access Level:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{plan.accessLevel}</span>
                  </div>
                  {plan.maxPicks && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Max Picks:</span>
                      <span className="text-sm font-medium text-gray-900">{plan.maxPicks}</span>
                    </div>
                  )}
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Features:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openPlanModal(plan)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit Plan"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleTogglePlanStatus(plan._id)}
                      className={`${plan.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                      title={plan.isActive ? 'Deactivate Plan' : 'Activate Plan'}
                    >
                      {plan.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-xs text-gray-500">
                    {plan.subscriberCount || 0} subscribers
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {plans.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No plans yet</h3>
            <p className="text-gray-600 mb-4">Create your first subscription plan to get started.</p>
            <button
              onClick={() => openPlanModal()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Plan
            </button>
          </div>
        )}

        {/* Plan Modal */}
        {showPlanModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
              <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                <h3 className="text-lg font-semibold">
                  {selectedPlan ? 'Edit Plan' : 'Create New Plan'}
                </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <form onSubmit={selectedPlan ? handleUpdatePlan : handleCreatePlan} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                      <input
                        type="text"
                        value={planForm.name}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Gold Plan"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={planForm.price}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="29.99"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</label>
                      <input
                        type="number"
                        value={planForm.duration}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="30"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Access Level *</label>
                      <select
                        value={planForm.accessLevel}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, accessLevel: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="premium">Premium</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Picks (optional)</label>
                      <input
                        type="number"
                        value={planForm.maxPicks}
                        onChange={(e) => setPlanForm(prev => ({ ...prev, maxPicks: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Unlimited if empty"
                      />
                    </div>
                    
                    <div className="flex items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={planForm.isActive}
                          onChange={(e) => setPlanForm(prev => ({ ...prev, isActive: e.target.checked }))}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">Active Plan</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={planForm.description}
                      onChange={(e) => setPlanForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                      placeholder="Plan description..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Add a feature..."
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                        />
                        <button
                          type="button"
                          onClick={addFeature}
                          className="px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {planForm.features.length > 0 && (
                        <div className="space-y-1">
                          {planForm.features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                              <span className="text-sm">{feature}</span>
                              <button
                                type="button"
                                onClick={() => removeFeature(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPlanModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={selectedPlan ? handleUpdatePlan : handleCreatePlan}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : selectedPlan ? 'Update Plan' : 'Create Plan'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderTabContent() {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'users':
        return renderUserManagement()
      case 'financial':
        return renderFinancialManagement()
      case 'content':
        return renderContentManagement()
      case 'plans':
        return renderPlanManagement()
      case 'support':
        return renderSupportManagement()
      case 'settings':
        return renderSettings()
      default:
        return renderDashboard()
    }
  }

  function renderDashboard() {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Total Users</h3>
                <p className="text-xl sm:text-3xl font-bold text-blue-600">{dashboardStats.totalUsers || userStats.total}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Revenue</h3>
                <p className="text-xl sm:text-3xl font-bold text-green-600">${dashboardStats.totalRevenue || 0}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Total Picks</h3>
                <p className="text-xl sm:text-3xl font-bold text-purple-600">{dashboardStats.totalPicks || picks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
              <div className="ml-3 sm:ml-4">
                <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Support Tickets</h3>
                <p className="text-xl sm:text-3xl font-bold text-orange-600">{dashboardStats.openTickets || supportTickets.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Plan Distribution */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2">Gold Users</h3>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{userStats.gold}</p>
            <p className="text-xs sm:text-sm text-gray-500">Premium subscribers</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2">Silver Users</h3>
            <p className="text-2xl sm:text-3xl font-bold text-gray-600">{userStats.silver}</p>
            <p className="text-xs sm:text-sm text-gray-500">Standard subscribers</p>
          </div>
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2">Free Users</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600">{userStats.free}</p>
            <p className="text-xs sm:text-sm text-gray-500">Free tier users</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {(Array.isArray(dashboardStats.recentUsers) ? dashboardStats.recentUsers : []).slice(0, 5).map((user, idx) => (
                <div key={user._id || user.id || user.email || `${user.firstName}-${user.lastName}-${user.createdAt}-${idx}`} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                    user.plan === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                    user.plan === 'silver' ? 'bg-gray-100 text-gray-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {user.plan}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderUserManagement() {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Management</h3>
              <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="flex-1 sm:flex-none px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => loadData(search)}
                  className="px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Card View */}
          <div className="block sm:hidden">
            <div className="space-y-3 p-3">
              {users.map((user) => (
                <div key={user._id} className="bg-gray-50 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                      user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Plan</label>
                      <select
                        value={user.plan}
                        onChange={(e) => updateUser(user._id, { plan: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="free">Free</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Role</label>
                      <select
                        value={user.role}
                        onChange={(e) => updateUser(user._id, { role: e.target.value })}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => viewUserDetails(user._id)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                      className="text-yellow-600 hover:text-yellow-900 p-1"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Deposited</th>
                  <th className="px-3 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} className="w-10 h-10 rounded-full mr-3" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.plan}
                        onChange={(e) => updateUser(user._id, { plan: e.target.value })}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="free">Free</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                      </select>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role}
                        onChange={(e) => updateUser(user._id, { role: e.target.value })}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ml-2 ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        value={user.totalDeposited ?? 0}
                        min={0}
                        step={0.01}
                        onChange={e => updateUser(user._id, { totalDeposited: parseFloat(e.target.value) })}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        title="Total Deposited"
                      />
                    </td>
                    <td className="px-3 lg:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => viewUserDetails(user._id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Options Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Payment Options Management</h3>
            <button
              onClick={() => openPaymentOptionModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Payment Option</span>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paymentOptions.map((option) => (
                  <tr key={option._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {option.icon && (
                          <div className="w-8 h-8 mr-3 flex items-center justify-center bg-gray-100 rounded">
                            <span className="text-sm">{option.icon}</span>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{option.name}</div>
                          <div className="text-sm text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{option.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{option.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{option.category.replace('_', ' ')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        option.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {option.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${option.minAmount} - ${option.maxAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openPaymentOptionModal(option)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit Payment Option"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => togglePaymentOption(option._id)}
                        className={`${option.isActive ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}`}
                        title={option.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {option.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deletePaymentOption(option._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Payment Option"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {paymentOptions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No payment options found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  function renderFinancialManagement() {
    return (
      <div className="space-y-6">
        {/* Deposit Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Deposit Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {depositRequests.map((deposit) => (
                  <tr key={deposit._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{deposit.user?.firstName} {deposit.user?.lastName}</div>
                      <div className="text-sm text-gray-500">{deposit.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${deposit.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{deposit.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        deposit.status === 'completed' ? 'bg-green-100 text-green-800' :
                        deposit.status === 'waiting_for_deposit' ? 'bg-blue-100 text-blue-800' :
                        deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {deposit.status === 'waiting_for_deposit' ? 'Waiting for Deposit' : deposit.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {deposit.status === 'pending' && (
                        <button
                          onClick={() => openDepositModal(deposit)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Add Payment Details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {deposit.status === 'waiting_for_deposit' && (
                        <>
                          <button
                            key={`approve-deposit-${deposit._id}`}
                            onClick={() => approveDeposit(deposit._id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Deposit"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            key={`edit-deposit-${deposit._id}`}
                            onClick={() => openDepositModal(deposit)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Payment Details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        key={`reject-deposit-${deposit._id}`}
                        onClick={() => rejectDeposit(deposit._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Reject Deposit"
                        disabled={deposit.status === 'completed'}
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {depositRequests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No deposit requests found</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Transaction Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={transaction.status}
                        onChange={(e) => updateTransaction(transaction._id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => updateTransaction(transaction._id, transaction.status)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdrawal Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Withdrawal Requests</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawalRequests.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{withdrawal.user?.firstName} {withdrawal.user?.lastName}</div>
                      <div className="text-sm text-gray-500">{withdrawal.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${withdrawal.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{withdrawal.paymentMethod}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                        withdrawal.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        withdrawal.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        withdrawal.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {withdrawal.status === 'pending' && (
                        <>
                          <button
                            key={`approve-${withdrawal.id}`}
                            onClick={() => approveWithdrawal(withdrawal.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve Withdrawal"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            key={`processing-${withdrawal.id}`}
                            onClick={() => markWithdrawalAsProcessing(withdrawal.id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Mark as Processing"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            key={`reject-${withdrawal.id}`}
                            onClick={() => openWithdrawalModal(withdrawal)}
                            className="text-red-600 hover:text-red-900"
                            title="Reject Withdrawal"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {withdrawal.status === 'approved' && (
                        <button
                          key={`complete-approved-${withdrawal.id}`}
                          onClick={() => markWithdrawalAsCompleted(withdrawal.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Completed"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {withdrawal.status === 'processing' && (
                        <button
                          key={`complete-processing-${withdrawal.id}`}
                          onClick={() => markWithdrawalAsCompleted(withdrawal.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Mark as Completed"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        key={`view-${withdrawal.id}`}
                        onClick={() => openWithdrawalModal(withdrawal)}
                        className="text-gray-600 hover:text-gray-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {withdrawalRequests.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No withdrawal requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  function renderContentManagement() {
    return (
      <div className="space-y-6">
        {/* Homepage Content Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Homepage Content Management</h3>
          </div>
          <div className="p-6">
            <HomepageContentManager />
          </div>
        </div>

        {/* Contact Inquiries */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Contact Inquiries & Plan Requests</h3>
          </div>
          <div className="p-6">
            <ContactInquiriesManager />
          </div>
        </div>

        {/* Create New Pick */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Create New Pick</h3>
          </div>
          <div className="p-6">
            <form onSubmit={createPick} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Sport"
                value={newPick.sport}
                onChange={(e) => setNewPick({...newPick, sport: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="League"
                value={newPick.league}
                onChange={(e) => setNewPick({...newPick, league: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Home Team"
                value={newPick.homeTeam}
                onChange={(e) => setNewPick({...newPick, homeTeam: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Away Team"
                value={newPick.awayTeam}
                onChange={(e) => setNewPick({...newPick, awayTeam: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="datetime-local"
                value={newPick.matchDate}
                onChange={(e) => setNewPick({...newPick, matchDate: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Prediction"
                value={newPick.prediction}
                onChange={(e) => setNewPick({...newPick, prediction: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Odds"
                value={newPick.odds}
                onChange={(e) => setNewPick({...newPick, odds: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={newPick.confidence}
                onChange={(e) => setNewPick({...newPick, confidence: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Confidence</option>
                <option value="medium">Medium Confidence</option>
                <option value="high">High Confidence</option>
              </select>
              <input
                type="number"
                placeholder="Stake"
                value={newPick.stake}
                onChange={(e) => setNewPick({...newPick, stake: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={newPick.accessLevel}
                onChange={(e) => setNewPick({...newPick, accessLevel: e.target.value})}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="free">Free</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create Pick
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Picks Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Manage Picks</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Match</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prediction</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Odds</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {picks.slice(0, 10).map((pick) => (
                  <tr key={pick._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{pick.homeTeam} vs {pick.awayTeam}</div>
                      <div className="text-sm text-gray-500">{pick.sport} - {pick.league}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pick.prediction}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pick.odds}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        pick.accessLevel === 'gold' ? 'bg-yellow-100 text-yellow-800' :
                        pick.accessLevel === 'silver' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {pick.accessLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pick.status || 'pending'}
                        onChange={(e) => updatePick(pick._id, { status: e.target.value })}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                        <option value="void">Void</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => deletePick(pick._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Announcements</h3>
          </div>
          <div className="p-6">
            <form onSubmit={createAnnouncement} className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <textarea
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({...form, message: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="grid grid-cols-3 gap-4">
                <select
                  value={form.type}
                  onChange={(e) => setForm({...form, type: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({...form, priority: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  value={form.targetAudience}
                  onChange={(e) => setForm({...form, targetAudience: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All</option>
                  <option value="free">Free</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Creating...' : 'Create Announcement'}
              </button>
            </form>

            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div key={announcement._id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{announcement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{announcement.message}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Type: {announcement.type}</span>
                        <span>Priority: {announcement.priority}</span>
                        <span>Audience: {announcement.targetAudience}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => togglePin(announcement._id)}
                      className={`p-2 rounded ${announcement.isPinned ? 'text-blue-600' : 'text-gray-400'}`}
                    >
                      {announcement.isPinned ? <Pin className="w-4 h-4" /> : <PinOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  function renderSupportManagement() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Support Tickets</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supportTickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{ticket.user?.firstName} {ticket.user?.lastName}</div>
                      <div className="text-sm text-gray-500">{ticket.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{ticket.subject}</div>
                      <div className="text-sm text-gray-500">{ticket.message?.substring(0, 50)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={ticket.priority}
                        onChange={(e) => updateSupportTicket(ticket._id, { priority: e.target.value })}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateSupportTicket(ticket._id, { status: e.target.value })}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openTicketModal(ticket)}
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        title="View Details & Respond"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  function renderSettings() {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Dashboard Configuration</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Module Visibility</h4>
                <div className="space-y-3">
                  {['showQuickActions', 'showBalance', 'showStats', 'showRecentPicks', 'showAnnouncements'].map((key) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={dashboardConfig?.modules?.[key] ?? true}
                        onChange={(e) => setDashboardConfig(prev => ({
                          ...prev,
                          modules: { ...prev.modules, [key]: e.target.checked }
                        }))}
                        className="mr-3"
                      />
                      <span className="text-sm text-gray-700">
                        {key.replace('show', 'Show ').replace(/([A-Z])/g, ' $1')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Hero Banner</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={dashboardConfig?.hero?.enabled ?? false}
                      onChange={(e) => setDashboardConfig(prev => ({
                        ...prev,
                        hero: { ...prev.hero, enabled: e.target.checked }
                      }))}
                      className="mr-3"
                    />
                    <span className="text-sm text-gray-700">Enable Hero Banner</span>
                  </label>
                  
                  <input
                    type="text"
                    placeholder="Hero Title"
                    value={dashboardConfig?.hero?.title || ''}
                    onChange={(e) => setDashboardConfig(prev => ({
                      ...prev,
                      hero: { ...prev.hero, title: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <input
                    type="text"
                    placeholder="Hero Subtitle"
                    value={dashboardConfig?.hero?.subtitle || ''}
                    onChange={(e) => setDashboardConfig(prev => ({
                      ...prev,
                      hero: { ...prev.hero, subtitle: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={saveDashboardConfig}
                disabled={savingConfig}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {savingConfig ? 'Saving...' : 'Save Configuration'}
              </button>
              {dashboardConfig?.updatedAt && (
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {new Date(dashboardConfig.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminPanel;