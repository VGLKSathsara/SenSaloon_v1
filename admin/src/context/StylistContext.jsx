import { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const StylistContext = createContext()

/**
 * Stylist Context Provider
 * Manages stylist authentication, appointments, profile data, and dashboard statistics
 * Provides functions for stylist operations like managing appointments
 */
const StylistContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL

  // Stylist token from localStorage
  const [sToken, setSToken] = useState(
    localStorage.getItem('sToken') ? localStorage.getItem('sToken') : '',
  )
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  const [profileData, setProfileData] = useState(false)

  /**
   * Fetch stylist's appointments from backend
   * Returns appointments in reverse chronological order
   */
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + '/api/stylist/appointments',
        { headers: { sToken } },
      )
      if (data.success) {
        setAppointments(data.appointments.reverse())
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /**
   * Fetch stylist's profile data
   * Returns stylist information (excluding password)
   */
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/stylist/profile', {
        headers: { sToken },
      })
      if (data.success) {
        setProfileData(data.profileData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /**
   * Cancel an appointment
   * Stylist ID is automatically added by backend middleware
   * @param {string} appointmentId - ID of appointment to cancel
   */
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/stylist/cancel-appointment',
        { appointmentId }, // stylistId added by middleware
        { headers: { sToken } },
      )
      if (data.success) {
        toast.success(data.message)
        getAppointments() // Refresh appointments list
        getDashData() // Refresh dashboard data
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /**
   * Mark appointment as completed
   * @param {string} appointmentId - ID of appointment to complete
   */
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/stylist/complete-appointment',
        { appointmentId },
        { headers: { sToken } },
      )
      if (data.success) {
        toast.success(data.message)
        getAppointments() // Refresh appointments list
        getDashData() // Refresh dashboard data
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /**
   * Fetch dashboard statistics for stylist
   * Returns earnings, appointment counts, and latest appointments
   */
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/stylist/dashboard', {
        headers: { sToken },
      })
      if (data.success) {
        setDashData(data.dashData)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Context value object with all state and functions
  const value = {
    sToken,
    setSToken,
    backendUrl,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  }

  return (
    <StylistContext.Provider value={value}>
      {props.children}
    </StylistContext.Provider>
  )
}

export default StylistContextProvider
