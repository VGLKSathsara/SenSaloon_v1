import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { toast } from 'react-toastify'

/**
 * StylistsList Component (Admin Panel)
 * Displays all stylists in a card grid format
 * Allows admin to toggle availability and delete stylists
 */
const StylistsList = () => {
  const {
    stylists,
    changeAvailability,
    aToken,
    getAllStylists,
    deleteStylist,
  } = useContext(AdminContext)

  const [deletingId, setDeletingId] = useState(null)

  // Fetch stylists when admin token is available
  useEffect(() => {
    if (aToken) {
      getAllStylists()
    }
  }, [aToken])

  /**
   * Handle stylist deletion with confirmation
   * Shows loading spinner while deleting
   * @param {string} stylistId - ID of stylist to delete
   * @param {string} stylistName - Name of stylist for confirmation
   */
  const handleDelete = async (stylistId, stylistName) => {
    // Show confirmation dialog before deletion
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${stylistName}?`,
    )

    if (confirmDelete) {
      setDeletingId(stylistId) // Show loading spinner

      try {
        await deleteStylist(stylistId)
        // Toast message comes from deleteStylist function
      } catch (error) {
        toast.error('Failed to delete stylist')
      } finally {
        setDeletingId(null) // Hide loading spinner
      }
    }
  }

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium text-gray-700">All Stylists</h1>

      {/* Stylist Cards Grid */}
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {stylists.map((item, index) => (
          <div
            className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group hover:shadow-md transition-all relative"
            key={index}
          >
            {/* Delete Button - Only visible on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDelete(item._id, item.name)
              }}
              disabled={deletingId === item._id}
              className={`absolute top-2 right-2 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all z-10 ${
                deletingId === item._id
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 opacity-0 group-hover:opacity-100 hover:bg-red-600'
              }`}
              title="Delete Stylist"
            >
              {deletingId === item._id ? (
                // Loading spinner while deleting
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-xl font-bold">×</span>
              )}
            </button>

            {/* Stylist Image */}
            <img
              className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-48 object-cover"
              src={item.image}
              alt={item.name}
            />

            {/* Stylist Info */}
            <div className="p-4">
              <p className="text-[#262626] text-lg font-medium">{item.name}</p>
              <p className="text-[#5C5C5C] text-sm">{item.serviceType}</p>

              {/* Availability Toggle Checkbox */}
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                  className="cursor-pointer"
                />
                <p
                  className={
                    item.available ? 'text-green-600' : 'text-gray-500'
                  }
                >
                  {item.available ? 'Available' : 'Busy'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StylistsList
