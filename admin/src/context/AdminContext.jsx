import { createContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()

/**
 * Admin Context Provider
 * Manages admin authentication, stylists data, appointments, and dashboard statistics
 * Provides functions for admin operations like adding, updating, and deleting stylists
 */
const AdminContextProvider = (props) => {
  // Admin token from localStorage
  const [aToken, setAToken] = useState(
    localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '',
  )
  const [stylists, setStylists] = useState([])
  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  /**
   * Fetch all stylists from backend
   * Updates stylists state on success
   */
  const getAllStylists = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/all-stylists', {
        headers: { aToken },
      })
      if (data.success) {
        setStylists(data.stylists)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  /**
   * Toggle stylist availability status
   * @param {string} stylistId - ID of stylist to update
   */
  const changeAvailability = async (stylistId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/change-availability',
        { stylistId },
        { headers: { aToken } },
      )
      if (data.success) {
        toast.success(data.message)
        getAllStylists() // Refresh list after update
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /**
   * Fetch all appointments from backend
   */
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', {
        headers: { aToken },
      })
      if (data.success) {
        setAppointments(data.appointments)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /**
   * Cancel an appointment
   * @param {string} appointmentId - ID of appointment to cancel
   */
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/cancel-appointment',
        { appointmentId },
        { headers: { aToken } },
      )
      if (data.success) {
        toast.success(data.message)
        getAllAppointments() // Refresh list after cancellation
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  /**
   * Fetch dashboard statistics
   * Returns counts of stylists, appointments, customers and latest appointments
   */
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', {
        headers: { aToken },
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

  /**
   * Delete a stylist from the system
   * Shows success toast and refreshes list on success
   * @param {string} stylistId - ID of stylist to delete
   */
  const deleteStylist = async (stylistId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/delete-stylist',
        { stylistId },
        { headers: { aToken } },
      )

      if (data.success) {
        toast.success(data.message) // "Stylist deleted successfully"
        getAllStylists() // Refresh list after deletion
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Failed to delete stylist')
    }
  }

  // Context value object with all state and functions
  const value = {
    aToken,
    setAToken,
    backendUrl,
    stylists,
    getAllStylists,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    deleteStylist,
  }

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  )
}

export default AdminContextProvider
