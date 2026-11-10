import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, Users, FileText } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Privacy = () => {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: [
        'Personal information you provide when creating an account (name, email, phone number)',
        'Payment information for subscription processing',
        'Usage data and analytics to improve our services',
        'Device information and IP addresses for security purposes',
        'Communication preferences and support interactions'
      ]
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'Provide and maintain our sports analytics services',
        'Process payments and manage subscriptions',
        'Send important updates and notifications',
        'Improve our algorithms and user experience',
        'Comply with legal obligations and prevent fraud'
      ]
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        'We do not sell your personal information to third parties',
        'Payment processors for subscription management',
        'Analytics providers for service improvement (anonymized data)',
        'Legal authorities when required by law',
        'Service providers who assist in our operations (under strict confidentiality)'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'Industry-standard encryption for all data transmission',
        'Secure servers with regular security audits',
        'Limited access to personal information on a need-to-know basis',
        'Regular security training for all employees',
        'Incident response procedures for any security breaches'
      ]
    },
    {
      icon: FileText,
      title: 'Your Rights',
      content: [
        'Access and review your personal information',
        'Request corrections to inaccurate data',
        'Delete your account and associated data',
        'Opt-out of marketing communications',
        'Data portability for your information'
      ]
    },
    {
      icon: Shield,
      title: 'Data Retention',
      content: [
        'Account information retained while your account is active',
        'Payment records kept for 7 years for tax and legal purposes',
        'Usage analytics anonymized after 2 years',
        'Support communications deleted after 3 years',
        'Marketing data removed immediately upon opt-out'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-950 to-black"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-16 h-16 text-gold-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  Privacy
                </span>
                <span className="text-white"> Policy</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your personal information.
            </p>
            <div className="mt-6 text-sm text-gray-400">
              Last updated: January 2025
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-navy-800/50 rounded-2xl p-8 border border-gold-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-gray-300 leading-relaxed">
              SureSport Picks ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your 
              information when you use our sports analytics platform and services. Please read 
              this privacy policy carefully. If you do not agree with the terms of this privacy 
              policy, please do not access the site or use our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Privacy Sections */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sections.map((section, index) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-navy-800/50 rounded-2xl p-6 border border-gold-500/20"
                >
                  <div className="flex items-center mb-4">
                    <Icon className="w-8 h-8 text-gold-400 mr-3" />
                    <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Cookies Section */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-navy-800/50 rounded-2xl p-8 border border-gold-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We use cookies and similar tracking technologies to enhance your experience on our platform:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Essential Cookies:</strong> Required for basic site functionality</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Analytics Cookies:</strong> Help us understand how you use our site</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span><strong>Preference Cookies:</strong> Remember your settings and preferences</span>
                </li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences, though disabling 
                certain cookies may affect site functionality.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-gold-500/10 to-gold-600/10 rounded-2xl p-8 border border-gold-500/20 text-center"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Questions About Privacy?</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about this Privacy Policy or our data practices, 
              please don't hesitate to contact us.
            </p>
            <div className="space-y-2 text-gray-300">
              <p><strong>Email:</strong> privacy@suresportpicks.com</p>
              <p><strong>Address:</strong> 123 Privacy Street, New York, NY 10001</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Updates Section */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-navy-800/50 rounded-2xl p-8 border border-gold-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our 
              practices or for other operational, legal, or regulatory reasons. We will notify 
              you of any material changes by posting the new Privacy Policy on this page and 
              updating the "Last updated" date. We encourage you to review this Privacy Policy 
              periodically to stay informed about how we protect your information.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Privacy