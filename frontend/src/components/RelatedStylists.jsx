import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

/**
 * RelatedStylists Component
 * Displays other stylists offering the same service type
 * Excludes the currently viewed stylist
 */
const RelatedStylists = ({ serviceType, stylId }) => {
  const navigate = useNavigate()
  const { stylists } = useContext(AppContext)

  const [relStylist, setRelStylist] = useState([])

  /**
   * Filter stylists to show only those with same service type
   * Exclude current stylist using stylId
   */
  useEffect(() => {
    if (stylists.length > 0 && serviceType) {
      const stylistsData = stylists.filter(
        (styl) => styl.serviceType === serviceType && styl._id !== stylId,
      )
      setRelStylist(stylistsData)
    }
  }, [stylists, serviceType, stylId])

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626]">
      {/* Section title */}
      <h1 className="text-3xl font-medium">Related Stylists</h1>

      {/* Section description */}
      <p className="sm:w-1/3 text-center text-sm">
        Browse through other expert stylists offering similar services.
      </p>

      {/* Grid of related stylists */}
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relStylist.map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              scrollTo(0, 0)
            }}
            className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            {/* Stylist image */}
            <img
              className="bg-[#EAEFFF] w-full h-64 object-cover"
              src={item.image}
              alt={item.name}
            />

            {/* Stylist info */}
            <div className="p-4">
              {/* Availability status indicator */}
              <div
                className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-gray-500'}`}
              >
                <p
                  className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}
                ></p>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>

              {/* Stylist name */}
              <p className="text-[#262626] text-lg font-medium">{item.name}</p>

              {/* Service type */}
              <p className="text-[#5C5C5C] text-sm">{item.serviceType}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedStylists
