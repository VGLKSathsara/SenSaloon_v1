import React, { useEffect } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

/**
 * AllAppointments Component (Admin Panel)
 * Displays all appointments in the system with details
 * Allows admin to cancel any appointment
 */
const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } =
    useContext(AdminContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  // Fetch appointments when admin token is available
  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  return (
    <div className="w-full max-w-6xl m-5">
      <p className="mb-3 text-lg font-medium">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll shadow-sm">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] py-3 px-6 border-b bg-gray-50 font-semibold">
          <p>#</p>
          <p>Customer</p>
          <p>Service</p>
          <p>Date & Time</p>
          <p>Stylist</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointments List */}
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            key={index}
          >
            {/* Row number */}
            <p>{index + 1}</p>

            {/* Customer Details - Image and Name */}
            <div className="flex items-center gap-2">
              <img
                src={item.userData.image}
                className="w-8 h-8 rounded-full object-cover"
                alt={item.userData.name}
              />
              <p className="font-medium text-gray-700">{item.userData.name}</p>
            </div>

            {/* Service Type */}
            <p>{item.stylistData.serviceType}</p>

            {/* Date & Time - Formatted using slotDateFormat */}
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* Stylist Details - Image and Name */}
            <div className="flex items-center gap-2">
              <img
                src={item.stylistData.image}
                className="w-8 h-8 rounded-full bg-gray-200 object-cover"
                alt={item.stylistData.name}
              />
              <p>{item.stylistData.name}</p>
            </div>

            {/* Fees with currency symbol */}
            <p className="font-medium">
              {currency}
              {item.amount}
            </p>

            {/* Status & Actions - Based on appointment state */}
            <div className="flex justify-center">
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-8 cursor-pointer hover:scale-110 transition-all"
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllAppointments
