import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../components/AuthProvider'

function Home() {
  const { user, isAuthenticated } = useAuth()

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  }

  const staggerChildren = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.2 } }
  }

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.6, ease: "easeOut" }
  }

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          className="w-full h-full object-cover opacity-40"
          poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPHN0eWxlPgoucGV0YWwgewogIGZpbGw6ICNmZjk0YTk7CiAgYW5pbWF0aW9uOiBmbG9hdCA0cyBlYXNlLWluLW91dCBpbmZpbml0ZSBhbHRlcm5hdGU7Cn0KQGV5ZXMgewowJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTsgfQoxMDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0yMHB4KTsgfQp9Cjwvc3R5bGU+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KPHN2ZyB4PSI0MDAiIHk9IjIwMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9Im5vbmUiPgo8Y2lyY2xlIGN4PSI2MCIgY3k9IjYwIiByPSI0MCIgY2xhc3M9InBldGFsIi8+Cjwvc3ZnPgo8L3N2Zz4="
        >
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9a1c2e8&profile_id=139&oauth2_token_id=57447761" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-rose-900/60 to-amber-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-rose-400 to-amber-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 text-center">
            <motion.div
              className="flex justify-center mb-8"
              {...floatingAnimation}
            >
              <span className="text-8xl filter drop-shadow-2xl">🌸</span>
            </motion.div>
            
            <motion.h1
              className="text-6xl md:text-8xl font-black tracking-tight mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-300 bg-clip-text text-transparent drop-shadow-2xl">
                Banana Blossom
              </span>
              <br />
              <span className="text-white text-5xl md:text-6xl font-light">
                Superfoods
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed mb-12"
              {...fadeInUp}
              transition={{ delay: 0.3 }}
            >
              Experience Sri Lanka's hidden tropical treasure — 100% natural banana blossom powder & products crafted for health, wellness, and plant‑based living.
            </motion.p>

            {!isAuthenticated && (
              <motion.div
                className="mt-12 flex flex-col sm:flex-row gap-6 justify-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <Link
                  to="/register"
                  className="group relative overflow-hidden px-10 py-5 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">🌿 Join the Wellness Journey</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                <Link
                  to="/login"
                  className="px-10 py-5 border-2 border-rose-400 text-rose-300 rounded-2xl font-bold text-lg backdrop-blur-sm bg-white/10 hover:bg-white/20 hover:text-white hover:border-rose-300 hover:scale-105 transition-all duration-300"
                >
                  ✨ Sign In
                </Link>
              </motion.div>
            )}

            {/* Scroll Indicator */}
            <motion.div
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Glassmorphism About Section */}
        <motion.section
          className="max-w-6xl mx-auto px-6 lg:px-12 py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-12 text-center shadow-2xl">
            <motion.h2
              className="text-5xl font-bold text-white mb-8"
              {...fadeInUp}
            >
              Why Banana Blossoms?
            </motion.h2>
            <motion.p
              className="text-xl text-gray-200 leading-relaxed max-w-4xl mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Banana blossoms (kesel mala) are nature's powerhouse — packed with fiber, iron, and antioxidants. 
              Treasured in traditional cuisine for centuries, now reimagined as the ultimate modern superfood 
              for vegan, gluten‑free, and plant‑based lifestyles worldwide.
            </motion.p>
          </div>
        </motion.section>

        {/* Products Grid with Advanced Animations */}
        <motion.section
          className="max-w-7xl mx-auto px-6 lg:px-12 py-20"
          variants={staggerChildren}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                emoji: "🍃",
                title: "Banana Blossom Powder",
                description: "Sun‑dried & finely ground. Perfect for smoothies, gluten‑free baking, and vegan recipes.",
                gradient: "from-emerald-500/20 to-green-500/20",
                border: "border-emerald-400/30"
              },
              {
                emoji: "🥗",
                title: "Dried Blossom Slices",
                description: "Nutrient‑rich dried slices, ready for tea infusions, cooking, or superfood snacks.",
                gradient: "from-amber-500/20 to-orange-500/20",
                border: "border-amber-400/30"
              },
              {
                emoji: "💊",
                title: "Health Supplements",
                description: "Banana blossom capsules for digestive health, women's wellness, and fiber support.",
                gradient: "from-rose-500/20 to-pink-500/20",
                border: "border-rose-400/30"
              }
            ].map((product, index) => (
              <motion.div
                key={index}
                className={`group backdrop-blur-xl bg-gradient-to-br ${product.gradient} border ${product.border} rounded-3xl p-10 text-center hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:rotate-1`}
                variants={scaleIn}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div
                  className="text-6xl mb-6"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {product.emoji}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">{product.title}</h3>
                <p className="text-gray-200 text-lg leading-relaxed">{product.description}</p>
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Authenticated User Section */}
        {isAuthenticated && (
          <motion.section
            className="max-w-6xl mx-auto px-6 lg:px-12 py-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 rounded-3xl border border-white/20 p-12 shadow-2xl">
              <motion.h3
                className="text-4xl font-bold text-white mb-6 text-center"
                {...fadeInUp}
              >
                Welcome back, {user?.username}! 🌸
              </motion.h3>
              <motion.p
                className="text-gray-200 mb-10 text-center text-xl"
                {...fadeInUp}
                transition={{ delay: 0.2 }}
              >
                Ready to explore the world of superfoods?
              </motion.p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    to: "/orders",
                    emoji: "🛒",
                    title: "Browse & Order",
                    description: "Discover our premium products",
                    gradient: "from-green-500/20 to-emerald-500/20",
                    border: "border-green-400/30"
                  },
                  {
                    to: "/profile",
                    emoji: "👤",
                    title: "My Profile",
                    description: "Manage your wellness journey",
                    gradient: "from-rose-500/20 to-pink-500/20",
                    border: "border-rose-400/30"
                  }
                ].map((action, index) => (
                  <Link
                    key={index}
                    to={action.to}
                    className={`group relative overflow-hidden flex items-center p-8 bg-gradient-to-r ${action.gradient} border ${action.border} rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2 hover:scale-105`}
                  >
                    <motion.div
                      className="text-4xl mr-6"
                      whileHover={{ scale: 1.2, rotate: 12 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {action.emoji}
                    </motion.div>
                    <div>
                      <h4 className="text-2xl font-semibold text-white mb-2">{action.title}</h4>
                      <p className="text-gray-200 text-lg">{action.description}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Premium Footer */}
        <motion.footer
          className="relative overflow-hidden py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/90 via-amber-600/90 to-green-600/90"></div>
          <div className="relative max-w-6xl mx-auto text-center px-6">
            <motion.h3
              className="text-4xl font-bold text-white mb-6"
              {...fadeInUp}
            >
              Handcrafted in Sri Lanka 🇱🇰
            </motion.h3>
            <motion.p
              className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Hand‑harvested from pristine tropical gardens, sun‑dried with traditional methods, 
              and packed with love. We're bringing the authentic goodness of banana blossoms 
              to health-conscious people worldwide.
            </motion.p>
            <div className="flex justify-center space-x-8 text-5xl">
              {["🌸", "🍃", "🥗", "💊"].map((emoji, index) => (
                <motion.span
                  key={index}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                  className="inline-block drop-shadow-lg hover:scale-110 transition-transform cursor-pointer"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default Home