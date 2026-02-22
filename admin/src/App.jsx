import React, { useContext } from 'react'
import { StylistContext } from './context/StylistContext'
import { AdminContext } from './context/AdminContext'
import { Route, Routes, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddStylist from './pages/Admin/AddStylist'
import StylistsList from './pages/Admin/StylistsList'
import Login from './pages/Login'
import StylistAppointments from './pages/Stylist/StylistAppointments'
import StylistDashboard from './pages/Stylist/StylistDashboard'
import StylistProfile from './pages/Stylist/StylistProfile'

/**
 * Main App Component for Admin/Stylist Panel
 * Handles routing and layout based on authentication status
 * Shows different dashboards for Admin and Stylist roles
 */
const App = () => {
  const { sToken } = useContext(StylistContext)
  const { aToken } = useContext(AdminContext)

  // If user is authenticated (either admin or stylist)
  return sToken || aToken ? (
    <div className="bg-[#F8F9FD]">
      <ToastContainer />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Routes>
          {/* Default route - redirects to appropriate dashboard based on role */}
          <Route
            path="/"
            element={
              aToken ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Navigate to="/stylist-dashboard" />
              )
            }
          />

          {/* Admin Routes - accessible only when aToken exists */}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/all-appointments" element={<AllAppointments />} />
          <Route path="/add-stylist" element={<AddStylist />} />
          <Route path="/stylist-list" element={<StylistsList />} />

          {/* Stylist Routes - accessible only when sToken exists */}
          <Route path="/stylist-dashboard" element={<StylistDashboard />} />
          <Route
            path="/stylist-appointments"
            element={<StylistAppointments />}
          />
          <Route path="/stylist-profile" element={<StylistProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    // If not authenticated, show login page
    <>
      <ToastContainer />
      <Login />
    </>
  )
}

export default App
