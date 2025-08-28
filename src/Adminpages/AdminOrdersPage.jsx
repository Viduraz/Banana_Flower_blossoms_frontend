import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import { orderAPI } from '../api/authAPI'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import toast from 'react-hot-toast'

function AdminOrdersPage() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [allOrders, setAllOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('ALL')

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access admin panel')
      navigate('/login')
      return
    }

    // Check if user is admin
    if (!user.roles?.includes('ROLE_ADMIN')) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/dashboard')
      return
    }

    fetchAllOrders()
  }, [isAuthenticated, navigate, user])

  const fetchAllOrders = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching all orders...')
      
      const response = await orderAPI.getAllOrders()
      console.log('API Response:', response)
      console.log('Orders data:', response.data)
      
      // Handle the response structure
      if (response.success && response.data) {
        setAllOrders(response.data)
        setFilteredOrders(response.data)
        console.log('Orders loaded successfully:', response.data.length)
      } else {
        console.log('No orders found or unexpected response structure')
        setAllOrders([])
        setFilteredOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      console.error('Error response:', error.response)
      toast.error('Failed to fetch orders')
      setAllOrders([])
      setFilteredOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusFilter = (status) => {
    setStatusFilter(status)
    if (status === 'ALL') {
      setFilteredOrders(allOrders)
    } else {
      setFilteredOrders(allOrders.filter(order => order.paymentStatus === status))
    }
  }

  const getStatusDisplay = (paymentStatus) => {
    const statusMap = {
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', text: 'Payment Pending' },
      'PAID': { color: 'bg-green-100 text-green-800', text: 'Paid & Processing' },
      'FAILED': { color: 'bg-red-100 text-red-800', text: 'Payment Failed' },
      'CANCELLED': { color: 'bg-gray-100 text-gray-800', text: 'Cancelled' }
    }
    
    return statusMap[paymentStatus] || statusMap['PENDING']
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus)
      toast.success('Order status updated successfully')
      fetchAllOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error('Failed to update order status')
    }
  }

  if (!isAuthenticated || !user.roles?.includes('ROLE_ADMIN')) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600">View and manage all customer orders</p>
            </div>
            <button
              onClick={fetchAllOrders}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh Orders
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Orders</h2>
          <div className="flex flex-wrap gap-2">
            {['ALL', 'PENDING', 'PAID', 'FAILED', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-4 py-2 rounded-md font-medium ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status} ({status === 'ALL' ? allOrders.length : allOrders.filter(o => o.paymentStatus === status).length})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Orders ({filteredOrders.length})
          </h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Special Instructions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const statusDisplay = getStatusDisplay(order.paymentStatus || 'PENDING')
                    return (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div className="font-medium">{order.user?.username || 'Unknown User'}</div>
                            <div className="text-gray-500">{order.user?.email || 'No email'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.orderDateTime ? new Date(order.orderDateTime).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {order.items || 'No items specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {order.totalAmount ? `USD ${order.totalAmount.toFixed(2)}` : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusDisplay.color}`}>
                            {statusDisplay.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {order.address?.split(' | ')[0] || order.address || 'No address'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                          {order.specialInstructions ? (
                            <div className="truncate" title={order.specialInstructions}>
                              {order.specialInstructions}
                            </div>
                          ) : (
                            <span className="text-gray-400 italic">None</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={order.paymentStatus || 'PENDING'}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className="text-sm border border-gray-300 rounded-md px-2 py-1"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PAID">Paid</option>
                            <option value="FAILED">Failed</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-gray-600 text-lg">No orders found</p>
              <p className="text-gray-500">Orders will appear here when customers place them</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrdersPage