import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { 
  Home, BarChart3, CalendarDays, Clock, DollarSign, CreditCard, Gift, Trophy, 
  Target, Users, MessageSquare, Settings, HelpCircle, LogOut, ChevronRight, ChevronLeft, Sun, Moon
} from 'lucide-react'

function getActiveClass(path) {
  const currentPath = window.location.pathname
  if (path === '/') return currentPath === '/' ? 'bg-blue-100 text-blue-800 shadow-inner shadow-blue-200' : ''
  return currentPath.startsWith(path) ? 'bg-blue-100 text-blue-800 shadow-inner shadow-blue-200' : ''
}

const DashboardSidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const { theme, toggleTheme, isLight } = useTheme()
  const [expanded, setExpanded] = useState({})

  const navItems = [
    { label: 'Overview', icon: Home, path: '/dashboard' },
    { label: 'Deposit', icon: DollarSign, path: '/dashboard/deposit' },
    { label: 'Withdraw', icon: CreditCard, path: '/dashboard/withdraw' },
    { label: 'Referral', icon: Users, path: '/dashboard/referral' },
    { label: 'Transactions', icon: BarChart3, path: '/dashboard/transactions' },
    { label: 'Support', icon: HelpCircle, path: '/dashboard/support', submenu: [
      { label: 'Open Ticket', icon: MessageSquare, path: '/dashboard/support/new' },
      { label: 'My Tickets', icon: MessageSquare, path: '/dashboard/support/tickets' },
    ]},
    { label: 'Settings', icon: Settings, path: '/dashboard/settings', submenu: [
      { label: 'Profile', icon: Settings, path: '/dashboard/settings/profile' },
      { label: 'Password', icon: Settings, path: '/dashboard/settings/password' },
      { label: 'Two-Factor', icon: Settings, path: '/dashboard/settings/2fa' },
    ]},
  ]

  const toggleExpand = (section) => {
    setExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-full theme-bg-primary theme-border-primary border-r transform transition-transform duration-300 ease-in-out w-64 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto overflow-x-hidden ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      aria-hidden={!isOpen && window.innerWidth < 1024}
    >
      {/* Header / Branding */}
      <div className="p-4 theme-border-primary border-b lg:sticky lg:top-0 theme-bg-primary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
            <span className="text-navy-900 font-bold text-lg">S</span>
          </div>
          <div className={`${isCollapsed ? 'lg:hidden' : ''}`}>
            <h1 className="theme-text-primary font-bold text-lg">SureSport Picks</h1>
            <p className="theme-text-muted text-xs">Premium Sports Betting</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-3 space-y-1">
        {navItems.map((item) => (
          <div key={item.label}>
            {!item.submenu ? (
              <Link
                to={item.path}
                className={`${getActiveClass(item.path)} flex items-center ${isCollapsed ? 'justify-center gap-0' : 'gap-3'} px-3 py-2 rounded-md hover:theme-bg-secondary theme-text-secondary transition-colors`}
                onClick={() => setIsOpen && setIsOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className={`font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
              </Link>
            ) : (
              <div>
                <button
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center gap-0' : 'gap-3'} px-3 py-2 rounded-md theme-text-secondary hover:theme-bg-secondary transition-colors`}
                  onClick={() => toggleExpand(item.label)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className={`font-medium ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${expanded[item.label] ? 'rotate-90' : ''} ${isCollapsed ? 'lg:hidden' : 'lg:inline-block'}`} />
                </button>
                <ul className={`${expanded[item.label] ? 'block' : 'hidden'} ${isCollapsed ? 'lg:hidden' : ''} pl-11 space-y-1`}>
                  {item.submenu.map((sub) => (
                    <li key={sub.label}>
                      <Link
                        to={sub.path}
                        className={`flex items-center ${isCollapsed ? 'justify-center gap-0' : 'gap-3'} px-3 py-2 rounded-md hover:theme-bg-secondary theme-text-secondary transition-colors`}
                        onClick={() => setIsOpen && setIsOpen(false)}
                      >
                        <sub.icon className="w-4 h-4" />
                        <span className={`text-sm ${isCollapsed ? 'lg:hidden' : ''}`}>{sub.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto p-3 theme-border-primary border-t space-y-2">
        {/* Theme Toggle Button */}
        <button 
          className={`w-full flex items-center ${isCollapsed ? 'justify-center gap-0' : 'gap-3'} px-3 py-2 rounded-md theme-text-secondary hover:theme-text-primary hover:theme-bg-secondary transition-colors`} 
          onClick={toggleTheme}
          title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
        >
          {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          <span className={`${isCollapsed ? 'lg:hidden' : ''} font-medium`}>
            {isLight ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
        
        {/* Sign Out Button */}
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center gap-0' : 'gap-3'} px-3 py-2 rounded-md theme-text-secondary hover:theme-text-primary hover:theme-bg-secondary transition-colors`} onClick={() => { logout(); setIsOpen && setIsOpen(false); navigate('/login'); }}>
          <LogOut className="w-5 h-5" />
          <span className={`${isCollapsed ? 'lg:hidden' : ''} font-medium`}>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}

export default DashboardSidebar