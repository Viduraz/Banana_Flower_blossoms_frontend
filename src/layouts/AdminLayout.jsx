import React from 'react'
import AdminSidebar from './Adminsidebar' 

function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin-specific header */}
      <div className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Flower Blossoms - Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Administrator Dashboard</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Admin sidebar */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="ml-64 pt-16">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout