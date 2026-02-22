import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'
import { StylistContext } from '../context/StylistContext'
import { AdminContext } from '../context/AdminContext'

/**
 * Sidebar Component for Admin/Stylist Panel
 * Displays different navigation menus based on user role
 * Shows admin menu for admin users, stylist menu for stylist users
 */
const Sidebar = () => {
  // Get stylist authentication state
  const { sToken } = useContext(StylistContext)
  // Get admin authentication state
  const { aToken } = useContext(AdminContext)

  return (
    <div className="min-h-screen bg-white border-r">
      {/* Admin Menu - Visible only when admin is logged in */}
      {aToken && (
        <ul className="text-[#515151] mt-5">
          {/* Dashboard link */}
          <NavLink
            to={'/admin-dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className="min-w-5" src={assets.home_icon} alt="Dashboard" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          {/* All Appointments link */}
          <NavLink
            to={'/all-appointments'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img
              className="min-w-5"
              src={assets.appointment_icon}
              alt="Appointments"
            />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          {/* Add New Stylist link */}
          <NavLink
            to={'/add-stylist'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className="min-w-5" src={assets.add_icon} alt="Add Stylist" />
            <p className="hidden md:block">Add Stylist</p>
          </NavLink>

          {/* View All Stylists link */}
          <NavLink
            to={'/stylist-list'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img
              className="min-w-5"
              src={assets.people_icon}
              alt="Stylists List"
            />
            <p className="hidden md:block">Stylists List</p>
          </NavLink>
        </ul>
      )}

      {/* Stylist Menu - Visible only when stylist is logged in */}
      {sToken && (
        <ul className="text-[#515151] mt-5">
          {/* Dashboard link */}
          <NavLink
            to={'/stylist-dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className="min-w-5" src={assets.home_icon} alt="Dashboard" />
            <p className="hidden md:block">Dashboard</p>
          </NavLink>

          {/* My Appointments link */}
          <NavLink
            to={'/stylist-appointments'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img
              className="min-w-5"
              src={assets.appointment_icon}
              alt="Appointments"
            />
            <p className="hidden md:block">Appointments</p>
          </NavLink>

          {/* Profile link */}
          <NavLink
            to={'/stylist-profile'}
            className={({ isActive }) =>
              `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-72 cursor-pointer ${
                isActive ? 'bg-[#F2F3FF] border-r-4 border-primary' : ''
              }`
            }
          >
            <img className="min-w-5" src={assets.people_icon} alt="Profile" />
            <p className="hidden md:block">Profile</p>
          </NavLink>
        </ul>
      )}
    </div>
  )
}

export default Sidebar
