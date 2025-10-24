import React from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, TrendingUp, Trophy, Target, Zap } from 'lucide-react'

const FeaturedPicks = () => {
  const picks = [
    {
      teams: 'Lakers vs Warriors',
      sport: 'NBA',
      time: 'Tonight 8:00 PM',
      pick: 'Lakers -3.5',
      confidence: 89,
      odds: '-110',
      result: 'pending',
      venue: 'Crypto.com Arena'
    },
    {
      teams: 'Chiefs vs Ravens',
      sport: 'NFL',
      time: 'Sunday 1:00 PM',
      pick: 'Over 48.5',
      confidence: 92,
      odds: '-105',
      result: 'won',
      venue: 'Arrowhead Stadium'
    },
    {
      teams: 'Celtics vs Heat',
      sport: 'NBA',
      time: 'Tomorrow 7:30 PM',
      pick: 'Celtics ML',
      confidence: 85,
      odds: '+120',
      result: 'pending',
      venue: 'TD Garden'
    }
  ]

  return (
    <section id="picks" className="py-20 bg-navy-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Featured Picks
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Today's top-rated predictions with highest confidence levels
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {picks.map((pick, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 border border-gold-500/20"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gold-400 text-sm font-medium">{pick.sport}</span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {pick.result === 'pending' ? 'Live' : pick.result.toUpperCase()}
                </span>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-white font-bold text-lg mb-2">{pick.teams}</h3>
                <p className="text-gray-400 text-sm">{pick.time}</p>
                <p className="text-gray-500 text-xs">{pick.venue}</p>
              </div>

              <div className="bg-navy-900/30 rounded-lg p-3 mb-4 border border-gold-500/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Our Pick:</span>
                  <span className="text-gold-400 font-semibold">{pick.pick}</span>
                </div>
              </div>

              <div className="space-y-4 bg-navy-900/50 rounded-xl p-4 border border-gold-500/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Odds:</span>
                  <span className="text-white font-bold text-lg">{pick.odds}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Confidence:</span>
                  <span className="text-green-400 font-bold text-lg">{pick.confidence}%</span>
                </div>
                
                <div className="w-full bg-navy-700 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    className="bg-gradient-to-r from-green-500 via-green-400 to-emerald-400 h-3 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${pick.confidence}%` }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-6 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold py-4 px-6 rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300"
              >
                View Analysis
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedPicks