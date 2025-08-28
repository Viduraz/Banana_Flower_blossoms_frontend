import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Leaf, 
  Globe, 
  Users, 
  Award, 
  Heart, 
  Sparkles, 
  MapPin, 
  CheckCircle,
  Star,
  Quote,
  Shield,
  Truck,
  Recycle
} from 'lucide-react'

function Aboutus() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [visibleSection, setVisibleSection] = useState('')

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    },
    hover: {
      y: -10,
      scale: 1.05,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  }

  const numberCountVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.5 }
    }
  }

  // Core values data
  const coreValues = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Pure Sri Lankan Origin",
      description: "Sourced directly from trusted local farmers in pristine banana groves",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Sustainable & Ethical",
      description: "Empowering rural farming communities through fair trade practices",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Quality First",
      description: "Every batch tested for safety, freshness, and premium standards",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Vision",
      description: "Bridging Sri Lanka's heritage with today's superfood market",
      color: "from-orange-500 to-red-500"
    }
  ]

  // Statistics data
  const statistics = [
    { number: "100%", label: "Natural & Chemical-Free", icon: <Shield className="w-6 h-6" /> },
    { number: "50+", label: "Partner Farmers", icon: <Users className="w-6 h-6" /> },
    { number: "25+", label: "Countries Served", icon: <Globe className="w-6 h-6" /> },
    { number: "5★", label: "Customer Rating", icon: <Star className="w-6 h-6" /> }
  ]

  // Team testimonials
  const testimonials = [
    {
      name: "Kumari Perera",
      role: "Founder & CEO",
      quote: "Our mission is to share Sri Lanka's ancient wisdom with the modern world, one blossom at a time.",
      image: "👩‍💼"
    },
    {
      name: "Sunil Fernando",
      role: "Head of Quality",
      quote: "Every product carries our commitment to excellence and the trust of our farming partners.",
      image: "👨‍🔬"
    },
    {
      name: "Priya Silva",
      role: "Sustainability Director",
      quote: "We're not just creating superfoods; we're building sustainable communities.",
      image: "👩‍🌾"
    }
  ]

  // Journey timeline
  const timeline = [
    {
      year: "2020",
      title: "The Beginning",
      description: "Started with a vision to share Sri Lanka's superfood secrets",
      emoji: "🌱"
    },
    {
      year: "2021",
      title: "First Harvest",
      description: "Established partnerships with local farmers",
      emoji: "🤝"
    },
    {
      year: "2022",
      title: "Global Expansion",
      description: "Launched international shipping and partnerships",
      emoji: "🌍"
    },
    {
      year: "2023",
      title: "Innovation Hub",
      description: "Introduced new superfood products and sustainable packaging",
      emoji: "💡"
    }
  ]

  // Floating background elements
  const floatingElements = Array.from({ length: 15 }, (_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20"
      animate={{
        x: [0, Math.random() * 200 - 100, 0],
        y: [0, Math.random() * 200 - 100, 0],
        scale: [1, 1.5, 1],
        opacity: [0.2, 0.6, 0.2],
      }}
      transition={{
        duration: Math.random() * 6 + 4,
        repeat: Infinity,
        repeatType: "reverse",
        delay: Math.random() * 3,
      }}
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
    />
  ))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Interactive gradient following mouse */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: `radial-gradient(800px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(34, 197, 94, 0.4), transparent 70%)`
          }}
          transition={{ type: "tween", ease: "linear", duration: 0.2 }}
        />

        {/* Floating elements */}
        {floatingElements}

        {/* Large background shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>

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
          className="max-w-7xl mx-auto space-y-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            <motion.div
              className="flex justify-center mb-8"
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
                <span className="text-9xl filter drop-shadow-2xl">🌿</span>
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
                  <Sparkles className="w-8 h-8 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <motion.h1
              className="text-6xl font-black bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent mb-6"
              animate={{
                textShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                  "0 0 30px rgba(16, 185, 129, 0.7)",
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              About Our Journey
            </motion.h1>
            
            <motion.p
              className="text-green-200 text-xl max-w-3xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Transforming Sri Lanka's ancient wisdom into modern wellness, one blossom at a time 🌸
            </motion.p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-12 relative overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl"></div>
            
            <div className="relative z-10 text-center">
              <motion.div
                className="text-7xl mb-8"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🌸
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-8">Our Mission</h2>
              <p className="text-green-200 text-xl leading-relaxed max-w-4xl mx-auto mb-8">
                At <span className="text-green-400 font-semibold">Flower Blossoms</span>, we believe in turning Sri Lanka's ancient wisdom into modern wellness. 
                Our journey began with a simple mission – to share the untapped superfoods of Sri Lanka with the world.
              </p>
              <p className="text-green-300 text-lg leading-relaxed max-w-3xl mx-auto">
                From the lush banana groves of rural Sri Lanka, we carefully handpick Seeni Kesel banana blossoms, 
                known for their rich nutrients, fiber, and healing properties.
              </p>
            </div>
          </motion.div>

          {/* Statistics Section */}
          <motion.div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8"
            variants={cardVariants}
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center group"
                  variants={numberCountVariants}
                  whileHover={{ scale: 1.1 }}
                >
                  <motion.div
                    className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.h3
                    className="text-4xl font-black text-green-400 mb-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {stat.number}
                  </motion.h3>
                  <p className="text-green-200 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Core Values Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            <motion.div
              className="md:col-span-2 text-center mb-8"
              variants={itemVariants}
            >
              <h2 className="text-5xl font-bold text-white mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 mr-4 text-yellow-400" />
                What Makes Us Different
                <Sparkles className="w-8 h-8 ml-4 text-yellow-400" />
              </h2>
              <p className="text-green-200 text-xl">Our commitment to excellence in every aspect</p>
            </motion.div>

            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden group"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${value.color} opacity-5 rounded-3xl group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <motion.div
                    className={`w-16 h-16 mb-6 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-4">{value.title}</h3>
                  <p className="text-green-200 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Journey Timeline */}
          <motion.div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-12"
            variants={cardVariants}
          >
            <motion.div
              className="text-center mb-12"
              variants={itemVariants}
            >
              <h2 className="text-5xl font-bold text-white mb-4">Our Journey</h2>
              <p className="text-green-200 text-xl">From vision to global impact</p>
            </motion.div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>

              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  className="relative flex items-start mb-12 last:mb-0"
                  variants={itemVariants}
                  custom={index}
                >
                  <motion.div
                    className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-2xl shadow-lg relative z-10"
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.emoji}
                  </motion.div>
                  <div className="ml-8 bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/20 flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-green-400 font-black text-2xl mr-4">{item.year}</span>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-green-200">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Testimonials */}
          <motion.div
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-12"
            variants={cardVariants}
          >
            <motion.div
              className="text-center mb-12"
              variants={itemVariants}
            >
              <h2 className="text-5xl font-bold text-white mb-4">Meet Our Team</h2>
              <p className="text-green-200 text-xl">The passionate people behind our mission</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20 text-center relative overflow-hidden group"
                  variants={cardVariants}
                  whileHover={{ y: -10, scale: 1.02 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10">
                    <motion.div
                      className="text-6xl mb-4"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {testimonial.image}
                    </motion.div>
                    <h3 className="text-xl font-bold text-white mb-2">{testimonial.name}</h3>
                    <p className="text-green-400 font-medium mb-4">{testimonial.role}</p>
                    <div className="relative">
                      <Quote className="w-6 h-6 text-green-500 opacity-50 absolute -top-2 -left-2" />
                      <p className="text-green-200 italic leading-relaxed pl-4">"{testimonial.quote}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quality Promise */}
          <motion.div
            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-12 text-center relative overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-3xl"></div>
            
            <div className="relative z-10">
              <motion.div
                className="text-8xl mb-8"
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
                🏆
              </motion.div>
              
              <h2 className="text-4xl font-bold text-white mb-6">Our Quality Promise</h2>
              <p className="text-green-200 text-xl leading-relaxed max-w-4xl mx-auto mb-8">
                Using traditional methods combined with modern hygienic processing, we transform these blossoms into a 
                <span className="text-green-400 font-semibold"> 100% natural, chemical-free, vegan-friendly powder </span>
                that supports health and well-being.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {[
                  { icon: <Shield className="w-6 h-6" />, text: "Chemical-Free Processing" },
                  { icon: <Truck className="w-6 h-6" />, text: "Global Quality Standards" },
                  { icon: <Recycle className="w-6 h-6" />, text: "Sustainable Packaging" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-center space-x-3 text-green-300 font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-green-400">{item.icon}</div>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            className="text-center"
            variants={itemVariants}
          >
            <motion.div
              className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20"></div>
              
              <div className="relative z-10">
                <motion.div
                  className="text-7xl mb-6"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  🌸
                </motion.div>
                
                <h2 className="text-4xl font-bold text-white mb-6">Join Our Wellness Journey</h2>
                <p className="text-green-100 text-xl mb-8 max-w-3xl mx-auto">
                  Whether blended into smoothies, brewed as tea, or added to your favorite recipes, 
                  our Banana Blossom Powder is more than just a product – it's a piece of Sri Lanka's culture, 
                  carried with care to your home.
                </p>
                
                <motion.p
                  className="text-2xl font-bold text-white"
                  animate={{
                    textShadow: [
                      "0 0 20px rgba(255,255,255,0.5)",
                      "0 0 30px rgba(255,255,255,0.8)",
                      "0 0 20px rgba(255,255,255,0.5)",
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  One blossom at a time 🌸
                </motion.p>
              </div>
            </motion.div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            className="flex justify-center space-x-8 mt-16"
            variants={itemVariants}
          >
            {['🌿', '🌸', '🌱', '🍃', '🌺'].map((emoji, index) => (
              <motion.div
                key={index}
                className="text-5xl cursor-pointer filter drop-shadow-lg"
                whileHover={{ 
                  scale: 1.6, 
                  rotate: 360,
                  filter: "drop-shadow(0 0 20px rgba(34, 197, 94, 0.8))"
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 15, -15, 0],
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
            className="text-center"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <p className="text-green-300 text-xl mb-4">
                🌟 Handcrafted in Sri Lanka with love, delivered worldwide with care 🌟
              </p>
              <p className="text-green-200 text-lg">
                Sustainability • Quality • Wellness • Tradition
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Aboutus
