import React, { useContext, useEffect } from 'react'
import { StylistContext } from '../../context/StylistContext'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'

/**
 * StylistDashboard Component (Stylist Panel)
 * Displays stylist's dashboard with earnings, appointment counts, and latest bookings
 * Allows stylist to manage their appointments directly from dashboard
 */
const StylistDashboard = () => {
  const {
    sToken,
    dashData,
    getDashData,
    cancelAppointment,
    completeAppointment,
  } = useContext(StylistContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  // Fetch dashboard data when stylist token is available
  useEffect(() => {
    if (sToken) {
      getDashData()
    }
  }, [sToken])

  return (
    dashData && (
      <div className="m-5">
        {/* Statistics Cards Row */}
        <div className="flex flex-wrap gap-3">
          {/* Earnings Card - Total earnings from completed/paid appointments */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.earning_icon} alt="earnings" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {currency} {dashData.earnings}
              </p>
              <p className="text-gray-400">Earnings</p>
            </div>
          </div>

          {/* Appointments Card - Total appointments count */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.appointments_icon}
              alt="appointments"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          {/* Customers Card - Unique customers count */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img className="w-14" src={assets.patients_icon} alt="customers" />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.customers}
              </p>
              <p className="text-gray-400">Customers</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border">
            <img src={assets.list_icon} alt="list" />
            <p className="font-semibold">Latest Bookings</p>
          </div>

          {/* Bookings List */}
          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-50 border-b"
                key={index}
              >
                {/* Customer Image */}
                <img
                  className="rounded-full w-10 h-10 object-cover bg-gray-100"
                  src={item.userData.image}
                  alt={item.userData.name}
                />

                {/* Booking Details */}
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.userData.name}
                  </p>
                  <p className="text-gray-500">
                    Booking on {slotDateFormat(item.slotDate)}
                  </p>
                </div>

                {/* Status Badge or Action Buttons */}
                <div className="flex items-center gap-2">
                  {item.cancelled ? (
                    <p className="text-red-400 text-xs font-medium bg-red-50 px-2 py-1 rounded">
                      Cancelled
                    </p>
                  ) : item.isCompleted ? (
                    <p className="text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded">
                      Completed
                    </p>
                  ) : (
                    <div className="flex items-center gap-2">
                      {/* Cancel Button */}
                      <img
                        onClick={() => cancelAppointment(item._id)}
                        className="w-9 cursor-pointer hover:bg-red-50 rounded-full p-1 transition-all"
                        src={assets.cancel_icon}
                        alt="Cancel"
                      />
                      {/* Complete Button */}
                      <img
                        onClick={() => completeAppointment(item._id)}
                        className="w-9 cursor-pointer hover:bg-green-50 rounded-full p-1 transition-all"
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
      </div>
    )
  )
}

export default StylistDashboard
