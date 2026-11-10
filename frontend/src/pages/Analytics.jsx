import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target, Award, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const stats = [
    {
      title: 'Win Rate',
      value: '87.3%',
      change: '+2.1%',
      trend: 'up',
      icon: Target,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Total Picks',
      value: '1,247',
      change: '+156',
      trend: 'up',
      icon: Activity,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'ROI',
      value: '23.8%',
      change: '+4.2%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-gold-500 to-yellow-600'
    },
    {
      title: 'Streak',
      value: '12 W',
      change: 'Current',
      trend: 'up',
      icon: Award,
      color: 'from-purple-500 to-violet-600'
    }
  ]

  const chartData = [
    { month: 'Jan', wins: 45, losses: 8 },
    { month: 'Feb', wins: 52, losses: 6 },
    { month: 'Mar', wins: 48, losses: 9 },
    { month: 'Apr', wins: 61, losses: 7 },
    { month: 'May', wins: 55, losses: 5 },
    { month: 'Jun', wins: 58, losses: 8 }
  ]

  const sportsData = [
    { sport: 'NFL', picks: 342, winRate: 89.2, color: 'bg-red-500' },
    { sport: 'NBA', picks: 298, winRate: 85.7, color: 'bg-orange-500' },
    { sport: 'MLB', picks: 267, winRate: 88.4, color: 'bg-blue-500' },
    { sport: 'NHL', picks: 189, winRate: 86.8, color: 'bg-cyan-500' },
    { sport: 'Soccer', picks: 151, winRate: 87.9, color: 'bg-green-500' }
  ]

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-black"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Dive deep into our performance metrics and data-driven insights that power our winning predictions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm ${
                    stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400">{stat.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Chart */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-navy-800/30 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/20"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">Performance Trends</h2>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-gold-500 text-navy-950 rounded-lg font-semibold">6M</button>
                <button className="px-4 py-2 bg-navy-700 text-gray-300 rounded-lg">1Y</button>
                <button className="px-4 py-2 bg-navy-700 text-gray-300 rounded-lg">All</button>
              </div>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-4">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col space-y-1 mb-2">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.wins / 70) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-t from-green-500 to-emerald-400 rounded-t"
                      style={{ minHeight: '4px' }}
                    ></motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.losses / 70) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="bg-gradient-to-t from-red-500 to-red-400 rounded-b"
                      style={{ minHeight: '2px' }}
                    ></motion.div>
                  </div>
                  <span className="text-sm text-gray-400">{data.month}</span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center space-x-6 mt-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-300">Wins</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-300">Losses</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sports Breakdown */}
      <section className="py-16 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Performance by Sport</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sportsData.map((sport, index) => (
                <motion.div
                  key={sport.sport}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">{sport.sport}</h3>
                    <div className={`w-4 h-4 rounded-full ${sport.color}`}></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Picks</span>
                      <span className="text-white font-semibold">{sport.picks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate</span>
                      <span className="text-green-400 font-semibold">{sport.winRate}%</span>
                    </div>
                    <div className="w-full bg-navy-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${sport.winRate}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className={`h-2 rounded-full ${sport.color}`}
                      ></motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Analytics