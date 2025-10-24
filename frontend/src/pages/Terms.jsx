import React from 'react'
import { motion } from 'framer-motion'
import { FileText, Scale, AlertTriangle, Users, CreditCard, Shield } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Terms = () => {
  const sections = [
    {
      icon: Users,
      title: 'User Accounts',
      content: [
        'You must be 18 years or older to create an account',
        'Provide accurate and complete information during registration',
        'Maintain the security of your account credentials',
        'You are responsible for all activities under your account',
        'Notify us immediately of any unauthorized access'
      ]
    },
    {
      icon: CreditCard,
      title: 'Subscription & Payments',
      content: [
        'Subscription fees are billed in advance on a recurring basis',
        'All payments are non-refundable except as required by law',
        'We reserve the right to change pricing with 30 days notice',
        'Failed payments may result in service suspension',
        'Cancellation takes effect at the end of the current billing period'
      ]
    },
    {
      icon: FileText,
      title: 'Service Usage',
      content: [
        'Use our services only for lawful purposes',
        'Do not share your account with others',
        'Respect intellectual property rights',
        'Do not attempt to reverse engineer our algorithms',
        'Report any bugs or security vulnerabilities responsibly'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Prohibited Activities',
      content: [
        'Creating multiple accounts to circumvent limitations',
        'Using automated tools to access our services',
        'Attempting to hack or compromise our systems',
        'Sharing copyrighted content without permission',
        'Engaging in any illegal or fraudulent activities'
      ]
    },
    {
      icon: Shield,
      title: 'Disclaimers',
      content: [
        'Sports predictions are for entertainment purposes only',
        'Past performance does not guarantee future results',
        'We are not responsible for gambling losses',
        'Services provided "as is" without warranties',
        'Use our analytics at your own risk and discretion'
      ]
    },
    {
      icon: Scale,
      title: 'Limitation of Liability',
      content: [
        'Our liability is limited to the amount you paid for services',
        'We are not liable for indirect or consequential damages',
        'Force majeure events excuse performance delays',
        'Some jurisdictions may not allow liability limitations',
        'These limitations apply to the fullest extent permitted by law'
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
              <Scale className="w-16 h-16 text-gold-400 mr-4" />
              <h1 className="text-5xl md:text-7xl font-bold">
                <span className="bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  Terms
                </span>
                <span className="text-white"> of Service</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Please read these terms carefully before using our sports analytics platform. 
              By using our services, you agree to these terms.
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
            <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              These Terms of Service ("Terms") govern your use of SureSport Picks' website, 
              mobile application, and related services (collectively, the "Service"). By accessing 
              or using our Service, you agree to be bound by these Terms. If you disagree with 
              any part of these terms, then you may not access the Service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
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

      {/* Intellectual Property */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-navy-800/50 rounded-2xl p-8 border border-gold-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property Rights</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                The Service and its original content, features, and functionality are and will remain 
                the exclusive property of SureSport Picks and its licensors. The Service is protected 
                by copyright, trademark, and other laws.
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Our trademarks and trade dress may not be used without permission</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>You may not copy, modify, or distribute our proprietary algorithms</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-gold-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>All data and analytics remain our intellectual property</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Termination */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-navy-800/50 rounded-2xl p-8 border border-gold-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, 
                without prior notice or liability, under our sole discretion, for any reason whatsoever 
                and without limitation, including but not limited to a breach of the Terms.
              </p>
              <p>
                If you wish to terminate your account, you may simply discontinue using the Service 
                or contact us to request account deletion. Upon termination, your right to use the 
                Service will cease immediately.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Governing Law */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-navy-800/50 rounded-2xl p-8 border border-gold-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Governing Law & Disputes</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                These Terms shall be interpreted and governed by the laws of the State of New York, 
                without regard to its conflict of law provisions. Any disputes arising from these 
                Terms or your use of the Service will be resolved through binding arbitration.
              </p>
              <p>
                You agree to first attempt to resolve any dispute through good faith negotiations. 
                If unsuccessful, disputes will be settled by arbitration in accordance with the 
                rules of the American Arbitration Association.
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
            <h2 className="text-2xl font-bold text-white mb-4">Questions About These Terms?</h2>
            <p className="text-gray-300 mb-6">
              If you have any questions about these Terms of Service, please contact us.
            </p>
            <div className="space-y-2 text-gray-300">
              <p><strong>Email:</strong> legal@suresportpicks.com</p>
              <p><strong>Address:</strong> 123 Legal Street, New York, NY 10001</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Changes Section */}
      <section className="py-16 bg-navy-900/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-navy-800/50 rounded-2xl p-8 border border-gold-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
            <p className="text-gray-300 leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision 
              is material, we will provide at least 30 days notice prior to any new terms taking 
              effect. What constitutes a material change will be determined at our sole discretion. 
              By continuing to access or use our Service after any revisions become effective, 
              you agree to be bound by the revised terms.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Terms