import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CreditCard, Shield, CheckCircle } from 'lucide-react'

const PaymentModal = ({ isOpen, onClose, selectedPlan }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    plan: selectedPlan?.name || '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({ name: '', email: '', plan: '', message: '' })
        onClose()
      }, 3000)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 max-w-md w-full relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Subscribe to {selectedPlan?.name}
                </h2>
                <p className="text-slate-400">
                  Complete your subscription request
                </p>
              </div>

              {/* Plan Details */}
              {selectedPlan && (
                <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{selectedPlan.name} Plan</span>
                    <span className="text-amber-400 font-bold">{selectedPlan.price}</span>
                  </div>
                  <p className="text-slate-400 text-sm mt-1">{selectedPlan.description}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Selected Plan
                  </label>
                  <input
                    type="text"
                    name="plan"
                    value={formData.plan}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="Plan name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                    placeholder="Any additional information..."
                  />
                </div>

                {/* Security Notice */}
                <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-800/30 rounded-lg p-3">
                  <Shield size={16} className="text-green-400" />
                  <span>Your information is secure and encrypted</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Send Payment Request'
                  )}
                </button>
              </form>

              {/* Payment Info */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400">
                  You will receive payment instructions via email within 24 hours
                </p>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Request Sent!
              </h2>
              <p className="text-slate-400 mb-4">
                Your subscription request has been sent to our team. You'll receive payment instructions via email within 24 hours.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-4">
                <p className="text-sm text-slate-300">
                  <strong>Next Steps:</strong><br />
                  1. Check your email for payment instructions<br />
                  2. Complete the payment process<br />
                  3. Your account will be upgraded automatically
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PaymentModal