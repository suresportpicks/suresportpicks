import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, User, Mail, Phone, MessageSquare } from 'lucide-react'
import axios from 'axios'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: 'plan_request',
    subject: '',
    message: '',
    interestedPlan: '',
    budget: '',
    timeline: '',
    specificRequirements: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await axios.post('/api/homepage/contact', formData)
      setSubmitStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        inquiryType: 'plan_request',
        subject: '',
        message: '',
        interestedPlan: '',
        budget: '',
        timeline: '',
        specificRequirements: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inquiryTypes = [
    { value: 'plan_request', label: 'Plan Request' },
    { value: 'general_inquiry', label: 'General Inquiry' },
    { value: 'support', label: 'Support' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'other', label: 'Other' }
  ]

  const planOptions = [
    { value: 'basic', label: 'Basic Plan' },
    { value: 'premium', label: 'Premium Plan' },
    { value: 'vip', label: 'VIP Plan' },
    { value: 'custom', label: 'Custom Plan' }
  ]

  const timelineOptions = [
    { value: 'immediate', label: 'Immediate' },
    { value: '1-2_weeks', label: '1-2 Weeks' },
    { value: '1_month', label: '1 Month' },
    { value: '2-3_months', label: '2-3 Months' },
    { value: 'flexible', label: 'Flexible' }
  ]

  return (
    <section className="py-20 bg-navy-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-gray-300">
            Ready to get started? Contact us for a personalized plan that fits your needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-navy-800/50 backdrop-blur-sm rounded-2xl p-8 border border-navy-700/50"
        >
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-center"
            >
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <h3 className="text-green-400 font-semibold">Message Sent Successfully!</h3>
                <p className="text-green-300 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center"
            >
              <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
              <div>
                <h3 className="text-red-400 font-semibold">Error Sending Message</h3>
                <p className="text-red-300 text-sm">Please try again or contact us directly.</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    placeholder="John"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Inquiry Type */}
            <div>
              <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-300 mb-2">
                Inquiry Type *
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
              >
                {inquiryTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Plan-specific fields */}
            {formData.inquiryType === 'plan_request' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="interestedPlan" className="block text-sm font-medium text-gray-300 mb-2">
                    Interested Plan
                  </label>
                  <select
                    id="interestedPlan"
                    name="interestedPlan"
                    value={formData.interestedPlan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  >
                    <option value="">Select a plan</option>
                    {planOptions.map(plan => (
                      <option key={plan.value} value={plan.value}>
                        {plan.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <input
                    type="text"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                    placeholder="$100-500/month"
                  />
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-300 mb-2">
                    Timeline
                  </label>
                  <select
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                  >
                    <option value="">Select timeline</option>
                    {timelineOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent"
                placeholder="How can we help you?"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message *
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full pl-10 pr-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                  placeholder="Tell us more about your needs..."
                />
              </div>
            </div>

            {/* Specific Requirements for plan requests */}
            {formData.inquiryType === 'plan_request' && (
              <div>
                <label htmlFor="specificRequirements" className="block text-sm font-medium text-gray-300 mb-2">
                  Specific Requirements
                </label>
                <textarea
                  id="specificRequirements"
                  name="specificRequirements"
                  value={formData.specificRequirements}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-navy-700/50 border border-navy-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent resize-none"
                  placeholder="Any specific features or requirements you need?"
                />
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-gold-400 to-gold-600 text-navy-950 font-bold py-4 px-8 rounded-lg hover:from-gold-500 hover:to-gold-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-navy-950"></div>
              ) : (
                <>
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactForm