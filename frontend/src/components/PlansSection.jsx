import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Zap, Shield, Sparkles, Award } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import PaymentModal from './PaymentModal'
import premiumSportsBg from '../assets/images/premium-sports-bg.svg'
import vipCrown from '../assets/images/vip-crown.svg'
import silverBadge from '../assets/images/silver-badge.svg'

const PlansSection = () => {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const plans = [
    {
      name: 'Free',
      price: 0,
      period: 'forever',
      icon: Shield,
      description: 'Get started with basic picks',
      features: [
        '3 picks per week',
        'Basic analytics',
        'Email support',
        'Mobile app access',
        'Community access'
      ],
      buttonText: 'Get Started',
      popular: false,
      gradient: 'from-gray-600 to-gray-700',
      badge: null,
      stats: { winRate: '78%', picks: '12/week', support: 'Email' }
    },
    {
      name: 'Silver',
      price: 10,
      period: 'month',
      icon: Sparkles,
      description: 'Perfect for casual bettors',
      features: [
        'Daily picks (5-7 per day)',
        'Advanced analytics dashboard',
        'Live chat support',
        'Mobile app access',
        'Win/loss tracking',
        'Basic AI insights',
        'SMS notifications'
      ],
      buttonText: 'Subscribe Now',
      popular: true,
      gradient: 'from-blue-500 to-blue-600',
      badge: silverBadge,
      stats: { winRate: '87%', picks: '35/week', support: 'Live Chat' }
    },
    {
      name: 'Gold',
      price: 50,
      period: 'month',
      icon: Award,
      description: 'For serious professionals',
      features: [
        'All Silver features',
        'VIP picks (10+ daily)',
        'Real-time notifications',
        'Priority support (24/7)',
        'Advanced AI models',
        'Custom strategies',
        'ROI optimization tools',
        'Exclusive webinars',
        'Personal betting advisor'
      ],
      buttonText: 'Go Premium',
      popular: false,
      gradient: 'from-gold-500 to-gold-600',
      badge: vipCrown,
      stats: { winRate: '94%', picks: '70/week', support: '24/7 VIP' }
    }
  ]

  return (
    <section id="plans" className="py-20 bg-gradient-to-b from-navy-950 to-navy-900 relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="section" intensity="high" />
      
      {/* Premium Sports Background */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src={premiumSportsBg} 
          alt="Premium Sports Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-gold-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
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
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Select the perfect plan for your betting strategy and start winning today
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative bg-gradient-to-br from-navy-800/60 to-navy-900/60 backdrop-blur-xl rounded-3xl p-8 border transition-all duration-300 group ${
                  plan.popular 
                    ? 'border-gold-500/50 shadow-2xl shadow-gold-500/20 lg:scale-105' 
                    : 'border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Premium Badge */}
                {plan.badge && (
                  <div className="absolute -top-6 -right-6 w-16 h-16 z-10">
                    <img src={plan.badge} alt={`${plan.name} badge`} className="w-full h-full object-contain" />
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${plan.gradient} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-gold-400 transition-colors">{plan.name}</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-white">${plan.price}</span>
                    {plan.price > 0 && <span className="text-gray-400 text-lg">/{plan.period}</span>}
                  </div>

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-navy-800/30 rounded-xl border border-gold-500/10">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">{plan.stats.winRate}</div>
                      <div className="text-xs text-gray-400">Win Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-400">{plan.stats.picks}</div>
                      <div className="text-xs text-gray-400">Picks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gold-400">{plan.stats.support}</div>
                      <div className="text-xs text-gray-400">Support</div>
                    </div>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-green-400" />
                      </div>
                      <span className="text-gray-300 leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedPlan(plan)
                    setIsModalOpen(true)
                  }}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                    plan.popular
                      ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 shadow-gold-500/25 hover:shadow-gold-500/40'
                      : plan.name === 'Gold'
                      ? 'bg-gradient-to-r from-gold-500/80 to-gold-600/80 hover:from-gold-500 hover:to-gold-600 text-white shadow-gold-500/20 hover:shadow-gold-500/30'
                      : 'bg-navy-700 hover:bg-navy-600 text-white border border-gold-500/30 hover:border-gold-500/50'
                  }`}
                >
                  {plan.buttonText}
                </motion.button>
              </motion.div>
            )
          })}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">Trusted by 10,000+ bettors worldwide</p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="text-gray-500 font-semibold">SSL Secured</div>
            <div className="text-gray-500 font-semibold">Money Back Guarantee</div>
            <div className="text-gray-500 font-semibold">24/7 Support</div>
          </div>
        </motion.div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  )
}

export default PlansSection