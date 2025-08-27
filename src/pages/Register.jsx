import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'
import { authAPI } from '../api/authAPI'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [focusedField, setFocusedField] = useState(null)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  // Track mouse movement for interactive background
  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])

  // Calculate password strength
  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      let strength = 0
      if (password.length >= 6) strength += 1
      if (password.length >= 8) strength += 1
      if (/[A-Z]/.test(password)) strength += 1
      if (/[0-9]/.test(password)) strength += 1
      if (/[^A-Za-z0-9]/.test(password)) strength += 1
      return strength
    }
    
    setPasswordStrength(calculatePasswordStrength(formData.password))
  }, [formData.password])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match! 🔐', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.2)',
        },
      })
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long! 🔒', {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      })
      return
    }

    setIsLoading(true)

    try {
      const registrationData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }

      const response = await authAPI.register(registrationData)
      
      if (response.data.success) {
        const userData = response.data.data
        login(userData)
        
        // Custom success toast
        toast.success('Welcome to our garden! 🌺', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
          },
        })
        
        navigate('/')
      } else {
        toast.error(response.data.message || 'Registration failed', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        })
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(errorMessage, {
        style: {
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          borderRadius: '16px',
        },
      })
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
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(147, 51, 234, 0.2)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    unfocused: {
      scale: 1,
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  }

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 15px 35px rgba(147, 51, 234, 0.4)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    tap: { scale: 0.98 },
    loading: {
      scale: [1, 1.02, 1],
      transition: { repeat: Infinity, duration: 1 }
    }
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength <= 1) return 'from-red-500 to-red-600'
    if (strength <= 2) return 'from-orange-500 to-orange-600'
    if (strength <= 3) return 'from-yellow-500 to-yellow-600'
    if (strength <= 4) return 'from-green-500 to-green-600'
    return 'from-emerald-500 to-emerald-600'
  }

  const getPasswordStrengthText = (strength) => {
    if (strength <= 1) return 'Weak'
    if (strength <= 2) return 'Fair'
    if (strength <= 3) return 'Good'
    if (strength <= 4) return 'Strong'
    return 'Very Strong'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Interactive gradient following mouse */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.3), transparent 50%)`
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        />

        {/* Floating geometric shapes */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 backdrop-blur-sm"
            style={{
              width: Math.random() * 120 + 30,
              height: Math.random() * 120 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -120, 0],
              x: [0, 60, 0],
              rotate: [0, 360],
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.6, 0.1],
            }}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-emerald-300 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -200, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-lg w-full space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo and Title Section */}
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <motion.div
              className="flex justify-center mb-6"
              animate={{
                rotate: [0, 15, -15, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-7xl filter drop-shadow-2xl">🌱</span>
            </motion.div>
            
            <motion.h2
              className="text-5xl font-black text-white mb-3"
              animate={{
                textShadow: [
                  "0 0 20px rgba(16, 185, 129, 0.5)",
                  "0 0 30px rgba(6, 182, 212, 0.7)",
                  "0 0 20px rgba(16, 185, 129, 0.5)",
                ]
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Join Our Garden
            </motion.h2>
            
            <motion.p
              className="text-emerald-200 text-xl"
              variants={itemVariants}
            >
              Plant the seeds of your beautiful journey 🌿
            </motion.p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8"
            variants={itemVariants}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username Field */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <label htmlFor="username" className="block text-sm font-semibold text-white mb-2">
                  Username
                </label>
                <motion.div
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === 'username' ? 'focused' : 'unfocused'}
                >
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="w-full px-4 py-4 pl-12 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="Choose your username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.div
                    className="absolute left-4 top-4 text-emerald-500"
                    animate={focusedField === 'username' ? { scale: 1.1, color: "#10b981" } : { scale: 1, color: "#34d399" }}
                  >
                    👤
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  Email Address
                </label>
                <motion.div
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === 'email' ? 'focused' : 'unfocused'}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-4 pl-12 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.div
                    className="absolute left-4 top-4 text-emerald-500"
                    animate={focusedField === 'email' ? { scale: 1.1, color: "#10b981" } : { scale: 1, color: "#34d399" }}
                  >
                    📧
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                  Password
                </label>
                <motion.div
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === 'password' ? 'focused' : 'unfocused'}
                >
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-4 pl-12 pr-12 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.div
                    className="absolute left-4 top-4 text-emerald-500"
                    animate={focusedField === 'password' ? { scale: 1.1, color: "#10b981" } : { scale: 1, color: "#34d399" }}
                  >
                    🔐
                  </motion.div>
                  <motion.button
                    type="button"
                    className="absolute right-4 top-4 text-gray-500 hover:text-emerald-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </motion.button>
                </motion.div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${getPasswordStrengthColor(passwordStrength)} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(passwordStrength / 5) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-xs text-white/80 font-medium">
                        {getPasswordStrengthText(passwordStrength)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-white mb-2">
                  Confirm Password
                </label>
                <motion.div
                  className="relative"
                  variants={inputVariants}
                  animate={focusedField === 'confirmPassword' ? 'focused' : 'unfocused'}
                >
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-4 pl-12 pr-12 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-emerald-400 transition-all duration-300"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.div
                    className="absolute left-4 top-4 text-emerald-500"
                    animate={focusedField === 'confirmPassword' ? { scale: 1.1, color: "#10b981" } : { scale: 1, color: "#34d399" }}
                  >
                    🔒
                  </motion.div>
                  <motion.button
                    type="button"
                    className="absolute right-4 top-4 text-gray-500 hover:text-emerald-600 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? '🙈' : '👁️'}
                  </motion.button>
                </motion.div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ 
                          scale: formData.password === formData.confirmPassword ? [1, 1.2, 1] : 1,
                          color: formData.password === formData.confirmPassword ? "#10b981" : "#ef4444"
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {formData.password === formData.confirmPassword ? '✅' : '❌'}
                      </motion.div>
                      <span className={`text-xs font-medium ${
                        formData.password === formData.confirmPassword ? 'text-emerald-300' : 'text-red-300'
                      }`}>
                        {formData.password === formData.confirmPassword ? 'Passwords match!' : 'Passwords do not match'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white font-bold rounded-2xl text-lg shadow-2xl disabled:opacity-50 relative overflow-hidden"
                  variants={buttonVariants}
                  animate={isLoading ? "loading" : "idle"}
                  whileHover={!isLoading ? "hover" : ""}
                  whileTap={!isLoading ? "tap" : ""}
                >
                  {/* Button background animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600"
                    animate={isLoading ? {
                      x: ["-100%", "100%"],
                      transition: { repeat: Infinity, duration: 1.5, ease: "linear" }
                    } : {}}
                  />
                  
                  <span className="relative z-10 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Creating your account...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="register"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <span>🌱</span>
                          <span>Plant Your Seed</span>
                          <span>🌿</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div 
                className="relative my-6"
                variants={itemVariants}
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/10 backdrop-blur-xl text-white/80 rounded-full">
                    Already have an account?
                  </span>
                </div>
              </motion.div>

              {/* Login Link */}
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/login" 
                    className="inline-flex items-center space-x-2 text-emerald-200 hover:text-white font-semibold transition-all duration-300 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 hover:border-white/20"
                  >
                    <span>✨</span>
                    <span>Sign In Instead</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      →
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            </form>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="flex justify-center space-x-4 mt-8"
            variants={itemVariants}
          >
            {['🌱', '🌿', '🍃', '🌳', '🌲'].map((plant, index) => (
              <motion.div
                key={index}
                className="text-3xl cursor-pointer filter drop-shadow-lg"
                whileHover={{ 
                  scale: 1.4, 
                  rotate: 360,
                  filter: "drop-shadow(0 0 20px rgba(16, 185, 129, 0.8))"
                }}
                animate={{
                  y: [0, -12, 0],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 2.5 + index * 0.3,
                  repeat: Infinity,
                  delay: index * 0.15,
                  ease: "easeInOut",
                }}
              >
                {plant}
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Text */}
          <motion.p
            className="text-center text-emerald-200/60 text-sm"
            variants={itemVariants}
          >
            Secure • Growth • Community • Magic
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default Register