import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  Target,
  Bell,
  Wallet,
  CreditCard,
  Users,
  DollarSign,
  Trophy,
  Star,
  Plus,
  CheckCircle,
  XCircle,
  RotateCcw,
  FileText,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  BarChart3,
  HelpCircle
} from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const Dashboard = () => {
  const { user, token } = useAuth()
  const [picks, setPicks] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [stats, setStats] = useState({ 
    totalPicks: 0,
    wonPicks: 0,
    lostPicks: 0,
    pendingPicks: 0,
    voidPicks: 0,
    balance: 0,
    pendingWithdrawals: 0,
    bonusFunds: 0,
    activeBets: 0,
    totalTransactions: 0,
    totalSupportTickets: 0,
    wonBets: 0,
    lostBets: 0,
    refundedBets: 0,
    supportTickets: 0,
    totalDeposited: 0,
    totalWithdrawn: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dashboardConfig, setDashboardConfig] = useState({
    modules: {
      showQuickActions: true,
      showBalance: true,
      showStats: true,
      showRecentPicks: true,
      showAnnouncements: true,
    },
    hero: { enabled: false, title: '', subtitle: '' },
  })
  
  // Mock data for recent picks
  const recentPicks = picks.slice(0, 5).map(pick => ({
    game: pick.homeTeam && pick.awayTeam ? `${pick.homeTeam} vs ${pick.awayTeam}` : pick.title || 'Game',
    pick: pick.prediction || 'Pick',
    status: pick.status || 'pending'
  }))

  useEffect(() => {
    if (!token) return
    loadDashboardData()
  }, [token])

  async function loadDashboardData() {
    setLoading(true); setError(null)
    try {
      const headers = { Authorization: `Bearer ${token}` }
      const [picksRes, announcementsRes, transactionsRes, supportRes, userRes] = await Promise.all([
        fetch(`${API_BASE}/picks?limit=5`, { headers }),
        fetch(`${API_BASE}/announcements?limit=3`, { headers }),
        fetch(`${API_BASE}/payments/transactions`, { headers }),
        fetch(`${API_BASE}/support/tickets?limit=1`, { headers }),
        fetch(`${API_BASE}/users/profile`, { headers }),
      ])
      
      // Fetch dashboard configuration
      const configRes = await fetch(`${API_BASE}/config/dashboard`, { headers })
      const configData = await configRes.json()
      if (configRes.ok && configData?.config) {
        setDashboardConfig(configData.config)
      }
      
      const picksData = await picksRes.json()
      const announcementsData = await announcementsRes.json()
      const transactionsData = await transactionsRes.json()
      const supportData = await supportRes.json()
      const userData = await userRes.json()
      
      if (!picksRes.ok) throw new Error(picksData?.message || 'Failed to load picks')
      if (!announcementsRes.ok) throw new Error(announcementsData?.message || 'Failed to load announcements')
      if (!userRes.ok) throw new Error(userData?.message || 'Failed to load user data')

      setPicks(picksData.picks || [])
      setAnnouncements(announcementsData.announcements || [])
      
      // Use real stats from backend
      const picksStats = picksData.stats || {}
      
      // Calculate balance from completed transactions only
      const transactions = transactionsData.transactions || []
      const balance = transactions.reduce((acc, transaction) => {
        if (transaction.status === 'completed') {
          if (transaction.type === 'deposit') return acc + transaction.amount
          if (transaction.type === 'withdraw') return acc - transaction.amount
        }
        return acc
      }, 0)
      
      // Calculate pending withdrawals
      const pendingWithdrawals = transactions
        .filter(t => t.type === 'withdraw' && t.status === 'pending')
        .reduce((acc, t) => acc + t.amount, 0)
      
      // Calculate total deposited from completed deposits
      const totalDeposited = transactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((acc, t) => acc + t.amount, 0)
      
      // Calculate total withdrawn from completed withdrawals
      const totalWithdrawn = transactions
        .filter(t => t.type === 'withdraw' && t.status === 'completed')
        .reduce((acc, t) => acc + t.amount, 0)
      
      // Get betting statistics from user profile
      const userStats = userData.user?.stats || {}
      
      setStats({ 
        totalPicks: picksStats.totalPicks || 0,
        wonPicks: picksStats.wonPicks || 0,
        lostPicks: picksStats.lostPicks || 0,
        pendingPicks: picksStats.pendingPicks || 0,
        voidPicks: picksStats.voidPicks || 0,
        balance: balance,
        pendingWithdrawals: pendingWithdrawals,
        bonusFunds: 0, // TODO: Implement bonus system
        activeBets: picksStats.pendingPicks || 0,
        totalTransactions: transactionsData.total || 0,
        totalSupportTickets: supportData.tickets?.length || 0,
        totalDeposited: totalDeposited,
        totalWithdrawn: totalWithdrawn,
        wonBets: userStats.wonBets || 0,
        lostBets: userStats.lostBets || 0,
        refundedBets: userStats.refundedBets || 0
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="theme-text-muted">Loading your overview...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="theme-bg-secondary rounded-lg p-6 border theme-border-primary">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 lg:p-6">
      {/* Hero Banner */}
      {dashboardConfig.hero?.enabled && (
        <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm">
          <h2 className="theme-text-primary text-xl sm:text-2xl font-bold">{dashboardConfig.hero.title}</h2>
          {dashboardConfig.hero.subtitle && (
            <p className="theme-text-muted mt-1 text-sm sm:text-base">{dashboardConfig.hero.subtitle}</p>
          )}
        </div>
      )}

      {/* Header */}
      <div className="px-1">
        <h1 className="theme-text-primary text-xl sm:text-2xl font-bold">Welcome back, {user?.name || 'User'}!</h1>
        <p className="theme-text-muted text-sm sm:text-base">Current Plan: <span className="text-blue-600 font-medium">{user?.plan || 'Free'}</span></p>
      </div>

      {/* Quick Actions */}
      {dashboardConfig.modules?.showQuickActions !== false && (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link to="/dashboard/deposit" className="theme-bg-secondary hover:theme-bg-tertiary theme-border-primary border rounded-lg p-3 sm:p-4 transition-colors group">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-green-500/10 border border-green-500/20 p-1.5 sm:p-2 rounded-lg">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="theme-text-primary font-medium text-sm sm:text-base truncate">Deposit</h3>
              <p className="theme-text-muted text-xs sm:text-sm">Add funds</p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/withdraw" className="theme-bg-secondary hover:theme-bg-tertiary theme-border-primary border rounded-lg p-3 sm:p-4 transition-colors group">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-blue-500/10 border border-blue-500/20 p-1.5 sm:p-2 rounded-lg">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="theme-text-primary font-medium text-sm sm:text-base truncate">Withdraw</h3>
              <p className="theme-text-muted text-xs sm:text-sm">Cash out</p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/referral" className="theme-bg-secondary hover:theme-bg-tertiary theme-border-primary border rounded-lg p-3 sm:p-4 transition-colors group">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-purple-500/10 border border-purple-500/20 p-1.5 sm:p-2 rounded-lg">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="theme-text-primary font-medium text-sm sm:text-base truncate">Refer</h3>
              <p className="theme-text-muted text-xs sm:text-sm">Earn rewards</p>
            </div>
          </div>
        </Link>

        <Link to="/dashboard/support" className="theme-bg-secondary hover:theme-bg-tertiary border border-orange-500/20 rounded-lg p-3 sm:p-4 transition-colors group">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="bg-orange-500/10 border border-orange-500/20 p-1.5 sm:p-2 rounded-lg">
              <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="theme-text-primary font-medium text-sm sm:text-base truncate">Support</h3>
              <p className="theme-text-muted text-xs sm:text-sm">Get help</p>
            </div>
          </div>
        </Link>
      </div>
      )}

      {/* Account Balance Overview */}
      {dashboardConfig.modules?.showBalance !== false && (
      <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm">
        <h2 className="theme-text-primary text-base sm:text-lg font-semibold mb-3 sm:mb-4">Account Balance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-0">
            <p className="theme-text-muted text-xs sm:text-sm">Available Balance</p>
            <p className="theme-text-primary text-xl sm:text-2xl font-bold">${stats.balance?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="text-center p-3 sm:p-0">
            <p className="theme-text-muted text-xs sm:text-sm">Total Deposited</p>
            <p className="text-yellow-600 text-lg sm:text-xl font-semibold">${stats.totalDeposited?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="text-center p-3 sm:p-0">
            <p className="theme-text-muted text-xs sm:text-sm">Total Withdrawn</p>
            <p className="text-green-600 text-lg sm:text-xl font-semibold">${stats.totalWithdrawn?.toFixed(2) || '0.00'}</p>
          </div>
        </div>
      </div>
      )}

      {/* Betting & Activity Stats */}
      {dashboardConfig.modules?.showStats !== false && (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {/* Won Bets */}
        <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="theme-text-muted text-xs sm:text-sm">Won Bets</p>
              <p className="theme-text-primary text-xl sm:text-2xl font-bold">{stats.wonBets || 0}</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/20 p-2 sm:p-3 rounded-lg">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            </div>
          </div>
        </div>

        {/* Lost Bets */}
        <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="theme-text-muted text-xs sm:text-sm">Lost Bets</p>
              <p className="theme-text-primary text-xl sm:text-2xl font-bold">{stats.lostBets || 0}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 p-2 sm:p-3 rounded-lg">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
            </div>
          </div>
        </div>

        {/* Refunded Bets */}
        <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="theme-text-muted text-xs sm:text-sm">Refunded Bets</p>
              <p className="theme-text-primary text-xl sm:text-2xl font-bold">{stats.refundedBets || 0}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 sm:p-3 rounded-lg">
              <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Total Transactions */}
        <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="theme-text-muted text-xs sm:text-sm">Total Transactions</p>
              <p className="theme-text-primary text-xl sm:text-2xl font-bold">{stats.totalTransactions || 0}</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-2 sm:p-3 rounded-lg">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Support Tickets */}
        <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="theme-text-muted text-xs sm:text-sm">Support Tickets</p>
              <p className="theme-text-primary text-xl sm:text-2xl font-bold">{stats.supportTickets || 0}</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 p-2 sm:p-3 rounded-lg">
              <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Recent Picks */}
      {dashboardConfig.modules?.showRecentPicks !== false && (
      <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="theme-text-primary text-base sm:text-lg font-semibold">Recent Picks</h2>
          <Link to="/dashboard/picks" className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {recentPicks.length > 0 ? (
            recentPicks.map((pick) => (
              <div key={pick._id || pick.id || `pick-${pick.game}-${pick.pick}`} className="flex items-center justify-between p-2 sm:p-3 theme-bg-tertiary rounded-lg">
                <div className="min-w-0 flex-1 mr-2">
                  <p className="theme-text-primary font-medium text-sm sm:text-base truncate">{pick.game}</p>
                  <p className="theme-text-muted text-xs sm:text-sm truncate">{pick.pick}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  pick.status === 'won' ? 'bg-green-500/20 text-green-600' :
                  pick.status === 'lost' ? 'bg-red-500/20 text-red-600' :
                  pick.status === 'void' ? 'bg-yellow-500/20 text-yellow-600' :
                  'bg-blue-500/20 text-blue-600'
                }`}>
                  {pick.status}
                </span>
              </div>
            ))
          ) : (
            <p className="theme-text-muted text-center py-4 text-sm sm:text-base">No recent picks available</p>
          )}
        </div>
      </div>
      )}

      {/* Announcements */}
      {dashboardConfig.modules?.showAnnouncements !== false && (
      <div className="theme-bg-secondary theme-border-primary border rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          <h2 className="theme-text-primary text-base sm:text-lg font-semibold">Announcements</h2>
          <span className="bg-blue-500/20 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">Pinned</span>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div key={announcement._id || announcement.id || `announcement-${announcement.title}`} className="p-3 theme-bg-tertiary rounded-lg">
                <h3 className="theme-text-primary font-medium text-sm sm:text-base">{announcement.title}</h3>
                <p className="theme-text-secondary text-xs sm:text-sm mt-1">{announcement.content}</p>
                <p className="theme-text-muted text-xs mt-2">{announcement.date}</p>
              </div>
            ))
          ) : (
            <p className="theme-text-muted text-center py-4 text-sm sm:text-base">No announcements at this time</p>
          )}
        </div>
      </div>
      )}
    </div>
  )
}

export default Dashboard