import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const Login = () => {
  const { login, loading, user } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await login(email, password)
    if (res.success) {
      // Redirect all users to dashboard - admins should use /admin/login
      navigate('/dashboard')
    } else if (res.requiresVerification) {
      // Redirect to email verification page with user's email
      navigate(`/verify-email?email=${encodeURIComponent(res.email)}`)
    } else {
      setError(res.error || 'Login failed')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-navy-950 text-white">
      <div className="w-full max-w-md bg-navy-900/80 border border-gold-500/20 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="text-gray-400 mb-6">Access your dashboard</p>
        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full input-field pr-12"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-400 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full btn-secondary"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-400 space-y-2">
          <div>
            Don't have an account? <Link to="/register" className="text-gold-400">Register</Link>
          </div>
          <div className="pt-2 border-t border-gold-500/20">
            <Link to="/admin/login" className="text-gold-400 hover:text-gold-300 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login