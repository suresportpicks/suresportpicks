import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, TrendingUp } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    let last = window.scrollY > 50
    setIsScrolled(last)
    const handleScroll = () => {
      const next = window.scrollY > 50
      if (next !== last) {
        last = next
        setIsScrolled(next)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Picks', href: '/picks' },
    { name: 'Plans', href: '/plans' },
    { name: 'Contact', href: '#contact' }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy-950/95 backdrop-blur-md border-b border-gold-500/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-navy-950" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              SureSport Picks
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-gold-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    {item.name}
                  </motion.a>
                ) : (
                  <motion.div
                    key={item.name}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Link
                      to={item.href}
                      className="text-gray-300 hover:text-gold-400 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                )
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-gold-400 hover:text-gold-300 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg shadow-gold-500/25"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gold-400 hover:text-gold-300 px-4 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gold-400 hover:text-gold-300 px-4 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg shadow-gold-500/25"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-gold-400 p-2"
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? 'auto' : 0 
        }}
        className="md:hidden bg-navy-950/95 backdrop-blur-md border-t border-gold-500/20"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => (
            item.href.startsWith('#') ? (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-gold-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-300 hover:text-gold-400 block px-3 py-2 text-base font-medium transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            )
          ))}
          <div className="pt-4 pb-2 space-y-2">
            {!token ? (
              <>
                <Link to="/login" className="w-full block text-left text-gold-400 hover:text-gold-300 px-3 py-2 text-base font-medium" onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="w-full block bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 px-3 py-2 rounded-lg text-base font-semibold" onClick={() => setIsOpen(false)}>
                  Get Started
                </Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="w-full block text-left text-gold-400 hover:text-gold-300 px-3 py-2 text-base font-medium" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="w-full block text-left text-gold-400 hover:text-gold-300 px-3 py-2 text-base font-medium" onClick={() => setIsOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 px-3 py-2 rounded-lg text-base font-semibold" onClick={() => { logout(); setIsOpen(false); navigate('/'); }}>
                    Logout
                  </button>
                </>
              )}
            </div>
        </div>
      </motion.div>
    </motion.nav>
  )
}

export default Navbar