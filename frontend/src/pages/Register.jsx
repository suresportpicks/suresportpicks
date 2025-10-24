import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const Register = () => {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const res = await register(name, email, password)
    if (res.success) {
      if (res.requiresVerification) {
        // Redirect to verification page with email parameter
        navigate(`/verify-email?email=${encodeURIComponent(res.email)}`)
      } else {
        // Fallback for old flow
        navigate('/dashboard')
      }
    } else {
      setError(res.error || 'Registration failed')
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-navy-950 text-white">
      <div className="w-full max-w-md bg-navy-900/80 border border-gold-500/20 rounded-xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>
        <p className="text-gray-400 mb-6">Join VIP access in minutes</p>
        {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              className="w-full input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-gold-400">Login</Link>
        </div>
      </div>
    </section>
  )
}

export default Register