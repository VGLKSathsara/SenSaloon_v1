import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

/**
 * Stylists Component
 * Displays filtered list of stylists based on service type
 * Allows filtering by service categories
 */
const Stylists = () => {
  const { service } = useParams()
  const [filterStylist, setFilterStylist] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const navigate = useNavigate()
  const { stylists } = useContext(AppContext)

  /**
   * Maps frontend service names to backend serviceType values
   * Handles naming differences (e.g., "Haircut" -> "Hair Cut")
   */
  const serviceMapping = {
    Haircut: 'Hair Cut',
    Facial: 'Facial',
    Manicure: 'Manicure',
    'Hair Coloring': 'Hair Coloring',
    Makeup: 'Makeup',
    'Hair Spa': 'Hair Spa',
  }

  /**
   * Filter stylists based on selected service
   * If no service selected, show all stylists
   */
  const applyFilter = () => {
    if (service) {
      const backendServiceName = serviceMapping[service]
      console.log('Selected service:', service)
      console.log('Looking for:', backendServiceName)

      const filtered = stylists.filter(
        (styl) => styl.serviceType === backendServiceName,
      )
      console.log('Found:', filtered.length, 'stylists')
      setFilterStylist(filtered)
    } else {
      setFilterStylist(stylists)
    }
  }

  // Re-apply filter when stylists data or service changes
  useEffect(() => {
    applyFilter()
  }, [stylists, service])

  /**
   * Handle service category click
   * Toggles between showing all stylists and filtered by service
   * @param {string} serviceName - Selected service category
   */
  const handleServiceClick = (serviceName) => {
    if (service === serviceName) {
      navigate('/stylists') // Show all stylists
    } else {
      navigate(`/stylists/${serviceName}`) // Show filtered stylists
    }
    scrollTo(0, 0)
  }

  return (
    <div>
      {/* Page description */}
      <p className="text-gray-600">Browse through the specialist stylists.</p>

      {/* Main content - Filter sidebar and stylist grid */}
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        {/* Mobile filter toggle button */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? 'bg-primary text-white' : ''
          }`}
        >
          Filters
        </button>

        {/* Filter sidebar - Service categories */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? 'flex' : 'hidden sm:flex'
          }`}
        >
          {/* Service filter options */}
          <p
            onClick={() => handleServiceClick('Haircut')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              service === 'Haircut' ? 'bg-[#E2E5FF] text-black' : ''
            }`}
          >
            Haircut
          </p>
          <p
            onClick={() => handleServiceClick('Facial')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              service === 'Facial' ? 'bg-[#E2E5FF] text-black' : ''
            }`}
          >
            Facial
          </p>
          <p
            onClick={() => handleServiceClick('Manicure')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              service === 'Manicure' ? 'bg-[#E2E5FF] text-black' : ''
            }`}
          >
            Manicure
          </p>
          <p
            onClick={() => handleServiceClick('Hair Coloring')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              service === 'Hair Coloring' ? 'bg-[#E2E5FF] text-black' : ''
            }`}
          >
            Hair Coloring
          </p>
          <p
            onClick={() => handleServiceClick('Makeup')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              service === 'Makeup' ? 'bg-[#E2E5FF] text-black' : ''
            }`}
          >
            Makeup
          </p>
          <p
            onClick={() => handleServiceClick('Hair Spa')}
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${
              service === 'Hair Spa' ? 'bg-[#E2E5FF] text-black' : ''
            }`}
          >
            Hair Spa
          </p>
        </div>

        {/* Stylist grid - Display filtered stylists */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterStylist.length > 0 ? (
            filterStylist.map((item, index) => (
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
                  {/* Availability indicator */}
                  <div
                    className={`flex items-center gap-2 text-sm text-center ${
                      item.available ? 'text-green-500' : 'text-gray-500'
                    }`}
                  >
                    <p
                      className={`w-2 h-2 rounded-full ${
                        item.available ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    ></p>
                    <p>{item.available ? 'Available' : 'Not Available'}</p>
                  </div>

                  {/* Stylist name */}
                  <p className="text-[#262626] text-lg font-medium">
                    {item.name}
                  </p>

                  {/* Service type */}
                  <p className="text-[#5C5C5C] text-sm">{item.serviceType}</p>
                </div>
              </div>
            ))
          ) : (
            // No results message
            <p className="text-gray-500 col-span-full text-center py-10">
              No stylists found for {service}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Stylists
