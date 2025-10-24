import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token && !user) {
      setLoading(true)
      fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          if (!res.ok) throw new Error('Failed to fetch user')
          const data = await res.json()
          setUser(data.user)
        })
        .catch(() => {
          setUser(null)
          setToken(null)
          localStorage.removeItem('auth_token')
        })
        .finally(() => setLoading(false))
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        // Check if it's an email verification error
        if (data.requiresVerification) {
          return { 
            success: false, 
            requiresVerification: true, 
            email: data.email,
            error: data.message 
          }
        }
        throw new Error(data?.message || 'Login failed')
      }
      localStorage.setItem('auth_token', data.token)
      setToken(data.token)
      setUser(data.user)
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Registration failed')
      
      // New registration flow returns requiresVerification instead of immediate login
      if (data.requiresVerification) {
        return { 
          success: true, 
          requiresVerification: true, 
          email: data.email,
          message: data.message 
        }
      }
      
      // Fallback for old flow (shouldn't happen with new backend)
      localStorage.setItem('auth_token', data.token)
      setToken(data.token)
      setUser(data.user)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  // Direct login function for post-verification login
  const loginWithToken = (token, userData) => {
    localStorage.setItem('auth_token', token)
    setToken(token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
  }

  const updateUser = (updatedUser) => {
    setUser(updatedUser)
  }

  const value = useMemo(() => ({ user, token, loading, login, register, logout, updateUser, loginWithToken }), [user, token, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export { AuthContext }