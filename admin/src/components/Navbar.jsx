import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { StylistContext } from '../context/StylistContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

/**
 * Navbar Component for Admin/Stylist Panel
 * Displays logo, role indicator, and logout button
 * Handles authentication state for both admin and stylist
 */
const Navbar = () => {
  // Get stylist authentication state
  const { sToken, setSToken } = useContext(StylistContext)
  // Get admin authentication state
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  /**
   * Handle logout for both admin and stylist
   * Clears tokens from state and localStorage
   */
  const logout = () => {
    navigate('/')

    // Stylist logout
    if (sToken) {
      setSToken('')
      localStorage.removeItem('sToken')
    }

    // Admin logout
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }
  }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white">
      {/* Logo and Role Section */}
      <div className="flex items-center gap-2 text-xs">
        {/* Logo - Click to go home */}
        <img
          onClick={() => navigate('/')}
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="Sensaloon Logo"
        />

        {/* Role indicator badge */}
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? 'Admin' : 'Stylist'}
        </p>
      </div>

      {/* Logout button - visible for both admin and stylist */}
      <button
        onClick={logout}
        className="bg-primary text-white text-sm px-10 py-2 rounded-full"
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar
