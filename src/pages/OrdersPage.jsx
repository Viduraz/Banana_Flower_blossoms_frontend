import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import { orderAPI } from '../api/authAPI'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

function OrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [userOrders, setUserOrders] = useState([])
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  // Product details (Banana Flower Blossoms)
  const [product] = useState({
    id: 1,
    name: 'Fresh Banana Flower Blossoms',
    description: 'Premium quality banana flower blossoms, hand-picked and fresh',
    pricePerKg: 25.00,
    currency: 'LKR',
    image: '🌺',
    inStock: true
  })

  // Order form state
  const [orderForm, setOrderForm] = useState({
    quantity: 1,
    address: '',
    phone: '',
    specialInstructions: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access orders')
      navigate('/login')
      return
    }

    fetchUserOrders()
  }, [isAuthenticated, navigate])

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

  const calculateTotal = () => {
    return (orderForm.quantity * product.pricePerKg).toFixed(2)
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

    if (orderForm.quantity <= 0) {
      toast.error('Please enter valid quantity')
      return
    }

    setIsProcessingPayment(true)

    try {
      // Create order in backend
      const orderData = {
        address: `${orderForm.address} | Phone: ${orderForm.phone} | Instructions: ${orderForm.specialInstructions}`,
        items: `${product.name} - ${orderForm.quantity}kg`,
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
        
        // Prepare payment data with proper order ID
        const paymentData = {
          orderId: `ORD-${order.id}-${Date.now()}`, // Now order.id should be valid
          items: `${product.name} (${orderForm.quantity}kg)`,
          amount: parseFloat(calculateTotal()),
          currency: product.currency,
          firstName: user.username.split(' ')[0] || user.username,
          lastName: user.username.split(' ')[1] || 'User',
          email: user.email,
          phone: orderForm.phone,
          address: orderForm.address,
          city: 'Colombo'
        }

        console.log('Payment data being sent:', paymentData);

        // Initiate payment
        await initiatePayment(paymentData)
        
        // Reset form and refresh orders
        setOrderForm({
          quantity: 1,
          address: '',
          phone: '',
          specialInstructions: ''
        })
        setShowOrderForm(false)
        fetchUserOrders()
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
      
      // Call your payment API to get PayHere parameters
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
        icon: '⏳',
        description: 'Awaiting payment confirmation'
      },
      'PAID': { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        text: 'Paid & Processing',
        icon: '✅',
        description: 'Payment successful, order being processed'
      },
      'FAILED': { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        text: 'Payment Failed',
        icon: '❌',
        description: 'Payment was unsuccessful'
      },
      'CANCELLED': { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        text: 'Cancelled',
        icon: '🚫',
        description: 'Order was cancelled'
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

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Orders & Shop</h1>
              <p className="text-gray-600">Place new orders and track existing ones</p>
            </div>
            <button
              onClick={() => setShowOrderForm(!showOrderForm)}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
            >
              {showOrderForm ? 'Cancel Order' : 'Place New Order'}
            </button>
          </div>
        </div>

        {/* Product Display & Order Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Card */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">{product.image}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="text-3xl font-bold text-green-600">
                {product.currency} {product.pricePerKg.toFixed(2)} / kg
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Order Form */}
          {showOrderForm && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Place Your Order</h3>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (kg)
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    max="100"
                    value={orderForm.quantity}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Delivery Address
                  </label>
                  <textarea
                    name="address"
                    rows={3}
                    value={orderForm.address}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Enter your complete delivery address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderForm.phone}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="07XXXXXXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="specialInstructions"
                    rows={2}
                    value={orderForm.specialInstructions}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="Any special delivery instructions..."
                  />
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{orderForm.quantity} kg</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Price per kg:</span>
                    <span className="font-medium">{product.currency} {product.pricePerKg.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-green-600">{product.currency} {calculateTotal()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessingPayment || !product.inStock}
                  className="w-full py-3 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isProcessingPayment ? 'Processing...' : `Pay ${product.currency} ${calculateTotal()} & Place Order`}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Order History with Enhanced Status Integration */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Order History 
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({userOrders.length} {userOrders.length === 1 ? 'order' : 'orders'})
              </span>
            </h2>
            <div className="flex gap-2">
              <span className="text-sm text-gray-500">
                User: {user.username} (ID: {user.id})
              </span>
              <button
                onClick={fetchUserOrders}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Refresh Orders
              </button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your orders...</p>
            </div>
          ) : userOrders.length > 0 ? (
            <div className="space-y-6">
              {userOrders.map((order) => {
                const statusDisplay = getStatusDisplay(order.paymentStatus || 'PENDING')
                const nextSteps = getNextSteps(order.paymentStatus || 'PENDING')
                return (
                  <div key={order.id} className={`border rounded-lg p-6 ${statusDisplay.color.includes('border') ? '' : 'border-gray-200'}`}>
                    {/* Order Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">Order #{order.id}</h3>
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${statusDisplay.color}`}>
                            <span>{statusDisplay.icon}</span>
                            <span>{statusDisplay.text}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          Ordered on {new Date(order.orderDateTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{statusDisplay.description}</p>
                        {/* Debug info - remove in production */}
                        <p className="text-xs text-gray-400 mt-1">
                          Order User: {order.user?.username} (ID: {order.user?.id})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-green-600">
                          {product.currency} {order.totalAmount?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Items Ordered:</p>
                        <p className="text-sm text-gray-900">{order.items || 'No items specified'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Delivery Address:</p>
                        <p className="text-sm text-gray-900">{order.address?.split(' | ')[0] || order.address || 'No address provided'}</p>
                      </div>
                      {order.address?.includes('Phone:') && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Contact Number:</p>
                          <p className="text-sm text-gray-900">
                            {order.address.split('Phone: ')[1]?.split(' | ')[0] || 'Not provided'}
                          </p>
                        </div>
                      )}
                      {order.paymentId && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Payment ID:</p>
                          <p className="text-sm text-gray-900 font-mono">{order.paymentId}</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Next Steps & Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700 mb-1">Next Steps:</p>
                        <p className="text-sm text-gray-600">{nextSteps}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {order.paymentStatus === 'FAILED' && (
                          <button 
                            onClick={() => {
                              toast.info('Retry payment feature coming soon!')
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                          >
                            Retry Payment
                          </button>
                        )}
                        
                        {order.paymentStatus === 'PENDING' && (
                          <button 
                            onClick={() => {
                              toast.info('Payment reminder sent!')
                            }}
                            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm font-medium"
                          >
                            Complete Payment
                          </button>
                        )}
                        
                        {(order.paymentStatus === 'PAID' || order.paymentStatus === 'PENDING') && (
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this order?')) {
                                toast.info('Order cancellation feature coming soon!')
                              }
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm font-medium"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Place your first order to see it here!</p>
              <button
                onClick={() => setShowOrderForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Place Your First Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersPage