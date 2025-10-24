import React, { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { TrendingUp, Users, DollarSign } from 'lucide-react'

const AnimatedCounters = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, threshold: 0.3 })

  const counters = [
    {
      icon: TrendingUp,
      value: 94,
      suffix: '%',
      label: 'Win Rate',
      description: 'Average success rate',
      color: 'text-green-400'
    },
    {
      icon: Users,
      value: 10,
      suffix: 'K+',
      label: 'Subscribers',
      description: 'Active members',
      color: 'text-blue-400'
    },
    {
      icon: DollarSign,
      value: 2.8,
      suffix: 'M',
      label: 'Total Winnings',
      description: 'Member profits',
      color: 'text-gold-400'
    }
  ]

  const AnimatedNumber = ({ value, suffix, isVisible }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = value / steps
      const stepDuration = duration / steps

      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(current)
        }
      }, stepDuration)

      return () => clearInterval(timer)
    }, [value, isVisible])

    return (
      <span>
        {value < 10 ? count.toFixed(1) : Math.floor(count)}
        {suffix}
      </span>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-navy-950 to-navy-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gold-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {counters.map((counter, index) => {
            const Icon = counter.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Icon Background */}
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl flex items-center justify-center border border-gold-500/20 group-hover:border-gold-500/40 transition-all duration-300 shadow-lg shadow-black/20">
                    <Icon className={`w-10 h-10 ${counter.color}`} />
                  </div>

                  {/* Counter */}
                  <motion.div
                    className="text-5xl md:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
                    transition={{ delay: index * 0.2 + 0.5, duration: 0.8, ease: "easeOut" }}
                  >
                    <AnimatedNumber 
                      value={counter.value} 
                      suffix={counter.suffix}
                      isVisible={isInView}
                    />
                  </motion.div>

                  {/* Label */}
                  <h3 className="text-xl font-semibold text-gold-400 mb-2">
                    {counter.label}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm">
                    {counter.description}
                  </p>

                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-gold-500/10 to-primary-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
                    initial={false}
                  />
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom Accent Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent"
        />
      </div>
    </section>
  )
}

export default AnimatedCounters