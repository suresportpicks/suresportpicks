import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Clock, TrendingUp, Star, Filter, Calendar, Search } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Picks = () => {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filters = [
    { id: 'all', label: 'All Sports', count: 24 },
    { id: 'nfl', label: 'NFL', count: 8 },
    { id: 'nba', label: 'NBA', count: 6 },
    { id: 'mlb', label: 'MLB', count: 5 },
    { id: 'nhl', label: 'NHL', count: 3 },
    { id: 'soccer', label: 'Soccer', count: 2 }
  ]

  const picks = [
    {
      id: 1,
      sport: 'NFL',
      game: 'Chiefs vs Bills',
      pick: 'Chiefs -3.5',
      confidence: 95,
      odds: '-110',
      status: 'active',
      time: '8:20 PM ET',
      date: 'Today',
      analysis: 'Strong offensive line matchup favors Chiefs',
      image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 2,
      sport: 'NBA',
      game: 'Lakers vs Warriors',
      pick: 'Over 225.5',
      confidence: 88,
      odds: '-105',
      status: 'won',
      time: '10:00 PM ET',
      date: 'Yesterday',
      analysis: 'Both teams averaging high scoring games',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 3,
      sport: 'MLB',
      game: 'Yankees vs Red Sox',
      pick: 'Yankees ML',
      confidence: 82,
      odds: '+120',
      status: 'won',
      time: '7:05 PM ET',
      date: '2 days ago',
      analysis: 'Pitcher advantage and recent form',
      image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 4,
      sport: 'NHL',
      game: 'Rangers vs Bruins',
      pick: 'Under 6.5',
      confidence: 79,
      odds: '-115',
      status: 'lost',
      time: '7:00 PM ET',
      date: '3 days ago',
      analysis: 'Strong defensive matchup expected',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 5,
      sport: 'Soccer',
      game: 'Manchester United vs Liverpool',
      pick: 'Draw',
      confidence: 75,
      odds: '+240',
      status: 'active',
      time: '12:30 PM ET',
      date: 'Tomorrow',
      analysis: 'Evenly matched teams in crucial fixture',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      id: 6,
      sport: 'NBA',
      game: 'Celtics vs Heat',
      pick: 'Celtics -7.5',
      confidence: 91,
      odds: '-108',
      status: 'active',
      time: '8:00 PM ET',
      date: 'Tomorrow',
      analysis: 'Home court advantage and injury report',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'won': return 'text-green-400 bg-green-400/20'
      case 'lost': return 'text-red-400 bg-red-400/20'
      case 'active': return 'text-blue-400 bg-blue-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-400'
    if (confidence >= 80) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const filteredPicks = picks.filter(pick => {
    const matchesFilter = activeFilter === 'all' || pick.sport.toLowerCase() === activeFilter
    const matchesSearch = pick.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pick.pick.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-black"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
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
                Expert Picks
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Data-driven predictions from our team of professional analysts with proven track records
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search picks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-navy-800 border border-gold-500/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeFilter === filter.id
                      ? 'bg-gold-500 text-navy-950'
                      : 'bg-navy-800 text-gray-300 hover:bg-navy-700'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Picks Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPicks.map((pick, index) => (
              <motion.div
                key={pick.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-navy-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={pick.image}
                    alt={pick.game}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent"></div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-navy-950/80 backdrop-blur-sm rounded-full text-sm font-medium text-gold-400">
                      {pick.sport}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pick.status)}`}>
                      {pick.status.charAt(0).toUpperCase() + pick.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{pick.game}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className={`w-4 h-4 ${getConfidenceColor(pick.confidence)}`} />
                      <span className={`text-sm font-semibold ${getConfidenceColor(pick.confidence)}`}>
                        {pick.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Pick:</span>
                      <span className="text-white font-semibold">{pick.pick}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Odds:</span>
                      <span className="text-green-400 font-semibold">{pick.odds}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Time:</span>
                      <span className="text-white">{pick.time}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-navy-700">
                    <p className="text-sm text-gray-300">{pick.analysis}</p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-400">{pick.date}</span>
                    <button className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all duration-200">
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gold-500/10 to-gold-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Want Access to Premium Picks?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of successful bettors with our premium subscription plans
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 rounded-lg font-bold text-lg hover:from-gold-600 hover:to-gold-700 transition-all duration-200 shadow-lg shadow-gold-500/25">
              View Plans
            </button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Picks