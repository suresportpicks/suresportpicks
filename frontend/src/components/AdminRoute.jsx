import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { token, user, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }

  if (!token || user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default AdminRoute