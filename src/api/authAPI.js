import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Auth APIs
export const authAPI = {
  // User registration
  register: (userData) => api.post('/auth/register', userData),
  
  // Admin registration
  registerAdmin: (userData) => api.post('/auth/register-admin', userData),
  
  // User login
  login: (credentials) => api.post('/auth/login', credentials),
  
  // Check admin status
  checkAdmin: (email) => api.get(`/auth/check-admin/${email}`),
  
  // Health check
  healthCheck: () => api.get('/auth/health'),
  
  // Update user profile
  updateUser: (email, userData) => api.put(`/auth/update/${email}`, userData),
  
  // Delete user
  deleteUser: (email) => api.delete(`/auth/delete/${email}`),
  
  // Change password
  changePassword: (email, passwordData) => api.put(`/auth/change-password/${email}`, passwordData),
  
  // Forgot password
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (resetData) => api.post('/auth/reset-password', resetData),
  
  // Google authentication
  googleAuth: (googleData) => api.post('/auth/google', googleData),
  
  // Verify Firebase token
  verifyToken: (idToken) => api.post('/auth/verify-token', idToken),
}

// Contact APIs
export const contactAPI = {
  // Submit contact message
  submitMessage: (messageData) => api.post('/contact', messageData),
  
  // Get all contact messages (admin only)
  getAllMessages: () => api.get('/contact'),
}

// Admin APIs
export const adminAPI = {
  // Get admin dashboard data
  getDashboard: () => api.get('/admin/dashboard'),
  
  // Get all users
  getAllUsers: () => api.get('/admin/users'),
}

// Order APIs
export const orderAPI = {
  // Create order for user
  createOrder: async (userId, orderData) => {
    const response = await api.post(`/orders/${userId}`, orderData)
    return response.data
  },
  
  // Get orders by user
  getUserOrders: async (userId) => {
    const response = await api.get(`/orders/${userId}`)
    return response.data
  },
  
  // Get all orders (admin only)
  getAllOrders: async () => {
    const response = await api.get('/orders/all')
    return response.data
  },
  
  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status })
    return response.data
  }
}

// Payment APIs
export const paymentAPI = {
  // Initiate payment
  initiatePayment: (paymentData) => api.post('/payment/initiate', paymentData),
  
  // Handle payment notification
  handleNotification: (notificationData) => api.post('/payment/notify', notificationData),
}

export default api

