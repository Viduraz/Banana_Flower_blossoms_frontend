import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../components/AuthProvider'
import toast from 'react-hot-toast'

function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully! 👋', {
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
      },
    })
    navigate('/')
    setActiveDropdown(null)
  }

  const navVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const linkVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: { 
      scale: 1.05,
      y: -2,
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  }

  const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 200, 
        damping: 10,
        delay: 0.2
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  }

  const dropdownVariants = {
    initial: { opacity: 0, scale: 0.95, y: -10 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { duration: 0.2 }
    }
  }

  const menuItemVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    hover: { 
      x: 5,
      backgroundColor: "rgba(255,255,255,0.1)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  }

  const buttonVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { 
      scale: 1.05,
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  }

  const mobileMenuVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: { duration: 0.2, ease: "easeInOut" }
    }
  }

  const floatingElements = [...Array(5)].map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-30"
      style={{
        left: `${20 + i * 15}%`,
        top: `${10 + (i % 2) * 80}%`,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration: 3 + i * 0.5,
        repeat: Infinity,
        delay: i * 0.3,
        ease: "easeInOut",
      }}
    />
  ))

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-xl' 
            : 'bg-gradient-to-r from-white/90 via-purple-50/80 to-pink-50/90 backdrop-blur-lg'
        }`}
        variants={navVariants}
        initial="initial"
        animate="animate"
      >
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingElements}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              variants={logoVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Link to="/" className="flex items-center space-x-2 group">
                <motion.div 
                  className="text-3xl"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  🌸
                </motion.div>
                <motion.h1 
                  className="text-2xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent"
                  whileHover={{ 
                    textShadow: "0 0 20px rgba(147, 51, 234, 0.3)" 
                  }}
                >
                  Flower Blossoms
                </motion.h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {['Home', 'About', 'Contact'].map((item, index) => (
                <motion.div
                  key={item}
                  variants={linkVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  custom={index}
                >
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="relative px-3 py-2 text-gray-700 font-medium rounded-xl hover:text-purple-600 transition-colors duration-200 group whitespace-nowrap"
                  >
                    {item}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      layoutId="navHover"
                    />
                  </Link>
                </motion.div>
              ))}

              {/* User Authentication Section */}
              {user ? (
                <div className="flex items-center space-x-2">
                  {/* Orders Link */}
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/orders"
                      className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-1 whitespace-nowrap"
                    >
                      <span>🛒</span>
                      <span className="hidden lg:inline">Orders</span>
                    </Link>
                  </motion.div>

                  {/* Admin Dropdown */}
                  {isAdmin && (
                    <div className="relative">
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setActiveDropdown(activeDropdown === 'admin' ? null : 'admin')}
                        className="px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-1 whitespace-nowrap"
                      >
                        <span>👑</span>
                        <span className="hidden lg:inline">Admin</span>
                        <motion.span
                          animate={{ rotate: activeDropdown === 'admin' ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          ▼
                        </motion.span>
                      </motion.button>

                      <AnimatePresence>
                        {activeDropdown === 'admin' && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="absolute top-full mt-2 right-0 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 overflow-hidden"
                          >
                            {[
                              { to: '/admin/dashboard', text: 'Dashboard', emoji: '📊' },
                              { to: '/admin/profile', text: 'Admin Profile', emoji: '👤' },
                              { to: '/admin/orders', text: 'Manage Orders', emoji: '📦' }
                            ].map((item, index) => (
                              <motion.div key={item.to} variants={menuItemVariants}>
                                <Link
                                  to={item.to}
                                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-600 transition-all duration-200"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <span className="text-lg">{item.emoji}</span>
                                  <span className="font-medium">{item.text}</span>
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* User Dropdown */}
                  <div className="relative">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                      className="px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
                    >
                      <span>👋</span>
                      <span className="hidden xl:block">Hi, {user.username}</span>
                      <span className="hidden lg:block xl:hidden">Hi</span>
                      <motion.span
                        animate={{ rotate: activeDropdown === 'user' ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        ▼
                      </motion.span>
                    </motion.button>

                    <AnimatePresence>
                      {activeDropdown === 'user' && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="absolute top-full mt-2 right-0 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 overflow-hidden"
                        >
                          <motion.div variants={menuItemVariants}>
                            <Link
                              to="/profile"
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 hover:text-purple-600 transition-all duration-200"
                              onClick={() => setActiveDropdown(null)}
                            >
                              <span className="text-lg">👤</span>
                              <span className="font-medium">My Profile</span>
                            </Link>
                          </motion.div>
                          <div className="border-t border-gray-200 my-1"></div>
                          <motion.div variants={menuItemVariants}>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 hover:text-red-600 transition-all duration-200"
                            >
                              <span className="text-lg">🚪</span>
                              <span className="font-medium">Logout</span>
                            </button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-gray-700 font-medium hover:text-purple-600 transition-colors duration-200 rounded-xl hover:bg-purple-50 whitespace-nowrap"
                    >
                      <span className="hidden lg:inline">✨ Login</span>
                      <span className="lg:hidden">✨</span>
                    </Link>
                  </motion.div>
                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center space-x-1 whitespace-nowrap"
                    >
                      <span>🌟</span>
                      <span className="hidden lg:inline">Register</span>
                    </Link>
                  </motion.div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-xl bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? '✕' : '☰'}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-white/20 shadow-xl z-40 md:hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {['Home', 'About', 'Contact'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="block px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/orders"
                    className="block px-4 py-3 text-green-600 font-medium rounded-xl hover:bg-green-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🛒 Orders
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-purple-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    👤 Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors duration-200"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-purple-50 transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ✨ Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    🌟 Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close dropdowns */}
      {(activeDropdown || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setActiveDropdown(null)
            setIsMobileMenuOpen(false)
          }}
        />
      )}
    </>
  )
}

export default Navbar