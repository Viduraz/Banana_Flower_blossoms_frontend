import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import { authAPI } from '../api/authAPI'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { User, Mail, Shield, Settings, Crown, Trash2, Edit3, Save, X, Eye, EyeOff, Sparkles } from 'lucide-react'

function Userprofile() {
  const { user, isAuthenticated, isLoading, updateUser, logout } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLoadingState, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const [profileData, setProfileData] = useState({
    username: '',
    email: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

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

  useEffect(() => {
    // Don't redirect if still loading
    if (isLoading) return;
    
    if (!isAuthenticated) {
      toast.error('Please login to access your profile')
      navigate('/login')
      return
    }

    // Initialize profile data only if user exists
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || ''
      })
    }
  }, [isAuthenticated, isLoading, navigate, user])

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    })
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await authAPI.updateUser(user.email, profileData)
      
      if (response.data.success) {
        const updatedUser = response.data.data
        updateUser(updatedUser)
        toast.success('Profile updated successfully! ✨', {
          style: {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        })
        setIsEditing(false)
      } else {
        toast.error(response.data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return
    }

    setIsLoading(true)

    try {
      const changeData = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }

      const response = await authAPI.changePassword(user.email, changeData)
      
      if (response.data.success) {
        toast.success('Password changed successfully! 🔐', {
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            borderRadius: '16px',
          },
        })
        setIsChangingPassword(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error(response.data.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Password change error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to change password'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    const confirmText = 'Are you absolutely sure you want to delete your account? This action cannot be undone and you will lose all your data permanently.'
    
    if (window.confirm(confirmText)) {
      try {
        const response = await authAPI.deleteUser(user.email)
        
        if (response.data.success) {
          toast.success('Account deleted successfully', {
            style: {
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              borderRadius: '16px',
            },
          })
          logout()
          navigate('/')
        } else {
          toast.error(response.data.message || 'Failed to delete account')
        }
      } catch (error) {
        console.error('Delete account error:', error)
        const errorMessage = error.response?.data?.message || 'Failed to delete account'
        toast.error(errorMessage)
      }
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  }

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
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
      scale: 1.05,
      boxShadow: "0 15px 35px rgba(147, 51, 234, 0.4)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    tap: { scale: 0.95 }
  }

  const floatingElements = Array.from({ length: 8 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
      animate={{
        x: [0, Math.random() * 200 - 100, 0],
        y: [0, Math.random() * 200 - 100, 0],
        scale: [1, 1.5, 1],
        opacity: [0.3, 0.7, 0.3],
      }}
      transition={{
        duration: Math.random() * 5 + 3,
        repeat: Infinity,
        repeatType: "reverse",
        delay: Math.random() * 2,
      }}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  ))

  // Show loading if auth is still being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-purple-200">Please log in to view your profile</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Interactive gradient following mouse */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(147, 51, 234, 0.4), transparent 70%)`
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        />

        {/* Floating elements */}
        {floatingElements}

        {/* Large background shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
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
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-5xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Enhanced Header */}
          <motion.div
            className="text-center mb-12"
            variants={itemVariants}
          >
            <motion.div
              className="flex justify-center mb-6"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="relative">
                <span className="text-8xl filter drop-shadow-2xl">👤</span>
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.h1
              className="text-6xl font-black bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.5)",
                  "0 0 30px rgba(236, 72, 153, 0.7)",
                  "0 0 20px rgba(147, 51, 234, 0.5)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              My Profile
            </motion.h1>
            
            <motion.p
              className="text-purple-200 text-xl max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Manage your account settings and preferences with style ✨
            </motion.p>
          </motion.div>

          {/* Enhanced User Info Card */}
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden"
            variants={cardVariants}
          >
            {/* Card background pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                <div className="flex items-center space-x-6">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <User className="w-10 h-10 text-white" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{user.username}</h2>
                    <p className="text-purple-200 text-lg">{user.email}</p>
                    <p className="text-purple-300 text-sm mt-1">Account Status: Active</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {user.roles?.map((role) => (
                    <motion.span
                      key={role}
                      className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${
                        role === 'ROLE_ADMIN'
                          ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {role === 'ROLE_ADMIN' ? <Crown className="w-4 h-4 mr-2" /> : <Shield className="w-4 h-4 mr-2" />}
                      {role.replace('ROLE_', '')}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Enhanced Admin Quick Access */}
              <AnimatePresence>
                {user.roles?.includes('ROLE_ADMIN') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-6 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 rounded-2xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 flex items-center">
                          <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                          Administrator Access
                        </h3>
                        <p className="text-red-200">You have elevated privileges and can access admin features</p>
                      </div>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <Link
                          to="/admin/dashboard"
                          className="inline-flex items-center px-6 py-3 bg-white/20 text-white rounded-xl font-medium backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200"
                        >
                          <Settings className="w-5 h-5 mr-2" />
                          Admin Dashboard
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Profile Information */}
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden"
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Edit3 className="w-7 h-7 mr-3 text-indigo-400" />
                  Profile Information
                </h2>
                <motion.button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-3 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-xl font-medium hover:bg-indigo-500/30 transition-all duration-200 flex items-center space-x-2"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isEditing ? (
                    <>
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-5 h-5" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form
                    key="editing"
                    onSubmit={handleProfileUpdate}
                    className="space-y-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Username Field */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Username
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputVariants}
                        animate={focusedField === 'username' ? 'focused' : 'unfocused'}
                      >
                        <input
                          type="text"
                          name="username"
                          value={profileData.username}
                          onChange={handleProfileChange}
                          onFocus={() => setFocusedField('username')}
                          onBlur={() => setFocusedField('')}
                          className="w-full px-6 py-4 pl-14 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-indigo-400 transition-all duration-300 text-lg"
                          placeholder="Enter your username"
                          required
                        />
                        <motion.div
                          className="absolute left-4 top-4 text-indigo-500"
                          animate={focusedField === 'username' ? { scale: 1.1, color: "#6366f1" } : { scale: 1, color: "#8b5cf6" }}
                        >
                          <User className="w-6 h-6" />
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Email Field */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Email Address
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputVariants}
                        animate={focusedField === 'email' ? 'focused' : 'unfocused'}
                      >
                        <input
                          type="email"
                          name="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          onFocus={() => setFocusedField('email')}
                          onBlur={() => setFocusedField('')}
                          className="w-full px-6 py-4 pl-14 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-indigo-400 transition-all duration-300 text-lg"
                          placeholder="Enter your email"
                          required
                        />
                        <motion.div
                          className="absolute left-4 top-4 text-indigo-500"
                          animate={focusedField === 'email' ? { scale: 1.1, color: "#6366f1" } : { scale: 1, color: "#8b5cf6" }}
                        >
                          <Mail className="w-6 h-6" />
                        </motion.div>
                      </motion.div>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <motion.button
                        type="submit"
                        disabled={isLoadingState}
                        className="flex-1 py-4 px-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold rounded-2xl shadow-2xl disabled:opacity-50 relative overflow-hidden text-lg"
                        variants={buttonVariants}
                        whileHover={!isLoadingState ? "hover" : ""}
                        whileTap={!isLoadingState ? "tap" : ""}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10 flex items-center justify-center">
                          <Save className="w-6 h-6 mr-3" />
                          {isLoadingState ? 'Saving...' : 'Save Changes'}
                        </span>
                      </motion.button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="viewing"
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        className="p-8 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent"></div>
                        <div className="relative z-10">
                          <label className="block text-sm font-medium text-purple-200 mb-3 flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            Username
                          </label>
                          <p className="text-2xl text-white font-semibold">{user.username}</p>
                        </div>
                      </motion.div>
                      <motion.div
                        className="p-8 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                        <div className="relative z-10">
                          <label className="block text-sm font-medium text-purple-200 mb-3 flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                          </label>
                          <p className="text-2xl text-white font-semibold break-all">{user.email}</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Password Management */}
          <motion.div
            className="bg-white/10 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden"
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white flex items-center">
                  <Shield className="w-7 h-7 mr-3 text-green-400" />
                  Password & Security
                </h2>
                <motion.button
                  onClick={() => setIsChangingPassword(!isChangingPassword)}
                  className="px-6 py-3 bg-green-500/20 text-green-300 border border-green-400/30 rounded-xl font-medium hover:bg-green-500/30 transition-all duration-200 flex items-center space-x-2"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {isChangingPassword ? (
                    <>
                      <X className="w-5 h-5" />
                      <span>Cancel</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      <span>Change Password</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Fixed: Simplified AnimatePresence for better stability */}
              {isChangingPassword ? (
                <motion.div
                  key="password-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <form onSubmit={handlePasswordUpdate} className="space-y-8">
                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Current Password
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputVariants}
                        animate={focusedField === 'currentPassword' ? 'focused' : 'unfocused'}
                      >
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          onFocus={() => setFocusedField('currentPassword')}
                          onBlur={() => setFocusedField('')}
                          className="w-full px-6 py-4 pl-14 pr-14 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 transition-all duration-300 text-lg"
                          placeholder="Enter current password"
                          required
                        />
                        <motion.div
                          className="absolute left-4 top-4 text-green-500"
                          animate={focusedField === 'currentPassword' ? { scale: 1.1 } : { scale: 1 }}
                        >
                          <Shield className="w-6 h-6" />
                        </motion.div>
                        <motion.button
                          type="button"
                          className="absolute right-4 top-4 text-gray-500 hover:text-green-600 transition-colors"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showCurrentPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        New Password
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputVariants}
                        animate={focusedField === 'newPassword' ? 'focused' : 'unfocused'}
                      >
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          onFocus={() => setFocusedField('newPassword')}
                          onBlur={() => setFocusedField('')}
                          className="w-full px-6 py-4 pl-14 pr-14 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 transition-all duration-300 text-lg"
                          placeholder="Enter new password"
                          required
                        />
                        <motion.div
                          className="absolute left-4 top-4 text-green-500"
                          animate={focusedField === 'newPassword' ? { scale: 1.1 } : { scale: 1 }}
                        >
                          <Shield className="w-6 h-6" />
                        </motion.div>
                        <motion.button
                          type="button"
                          className="absolute right-4 top-4 text-gray-500 hover:text-green-600 transition-colors"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showNewPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-semibold text-white mb-3">
                        Confirm New Password
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputVariants}
                        animate={focusedField === 'confirmPassword' ? 'focused' : 'unfocused'}
                      >
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField('')}
                          className="w-full px-6 py-4 pl-14 pr-14 bg-white/90 backdrop-blur-xl border border-white/30 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:border-green-400 transition-all duration-300 text-lg"
                          placeholder="Confirm new password"
                          required
                        />
                        <motion.div
                          className="absolute left-4 top-4 text-green-500"
                          animate={focusedField === 'confirmPassword' ? { scale: 1.1 } : { scale: 1 }}
                        >
                          <Shield className="w-6 h-6" />
                        </motion.div>
                        <motion.button
                          type="button"
                          className="absolute right-4 top-4 text-gray-500 hover:text-green-600 transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                        </motion.button>
                      </motion.div>

                      {/* Password Match Indicator */}
                      {passwordData.confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3"
                        >
                          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 border border-white/10">
                            <motion.div
                              animate={{ 
                                scale: passwordData.newPassword === passwordData.confirmPassword ? [1, 1.2, 1] : 1,
                                rotate: passwordData.newPassword === passwordData.confirmPassword ? [0, 360] : 0
                              }}
                              transition={{ duration: 0.5 }}
                              className="text-2xl"
                            >
                              {passwordData.newPassword === passwordData.confirmPassword ? '✅' : '❌'}
                            </motion.div>
                            <span className={`text-sm font-medium ${
                              passwordData.newPassword === passwordData.confirmPassword ? 'text-green-300' : 'text-red-300'
                            }`}>
                              {passwordData.newPassword === passwordData.confirmPassword ? 'Passwords match perfectly!' : 'Passwords do not match'}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Change Password Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoadingState || passwordData.newPassword !== passwordData.confirmPassword}
                      className="w-full py-4 px-8 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 text-white font-bold rounded-2xl shadow-2xl disabled:opacity-50 relative overflow-hidden text-lg"
                      variants={buttonVariants}
                      whileHover={!isLoadingState ? "hover" : ""}
                      whileTap={!isLoadingState ? "tap" : ""}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        <Shield className="w-6 h-6 mr-3" />
                        {isLoadingState ? 'Changing...' : 'Change Password'}
                      </span>
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="security-info"
                  className="text-center p-10 bg-white/5 rounded-2xl border border-white/10 relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent"></div>
                  <div className="relative z-10">
                    <motion.div
                      className="text-7xl mb-6"
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
                      🔐
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">Your Account is Secure</h3>
                    <p className="text-purple-200 text-lg max-w-md mx-auto">
                      For maximum security, we recommend changing your password regularly and using a strong, unique password.
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Enhanced Danger Zone */}
          <motion.div
            className="bg-red-500/10 backdrop-blur-2xl rounded-3xl border border-red-400/30 shadow-2xl p-8 relative overflow-hidden"
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-3xl"></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                className="text-7xl mb-6"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⚠️
              </motion.div>
              <h2 className="text-3xl font-bold text-red-300 mb-4">Danger Zone</h2>
              <p className="text-red-200 mb-8 text-lg max-w-md mx-auto">
                Once you delete your account, there is no going back. Please be absolutely certain before proceeding.
              </p>
              <motion.button
                onClick={handleDeleteAccount}
                className="px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-3 mx-auto relative overflow-hidden text-lg"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center">
                  <Trash2 className="w-6 h-6 mr-3" />
                  Delete Account Permanently
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Enhanced Decorative Elements */}
          <motion.div
            className="flex justify-center space-x-6 mt-12"
            variants={itemVariants}
          >
            {['👤', '🛡️', '⚙️', '🔐', '💫'].map((emoji, index) => (
              <motion.div
                key={index}
                className="text-4xl cursor-pointer filter drop-shadow-lg"
                whileHover={{ 
                  scale: 1.6, 
                  rotate: 360,
                  filter: "drop-shadow(0 0 20px rgba(147, 51, 234, 0.8))"
                }}
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3 + index * 0.3,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Message */}
          <motion.div
            className="text-center mt-8"
            variants={itemVariants}
          >
            <p className="text-purple-300 text-lg">
              🌟 Your profile is your digital identity - keep it updated and secure! 🌟
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Userprofile