import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Shield, Clock, Star, Award, Zap, 
  ArrowRight, CheckCircle, Users, TrendingUp 
} from 'lucide-react'
import axios from 'axios'

const DynamicHomepageContent = () => {
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomepageContent()
  }, [])

  const fetchHomepageContent = async () => {
    try {
      const response = await axios.get('/api/homepage/content')
      setContent(response.data)
    } catch (error) {
      console.error('Error fetching homepage content:', error)
      // Set default content if API fails
      setContent(getDefaultContent())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultContent = () => ({
    sections: [
      {
        title: 'Expert Analysis',
        subtitle: 'Data-Driven Insights',
        content: 'Our team of experts provides comprehensive analysis using advanced statistical models and real-time data.',
        order: 1,
        enabled: true
      }
    ],
    features: {
      title: 'Why Choose Us',
      subtitle: 'Discover what makes us different',
      items: [
        {
          icon: 'BarChart3',
          title: 'Advanced Analytics',
          description: 'Cutting-edge statistical analysis and data modeling',
          enabled: true
        }
      ],
      enabled: true
    },
    about: {
      title: 'About SureSport Picks',
      content: 'We provide comprehensive sports analysis and insights.',
      enabled: true
    }
  })

  const getIcon = (iconName) => {
    const icons = {
      BarChart3,
      Shield,
      Clock,
      Star,
      Award,
      Zap,
      CheckCircle,
      Users,
      TrendingUp
    }
    return icons[iconName] || BarChart3
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gold-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-20">
      {/* Dynamic Sections */}
      {content?.sections?.filter(section => section.enabled).map((section, index) => (
        <motion.section
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.2 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {section.title}
              </motion.h2>
              {section.subtitle && (
                <motion.p 
                  className="text-xl text-gray-300 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  {section.subtitle}
                </motion.p>
              )}
              <motion.div 
                className="prose prose-lg prose-invert mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
              {section.imageUrl && (
                <motion.div 
                  className="mt-12"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={section.imageUrl} 
                    alt={section.title}
                    className="mx-auto rounded-lg shadow-2xl max-w-4xl w-full"
                  />
                </motion.div>
              )}
              {section.buttonText && section.buttonLink && (
                <motion.div 
                  className="mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={section.buttonLink}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-bold rounded-lg hover:from-gold-500 hover:to-gold-700 transition-all duration-300 transform hover:scale-105"
                  >
                    {section.buttonText}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      ))}

      {/* Features Section */}
      {content?.features?.enabled && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20 bg-navy-900/50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {content.features.title}
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {content.features.subtitle}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {content.features.items?.filter(item => item.enabled).map((feature, index) => {
                const IconComponent = getIcon(feature.icon)
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-navy-800/50 backdrop-blur-sm rounded-xl p-8 border border-navy-700/50 hover:border-gold-400/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gold-400 to-gold-600 rounded-lg mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="h-8 w-8 text-navy-950" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gold-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </motion.section>
      )}

      {/* About Section */}
      {content?.about?.enabled && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-20"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  {content.about.title}
                </h2>
                <div 
                  className="prose prose-lg prose-invert"
                  dangerouslySetInnerHTML={{ __html: content.about.content }}
                />
              </motion.div>
              {content.about.imageUrl && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <img 
                    src={content.about.imageUrl} 
                    alt={content.about.title}
                    className="rounded-lg shadow-2xl w-full"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  )
}

export default DynamicHomepageContent