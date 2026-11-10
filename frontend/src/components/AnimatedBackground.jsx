import React from 'react'
import { motion } from 'framer-motion'

const AnimatedBackground = ({ variant = 'default', intensity = 'medium' }) => {
  const getParticleCount = () => {
    switch (intensity) {
      case 'low': return 10
      case 'medium': return 15
      case 'high': return 25
      default: return 15
    }
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Background Blur Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl"></div>
      
      {/* Simple Floating Particles */}
      {Array.from({ length: getParticleCount() }).map((_, index) => (
        <motion.div
          key={`particle-${index}`}
          className="absolute w-1 h-1 bg-gold-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  )
}

export default AnimatedBackground