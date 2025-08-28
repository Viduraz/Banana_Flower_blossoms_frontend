import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../components/AuthProvider'
import { orderAPI } from '../api/authAPI'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  ShoppingCart, 
  Package, 
  CreditCard, 
  MapPin, 
  Phone, 
  FileText, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Ban,
  Repeat,
  Sparkles,
  Plus,
  Minus,
  Star,
  Heart,
  Truck
} from 'lucide-react'

function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [userOrders, setUserOrders] = useState([])
  const [showOrderForm, setShowOrderForm] = useState(true) // Default to true for better visibility
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Refs for scrolling to sections
  const orderFormRef = useRef(null)
  const orderHistoryRef = useRef(null)

  // Product details (Banana Flower Blossoms) - Updated to USD pricing
  const [product] = useState({
    id: 1,
    name: 'Fresh Banana Flower Blossoms',
    description: 'Premium quality banana flower blossoms, hand-picked and fresh from organic farms',
    pricePer100g: 11.99, // $11.99 per 100g
    currency: 'USD',
    image: '🌺',
    inStock: true,
    rating: 4.8,
    reviews: 127,
    features: ['Organic', 'Fresh', 'Hand-picked', 'Premium Quality']
  })

  // Order form state - Updated to grams
  const [orderForm, setOrderForm] = useState({
    quantity: 100, // Start with 100g minimum
    address: '',
    phone: '',
    specialInstructions: ''
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
    if (!isAuthenticated) {
      toast.error('Please login to access orders')
      navigate('/login')
      return
    }

    fetchUserOrders()
  }, [isAuthenticated, navigate])

  // Scroll to section functions
  const scrollToOrderForm = () => {
    setShowOrderForm(true)
    setTimeout(() => {
      orderFormRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }, 100)
  }

  const scrollToOrderHistory = () => {
    setShowOrderForm(false)
    setTimeout(() => {
      orderHistoryRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }, 100)
  }

  const fetchUserOrders = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching orders for user ID:', user.id)
      console.log('User details:', { id: user.id, username: user.username, email: user.email })
      
      const response = await orderAPI.getUserOrders(user.id)
      console.log('Full API response:', response)
      console.log('Orders data:', response.data)
      
      // Handle the response structure more carefully
      if (response && response.success) {
        const orders = response.data || []
        console.log('Processed orders:', orders)
        console.log('Number of orders found:', orders.length)
        
        // Additional validation - ensure orders belong to current user
        const userSpecificOrders = orders.filter(order => {
          const belongsToUser = order.user && order.user.id === user.id
          if (!belongsToUser) {
            console.warn('Found order that does not belong to current user:', order)
          }
          return belongsToUser
        })
        
        console.log('User-specific orders after filtering:', userSpecificOrders.length)
        setUserOrders(userSpecificOrders)
        
        if (userSpecificOrders.length === 0) {
          console.log('No orders found for user:', user.username)
        }
      } else {
        console.log('API response indicates failure or no data')
        setUserOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      })
      
      // Set empty array for any error
      setUserOrders([])
      
      // Only show error toast for actual server errors, not 404 (no orders)
      if (error.response?.status !== 404) {
        toast.error('Failed to load orders. Please try again.')
      } else {
        console.log('404 response - user likely has no orders yet')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFormChange = (e) => {
    setOrderForm({
      ...orderForm,
      [e.target.name]: e.target.value
    })
  }

  // Updated calculation for USD pricing per 100g
  const calculateTotal = () => {
    const priceFor100g = product.pricePer100g
    const totalPrice = (orderForm.quantity / 100) * priceFor100g
    return totalPrice.toFixed(2)
  }

  const handleCreateOrder = async (e) => {
    e.preventDefault()
    
    if (!orderForm.address.trim()) {
      toast.error('Please enter delivery address')
      return
    }

    if (!orderForm.phone.trim()) {
      toast.error('Please enter phone number')
      return
    }

    if (orderForm.quantity < 100) {
      toast.error('Minimum order quantity is 100g')
      return
    }

    setIsProcessingPayment(true)

    try {
      // Create order in backend
      const orderData = {
        address: `${orderForm.address} | Phone: ${orderForm.phone} | Instructions: ${orderForm.specialInstructions}`,
        items: `${product.name} - ${orderForm.quantity}g`,
        totalAmount: parseFloat(calculateTotal())
      }

      console.log('Creating order with data:', orderData);

      const orderResponse = await orderAPI.createOrder(user.id, orderData)
      
      console.log('Order response:', orderResponse);
      
      // Fix: Check for orderResponse.success instead of orderResponse.data.success
      if (orderResponse.success && orderResponse.data) {
        // Access the actual order data from the response
        const order = orderResponse.data; // Note: not nested .data
        
        console.log('Created order:', order);
        
        toast.success('Order created successfully!')
        
        // Prepare payment data with proper order ID (USD pricing)
        const paymentData = {
          orderId: `ORD-${order.id}-${Date.now()}`, // Now order.id should be valid
          items: `${product.name} (${orderForm.quantity}g)`,
          amount: parseFloat(calculateTotal()),
          currency: product.currency, // USD
          firstName: user.username.split(' ')[0] || user.username,
          lastName: user.username.split(' ')[1] || 'User',
          email: user.email,
          phone: orderForm.phone,
          address: orderForm.address,
          city: 'New York' // Changed from Colombo for USD payments
        }

        console.log('Payment data being sent:', paymentData);

        // Initiate payment
        await initiatePayment(paymentData)
        
        // Reset form and refresh orders
        setOrderForm({
          quantity: 100, // Reset to minimum 100g
          address: '',
          phone: '',
          specialInstructions: ''
        })
        
        // Scroll to order history after successful order
        setTimeout(() => {
          scrollToOrderHistory()
          fetchUserOrders()
        }, 2000)
        
      } else {
        throw new Error(orderResponse.message || 'Failed to create order')
      }
    } catch (error) {
      console.error('Order creation error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create order'
      toast.error(errorMessage)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const initiatePayment = async (paymentData) => {
    try {
      console.log('Initiating payment with data:', paymentData);
      
      // Call your payment API to get PayHere parameters (updated for USD)
      const response = await fetch('http://localhost:8080/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      })

      const result = await response.json()
      console.log('Payment API response:', result);
      
      if (result.success) {
        const params = result.data
        
        // Log parameters for debugging
        console.log('PayHere parameters:', params);
        
        // Create a form and submit to PayHere
        const form = document.createElement('form')
        form.method = 'POST'
        form.action = params.payhere_endpoint
        form.target = '_self'

        // Add all payment parameters to form
        Object.keys(params).forEach(key => {
          if (key !== 'payhere_endpoint') {
            const input = document.createElement('input')
            input.type = 'hidden'
            input.name = key
            input.value = params[key]
            form.appendChild(input)
            console.log(`${key}: ${params[key]}`);
          }
        })

        document.body.appendChild(form)
        
        toast.success('Redirecting to payment gateway...')
        
        // Submit after a short delay to ensure toast is visible
        setTimeout(() => {
          form.submit()
        }, 1000)
        
      } else {
        throw new Error(result.message || 'Payment initiation failed')
      }
    } catch (error) {
      console.error('Payment initiation error:', error)
      toast.error('Failed to initiate payment. Please try again.')
    }
  }

  // Enhanced function to get status color and text with better integration
  const getStatusDisplay = (paymentStatus) => {
    const statusMap = {
      'PENDING': { 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
        text: 'Payment Pending',
        icon: <Clock className="w-4 h-4" />,
        description: 'Awaiting payment confirmation',
        bgGradient: 'from-yellow-500/20 to-amber-500/20',
        borderColor: 'border-yellow-400/30'
      },
      'PAID': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: 'Paid & Processing',
        icon: <CheckCircle className="w-4 h-4" />,
        description: 'Payment successful, order being processed',
        bgGradient: 'from-green-500/20 to-emerald-500/20',
        borderColor: 'border-green-400/30'
      },
      'FAILED': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Payment Failed',
        icon: <XCircle className="w-4 h-4" />,
        description: 'Payment was unsuccessful',
        bgGradient: 'from-red-500/20 to-rose-500/20',
        borderColor: 'border-red-400/30'
      },
      'CANCELLED': { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        text: 'Cancelled',
        icon: <Ban className="w-4 h-4" />,
        description: 'Order was cancelled',
        bgGradient: 'from-gray-500/20 to-slate-500/20',
        borderColor: 'border-gray-400/30'
      }
    }
    
    return statusMap[paymentStatus] || statusMap['PENDING']
  }

  // Function to get next steps for user based on status
  const getNextSteps = (paymentStatus) => {
    switch(paymentStatus) {
      case 'PENDING':
        return 'Complete your payment to process the order'
      case 'PAID':
        return 'Your order is being prepared for delivery'
      case 'FAILED':
        return 'Please try placing the order again'
      case 'CANCELLED':
        return 'You can place a new order anytime'
      default:
        return 'Contact support if you need assistance'
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
        staggerChildren: 0.1
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
      boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)",
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
      boxShadow: "0 15px 35px rgba(34, 197, 94, 0.4)",
      transition: { type: "spring", stiffness: 300, damping: 10 }
    },
    tap: { scale: 0.95 }
  }

  // Floating elements for background
  const floatingElements = Array.from({ length: 12 }, (_, i) => (
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        {/* Interactive gradient following mouse */}
        <motion.div
          className="absolute inset-0 opacity-20"
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
          className="max-w-7xl mx-auto space-y-8"
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
                <span className="text-8xl filter drop-shadow-2xl">🛒</span>
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
              className="text-6xl font-black bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                  "0 0 30px rgba(16, 185, 129, 0.7)",
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Premium Flower Shop
            </motion.h1>
            
            <motion.p
              className="text-green-200 text-xl max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Experience the finest organic banana flower blossoms 🌺
            </motion.p>
          </motion.div>

          {/* Enhanced Welcome Section with Fixed Navigation */}
          <motion.div
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden"
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center space-x-6">
                  <motion.div
                    className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <ShoppingCart className="w-10 h-10 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome back, {user.username}!</h2>
                    <p className="text-green-200 text-lg">Discover our premium organic collection</p>
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-green-200 ml-2">4.9/5 Rating</span>
                      </div>
                      <div className="flex items-center gap-2 text-green-200">
                        <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                        <span>1000+ Happy Customers</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <motion.button
                    onClick={scrollToOrderForm}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center space-x-3"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Place Order</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={scrollToOrderHistory}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-300 flex items-center space-x-3"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Eye className="w-5 h-5" />
                    <span>View Orders</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Product & Order Section - Always Visible */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8" ref={orderFormRef}>
            {/* Enhanced Product Card - Updated for USD pricing */}
            <motion.div
              className="xl:col-span-1 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden"
              variants={cardVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <motion.div
                    className="text-9xl mb-4"
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
                    {product.image}
                  </motion.div>
                  
                  <div className="bg-white/10 rounded-2xl p-1 mb-4">
                    <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-green-200 mb-4 leading-relaxed">{product.description}</p>
                  </div>
                </div>

                {/* Product Features */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {product.features.map((feature, index) => (
                    <motion.div 
                      key={index}
                      className="bg-white/10 rounded-xl p-3 text-center border border-white/20"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    >
                      <span className="text-green-300 font-medium text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Rating and Reviews */}
                <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                      <span className="text-white font-bold">{product.rating}</span>
                    </div>
                    <span className="text-green-200 text-sm">({product.reviews} reviews)</span>
                  </div>
                </div>
                
                {/* Price - Updated for USD */}
                <div className="text-center mb-6">
                  <motion.div
                    className="text-4xl font-black text-green-400 mb-3"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ${product.pricePer100g.toFixed(2)} / 100g
                  </motion.div>
                  
                  <motion.span 
                    className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${
                      product.inStock 
                        ? 'bg-green-500/20 text-green-300 border border-green-400/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-400/30'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {product.inStock ? (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        In Stock
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 mr-2" />
                        Out of Stock
                      </>
                    )}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Order Form - Updated for grams and USD */}
            <motion.div
              className="xl:col-span-2 bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden"
              variants={cardVariants}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-bold text-white flex items-center">
                    <Package className="w-8 h-8 mr-3 text-emerald-400" />
                    Place Your Order
                  </h3>
                  <div className="flex items-center gap-2 text-green-200">
                    <Truck className="w-5 h-5" />
                    <span className="text-sm">Free delivery on orders over $50</span>
                  </div>
                </div>
                
                <form onSubmit={handleCreateOrder} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Quantity Field - Updated for grams */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                      <label className="block text-lg font-semibold text-white mb-4">
                        Quantity (grams) - Min: 100g
                      </label>
                      <div className="flex items-center space-x-4">
                        <motion.button
                          type="button"
                          onClick={() => setOrderForm({...orderForm, quantity: Math.max(100, orderForm.quantity - 100)})}
                          className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Minus className="w-6 h-6" />
                        </motion.button>
                        
                        <motion.div
                          className="relative flex-1"
                          variants={inputVariants}
                          animate={focusedField === 'quantity' ? 'focused' : 'unfocused'}
                        >
                          <input
                            type="number"
                            name="quantity"
                            min="100"
                            max="10000"
                            step="100"
                            value={orderForm.quantity}
                            onChange={handleFormChange}
                            onFocus={() => setFocusedField('quantity')}
                            onBlur={() => setFocusedField('')}
                            className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-center text-2xl font-bold placeholder-gray-400 focus:outline-none focus:border-green-400 transition-all duration-300"
                            required
                          />
                        </motion.div>
                        
                        <motion.button
                          type="button"
                          onClick={() => setOrderForm({...orderForm, quantity: Math.min(10000, orderForm.quantity + 100)})}
                          className="w-14 h-14 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Plus className="w-6 h-6" />
                        </motion.button>
                      </div>
                    </motion.div>

                    {/* Phone Field */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                      <label className="block text-lg font-semibold text-white mb-4">
                        <Phone className="w-5 h-5 inline mr-2" />
                        Phone Number
                      </label>
                      <motion.div
                        className="relative"
                        variants={inputVariants}
                        animate={focusedField === 'phone' ? 'focused' : 'unfocused'}
                      >
                        <input
                          type="tel"
                          name="phone"
                          value={orderForm.phone}
                          onChange={handleFormChange}
                          onFocus={() => setFocusedField('phone')}
                          onBlur={() => setFocusedField('')}
                          className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-all duration-300 text-lg"
                          placeholder="Enter your phone number"
                          required
                        />
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Address Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-lg font-semibold text-white mb-4">
                      <MapPin className="w-5 h-5 inline mr-2" />
                      Delivery Address
                    </label>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      animate={focusedField === 'address' ? 'focused' : 'unfocused'}
                    >
                      <textarea
                        name="address"
                        rows={3}
                        value={orderForm.address}
                        onChange={handleFormChange}
                        onFocus={() => setFocusedField('address')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-all duration-300 resize-none text-lg"
                        placeholder="Enter your complete delivery address"
                        required
                      />
                    </motion.div>
                  </motion.div>

                  {/* Special Instructions Field */}
                  <motion.div variants={itemVariants}>
                    <label className="block text-lg font-semibold text-white mb-4">
                      <FileText className="w-5 h-5 inline mr-2" />
                      Special Instructions (Optional)
                    </label>
                    <motion.div
                      className="relative"
                      variants={inputVariants}
                      animate={focusedField === 'specialInstructions' ? 'focused' : 'unfocused'}
                    >
                      <textarea
                        name="specialInstructions"
                        rows={2}
                        value={orderForm.specialInstructions}
                        onChange={handleFormChange}
                        onFocus={() => setFocusedField('specialInstructions')}
                        onBlur={() => setFocusedField('')}
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-green-400 transition-all duration-300 resize-none text-lg"
                        placeholder="Any special delivery instructions..."
                      />
                    </motion.div>
                  </motion.div>

                  {/* Enhanced Order Summary - Updated for USD */}
                  <motion.div 
                    className="border-t border-white/20 pt-8 space-y-6"
                    variants={itemVariants}
                  >
                    <div className="bg-gradient-to-r from-white/10 to-white/5 rounded-3xl p-8 border border-white/20">
                      <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                        <CreditCard className="w-6 h-6 mr-3 text-green-400" />
                        Order Summary
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-green-200">Product:</span>
                          <span className="font-bold text-white">{product.name}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-green-200">Quantity:</span>
                          <span className="font-bold text-white">{orderForm.quantity}g</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-green-200">Price per 100g:</span>
                          <span className="font-bold text-white">${product.pricePer100g.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg border-t border-white/20 pt-4">
                          <span className="text-green-200">Delivery:</span>
                          <span className="font-bold text-green-400">
                            {parseFloat(calculateTotal()) >= 50 ? 'FREE' : '$5.00'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-2xl font-black border-t border-white/20 pt-4">
                          <span className="text-white">Total:</span>
                          <motion.span 
                            className="text-green-400"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            ${(parseFloat(calculateTotal()) + (parseFloat(calculateTotal()) >= 50 ? 0 : 5)).toFixed(2)}
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isProcessingPayment || !product.inStock}
                      className="w-full py-6 px-8 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 text-white font-bold rounded-2xl text-xl shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      variants={buttonVariants}
                      whileHover={!isProcessingPayment ? "hover" : ""}
                      whileTap={!isProcessingPayment ? "tap" : ""}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <span className="relative z-10 flex items-center justify-center">
                        {isProcessingPayment ? (
                          <>
                            <motion.div
                              className="w-7 h-7 border-3 border-white/30 border-t-white rounded-full mr-4"
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                            Processing Your Order...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-7 h-7 mr-4" />
                            💳 Pay ${(parseFloat(calculateTotal()) + (parseFloat(calculateTotal()) >= 50 ? 0 : 5)).toFixed(2)} & Place Order 🌺
                          </>
                        )}
                      </span>
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>

          {/* Enhanced Order History - Updated ref */}
          <motion.div
            ref={orderHistoryRef}
            className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-2xl p-8 relative overflow-hidden"
            variants={cardVariants}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                <div>
                  <h2 className="text-4xl font-bold text-white flex items-center mb-3">
                    <Package className="w-8 h-8 mr-4 text-green-400" />
                    Your Order History
                    <span className="text-xl font-normal text-green-200 ml-4 bg-white/10 px-4 py-2 rounded-full">
                      {userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'}
                    </span>
                  </h2>
                  <p className="text-green-200 text-lg">Track all your wellness orders and deliveries</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-sm text-green-300 bg-white/10 px-4 py-3 rounded-xl border border-white/20">
                    <span className="font-semibold">Customer:</span> {user.username}
                  </div>
                  <motion.button
                    onClick={fetchUserOrders}
                    className="px-6 py-3 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-xl font-medium hover:bg-blue-500/30 transition-all duration-200 flex items-center space-x-3"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>Refresh</span>
                  </motion.button>
                </div>
              </div>
              
              {isLoading ? (
                <motion.div 
                  className="text-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-20 h-20 border-4 border-green-400/30 border-t-green-400 rounded-full mx-auto mb-6"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <p className="text-green-200 text-xl">Loading your orders...</p>
                </motion.div>
              ) : userOrders.length > 0 ? (
                <motion.div 
                  className="space-y-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {userOrders.map((order, index) => {
                    const statusDisplay = getStatusDisplay(order.paymentStatus || 'PENDING')
                    const nextSteps = getNextSteps(order.paymentStatus || 'PENDING')
                    return (
                      <motion.div 
                        key={order.id} 
                        className={`bg-gradient-to-r ${statusDisplay.bgGradient} border ${statusDisplay.borderColor} rounded-3xl p-8 relative overflow-hidden`}
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="absolute inset-0 bg-white/5 rounded-3xl"></div>
                        
                        <div className="relative z-10">
                          {/* Order Header */}
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-4">
                                <h3 className="font-bold text-3xl text-white">Order #{order.id}</h3>
                                <motion.div 
                                  className={`flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold border ${statusDisplay.color}`}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {statusDisplay.icon}
                                  <span>{statusDisplay.text}</span>
                                </motion.div>
                              </div>
                              <p className="text-green-200 mb-3 text-lg">
                                📅 Ordered on {new Date(order.orderDateTime).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                              <p className="text-green-300 text-xl">{statusDisplay.description}</p>
                            </div>
                            <div className="text-right">
                              <motion.p 
                                className="font-black text-4xl text-green-400 mb-2"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                ${order.totalAmount?.toFixed(2)}
                              </motion.p>
                              <p className="text-green-200">Total Amount</p>
                            </div>
                          </div>
                          
                          {/* Order Details Grid */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <motion.div 
                              className="bg-white/10 rounded-2xl p-6 border border-white/20"
                              whileHover={{ scale: 1.02 }}
                            >
                              <p className="text-lg font-bold text-green-200 mb-3 flex items-center">
                                <Package className="w-5 h-5 mr-3" />
                                Items Ordered:
                              </p>
                              <p className="text-white font-medium text-lg">{order.items || 'No items specified'}</p>
                            </motion.div>
                            
                            <motion.div 
                              className="bg-white/10 rounded-2xl p-6 border border-white/20"
                              whileHover={{ scale: 1.02 }}
                            >
                              <p className="text-lg font-bold text-green-200 mb-3 flex items-center">
                                <MapPin className="w-5 h-5 mr-3" />
                                Delivery Address:
                              </p>
                              <p className="text-white font-medium text-lg">{order.address?.split(' | ')[0] || order.address || 'No address provided'}</p>
                            </motion.div>
                            
                            {order.address?.includes('Phone:') && (
                              <motion.div 
                                className="bg-white/10 rounded-2xl p-6 border border-white/20"
                                whileHover={{ scale: 1.02 }}
                              >
                                <p className="text-lg font-bold text-green-200 mb-3 flex items-center">
                                  <Phone className="w-5 h-5 mr-3" />
                                  Contact Number:
                                </p>
                                <p className="text-white font-medium text-lg">
                                  {order.address.split('Phone: ')[1]?.split(' | ')[0] || 'Not provided'}
                                </p>
                              </motion.div>
                            )}
                            
                            {order.paymentId && (
                              <motion.div 
                                className="bg-white/10 rounded-2xl p-6 border border-white/20"
                                whileHover={{ scale: 1.02 }}
                              >
                                <p className="text-lg font-bold text-green-200 mb-3 flex items-center">
                                  <CreditCard className="w-5 h-5 mr-3" />
                                  Payment ID:
                                </p>
                                <p className="text-white font-medium font-mono text-lg">{order.paymentId}</p>
                              </motion.div>
                            )}
                          </div>
                          
                          {/* Next Steps & Actions */}
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-6 border-t border-white/20">
                            <div className="flex-1">
                              <p className="text-lg font-bold text-green-200 mb-3 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-3" />
                                Next Steps:
                              </p>
                              <p className="text-green-300 font-medium text-lg">{nextSteps}</p>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              {order.paymentStatus === 'FAILED' && (
                                <motion.button 
                                  onClick={() => {
                                    toast.info('Retry payment feature coming soon!')
                                  }}
                                  className="px-6 py-3 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-xl font-medium hover:bg-blue-500/30 transition-all duration-200 flex items-center space-x-3"
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Repeat className="w-5 h-5" />
                                  <span>Retry Payment</span>
                                </motion.button>
                              )}
                              
                              {order.paymentStatus === 'PENDING' && (
                                <motion.button 
                                  onClick={() => {
                                    toast.info('Payment reminder sent!')
                                  }}
                                  className="px-6 py-3 bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 rounded-xl font-medium hover:bg-yellow-500/30 transition-all duration-200 flex items-center space-x-3"
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Clock className="w-5 h-5" />
                                  <span>Complete Payment</span>
                                </motion.button>
                              )}
                              
                              {(order.paymentStatus === 'PAID' || order.paymentStatus === 'PENDING') && (
                                <motion.button 
                                  onClick={() => {
                                    if (window.confirm('Are you sure you want to cancel this order?')) {
                                      toast.info('Order cancellation feature coming soon!')
                                    }
                                  }}
                                  className="px-6 py-3 bg-gray-500/20 text-gray-300 border border-gray-400/30 rounded-xl font-medium hover:bg-gray-500/30 transition-all duration-200 flex items-center space-x-3"
                                  variants={buttonVariants}
                                  whileHover="hover"
                                  whileTap="tap"
                                >
                                  <Ban className="w-5 h-5" />
                                  <span>Cancel Order</span>
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="text-9xl mb-8"
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
                    📦
                  </motion.div>
                  <h3 className="text-4xl font-bold text-white mb-6">No orders yet</h3>
                  <p className="text-green-200 mb-10 text-xl max-w-2xl mx-auto">
                    Start your wellness journey with our premium organic banana flower blossoms!
                  </p>
                  <motion.button
                    onClick={scrollToOrderForm}
                    className="px-10 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all duration-200 flex items-center space-x-4 mx-auto text-xl"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Plus className="w-7 h-7" />
                    <span>Place Your First Order</span>
                    <span>🌺</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Enhanced Decorative Elements */}
          <motion.div
            className="flex justify-center space-x-8 mt-12"
            variants={itemVariants}
          >
            {['🌺', '🛒', '📦', '💳', '🚚'].map((emoji, index) => (
              <motion.div
                key={index}
                className="text-5xl cursor-pointer filter drop-shadow-2xl"
                whileHover={{ 
                  scale: 1.8, 
                  rotate: 360,
                  filter: "drop-shadow(0 0 30px rgba(34, 197, 94, 0.8))"
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

          {/* Enhanced Footer Message */}
          <motion.div
            className="text-center mt-12"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
              <p className="text-green-300 text-xl mb-4">
                🌟 Your wellness journey starts with every order - fresh, natural, premium quality! 🌟
              </p>
              <p className="text-green-200 text-lg">
                Free delivery on orders over $50 • Organic certified • 100% satisfaction guarantee
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrdersPage
