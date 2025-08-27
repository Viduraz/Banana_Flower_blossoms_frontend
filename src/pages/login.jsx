import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../components/AuthProvider'
import { authAPI } from '../api/authAPI'
import toast from 'react-hot-toast'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [focusedField, setFocusedField] = useState(null)
  
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
      const response = await authAPI.login(formData)
      
      if (response.data.success) {
        const userData = response.data.data
        login(userData)
        
        // Custom success toast
        toast.success('Welcome back! 🌸', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.2)',
          },
        })
        
        // Redirect based on user role
        if (userData.roles?.includes('ROLE_ADMIN')) {
          navigate('/admin/dashboard')
        } else {
          navigate('/')
        }
      } else {
        toast.error(response.data.message || 'Login failed', {
          style: {
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 'Invalid email or password'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Interactive gradient following mouse */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.3), transparent 50%)`
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        />

        {/* Floating geometric shapes */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-pink-400/20 to-purple-400/20 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-md w-full space-y-8"
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
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-6xl filter drop-shadow-2xl">🌸</span>
            </motion.div>
            
            <motion.h2
              className="text-4xl font-black text-white mb-2"
              animate={{
                textShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.5)",
                  "0 0 30px rgba(236, 72, 153, 0.7)",
                  "0 0 20px rgba(147, 51, 234, 0.5)",
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Welcome Back
            </motion.h2>
            
            <motion.p
              className="text-purple-200 text-lg"
              variants={itemVariants}
            >
              Sign in to your floral paradise 🌺
            </motion.p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8"
            variants={itemVariants}
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
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
                    className="w-full px-4 py-4 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all duration-300"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.div
                    className="absolute left-4 top-4 text-purple-500"
                    animate={focusedField === 'email' ? { scale: 1.1, color: "#8b5cf6" } : { scale: 1, color: "#a855f7" }}
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
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-4 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-400 transition-all duration-300 pr-12"
                    placeholder="Your secure password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                  />
                  <motion.div
                    className="absolute left-4 top-4 text-purple-500"
                    animate={focusedField === 'password' ? { scale: 1.1, color: "#8b5cf6" } : { scale: 1, color: "#a855f7" }}
                  >
                    🔐
                  </motion.div>
                  <motion.button
                    type="button"
                    className="absolute right-4 top-4 text-gray-500 hover:text-purple-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 text-white font-bold rounded-2xl text-lg shadow-2xl disabled:opacity-50 relative overflow-hidden"
                  variants={buttonVariants}
                  animate={isLoading ? "loading" : "idle"}
                  whileHover={!isLoading ? "hover" : ""}
                  whileTap={!isLoading ? "tap" : ""}
                >
                  {/* Button background animation */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600"
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
                          <span>Signing you in...</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="signin"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center space-x-2"
                        >
                          <span>✨</span>
                          <span>Sign In to Paradise</span>
                          <span>🌸</span>
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
                    New to our garden?
                  </span>
                </div>
              </motion.div>

              {/* Register Link */}
              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to="/register" 
                    className="inline-flex items-center space-x-2 text-purple-200 hover:text-white font-semibold transition-all duration-300 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-2xl backdrop-blur-xl border border-white/10 hover:border-white/20"
                  >
                    <span>🌱</span>
                    <span>Create Your Account</span>
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
            {['🌸', '🌺', '🌷', '🌹', '🌻'].map((flower, index) => (
              <motion.div
                key={index}
                className="text-3xl cursor-pointer filter drop-shadow-lg"
                whileHover={{ 
                  scale: 1.3, 
                  rotate: 360,
                  filter: "drop-shadow(0 0 20px rgba(255,255,255,0.8))"
                }}
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2 + index * 0.2,
                  repeat: Infinity,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
              >
                {flower}
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Text */}
          <motion.p
            className="text-center text-purple-200/60 text-sm"
            variants={itemVariants}
          >
            Secure • Beautiful • Magical
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login