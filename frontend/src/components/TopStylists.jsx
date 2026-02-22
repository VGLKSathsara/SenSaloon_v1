import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

/**
 * TopStylists Component
 * Displays first 10 stylists as featured professionals on homepage
 */
const TopStylists = () => {
  const navigate = useNavigate()
  const { stylists } = useContext(AppContext)

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
      {/* Section title */}
      <h1 className="text-3xl font-medium">Top Stylists to Book</h1>

      {/* Section description */}
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of expert stylists.
      </p>

      {/* Grid of top 10 stylists */}
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {stylists.slice(0, 10).map((item, index) => (
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

      {/* "View All" button */}
      <button
        onClick={() => {
          navigate('/stylists')
          scrollTo(0, 0)
        }}
        className="bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more
      </button>
    </div>
  )
}

export default TopStylists
