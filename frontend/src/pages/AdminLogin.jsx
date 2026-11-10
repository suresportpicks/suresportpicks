import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Shield, Lock, AlertTriangle } from 'lucide-react'

const AdminLogin = () => {
  const { login, loading, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [lockTime, setLockTime] = useState(0)

  // Check if user is already logged in and is admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin')
    } else if (user && user.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [user, navigate])

  // Handle lockout timer
  useEffect(() => {
    let timer
    if (isLocked && lockTime > 0) {
      timer = setInterval(() => {
        setLockTime(prev => {
          if (prev <= 1) {
            setIsLocked(false)
            setAttempts(0)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isLocked, lockTime])

  const onSubmit = async (e) => {
    e.preventDefault()
    
    if (isLocked) {
      setError(`Account temporarily locked. Try again in ${lockTime} seconds.`)
      return
    }

    setError('')
    const res = await login(email, password)
    
    if (res.success) {
      // Only allow admin users
      if (res.user?.role === 'admin') {
        setAttempts(0)
        navigate('/admin')
      } else {
        setError('Access denied. Insufficient privileges.')
        setAttempts(prev => prev + 1)
      }
    } else {
      setAttempts(prev => {
        const newAttempts = prev + 1
        if (newAttempts >= 3) {
          setIsLocked(true)
          setLockTime(300) // 5 minutes lockout
          setError('Too many failed attempts. Account locked for 5 minutes.')
        } else {
          setError(res.error || 'Invalid credentials')
        }
        return newAttempts
      })
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white">
      <div className="w-full max-w-md">
        {/* Admin Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-2 mb-4">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">ADMIN ACCESS</span>
          </div>
        </div>

        <div className="bg-navy-900/90 border border-red-500/30 rounded-xl p-6 shadow-2xl backdrop-blur-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
              <Lock className="w-8 h-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-red-400">Admin Portal</h1>
            <p className="text-gray-400 mt-2">Secure administrative access</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-600/20 border border-red-500/30 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {isLocked && (
            <div className="mb-4 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg text-center">
              <div className="text-yellow-400 font-semibold">Account Locked</div>
              <div className="text-yellow-300 text-sm mt-1">
                Unlock in: {formatTime(lockTime)}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Admin Email</label>
              <input
                type="email"
                className="w-full bg-navy-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@suresport.com"
                required
                disabled={isLocked}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1 text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full bg-navy-800/50 border border-gray-600 rounded-lg px-4 py-3 pr-12 text-white placeholder-gray-400 focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  disabled={isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLocked}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              disabled={loading || isLocked}
            >
              {loading ? 'Authenticating...' : isLocked ? 'Account Locked' : 'Access Admin Panel'}
            </button>
          </form>

          {attempts > 0 && attempts < 3 && !isLocked && (
            <div className="mt-4 text-center text-yellow-400 text-sm">
              Warning: {3 - attempts} attempt{3 - attempts !== 1 ? 's' : ''} remaining
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-gray-700 text-center">
            <Link 
              to="/login" 
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to User Login
            </Link>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            This is a secure area. All access attempts are logged.
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminLogin