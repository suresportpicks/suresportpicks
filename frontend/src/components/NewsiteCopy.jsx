import React from 'react'
import { motion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground'
import { UserPlus, CreditCard, Trophy, MessageSquare } from 'lucide-react'

const NewsiteCopy = () => {
  const steps = [
    {
      title: 'Create your free account',
      description: 'Sign up in minutes to access your dashboard and get started.',
      Icon: UserPlus,
    },
    {
      title: 'Choose your VIP plan',
      description: 'Pick the plan that fits your betting style — Free, Silver, or Gold.',
      Icon: CreditCard,
    },
    {
      title: 'Start winning with science',
      description: 'Follow expert picks backed by AI models and predictive analytics.',
      Icon: Trophy,
    },
  ]

  return (
    <section id="welcome" className="relative py-20 bg-gradient-to-b from-navy-950 to-navy-900 overflow-hidden">
      <AnimatedBackground variant="section" intensity="medium" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white via-gold-300 to-gold-500 bg-clip-text text-transparent">
            SureSport Picks
          </h2>
          <p className="mt-4 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Top-tier sports picks, predictive analytics, and a multi-functional app designed for results.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map(({ title, description, Icon }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-navy-800/50 border border-gold-500/20 backdrop-blur-xl p-6 hover:border-gold-500/40 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mb-4 shadow-lg">
                <Icon className="w-6 h-6 text-navy-950" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-300 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl bg-gradient-to-br from-navy-800/60 to-navy-900/60 border border-gold-500/20 p-8"
        >
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold-500 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-navy-950" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white">We provide utility</h3>
              <p className="mt-2 text-gray-300">
                Dedicated live chat assistance, guided onboarding, and a seamless experience across devices — all to make betting smarter and easier.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <h4 className="text-xl md:text-2xl font-semibold text-gray-200 mb-6">Ready to take the first step?</h4>
          <a
            href="#plans"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-navy-950 font-bold shadow-lg transition"
          >
            Join VIP Now
          </a>
        </motion.div>
      </div>
    </section>
  )
}

export default NewsiteCopy