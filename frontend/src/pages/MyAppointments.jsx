import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

/**
 * MyAppointments Component
 * Displays all appointments for the logged-in user
 * Handles appointment cancellation and PayHere payment processing
 */
const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get('payment')

  const [appointments, setAppointments] = useState([])
  const [loadingPayment, setLoadingPayment] = useState(null)

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  /**
   * Format slot date from "DD_MM_YYYY" to "DD MMM YYYY"
   * @param {string} slotDate - Date in format "DD_MM_YYYY"
   * @returns {string} Formatted date string
   */
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return (
      dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
    )
  }

  /**
   * Fetch user appointments from backend
   * Sorts appointments with newest first
   */
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/appointments', {
        headers: { token },
      })

      if (data.success) {
        setAppointments(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error)
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
        backendUrl + '/api/user/cancel-appointment',
        { appointmentId },
        { headers: { token } },
      )

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  /**
   * Process PayHere payment for appointment
   * @param {string} appointmentId - ID of appointment to pay for
   */
  const appointmentPayHere = async (appointmentId) => {
    setLoadingPayment(appointmentId)
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-payhere',
        { appointmentId },
        { headers: { token } },
      )
      if (data.success && data.payment_url) {
        // Redirect to PayHere hosted payment page
        window.location.href = data.payment_url
      } else {
        toast.error(data.message || 'Failed to initiate payment')
        setLoadingPayment(null)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message || 'Payment initiation failed')
      setLoadingPayment(null)
    }
  }

  // Check payment status from URL params
  useEffect(() => {
    if (paymentStatus === 'success') {
      toast.success('Payment completed successfully!')
      // Remove the query param from URL
      navigate('/my-appointments', { replace: true })
      getUserAppointments()
    } else if (paymentStatus === 'cancelled') {
      toast.info('Payment was cancelled')
      navigate('/my-appointments', { replace: true })
    } else if (paymentStatus === 'failed') {
      toast.error('Payment failed. Please try again.')
      navigate('/my-appointments', { replace: true })
    }
  }, [paymentStatus, navigate])

  // Load appointments when user is logged in
  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])

  return (
    <div>
      {/* Page title */}
      <p className="pb-3 mt-12 text-lg font-medium text-gray-600 border-b">
        My appointments
      </p>

      {/* Appointments list */}
      <div className="">
        {appointments.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
          >
            {/* Stylist image */}
            <div>
              <img
                className="w-36 bg-[#EAEFFF] rounded-lg"
                src={item.stylistData.image}
                alt={item.stylistData.name}
              />
            </div>

            {/* Appointment details */}
            <div className="flex-1 text-sm text-[#5E5E5E]">
              <p className="text-[#262626] text-base font-semibold">
                {item.stylistData.name}
              </p>
              <p className="text-xs text-gray-500">
                {item.stylistData.serviceType}
              </p>
              <p className="text-[#464646] font-medium mt-1 text-xs">
                Salon Address:
              </p>
              <p className="text-xs">{item.stylistData.address.line1}</p>
              <p className="text-xs">{item.stylistData.address.line2}</p>
              <p className="mt-1 text-xs">
                <span className="text-xs text-[#3C3C3C] font-medium">
                  Date & Time:
                </span>{' '}
                {slotDateFormat(item.slotDate)} | {item.slotTime}
              </p>
            </div>

            {/* Action buttons based on appointment status */}
            <div className="flex flex-col gap-2 justify-end text-sm text-center">
              {/* Pay Now button for unpaid appointments */}
              {!item.cancelled && !item.payment && !item.isCompleted && (
                <button
                  onClick={() => appointmentPayHere(item._id)}
                  disabled={loadingPayment === item._id}
                  className={`text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    loadingPayment === item._id
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {loadingPayment === item._id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <img
                        className="w-5 h-5"
                        src={assets.payhere_logo}
                        alt="Pay Here"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = assets.razorpay_logo
                        }}
                      />
                      Pay Now
                    </>
                  )}
                </button>
              )}

              {/* Paid status */}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-[#22C55E] bg-[#F0FDF4] border-green-200">
                  Paid ✓
                </button>
              )}

              {/* Completed status */}
              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded text-green-500">
                  Completed
                </button>
              )}

              {/* Cancel button for active appointments */}
              {!item.cancelled && !item.isCompleted && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel appointment
                </button>
              )}

              {/* Cancelled status */}
              {item.cancelled && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded text-red-500">
                  Appointment cancelled
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
