import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with interceptors
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔍 REQUEST INTERCEPTOR - Starting request to:', config.url);
    
    const token = localStorage.getItem('authToken');
    const expiry = localStorage.getItem('authExpiry');
    const user = localStorage.getItem('user');
    const now = Date.now();

    console.log('🔍 REQUEST INTERCEPTOR - Auth state check:', {
      hasToken: !!token,
      hasExpiry: !!expiry,
      hasUser: !!user,
      currentTime: new Date(now).toISOString(),
      expiryTime: expiry ? new Date(Number(expiry)).toISOString() : 'N/A',
      isExpired: expiry ? now > Number(expiry) : 'N/A'
    });

    // Check if token is expired before making request
    if (expiry && now > Number(expiry)) {
      console.log('❌ REQUEST INTERCEPTOR - Token expired, clearing storage');
      console.log('❌ Expiry time:', new Date(Number(expiry)).toISOString());
      console.log('❌ Current time:', new Date(now).toISOString());
      
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      localStorage.removeItem('authExpiry');
      
      console.log('❌ Storage cleared due to expiry');
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ REQUEST INTERCEPTOR - Added auth header for:', config.url);
    } else {
      console.log('⚠️ REQUEST INTERCEPTOR - No token found for:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ REQUEST INTERCEPTOR ERROR:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ RESPONSE INTERCEPTOR - Success for:', response.config.url);
    console.log('✅ Response status:', response.status);
    return response;
  },
  (error) => {
    console.log('❌ RESPONSE INTERCEPTOR - Error for:', error.config?.url);
    console.log('❌ Error status:', error.response?.status);
    console.log('❌ Error data:', error.response?.data);
    
    // Only clear auth on 401 if we actually sent a token
    if (error.response?.status === 401) {
      const sentToken = error.config?.headers?.Authorization;
      console.log('❌ 401 ERROR DETAILS:', {
        url: error.config?.url,
        sentToken: !!sentToken,
        tokenValue: sentToken ? sentToken.substring(0, 20) + '...' : 'None'
      });
      
      if (sentToken) {
        console.log('❌ RESPONSE INTERCEPTOR - 401 with token, clearing auth state');
        console.log('❌ Clearing localStorage and reloading page');
        
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authExpiry');
        
        // Add a small delay before reload to ensure cleanup
        setTimeout(() => {
          console.log('❌ Triggering page reload');
          window.location.reload();
        }, 100);
      } else {
        console.log('⚠️ RESPONSE INTERCEPTOR - 401 without token, not clearing auth');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  // User registration
  register: (userData) => apiClient.post('/auth/register', userData),
  
  // Admin registration
  registerAdmin: (userData) => apiClient.post('/auth/register-admin', userData),
  
  // User login
  login: (credentials) => apiClient.post('/auth/login', credentials),
  
  // Check admin status
  checkAdmin: (email) => apiClient.get(`/auth/check-admin/${email}`),
  
  // Health check
  healthCheck: () => apiClient.get('/auth/health'),
  
  // Update user profile
  updateUser: (email, userData) => apiClient.put(`/auth/update/${email}`, userData),
  
  // Delete user
  deleteUser: (email) => apiClient.delete(`/auth/delete/${email}`),
  
  // Change password
  changePassword: (email, passwordData) => apiClient.put(`/auth/change-password/${email}`, passwordData),
  
  // Forgot password
  forgotPassword: (email) => apiClient.post('/auth/forgot-password', { email }),
  
  // Reset password
  resetPassword: (resetData) => apiClient.post('/auth/reset-password', resetData),
  
  // Google authentication
  googleAuth: (googleData) => apiClient.post('/auth/google', googleData),
  
  // Verify Firebase token
  verifyToken: (idToken) => apiClient.post('/auth/verify-token', idToken),
}

// Contact APIs
export const contactAPI = {
  // Submit contact message
  submitMessage: (messageData) => apiClient.post('/contact', messageData),
  
  // Get all contact messages (admin only)
  getAllMessages: () => apiClient.get('/contact'),
}

// Admin APIs
export const adminAPI = {
  // Get admin dashboard data
  getDashboard: () => apiClient.get('/admin/dashboard'),
  
  // Get all users
  getAllUsers: () => apiClient.get('/admin/users'),
}

// Order APIs
export const orderAPI = {
  // Create order for user
  createOrder: async (userId, orderData) => {
    const response = await apiClient.post(`/orders/${userId}`, orderData)
    return response.data
  },
  
  // Get orders by user
  getUserOrders: async (userId) => {
    const response = await apiClient.get(`/orders/${userId}`)
    return response.data
  },
  
  // Get all orders (admin only)
  getAllOrders: async () => {
    const response = await apiClient.get('/orders/all')
    return response.data
  },
  
  // Update order status (admin only)
  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.put(`/orders/${orderId}/status`, { status })
    return response.data
  }
}

// Payment APIs
export const paymentAPI = {
  // Initiate payment
  initiatePayment: (paymentData) => apiClient.post('/payment/initiate', paymentData),
  
  // Handle payment notification
  handleNotification: (notificationData) => apiClient.post('/payment/notify', notificationData),
}

export default apiClient

