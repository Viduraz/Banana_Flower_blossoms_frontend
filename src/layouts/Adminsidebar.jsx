import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

function AdminSidebar() {
  const location = useLocation()
  const { user } = useAuth()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: '📊'
    },
    {
      name: 'Orders Management',
      path: '/admin/orders',
      icon: '📦'
    },
    {
      name: 'Admin Profile',
      path: '/admin/profile',
      icon: '👤'
    },
    {
      name: 'User Management',
      path: '/admin/users',
      icon: '👥'
    },
    {
      name: 'Reports',
      path: '/admin/reports',
      icon: '📈'
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: '⚙️'
    }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4 fixed left-0 top-16 z-40">
      {/* Admin Header */}
      <div className="mb-8 pb-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Admin Panel</h3>
            <p className="text-gray-400 text-sm">{user?.username}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">QUICK STATS</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Total Orders</span>
            <span className="text-white font-semibold">24</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Pending</span>
            <span className="text-yellow-400 font-semibold">5</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Completed</span>
            <span className="text-green-400 font-semibold">19</span>
          </div>
        </div>
      </div>

      {/* Back to Main Site */}
      <div className="mt-8">
        <Link
          to="/"
          className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200"
        >
          <span className="text-xl">🏠</span>
          <span className="font-medium">Back to Site</span>
        </Link>
      </div>
    </div>
  )
}

export default AdminSidebar
