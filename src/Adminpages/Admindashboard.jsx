import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import { useNavigate } from 'react-router-dom'
import { adminAPI, orderAPI, contactAPI } from '../api/authAPI'
import AdminLayout from '../layouts/AdminLayout'
import toast from 'react-hot-toast'

function Admindashboard() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    failedOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    todayOrders: 0,
    totalMessages: 0,
    recentOrders: [],
    systemStatus: 'Loading...'
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access admin panel')
      navigate('/login')
      return
    }

    if (!user.roles?.includes('ROLE_ADMIN')) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/')
      return
    }

    fetchDashboardData()
  }, [isAuthenticated, navigate, user])

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Fetch all data in parallel
      const [dashboardResponse, ordersResponse, messagesResponse] = await Promise.all([
        adminAPI.getDashboard(),
        orderAPI.getAllOrders(),
        contactAPI.getAllMessages().catch(() => ({ data: { data: [] } })) // Handle if messages API fails
      ])

      // Process order statistics
      let orderStats = { 
        total: 0, 
        pending: 0, 
        completed: 0, 
        failed: 0, 
        cancelled: 0,
        totalRevenue: 0,
        todayOrders: 0,
        recentOrders: []
      }
      
      if (ordersResponse.success && ordersResponse.data) {
        const orders = ordersResponse.data
        const today = new Date().toDateString()
        
        orderStats = {
          total: orders.length,
          pending: orders.filter(order => order.paymentStatus === 'PENDING').length,
          completed: orders.filter(order => order.paymentStatus === 'PAID').length,
          failed: orders.filter(order => order.paymentStatus === 'FAILED').length,
          cancelled: orders.filter(order => order.paymentStatus === 'CANCELLED').length,
          totalRevenue: orders
            .filter(order => order.paymentStatus === 'PAID')
            .reduce((sum, order) => sum + (order.totalAmount || 0), 0),
          todayOrders: orders.filter(order => 
            new Date(order.orderDateTime).toDateString() === today
          ).length,
          recentOrders: orders
            .sort((a, b) => new Date(b.orderDateTime) - new Date(a.orderDateTime))
            .slice(0, 5)
        }
      }

      // Process messages count
      const messagesCount = messagesResponse?.data?.data?.length || 0

      if (dashboardResponse.success) {
        setDashboardData({
          totalUsers: dashboardResponse.data?.totalUsers || 0,
          totalOrders: orderStats.total,
          pendingOrders: orderStats.pending,
          completedOrders: orderStats.completed,
          failedOrders: orderStats.failed,
          cancelledOrders: orderStats.cancelled,
          totalRevenue: orderStats.totalRevenue,
          todayOrders: orderStats.todayOrders,
          totalMessages: messagesCount,
          recentOrders: orderStats.recentOrders,
          systemStatus: dashboardResponse.data?.systemStatus || 'Online'
        })
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusDisplay = (paymentStatus) => {
    const statusMap = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Payment Pending', icon: '⏳' },
      'PAID': { color: 'bg-green-100 text-green-800', text: 'Paid & Processing', icon: '✅' },
      'FAILED': { color: 'bg-red-100 text-red-800', text: 'Payment Failed', icon: '❌' },
      'CANCELLED': { color: 'bg-gray-100 text-gray-800', text: 'Cancelled', icon: '🚫' }
    }
    return statusMap[paymentStatus] || statusMap['PENDING']
  }

  if (!isAuthenticated || !user.roles?.includes('ROLE_ADMIN')) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100">Welcome back, {user?.username}! Here's your comprehensive overview.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchDashboardData}
                disabled={isLoading}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 disabled:opacity-50 backdrop-blur-sm"
              >
                {isLoading ? 'Refreshing...' : 'Refresh Data'}
              </button>
              <div className="text-right">
                <span className="inline-flex px-3 py-1 bg-white text-blue-600 rounded-full font-semibold text-sm">
                  ADMINISTRATOR
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-2xl font-bold text-gray-900">{dashboardData.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📦</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd className="text-2xl font-bold text-gray-900">{dashboardData.totalOrders}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">💰</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-2xl font-bold text-gray-900">LKR {dashboardData.totalRevenue.toFixed(2)}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Today's Orders */}
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">📅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Today's Orders</dt>
                  <dd className="text-2xl font-bold text-gray-900">{dashboardData.todayOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pending Orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{dashboardData.pendingOrders}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{dashboardData.completedOrders}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Failed Orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">❌</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Failed Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{dashboardData.failedOrders}</dd>
                </dl>
              </div>
            </div>
          </div>

          {/* Cancelled Orders */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">🚫</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Cancelled Orders</dt>
                  <dd className="text-lg font-medium text-gray-900">{dashboardData.cancelledOrders}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders & Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
              <button
                onClick={() => navigate('/admin/orders')}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
              >
                View All
              </button>
            </div>
            
            {dashboardData.recentOrders.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.recentOrders.map((order) => {
                  const statusDisplay = getStatusDisplay(order.paymentStatus || 'PENDING')
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className="font-medium text-gray-900">#{order.id}</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusDisplay.color}`}>
                            {statusDisplay.icon} {statusDisplay.text}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {order.user?.username || 'Unknown User'} • {order.items || 'No items specified'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">LKR {order.totalAmount?.toFixed(2) || '0.00'}</div>
                        <div className="text-xs text-gray-500">
                          {order.orderDateTime ? new Date(order.orderDateTime).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📦</div>
                <p>No recent orders</p>
              </div>
            )}
          </div>

          {/* Messages & System Info */}
          <div className="space-y-6">
            {/* Messages Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                <button
                  onClick={() => navigate('/admin/messages')}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  View All
                </button>
              </div>
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{dashboardData.totalMessages}</p>
                  <p className="text-sm text-gray-600">Total Messages</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">System Status</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">{dashboardData.systemStatus}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">Connected</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Payment Gateway</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-sm font-medium text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/admin/orders')}
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">📦</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Manage Orders</div>
                <div className="text-sm text-gray-500">View and update order status</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3">👥</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Manage Users</div>
                <div className="text-sm text-gray-500">View and manage user accounts</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/profile')}
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3">⚙️</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Admin Settings</div>
                <div className="text-sm text-gray-500">Manage your admin profile</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/reports')}
              className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <span className="text-2xl mr-3">📊</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Reports</div>
                <div className="text-sm text-gray-500">View analytics and reports</div>
              </div>
            </button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Success Rate */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {dashboardData.totalOrders > 0 
                  ? ((dashboardData.completedOrders / dashboardData.totalOrders) * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Order Success Rate</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: dashboardData.totalOrders > 0 
                      ? `${(dashboardData.completedOrders / dashboardData.totalOrders) * 100}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                LKR {dashboardData.completedOrders > 0 
                  ? (dashboardData.totalRevenue / dashboardData.completedOrders).toFixed(2)
                  : '0.00'}
              </div>
              <div className="text-sm text-gray-600 mt-1">Average Order Value</div>
              <div className="text-xs text-gray-500 mt-1">Based on completed orders</div>
            </div>

            {/* Pending Rate */}
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {dashboardData.totalOrders > 0 
                  ? ((dashboardData.pendingOrders / dashboardData.totalOrders) * 100).toFixed(1)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Pending Orders</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: dashboardData.totalOrders > 0 
                      ? `${(dashboardData.pendingOrders / dashboardData.totalOrders) * 100}%`
                      : '0%'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Admindashboard
