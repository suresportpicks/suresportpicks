import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Star, Crown, Zap, Shield, TrendingUp, Users, Clock } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Plans = () => {
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for beginners',
      icon: Zap,
      color: 'from-blue-500 to-cyan-600',
      price: { monthly: 29, yearly: 290 },
      features: [
        '5 picks per week',
        'Basic analytics',
        'Email support',
        'Mobile app access',
        'Win/loss tracking'
      ],
      popular: false
    },
    {
      name: 'Professional',
      description: 'Most popular choice',
      icon: Star,
      color: 'from-gold-500 to-yellow-600',
      price: { monthly: 79, yearly: 790 },
      features: [
        '15 picks per week',
        'Advanced analytics',
        'Priority support',
        'Mobile app access',
        'Detailed analysis',
        'Live chat support',
        'Performance tracking',
        'Custom alerts'
      ],
      popular: true
    },
    {
      name: 'VIP',
      description: 'For serious professionals',
      icon: Crown,
      color: 'from-purple-500 to-violet-600',
      price: { monthly: 149, yearly: 1490 },
      features: [
        'Unlimited picks',
        'Premium analytics',
        '24/7 phone support',
        'Mobile app access',
        'Expert consultation',
        'Private Discord',
        'Early access picks',
        'Personal account manager',
        'Custom strategies',
        'Exclusive webinars'
      ],
      popular: false
    }
  ]

  const testimonials = [
    {
      name: 'Mike Johnson',
      role: 'Professional Bettor',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      quote: 'SureSport Picks transformed my betting strategy. Up 40% this year!',
      plan: 'VIP'
    },
    {
      name: 'Sarah Chen',
      role: 'Sports Enthusiast',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      quote: 'The analytics are incredible. Finally making consistent profits.',
      plan: 'Professional'
    },
    {
      name: 'David Rodriguez',
      role: 'Weekend Warrior',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      quote: 'Started with Starter plan, now I\'m hooked. Great value!',
      plan: 'Starter'
    }
  ]

  const features = [
    {
      icon: TrendingUp,
      title: 'Proven Track Record',
      description: '87% win rate over the past 12 months'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Professional analysts with 10+ years experience'
    },
    {
      icon: Shield,
      title: 'Money Back Guarantee',
      description: '30-day satisfaction guarantee on all plans'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Instant notifications for new picks and updates'
    }
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
            backgroundImage: `url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80')`,
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
                Choose Your Plan
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Join thousands of successful bettors with our proven strategies and expert insights
            </p>
          </motion.div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="bg-navy-800/50 backdrop-blur-sm rounded-lg p-1 border border-gold-500/20">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  billingCycle === 'monthly'
                    ? 'bg-gold-500 text-navy-950'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                  billingCycle === 'yearly'
                    ? 'bg-gold-500 text-navy-950'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Yearly
                <span className="ml-2 px-2 py-1 bg-green-500 text-white text-xs rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative bg-navy-800/50 backdrop-blur-sm rounded-2xl p-8 border transition-all duration-300 ${
                  plan.popular
                    ? 'border-gold-500 scale-105 shadow-2xl shadow-gold-500/20'
                    : 'border-gold-500/20 hover:border-gold-500/40'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 px-6 py-2 rounded-full font-bold text-sm">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price[billingCycle]}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 hover:from-gold-600 hover:to-gold-700 shadow-lg shadow-gold-500/25'
                    : 'bg-navy-700 text-white hover:bg-navy-600 border border-gold-500/20 hover:border-gold-500/40'
                }`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose SureSport Picks?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We provide more than just picks - we deliver a complete winning strategy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 mb-4">
                  <feature.icon className="w-8 h-8 text-navy-950" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">What Our Members Say</h2>
            <p className="text-xl text-gray-300">
              Join thousands of satisfied customers who trust our expertise
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/20"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-white font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                  <span className="ml-auto px-2 py-1 bg-gold-500 text-navy-950 text-xs rounded-full font-semibold">
                    {testimonial.plan}
                  </span>
                </div>
                <p className="text-gray-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-navy-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.'
              },
              {
                question: 'Do you offer a money-back guarantee?',
                answer: 'We offer a 30-day money-back guarantee on all plans. If you\'re not satisfied, we\'ll refund your payment.'
              },
              {
                question: 'How are the picks delivered?',
                answer: 'Picks are delivered through our mobile app, email notifications, and member dashboard in real-time.'
              },
              {
                question: 'What sports do you cover?',
                answer: 'We cover NFL, NBA, MLB, NHL, Soccer, and other major sports with expert analysis and predictions.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-6 border border-gold-500/20"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Plans