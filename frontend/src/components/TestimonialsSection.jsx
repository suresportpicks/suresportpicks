import React from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, Trophy, TrendingUp, Target, Award } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import avatarMichael from '../assets/images/avatar-michael.svg'
import avatarSarah from '../assets/images/avatar-sarah.svg'
import avatarDavid from '../assets/images/avatar-david.svg'
import espnLogo from '../assets/images/espn-logo.svg'
import siLogo from '../assets/images/si-logo.svg'
import athleticLogo from '../assets/images/athletic-logo.svg'
import bleacherLogo from '../assets/images/bleacher-logo.svg'

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Michael Rodriguez',
      role: 'Professional Bettor',
      avatar: avatarMichael,
      rating: 5,
      text: 'SureSport Picks transformed my betting strategy. The AI predictions are incredibly accurate, and I\'ve seen a 40% increase in my ROI since joining.',
      highlight: '+40% ROI',
      location: 'Las Vegas, NV',
      verified: true
    },
    {
      name: 'Sarah Chen',
      role: 'Sports Analyst',
      avatar: avatarSarah,
      rating: 5,
      text: 'The data analysis is top-notch. As someone who works in sports analytics, I can appreciate the depth and accuracy of their predictive models.',
      highlight: '94% Accuracy',
      location: 'New York, NY',
      verified: true
    },
    {
      name: 'David Thompson',
      role: 'Casual Bettor',
      avatar: avatarDavid,
      rating: 5,
      text: 'I was skeptical at first, but the results speak for themselves. Three months in and I\'m up 60%. The picks are consistent and reliable.',
      highlight: '+60% Profit',
      location: 'Chicago, IL',
      verified: true
    }
  ]

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-navy-900 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="section" intensity="medium" />
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-32 h-32 sm:w-40 sm:h-40 bg-gold-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-60 sm:h-60 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            What Our Members Say
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto px-4">
            Join thousands of satisfied bettors who trust our predictions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-4 sm:p-6 lg:p-8 border border-gold-500/20 relative hover:border-gold-500/40 transition-all duration-300 group hover:scale-105 hover:shadow-2xl hover:shadow-gold-500/10"
              whileHover={{ y: -5 }}
            >
              <Quote className="absolute top-4 right-4 sm:top-6 sm:right-6 w-6 h-6 sm:w-8 sm:h-8 text-gold-500/30 group-hover:text-gold-500/50 transition-colors" />
              
              {/* Verified Badge */}
              {testimonial.verified && (
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
                  <Award className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Verified</span>
                </div>
              )}
              
              <div className="flex items-center mb-4 sm:mb-6 mt-6 sm:mt-8">
                <div className="relative mr-3 sm:mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-gold-500/30 group-hover:border-gold-500/50 transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-navy-800 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                    <h4 className="font-semibold text-white group-hover:text-gold-400 transition-colors text-sm sm:text-base truncate">{testimonial.name}</h4>
                    <div className="px-2 py-1 bg-gold-500/20 rounded-full mt-1 sm:mt-0 self-start">
                      <span className="text-xs text-gold-400 font-medium">{testimonial.highlight}</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm">{testimonial.role}</p>
                  <p className="text-gray-500 text-xs">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400 fill-current" />
                ))}
                <span className="ml-2 text-xs sm:text-sm text-gray-400">({testimonial.rating}.0)</span>
              </div>

              <p className="text-gray-300 leading-relaxed italic text-sm sm:text-base">"{testimonial.text}"</p>
              
              {/* Performance Indicator */}
              <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gold-500/10">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-400">Member since</span>
                  <span className="text-gold-400 font-medium">2023</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured In Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 lg:mt-20 text-center"
        >
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400 mr-2 sm:mr-3" />
            <h3 className="text-xl sm:text-2xl font-bold text-white">Featured In</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-center justify-items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="transition-transform duration-300">
              <img src={espnLogo} alt="ESPN" className="h-8 sm:h-10 lg:h-12 w-auto" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="transition-transform duration-300">
              <img src={siLogo} alt="Sports Illustrated" className="h-8 sm:h-10 lg:h-12 w-auto" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="transition-transform duration-300">
              <img src={athleticLogo} alt="The Athletic" className="h-8 sm:h-10 lg:h-12 w-auto" />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} className="transition-transform duration-300">
              <img src={bleacherLogo} alt="Bleacher Report" className="h-8 sm:h-10 lg:h-12 w-auto" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TestimonialsSection