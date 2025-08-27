import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { contactAPI } from '../api/authAPI'
import toast from 'react-hot-toast'
import { Send, User, Mail, MessageSquare, Sparkles } from 'lucide-react'

function Contactus() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await contactAPI.submitMessage(formData)
      
      if (response.data.success) {
        toast.success('Message sent successfully!')
        setFormData({ name: '', email: '', message: '' })
      } else {
        toast.error(response.data.message || 'Failed to send message')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const floatingElements = Array.from({ length: 6 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
      animate={{
        x: [0, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, 0],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {floatingElements}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-lg mx-auto relative z-10"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 md:p-10"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-10">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Get In Touch
            </h1>
            <p className="text-gray-300 text-lg">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-3">
                Full Name
              </label>
              <div className="relative">
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  animate={{ 
                    scale: focusedField === 'name' ? 1.1 : 1,
                    color: focusedField === 'name' ? '#8b5cf6' : '#9ca3af'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <User className="w-5 h-5" />
                </motion.div>
                <motion.input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField('')}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="Enter your full name"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-3">
                Email Address
              </label>
              <div className="relative">
                <motion.div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2"
                  animate={{ 
                    scale: focusedField === 'email' ? 1.1 : 1,
                    color: focusedField === 'email' ? '#8b5cf6' : '#9ca3af'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="w-5 h-5" />
                </motion.div>
                <motion.input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  placeholder="your.email@example.com"
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Message Field */}
            <motion.div variants={itemVariants}>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-200 mb-3">
                Your Message
              </label>
              <div className="relative">
                <motion.div
                  className="absolute left-4 top-6"
                  animate={{ 
                    scale: focusedField === 'message' ? 1.1 : 1,
                    color: focusedField === 'message' ? '#8b5cf6' : '#9ca3af'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageSquare className="w-5 h-5" />
                </motion.div>
                <motion.textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField('')}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm resize-none"
                  placeholder="Tell us what's on your mind..."
                  whileFocus={{ scale: 1.02 }}
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                animate={isLoading ? { opacity: 0.7 } : { opacity: 1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </span>
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Bottom decorative text */}
        <motion.p
          variants={itemVariants}
          className="text-center text-gray-400 mt-8 text-sm"
        >
          We typically respond within 24 hours
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Contactus