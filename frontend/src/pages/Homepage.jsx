import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import AnimatedCounters from '../components/AnimatedCounters'
import HowItWorks from '../components/HowItWorks'
import TestimonialsSection from '../components/TestimonialsSection'
import NewsiteCopy from '../components/NewsiteCopy'
import DynamicHomepageContent from '../components/DynamicHomepageContent'
import ContactForm from '../components/ContactForm'
import Footer from '../components/Footer'

const Homepage = () => {
  return (
    <div className="min-h-screen bg-navy-950 text-white overflow-x-hidden">
      <Navbar />
      
      <main>
        <HeroSection />
        <NewsiteCopy />
        <AnimatedCounters />
        <DynamicHomepageContent />
        <HowItWorks />
        <ContactForm />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  )
}

export default Homepage