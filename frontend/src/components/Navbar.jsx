import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const { token, setToken, userData } = useContext(AppContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [imageError, setImageError] = useState(false)

  /**
   * Logout user by clearing token and redirecting to home
   */
  const logout = () => {
    setToken('')
    localStorage.removeItem('token')
    navigate('/')
    setShowMobileMenu(false)
  }

  /**
   * Check if current route matches given path
   * @param {string} path - Route path to check
   * @returns {boolean} - True if current route matches
   */
  const isActive = (path) => {
    return location.pathname === path
  }

  /**
   * Navigate to given path and close mobile menu
   * @param {string} path - Route path to navigate to
   */
  const handleNavigation = (path) => {
    navigate(path)
    setShowMobileMenu(false)
    scrollTo(0, 0)
  }

  /**
   * Profile Image Component with loading and error states
   * Shows skeleton loader while loading, initial letter on error
   */
  const ProfileImage = () => {
    // Don't show profile image if user is not logged in
    if (!token) return null

    // Show skeleton loader while user data is loading
    if (!userData) {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
      )
    }

    // Show user initial if image fails to load
    if (imageError) {
      return (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          {userData.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      )
    }

    // Normal profile picture
    return (
      <img
        className="w-8 h-8 rounded-full object-cover"
        src={userData.image}
        alt={userData.name}
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white relative">
      {/* Logo - Click to go home */}
      <img
        onClick={() => handleNavigation('/')}
        className="w-36 sm:w-40 cursor-pointer"
        src={assets.logo}
        alt="Sensaloon Logo"
      />

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center gap-8 text-gray-600">
        <button
          onClick={() => handleNavigation('/')}
          className={`hover:text-primary transition-colors ${isActive('/') ? 'text-primary font-medium' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => handleNavigation('/stylists')}
          className={`hover:text-primary transition-colors ${isActive('/stylists') ? 'text-primary font-medium' : ''}`}
        >
          Stylists
        </button>
        <button
          onClick={() => handleNavigation('/about')}
          className={`hover:text-primary transition-colors ${isActive('/about') ? 'text-primary font-medium' : ''}`}
        >
          About
        </button>
        <button
          onClick={() => handleNavigation('/contact')}
          className={`hover:text-primary transition-colors ${isActive('/contact') ? 'text-primary font-medium' : ''}`}
        >
          Contact
        </button>
      </div>

      {/* Mobile Menu Button (Hamburger) */}
      <button
        onClick={() => setShowMobileMenu(true)}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu - Slide in panel */}
      {showMobileMenu && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Menu panel */}
          <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 md:hidden animate-slideIn">
            {/* Menu header with close button */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="font-semibold text-gray-700">Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile menu items */}
            <div className="p-4">
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleNavigation('/')}
                  className={`text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${isActive('/') ? 'bg-primary text-white hover:bg-primary' : ''}`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation('/stylists')}
                  className={`text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${isActive('/stylists') ? 'bg-primary text-white hover:bg-primary' : ''}`}
                >
                  Stylists
                </button>
                <button
                  onClick={() => handleNavigation('/about')}
                  className={`text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${isActive('/about') ? 'bg-primary text-white hover:bg-primary' : ''}`}
                >
                  About
                </button>
                <button
                  onClick={() => handleNavigation('/contact')}
                  className={`text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${isActive('/contact') ? 'bg-primary text-white hover:bg-primary' : ''}`}
                >
                  Contact
                </button>

                {/* User specific menu items */}
                {token ? (
                  <>
                    <hr className="my-2" />
                    <button
                      onClick={() => handleNavigation('/my-profile')}
                      className="text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => handleNavigation('/my-appointments')}
                      className="text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      My Appointments
                    </button>
                    <button
                      onClick={logout}
                      className="text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="text-left px-4 py-3 rounded-lg bg-primary text-white hover:bg-opacity-90 transition-colors mt-4"
                  >
                    Login / Sign Up
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Desktop Right Side - User Menu */}
      {token ? (
        <div className="hidden md:flex items-center gap-2 cursor-pointer group relative">
          {/* Profile Image with loading/error handling */}
          <ProfileImage />

          <img className="w-2.5" src={assets.dropdown_icon} alt="dropdown" />

          {/* Desktop Dropdown Menu */}
          <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block">
            <div className="min-w-48 bg-stone-100 rounded-lg flex flex-col gap-2 p-4">
              <button
                onClick={() => navigate('/my-profile')}
                className="text-left px-3 py-2 hover:bg-white rounded-md transition-colors"
              >
                My Profile
              </button>
              <button
                onClick={() => navigate('/my-appointments')}
                className="text-left px-3 py-2 hover:bg-white rounded-md transition-colors"
              >
                My Appointments
              </button>
              <hr className="my-1" />
              <button
                onClick={logout}
                className="text-left px-3 py-2 hover:bg-white rounded-md transition-colors text-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Login Button */
        <button
          onClick={() => navigate('/login')}
          className="hidden md:block bg-primary text-white text-sm px-8 py-2 rounded-full hover:bg-opacity-90 transition-all"
        >
          Login
        </button>
      )}
    </div>
  )
}

export default Navbar
