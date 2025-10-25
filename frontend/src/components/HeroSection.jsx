import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import AnimatedBackground from './AnimatedBackground'
import basketballHeroVideo from '../assets/videos/basketball-hero.mp4'
import axios from 'axios'

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const [maskVisible, setMaskVisible] = useState(true)
  const [heroContent, setHeroContent] = useState({
    title: 'Welcome to SureSport Picks',
    subtitle: 'Your trusted source for sports insights',
    description: 'Get expert analysis and data-driven insights to make informed decisions.',
    ctaText: 'Get Started',
    ctaLink: '/register'
  })

  useEffect(() => {
    if (isVideoLoaded) {
      const t = setTimeout(() => setMaskVisible(false), 800)
      return () => clearTimeout(t)
    }
  }, [isVideoLoaded])

  useEffect(() => {
    fetchHeroContent()
  }, [])

  const fetchHeroContent = async () => {
    try {
      const response = await axios.get('/api/homepage/content')
      if (response.data?.hero) {
        setHeroContent(response.data.hero)
      }
    } catch (error) {
      console.error('Error fetching hero content:', error)
      // Keep default content if API fails
    }
  }

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="hero" intensity="high" />
      
      {/* Basketball Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Fallback gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        
        {/* Background video */}
        {!useFallback ? (
          <video
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            src={basketballHeroVideo}
            autoPlay
            muted
            loop
            playsInline
            onCanPlay={() => setIsVideoLoaded(true)}
            onError={() => setUseFallback(true)}
            style={{ objectFit: 'cover', width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.78vh' }}
          />
        ) : (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <iframe
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.78vh' }}
              src="https://www.youtube.com/embed/EYEHUOpwNvE?autoplay=1&mute=1&loop=1&playlist=EYEHUOpwNvE&controls=0&modestbranding=1&showinfo=0&rel=0&playsinline=1"
              title="Hero Background Video"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen={false}
              onLoad={() => setIsVideoLoaded(true)}
            />
          </div>
        )}

        {/* Optional intro mask for YouTube fallback only */}
         {maskVisible && useFallback && (
           <div className="absolute inset-0 bg-black/50 z-30 transition-opacity duration-300" />
         )}
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Main Title */}
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
              {heroContent.title.split(' ').slice(0, 2).join(' ')}
            </span>
            <br className="hidden sm:block" />
            <span className="text-white">
              {heroContent.title.split(' ').slice(2).join(' ')}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {heroContent.subtitle}
          </motion.p>

          {/* Description */}
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            {heroContent.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center pt-4 sm:pt-8 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            {/* Primary CTA */}
            <a
              href={heroContent.ctaLink}
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-bold text-base sm:text-lg rounded-lg hover:from-gold-500 hover:to-gold-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[200px]"
            >
              {heroContent.ctaText}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </a>

            {/* Secondary CTA */}
            <a
              href="/how-it-works"
              className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white/30 text-white font-semibold text-base sm:text-lg rounded-lg hover:border-gold-400 hover:bg-gold-400/10 transition-all duration-300 backdrop-blur-sm w-full sm:w-auto min-w-[200px]"
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              How It Works
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-white/70 text-sm font-medium">Scroll to explore</span>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1 h-3 bg-white/70 rounded-full mt-2"
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroSection