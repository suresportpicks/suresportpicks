import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashboardSidebar from './DashboardSidebar'
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // Add collapsed state for desktop
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen theme-bg-primary">
      {/* Mobile Header */}
      <header className="lg:hidden theme-bg-primary theme-border-primary border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
              <span className="text-navy-900 font-bold">S</span>
            </div>
            <h1 className="theme-text-primary font-semibold">SureSport Picks</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg theme-text-secondary hover:theme-bg-secondary hover:theme-text-primary transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <DashboardSidebar 
          isOpen={sidebarOpen} 
          setIsOpen={setSidebarOpen}
          isCollapsed={sidebarCollapsed}
          setIsCollapsed={setSidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Desktop Sidebar Toggle Button */}
          <div className={`hidden lg:block fixed top-4 z-30 transition-all duration-300 ${sidebarCollapsed ? 'left-24' : 'left-72'}`}>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg theme-bg-secondary theme-text-secondary hover:theme-bg-primary hover:theme-text-primary transition-all duration-200 shadow-lg border theme-border-primary"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout