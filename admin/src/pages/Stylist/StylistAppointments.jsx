import React, { useContext, useEffect } from 'react'
import { StylistContext } from '../../context/StylistContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

/**
 * StylistAppointments Component (Stylist Panel)
 * Displays all appointments assigned to the logged-in stylist
 * Allows stylist to cancel or complete appointments
 */
const StylistAppointments = () => {
  const {
    sToken,
    appointments,
    getAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(StylistContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  // Fetch appointments when stylist token is available
  useEffect(() => {
    if (sToken) {
      getAppointments()
    }
  }, [sToken])

  return (
    <div className="w-full max-w-6xl m-5 ">
      <p className="mb-3 text-lg font-medium text-gray-700">All Appointments</p>

      <div className="bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll shadow-sm">
        {/* Table Header - Hidden on mobile */}
        <div className="max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr_1fr] gap-1 py-3 px-6 border-b bg-gray-50 font-semibold">
          <p>#</p>
          <p>Customer</p>
          <p>Payment</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Appointments List */}
        {appointments.map((item, index) => (
          <div
            className="flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50 transition-all"
            key={index}
          >
            {/* Row Number */}
            <p className="max-sm:hidden">{index + 1}</p>

            {/* Customer Details - Image and Name */}
            <div className="flex items-center gap-2">
              <img
                src={item.userData.image}
                className="w-8 h-8 rounded-full object-cover"
                alt={item.userData.name}
              />
              <p className="text-gray-800 font-medium">{item.userData.name}</p>
            </div>

            {/* Payment Status Badge */}
            <div>
              <p
                className={`text-[10px] inline border px-2 py-0.5 rounded-full ${
                  item.payment
                    ? 'border-green-500 text-green-500'
                    : 'border-primary text-primary'
                }`}
              >
                {item.payment ? 'ONLINE' : 'CASH'}
              </p>
            </div>

            {/* Appointment Date & Time */}
            <p>
              {slotDateFormat(item.slotDate)}, {item.slotTime}
            </p>

            {/* Appointment Fees */}
            <p className="font-medium text-gray-700">
              {currency}
              {item.amount}
            </p>

            {/* Action Buttons - Based on appointment status */}
            <div className="flex items-center">
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium italic">
                  Cancelled
                </p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium italic">
                  Completed
                </p>
              ) : (
                <div className="flex gap-2">
                  {/* Cancel Button */}
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-8 cursor-pointer hover:scale-110 transition-all"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                  {/* Complete Button */}
                  <img
                    onClick={() => completeAppointment(item._id)}
                    className="w-8 cursor-pointer hover:scale-110 transition-all"
                    src={assets.tick_icon}
                    alt="Complete"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StylistAppointments
