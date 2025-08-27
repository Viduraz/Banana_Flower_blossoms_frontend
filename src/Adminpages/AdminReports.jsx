import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import toast from 'react-hot-toast'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

function AdminReports() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [reportsData, setReportsData] = useState(null)
  const [topCustomers, setTopCustomers] = useState([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access admin panel')
      navigate('/login')
      return
    }

    if (!user.roles?.includes('ROLE_ADMIN')) {
      toast.error('Access denied. Admin privileges required.')
      navigate('/dashboard')
      return
    }

    fetchReportsData()
    fetchTopCustomers()
  }, [isAuthenticated, navigate, user])

  const fetchReportsData = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching reports data...')
      
      const response = await fetch('http://localhost:8080/api/admin/reports/overview', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()
      console.log('Reports API Response:', result)
      
      if (result.success) {
        setReportsData(result.data)
        console.log('Reports data loaded successfully')
      } else {
        console.log('Failed to load reports data')
        toast.error('Failed to load reports data')
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      toast.error('Failed to fetch reports data')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTopCustomers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/reports/top-customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      const result = await response.json()
      if (result.success) {
        setTopCustomers(result.data)
      }
    } catch (error) {
      console.error('Error fetching top customers:', error)
    }
  }

  // Chart configurations
  const getChartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
  })

  // Revenue Chart Data
  const getRevenueChartData = () => {
    if (!reportsData?.revenueAnalytics?.monthlyRevenue) return null

    const monthlyRevenue = reportsData.revenueAnalytics.monthlyRevenue
    const months = Object.keys(monthlyRevenue).sort()
    const revenues = months.map(month => monthlyRevenue[month])

    return {
      labels: months.map(month => {
        const [year, monthNum] = month.split('-')
        return new Date(year, monthNum - 1).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        })
      }),
      datasets: [
        {
          label: 'Revenue (LKR)',
          data: revenues,
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
        },
      ],
    }
  }

  // Orders Trend Chart Data
  const getOrdersTrendData = () => {
    if (!reportsData?.monthlyTrends?.monthlyOrders) return null

    const monthlyOrders = reportsData.monthlyTrends.monthlyOrders
    const months = Object.keys(monthlyOrders).sort()
    const orderCounts = months.map(month => monthlyOrders[month])

    return {
      labels: months.map(month => {
        const [year, monthNum] = month.split('-')
        return new Date(year, monthNum - 1).toLocaleDateString('en-US', { 
          month: 'short', 
          year: 'numeric' 
        })
      }),
      datasets: [
        {
          label: 'Orders',
          data: orderCounts,
          fill: false,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          tension: 0.1,
        },
      ],
    }
  }

  // Payment Status Pie Chart
  const getPaymentStatusData = () => {
    if (!reportsData?.paymentStatusDistribution?.distribution) return null

    const distribution = reportsData.paymentStatusDistribution.distribution
    
    return {
      labels: Object.keys(distribution),
      datasets: [
        {
          label: 'Orders',
          data: Object.values(distribution),
          backgroundColor: [
            'rgba(34, 197, 94, 0.8)',   // PAID - Green
            'rgba(251, 191, 36, 0.8)',  // PENDING - Yellow
            'rgba(239, 68, 68, 0.8)',   // FAILED - Red
            'rgba(156, 163, 175, 0.8)', // CANCELLED - Gray
          ],
          borderColor: [
            'rgba(34, 197, 94, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(239, 68, 68, 1)',
            'rgba(156, 163, 175, 1)',
          ],
          borderWidth: 2,
        },
      ],
    }
  }

  // Country Distribution Chart
  const getCountryData = () => {
    if (!reportsData?.userAnalytics?.countryDistribution) return null

    const countries = reportsData.userAnalytics.countryDistribution
    
    return {
      labels: Object.keys(countries),
      datasets: [
        {
          label: 'Users',
          data: Object.values(countries),
          backgroundColor: [
            'rgba(168, 85, 247, 0.8)',  // Purple
            'rgba(236, 72, 153, 0.8)',  // Pink
            'rgba(59, 130, 246, 0.8)',  // Blue
            'rgba(16, 185, 129, 0.8)',  // Emerald
            'rgba(245, 158, 11, 0.8)',  // Amber
          ],
          borderColor: [
            'rgba(168, 85, 247, 1)',
            'rgba(236, 72, 153, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(245, 158, 11, 1)',
          ],
          borderWidth: 2,
        },
      ],
    }
  }

  // Quantity Distribution Chart
  const getQuantityData = () => {
    if (!reportsData?.orderAnalytics?.quantityDistribution) return null

    const quantities = reportsData.orderAnalytics.quantityDistribution
    
    return {
      labels: Object.keys(quantities),
      datasets: [
        {
          label: 'Orders',
          data: Object.values(quantities),
          backgroundColor: 'rgba(139, 69, 19, 0.8)',
          borderColor: 'rgba(139, 69, 19, 1)',
          borderWidth: 2,
        },
      ],
    }
  }

  if (!isAuthenticated || !user.roles?.includes('ROLE_ADMIN')) {
    return null
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 shadow rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-purple-100">Comprehensive business insights and data analysis</p>
            </div>
            <button
              onClick={fetchReportsData}
              disabled={isLoading}
              className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-md hover:bg-opacity-30 disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white shadow rounded-lg">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'revenue', name: 'Revenue', icon: '💰' },
              { id: 'orders', name: 'Orders', icon: '📦' },
              { id: 'users', name: 'Users', icon: '👥' },
              { id: 'customers', name: 'Top Customers', icon: '⭐' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading reports data...</p>
          </div>
        ) : !reportsData ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📊</div>
            <p className="text-gray-600">No reports data available</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          <dd className="text-2xl font-bold text-gray-900">
                            {reportsData.userAnalytics?.totalUsers || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

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
                          <dd className="text-2xl font-bold text-gray-900">
                            {reportsData.orderAnalytics?.totalOrders || 0}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

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
                          <dd className="text-2xl font-bold text-gray-900">
                            LKR {reportsData.revenueAnalytics?.totalRevenue?.toFixed(2) || '0.00'}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6 border-l-4 border-orange-500">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">📊</span>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                          <dd className="text-2xl font-bold text-gray-900">
                            LKR {reportsData.orderAnalytics?.averageOrderValue?.toFixed(2) || '0.00'}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Payment Status Distribution */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Status Distribution</h3>
                    <div className="h-64">
                      {getPaymentStatusData() && (
                        <Pie data={getPaymentStatusData()} options={getChartOptions('Order Status')} />
                      )}
                    </div>
                  </div>

                  {/* User Country Distribution */}
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Distribution by Country</h3>
                    <div className="h-64">
                      {getCountryData() && (
                        <Doughnut data={getCountryData()} options={getChartOptions('Users by Country')} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        LKR {reportsData.revenueAnalytics?.totalRevenue?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Total Revenue</div>
                    </div>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">
                        LKR {reportsData.revenueAnalytics?.pendingRevenue?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Pending Revenue</div>
                    </div>
                  </div>
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        LKR {reportsData.orderAnalytics?.averageOrderValue?.toFixed(2) || '0.00'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Average Order Value</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
                  <div className="h-80">
                    {getRevenueChartData() && (
                      <Bar data={getRevenueChartData()} options={getChartOptions('Monthly Revenue (LKR)')} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Trends</h3>
                    <div className="h-64">
                      {getOrdersTrendData() && (
                        <Line data={getOrdersTrendData()} options={getChartOptions('Monthly Orders')} />
                      )}
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quantity Distribution</h3>
                    <div className="h-64">
                      {getQuantityData() && (
                        <Bar data={getQuantityData()} options={getChartOptions('Orders by Quantity')} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {reportsData.orderAnalytics?.totalQuantitySold || 0} kg
                      </div>
                      <div className="text-sm text-gray-600">Total Quantity Sold</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {Object.values(reportsData.paymentStatusDistribution?.distribution || {})
                          .reduce((a, b) => Number(a) + Number(b), 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Orders</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900">
                        {reportsData.paymentStatusDistribution?.distribution?.PAID || 0}
                      </div>
                      <div className="text-sm text-gray-600">Successful Orders</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">User Roles Distribution</h3>
                    <div className="space-y-3">
                      {reportsData.userAnalytics?.roleDistribution && 
                        Object.entries(reportsData.userAnalytics.roleDistribution).map(([role, count]) => (
                          <div key={role} className="flex justify-between items-center">
                            <span className="font-medium">{role}</span>
                            <span className="text-gray-600">{count} users</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Authentication Methods</h3>
                    <div className="space-y-3">
                      {reportsData.userAnalytics?.authProviderDistribution && 
                        Object.entries(reportsData.userAnalytics.authProviderDistribution).map(([provider, count]) => (
                          <div key={provider} className="flex justify-between items-center">
                            <span className="font-medium">{provider}</span>
                            <span className="text-gray-600">{count} users</span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Geographic Distribution</h3>
                  <div className="h-64">
                    {getCountryData() && (
                      <Bar data={getCountryData()} options={getChartOptions('Users by Country')} />
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Top Customers Tab */}
            {activeTab === 'customers' && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Top Customers by Revenue</h3>
                  {topCustomers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Rank
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total Spent
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Orders
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {topCustomers.map((customer, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                #{index + 1}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {customer.username}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {customer.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                LKR {customer.totalSpent?.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {customer.orderCount} orders
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">👥</div>
                      <p className="text-gray-600">No customer data available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminReports
