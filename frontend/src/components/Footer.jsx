import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Shield, Award, Star, Zap, TrendingUp } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import nflLogo from '../assets/images/nfl-logo.svg'
import nbaLogo from '../assets/images/nba-logo.svg'
import mlbLogo from '../assets/images/mlb-logo.svg'
import mlsLogo from '../assets/images/mls-logo.svg'
import ncaaLogo from '../assets/images/ncaa-logo.svg'
import premierLeagueLogo from '../assets/images/premier-league-logo.svg'

const Footer = () => {
  const paymentLogos = [
    'Visa', 'MasterCard', 'PayPal', 'Bitcoin', 'USDT', 'Binance Pay'
  ]

  const sportsLeagues = [
    { name: 'NFL', logo: nflLogo, description: 'National Football League' },
    { name: 'NBA', logo: nbaLogo, description: 'National Basketball Association' },
    { name: 'MLB', logo: mlbLogo, description: 'Major League Baseball' },
    { name: 'MLS', logo: mlsLogo, description: 'Major League Soccer' },
    { name: 'NCAA', logo: ncaaLogo, description: 'College Sports' },
    { name: 'Premier League', logo: premierLeagueLogo, description: 'English Premier League' }
  ]

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/plans' },
    { name: 'Contact', href: '#contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' }
  ]

  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Youtube, href: '#', name: 'YouTube' }
  ]

  const premiumFeatures = [
    { icon: Shield, text: 'SSL Secure', color: 'text-green-400' },
    { icon: Award, text: 'Verified Data', color: 'text-blue-400' },
    { icon: Star, text: 'Licensed', color: 'text-gold-400' },
    { icon: Zap, text: 'Real-time', color: 'text-purple-400' }
  ]

  return (
    <footer id="contact" className="relative bg-navy-950 border-t border-gold-500/20 overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="footer" intensity="low" />
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gold-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      {/* Sports Leagues Section */}
      <div className="relative border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-2">
              Covering All Major Sports Leagues
            </h3>
            <p className="text-gray-400">
              Professional analytics across the biggest sports organizations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {sportsLeagues.map((league, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="group"
              >
                <div className="bg-gradient-to-br from-navy-800/60 to-navy-900/60 backdrop-blur-xl rounded-xl p-4 border border-gold-500/20 hover:border-gold-500/40 transition-all duration-300 text-center">
                  <img 
                    src={league.logo} 
                    alt={league.name}
                    className="w-12 h-8 mx-auto mb-2 object-contain filter brightness-90 group-hover:brightness-110 transition-all duration-300"
                  />
                  <p className="text-xs text-gray-400 group-hover:text-gold-400 transition-colors">
                    {league.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-gold-400 mr-2" />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                Stay Updated with Winning Picks
              </h3>
              <Star className="w-6 h-6 text-gold-400 ml-2" />
            </div>
            <p className="text-gray-400 mb-8 text-lg">
              Get the latest predictions, analytics, and exclusive offers delivered to your inbox
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-gradient-to-r from-navy-800/80 to-navy-900/80 backdrop-blur-xl border border-gold-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40"
              >
                Subscribe Now
              </motion.button>
            </div>

            {/* Premium Features */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {premiumFeatures.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-center space-x-2 text-sm"
                  >
                    <Icon className={`w-4 h-4 ${feature.color}`} />
                    <span className="text-gray-400">{feature.text}</span>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-navy-950" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  SureSport Picks
                </span>
              </div>
              <p className="text-gray-400 mb-6">
                The most trusted sports analytics platform for data-driven betting decisions.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>support@suresportpicks.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>New York, NY</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-gold-400 transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-gold-400 transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Payment Methods */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-semibold mb-6">Accepted Payment Methods</h4>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {paymentLogos.map((payment, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="bg-navy-800 border border-gold-500/20 rounded-lg p-4 text-center text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition-all duration-200 cursor-pointer"
                  >
                    <span className="text-sm font-medium">{payment}</span>
                  </motion.div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {premiumFeatures.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center justify-center space-x-2 bg-navy-800/30 rounded-lg p-3 border border-gold-500/10 hover:border-gold-500/30 transition-all duration-200"
                    >
                      <Icon className={`w-4 h-4 ${feature.color}`} />
                      <span className="text-gray-400 text-sm font-medium">{feature.text}</span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-gray-400 text-sm mb-4 md:mb-0"
            >
              © 2025 SureSport Picks. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 bg-navy-800 border border-gold-500/20 rounded-lg flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500/40 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                )
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer