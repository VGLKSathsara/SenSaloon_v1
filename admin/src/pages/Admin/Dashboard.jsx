import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

/**
 * Dashboard Component (Admin Panel)
 * Displays admin dashboard with statistics and latest appointments
 * Shows counts for stylists, appointments, and customers
 */
const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  // Fetch dashboard data when admin token is available
  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return (
    dashData && (
      <div className="m-5">
        {/* Statistics Cards Row */}
        <div className="flex flex-wrap gap-3">
          {/* Stylists Count Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.stylist_icon}
              alt="stylist_icon"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.stylists}
              </p>
              <p className="text-gray-400">Stylists</p>
            </div>
          </div>

          {/* Appointments Count Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.appointments_icon}
              alt="appointment_icon"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.appointments}
              </p>
              <p className="text-gray-400">Appointments</p>
            </div>
          </div>

          {/* Customers Count Card */}
          <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-14"
              src={assets.patients_icon}
              alt="customer_icon"
            />
            <div>
              <p className="text-xl font-semibold text-gray-600">
                {dashData.customers}
              </p>
              <p className="text-gray-400">Customers</p>
            </div>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white mt-10 rounded-t border">
          {/* Section Header */}
          <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
            <img src={assets.list_icon} alt="list" />
            <p className="font-semibold text-gray-700">Latest Bookings</p>
          </div>

          {/* Bookings List */}
          <div className="pt-4 border border-t-0">
            {dashData.latestAppointments.map((item, index) => (
              <div
                className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 border-b"
                key={index}
              >
                {/* Stylist Image */}
                <img
                  className="rounded-full w-10 h-10 object-cover"
                  src={item.stylistData.image}
                  alt={item.stylistData.name}
                />

                {/* Booking Details */}
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-medium">
                    {item.stylistData.name}
                  </p>
                  <p className="text-gray-600">
                    Booking on {slotDateFormat(item.slotDate)}
                  </p>
                </div>

                {/* Status Badge or Cancel Action */}
                {item.cancelled ? (
                  <p className="text-red-400 text-xs font-medium bg-red-50 px-2 py-1 rounded">
                    Cancelled
                  </p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-medium bg-green-50 px-2 py-1 rounded">
                    Completed
                  </p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer hover:bg-red-50 rounded-full p-1 transition-all"
                    src={assets.cancel_icon}
                    alt="Cancel"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  )
}

export default Dashboard
