import { createContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

export const AppContext = createContext()

const AppContextProvider = ({ children }) => {
  const currencySymbol = 'Rs. '
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const [stylists, setStylists] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [userData, setUserData] = useState(null)

  /**
   * Fetches all stylists from the backend API
   * Updates stylists state on success, shows error toast on failure
   */
  const getStylistsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/stylist/list')

      if (data.success) {
        setStylists(data.stylists)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching stylists:', error)
      toast.error(error.message || 'Failed to fetch stylists')
    }
  }

  /**
   * Retrieves the authenticated user's profile data
   * Requires valid token in headers
   */
  const loadUserProfileData = async () => {
    if (!token) return

    try {
      const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
        headers: { token },
      })

      if (data.success) {
        setUserData(data.userData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error(error.message || 'Failed to load profile')
    }
  }

  /**
   * Updates user profile information
   * Accepts FormData with user details and optional image
   * Returns boolean indicating success/failure
   */
  const updateUserProfile = async (formData) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/update-profile',
        formData,
        { headers: { token } },
      )

      if (data.success) {
        toast.success(data.message)
        await loadUserProfileData()
        return true
      } else {
        toast.error(data.message)
        return false
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(error.message || 'Failed to update profile')
      return false
    }
  }

  /**
   * Logs out the current user
   * Clears token and user data from state and localStorage
   */
  const logout = () => {
    setToken('')
    setUserData(null)
    localStorage.removeItem('token')
    toast.success('Logged out successfully')
  }

  // Load stylists data when component mounts
  useEffect(() => {
    getStylistsData()
  }, [])

  // Load user profile whenever token changes (login/logout)
  useEffect(() => {
    if (token) {
      loadUserProfileData()
    } else {
      setUserData(null)
    }
  }, [token])

  const value = {
    // State data
    stylists,
    token,
    userData,
    currencySymbol,
    backendUrl,

    // State setters
    setToken,
    setUserData,

    // API functions
    getStylistsData,
    loadUserProfileData,
    updateUserProfile,
    logout,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export default AppContextProvider
