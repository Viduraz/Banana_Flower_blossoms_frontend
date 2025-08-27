import React, { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import { adminAPI } from '../api/authAPI'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import toast from 'react-hot-toast'

function Usermanagement() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

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

    fetchAllUsers()
  }, [isAuthenticated, navigate, user])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, roleFilter])

  const fetchAllUsers = async () => {
    try {
      setIsLoading(true)
      console.log('Fetching all users...')
      
      const response = await adminAPI.getAllUsers()
      console.log('Users API Response:', response)
      
      if (response.data && response.data.success) {
        setUsers(response.data.data)
        console.log('Users loaded successfully:', response.data.data.length)
      } else {
        console.log('No users found or unexpected response structure')
        setUsers([])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by role
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(user =>
        user.roles.includes(roleFilter)
      )
    }

    setFilteredUsers(filtered)
  }

  const handleRoleFilter = (role) => {
    setRoleFilter(role)
  }

  const getRoleDisplay = (roles) => {
    if (!roles || roles.length === 0) return 'No Role'
    
    return roles.map(role => {
      const displayRole = role.replace('ROLE_', '')
      const colorClass = role === 'ROLE_ADMIN' 
        ? 'bg-red-100 text-red-800' 
        : 'bg-blue-100 text-blue-800'
      
      return (
        <span
          key={role}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mr-1 ${colorClass}`}
        >
          {displayRole}
        </span>
      )
    })
  }

  const getUserStats = () => {
    const totalUsers = users.length
    const adminUsers = users.filter(user => user.roles?.includes('ROLE_ADMIN')).length
    const regularUsers = users.filter(user => user.roles?.includes('ROLE_USER') && !user.roles?.includes('ROLE_ADMIN')).length
    
    return { totalUsers, adminUsers, regularUsers }
  }

  const stats = getUserStats()

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
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600">Manage all registered users and their roles</p>
            </div>
            <button
              onClick={fetchAllUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh Users
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">👥</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">👑</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Admin Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.adminUsers}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm">👤</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Regular Users</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.regularUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter Users</h2>
          
          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Role Filters */}
          <div className="flex flex-wrap gap-2">
            {['ALL', 'ROLE_ADMIN', 'ROLE_USER'].map((role) => (
              <button
                key={role}
                onClick={() => handleRoleFilter(role)}
                className={`px-4 py-2 rounded-md font-medium ${
                  roleFilter === role
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {role === 'ALL' ? 'All Users' : role.replace('ROLE_', '')} 
                ({role === 'ALL' ? users.length : users.filter(u => u.roles?.includes(role)).length})
              </button>
            ))}
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Users ({filteredUsers.length})
          </h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading users...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((userData) => (
                    <tr key={userData.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{userData.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {userData.username?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{userData.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userData.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getRoleDisplay(userData.roles)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => toast.info('View profile feature coming soon')}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </button>
                          {/* Only show manage button if not current admin user */}
                          {userData.id !== user.id && (
                            <button
                              onClick={() => toast.info('User management features coming soon')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Manage
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">👥</div>
              <p className="text-gray-600 text-lg">No users found</p>
              <p className="text-gray-500">
                {searchTerm || roleFilter !== 'ALL' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'No users have registered yet'
                }
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => toast.info('Export users feature coming soon')}
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-2xl mr-3">📊</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Export Users</div>
                <div className="text-sm text-gray-500">Download user list as CSV</div>
              </div>
            </button>

            <button
              onClick={() => toast.info('User analytics feature coming soon')}
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-2xl mr-3">📈</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">User Analytics</div>
                <div className="text-sm text-gray-500">View registration trends</div>
              </div>
            </button>

            <button
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3">🏠</span>
              <div className="text-left">
                <div className="font-medium text-gray-900">Back to Dashboard</div>
                <div className="text-sm text-gray-500">Return to admin dashboard</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default Usermanagement