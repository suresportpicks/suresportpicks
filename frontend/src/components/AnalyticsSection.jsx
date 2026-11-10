import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Target, Users, Award, Zap, Trophy, Activity } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import lakersLogo from '../assets/images/lakers-logo.svg'
import heatLogo from '../assets/images/heat-logo.svg'
import chiefsLogo from '../assets/images/chiefs-logo.svg'
import billsLogo from '../assets/images/bills-logo.svg'
import basketballCourt from '../assets/images/basketball-court.svg'

const AnalyticsSection = () => {
  return (
    <section id="analytics" className="py-20 bg-navy-900 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="section" intensity="medium" />
      
      {/* Background Court Image */}
      <div className="absolute inset-0 opacity-5">
        <img 
          src={basketballCourt} 
          alt="Basketball Court" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Predictive Analytics
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            AI-powered insights and real-time data analysis for maximum winning potential
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Live Data Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.div 
              className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 border border-gold-500/20 backdrop-blur-sm hover:border-gold-400/40 transition-all duration-300 group"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img src={lakersLogo} alt="Lakers" className="w-8 h-8" />
                    <span className="text-gray-400 text-sm">vs</span>
                    <img src={heatLogo} alt="Heat" className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-gold-400 transition-colors">Lakers vs Heat</h3>
                    <p className="text-sm text-gray-400">NBA • Tonight 8:00 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors">87%</div>
                  <div className="text-xs text-gray-400">AI Confidence</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Predicted Spread: Lakers -4.5</span>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-gold-400" />
                  <span className="text-gold-400 font-medium">High Value</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-navy-700 rounded-full h-1">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-1 rounded-full w-[87%]"></div>
              </div>
            </motion.div>

            <motion.div 
              className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-6 border border-gold-500/20 backdrop-blur-sm hover:border-gold-400/40 transition-all duration-300 group"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img src={chiefsLogo} alt="Chiefs" className="w-8 h-8" />
                    <span className="text-gray-400 text-sm">vs</span>
                    <img src={billsLogo} alt="Bills" className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-gold-400 transition-colors">Chiefs vs Bills</h3>
                    <p className="text-sm text-gray-400">NFL • Sunday 1:00 PM</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">92%</div>
                  <div className="text-xs text-gray-400">AI Confidence</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-300">Over/Under: 52.5</span>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-gold-400" />
                  <span className="text-gold-400 font-medium">Premium Pick</span>
                </div>
              </div>
              <div className="mt-3 w-full bg-navy-700 rounded-full h-1">
                <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-1 rounded-full w-[92%]"></div>
              </div>
            </motion.div>
          </motion.div>

          {/* ROI Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 border border-gold-500/20 hover:border-gold-400/40 transition-all duration-300 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold-500/20 rounded-lg flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                  <BarChart3 className="w-6 h-6 text-gold-400" />
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-gold-400 transition-colors">ROI Performance</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">Live</span>
              </div>
            </div>
            
            {/* Simple Chart Visualization */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">This Month</span>
                <span className="text-green-400 font-semibold">+24.8%</span>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full w-3/4"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last 3 Months</span>
                <span className="text-green-400 font-semibold">+67.2%</span>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-gold-500 to-gold-400 h-2 rounded-full w-4/5"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-400">All Time</span>
                <span className="text-gold-400 font-semibold">+156.4%</span>
              </div>
              <div className="w-full bg-navy-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full w-full"></div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Analytics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
        >
          <div className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 rounded-xl p-6 border border-gold-500/10 backdrop-blur-sm hover:border-gold-400/30 transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <h4 className="font-semibold text-white group-hover:text-gold-400 transition-colors">Win Rate</h4>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-2">94.2%</div>
            <p className="text-sm text-gray-400">This Month</p>
          </div>

          <div className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 rounded-xl p-6 border border-gold-500/10 backdrop-blur-sm hover:border-gold-400/30 transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gold-500/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-gold-400" />
              </div>
              <h4 className="font-semibold text-white group-hover:text-gold-400 transition-colors">Total Picks</h4>
            </div>
            <div className="text-2xl font-bold text-gold-400 mb-2">2,847</div>
            <p className="text-sm text-gray-400">All Time</p>
          </div>

          <div className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 rounded-xl p-6 border border-gold-500/10 backdrop-blur-sm hover:border-gold-400/30 transition-all duration-300 group">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-400" />
              </div>
              <h4 className="font-semibold text-white group-hover:text-gold-400 transition-colors">Accuracy</h4>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-2">89.7%</div>
            <p className="text-sm text-gray-400">AI Predictions</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AnalyticsSection