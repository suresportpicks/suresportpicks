import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import DashboardLayout from './components/DashboardLayout'

import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import AdminLogin from './pages/AdminLogin'
import Deposit from './pages/Deposit'
import Withdraw from './pages/Withdraw'
import Referral from './pages/Referral'
import Transactions from './pages/Transactions'
import Support from './pages/Support'
import AccountSettings from './pages/AccountSettings'
import Analytics from './pages/Analytics'
import Picks from './pages/Picks'
import Plans from './pages/Plans'
import HowItWorks from './pages/HowItWorks'
import About from './pages/About'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
// import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <div className="App min-h-screen app-bg app-text">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/picks" element={<Picks />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Dashboard Routes with Sidebar Layout */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="deposit/history" element={<Deposit />} />
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="withdraw/history" element={<Withdraw />} />
              <Route path="referral" element={<Referral />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="support" element={<Support />} />
              <Route path="support/new" element={<Support />} />
              <Route path="support/tickets" element={<Support />} />
              <Route path="settings" element={<AccountSettings />} />
              <Route path="settings/profile" element={<AccountSettings />} />
              <Route path="settings/password" element={<AccountSettings />} />
              <Route path="settings/2fa" element={<AccountSettings />} />
            </Route>

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              }
            />
          </Routes>
        </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
