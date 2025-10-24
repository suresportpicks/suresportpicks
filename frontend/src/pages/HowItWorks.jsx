import React from 'react'
import { motion } from 'framer-motion'
import { 
  UserPlus, 
  Search, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Shield, 
  Clock, 
  Target,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      icon: UserPlus,
      title: 'Sign Up & Choose Plan',
      description: 'Create your account and select the plan that fits your betting style and budget.',
      details: [
        'Quick 2-minute registration',
        'Choose from Starter, Professional, or VIP plans',
        'Instant access to your dashboard',
        '30-day money-back guarantee'
      ]
    },
    {
      step: 2,
      icon: Search,
      title: 'Receive Expert Picks',
      description: 'Get daily picks from our team of professional sports analysts with detailed reasoning.',
      details: [
        'Daily picks delivered to your dashboard',
        'Detailed analysis for each pick',
        'Real-time notifications',
        'Multiple sports coverage'
      ]
    },
    {
      step: 3,
      icon: TrendingUp,
      title: 'Track Performance',
      description: 'Monitor your wins, losses, and overall performance with our advanced analytics.',
      details: [
        'Real-time win/loss tracking',
        'Performance analytics dashboard',
        'ROI calculations',
        'Historical data analysis'
      ]
    },
    {
      step: 4,
      icon: DollarSign,
      title: 'Maximize Profits',
      description: 'Use our proven strategies and bankroll management to consistently grow your profits.',
      details: [
        'Bankroll management guidance',
        'Risk assessment tools',
        'Profit optimization strategies',
        'Long-term success planning'
      ]
    }
  ]

  const features = [
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep statistical analysis using machine learning and historical data to identify winning opportunities.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Shield,
      title: 'Proven Track Record',
      description: 'Our experts have a documented 87% win rate over the past 12 months across all major sports.',
      image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Get instant notifications for new picks, line movements, and important game updates.',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Target,
      title: 'Precision Targeting',
      description: 'Our AI-powered system identifies the most profitable betting opportunities with surgical precision.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ]

  const testimonials = [
    {
      name: 'Alex Thompson',
      role: 'Professional Bettor',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      quote: 'The step-by-step approach made it easy to understand. I went from losing money to consistent profits in just 3 months.',
      results: '+$15,000 profit'
    },
    {
      name: 'Maria Garcia',
      role: 'Sports Enthusiast',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      quote: 'The analytics dashboard is incredible. I can see exactly why each pick was made and track my progress.',
      results: '78% win rate'
    },
    {
      name: 'James Wilson',
      role: 'Weekend Warrior',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80',
      quote: 'Simple process, amazing results. The bankroll management tips alone were worth the subscription.',
      results: '+$8,500 profit'
    }
  ]

  const stats = [
    { number: '87%', label: 'Win Rate', description: 'Average across all sports' },
    { number: '10K+', label: 'Active Members', description: 'Growing community' },
    { number: '$2.5M+', label: 'Member Profits', description: 'Total winnings this year' },
    { number: '24/7', label: 'Support', description: 'Always here to help' }
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
            backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
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
                How It Works
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Our proven 4-step system has helped thousands of bettors turn their passion into profit
            </p>
            <div className="flex justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all duration-200 shadow-lg shadow-gold-500/25">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo Video
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gold-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-lg font-semibold text-white mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple Steps to Success
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Follow our proven methodology and start winning today
            </p>
          </motion.div>

          <div className="space-y-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gold-500 to-gold-600 rounded-full mr-4">
                      <step.icon className="w-8 h-8 text-navy-950" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gold-400 mb-1">
                        STEP {step.step}
                      </div>
                      <h3 className="text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-lg text-gray-300 mb-6">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-gold-600/20 rounded-2xl blur-xl"></div>
                    <div className="relative bg-navy-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gold-500/20">
                      <div className="text-6xl font-bold text-gold-400 mb-4">
                        {step.step}
                      </div>
                      <div className="text-lg text-gray-300">
                        {step.title}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Advanced technology meets expert analysis for unmatched results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600">
                      <feature.icon className="w-6 h-6 text-navy-950" />
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-300">
              Real results from real members
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gold-500/20"
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
                </div>
                
                <p className="text-gray-300 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-bold">
                    {testimonial.results}
                  </span>
                  <div className="flex text-gold-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold-500/10 to-gold-600/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Start Winning?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of successful bettors and start your profitable journey today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all duration-200 shadow-lg shadow-gold-500/25">
                Get Started Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-navy-800 text-white font-bold rounded-lg hover:bg-navy-700 transition-all duration-200 border border-gold-500/20">
                View Plans
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default HowItWorks