import React, { useState, useEffect } from 'react'
import AnimatedBackground from './AnimatedBackground'
import basketballHeroVideo from '../assets/videos/basketball-hero.mp4'

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [useFallback, setUseFallback] = useState(false)
  const [maskVisible, setMaskVisible] = useState(true)

  useEffect(() => {
    if (isVideoLoaded) {
      const t = setTimeout(() => setMaskVisible(false), 800)
      return () => clearTimeout(t)
    }
  }, [isVideoLoaded])

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



    </section>
  )
}

export default HeroSection