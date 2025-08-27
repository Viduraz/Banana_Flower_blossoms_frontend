import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './layouts/Navbar'
import Footer from './layouts/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Aboutus from './pages/Aboutus'
import Contactus from './pages/Contactus'
import Userprofile from './pages/Userprofile'
import OrdersPage from './pages/OrdersPage'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'
import Admindashboard from './Adminpages/Admindashboard'
import Adminprofile from './Adminpages/Adminprofile'
import AdminOrdersPage from './Adminpages/AdminOrdersPage'
import Usermanagement from './Adminpages/Usermanagement'
import AdminReports from './Adminpages/AdminReports'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "" : "flex-grow"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<Aboutus />} />
          <Route path="/contact" element={<Contactus />} />
          <Route path="/profile" element={<Userprofile />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
          <Route path="/admin/dashboard" element={<Admindashboard />} />
          <Route path="/admin/profile" element={<Adminprofile />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/users" element={<Usermanagement />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster position="top-right" />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
