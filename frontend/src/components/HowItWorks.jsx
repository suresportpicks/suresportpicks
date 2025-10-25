import React from 'react'
import { motion } from 'framer-motion'
import { Search, CreditCard, Trophy, BarChart3, Users, Target } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import basketballAction from '../assets/images/basketball-action.svg'
import footballAction from '../assets/images/football-action.svg'
import soccerAction from '../assets/images/soccer-action.svg'

const HowItWorks = () => {
  const steps = [
    {
      icon: BarChart3,
      title: 'Analyze',
      description: 'Our AI analyzes thousands of data points from live games to identify winning opportunities',
      image: basketballAction,
      stats: ['87% Accuracy', '10K+ Data Points', 'Real-time Analysis']
    },
    {
      icon: Users,
      title: 'Subscribe',
      description: 'Join thousands of winning bettors with our premium subscription plans',
      image: footballAction,
      stats: ['Premium Access', 'Live Predictions', 'Expert Analysis']
    },
    {
      icon: Target,
      title: 'Win',
      description: 'Follow our expert predictions and watch your profits grow consistently',
      image: soccerAction,
      stats: ['92% Win Rate', '+$250 Avg Profit', 'Proven Results']
    }
  ]

  return (
    <section id="how-it-works" className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-navy-900 to-navy-950 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="section" intensity="medium" />
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-24 h-24 sm:w-32 sm:h-32 bg-gold-500/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-32 h-32 sm:w-40 sm:h-40 bg-blue-500/5 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-gradient-to-r from-gold-500/3 to-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-tight">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4">
            Three simple steps to start winning with data-driven predictions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-navy-800/50 to-navy-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-navy-700/50 hover:border-gold-500/30 transition-all duration-300 h-full">
                  {/* Sports Action Image */}
                  <div className="relative mb-6 sm:mb-8 overflow-hidden rounded-xl">
                    <img 
                      src={step.image} 
                      alt={`${step.title} illustration`}
                      className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 to-transparent"></div>
                    
                    {/* Step Number Overlay */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gold-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-navy-950 font-bold text-base sm:text-lg">{index + 1}</span>
                    </div>
                  </div>

                  {/* Icon and Title */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/25 group-hover:shadow-gold-500/40 transition-all duration-300 mb-3 sm:mb-4">
                      <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-navy-950" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{step.description}</p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2">
                    {step.stats.map((stat, statIndex) => (
                      <div key={statIndex} className="flex items-center justify-center">
                        <div className="w-2 h-2 bg-gold-500 rounded-full mr-3 flex-shrink-0"></div>
                        <span className="text-sm text-gray-300 text-center">{stat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Connection Lines - Hidden on mobile and tablet */}
        <div className="hidden xl:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl">
          <svg className="w-full h-4" viewBox="0 0 800 20">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#FFD700" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#FFD700" stopOpacity="0.3"/>
              </linearGradient>
            </defs>
            <path d="M 100 10 Q 400 5 700 10" stroke="url(#connectionGradient)" strokeWidth="2" fill="none" strokeDasharray="5,5">
              <animate attributeName="stroke-dashoffset" values="0;10" dur="2s" repeatCount="indefinite"/>
            </path>
          </svg>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks