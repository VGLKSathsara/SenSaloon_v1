import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

/**
 * MyAppointments Component
 * Displays all appointments for the logged-in user
 * Handles appointment cancellation and payment processing
 */
const MyAppointments = () => {
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [payment, setPayment] = useState('')

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
   * Initialize Razorpay payment
   * @param {Object} order - Razorpay order object
   */
  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Appointment Payment',
      description: 'Sensaloon Service Payment',
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + '/api/user/verifyRazorpay',
            response,
            { headers: { token } },
          )
          if (data.success) {
            getUserAppointments()
            navigate('/my-appointments')
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      },
    }
    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  /**
   * Process Razorpay payment for appointment
   * @param {string} appointmentId - ID of appointment to pay for
   */
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-razorpay',
        { appointmentId },
        { headers: { token } },
      )
      if (data.success) {
        initPay(data.order)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  /**
   * Process Stripe payment for appointment
   * @param {string} appointmentId - ID of appointment to pay for
   */
  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/payment-stripe',
        { appointmentId },
        { headers: { token } },
      )
      if (data.success) {
        window.location.replace(data.session_url)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

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
              {/* Show Pay Online button for unpaid appointments */}
              {!item.cancelled &&
                !item.payment &&
                !item.isCompleted &&
                payment !== item._id && (
                  <button
                    onClick={() => setPayment(item._id)}
                    className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300"
                  >
                    Pay Online
                  </button>
                )}

              {/* Show payment options when Pay Online is clicked */}
              {!item.cancelled &&
                !item.payment &&
                !item.isCompleted &&
                payment === item._id && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => appointmentStripe(item._id)}
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
                    >
                      <img
                        className="max-w-16"
                        src={assets.stripe_logo}
                        alt="Stripe"
                      />
                    </button>
                    <button
                      onClick={() => appointmentRazorpay(item._id)}
                      className="text-[#696969] sm:min-w-48 py-2 border rounded hover:bg-gray-100 transition-all duration-300 flex items-center justify-center"
                    >
                      <img
                        className="max-w-16"
                        src={assets.razorpay_logo}
                        alt="Razorpay"
                      />
                    </button>
                  </div>
                )}

              {/* Paid status */}
              {!item.cancelled && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border rounded text-[#22C55E] bg-[#F0FDF4] border-green-200">
                  Paid
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
