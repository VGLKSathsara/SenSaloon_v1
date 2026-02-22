import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

/**
 * Contact Component
 * Displays contact information and office details
 * Includes navigation to About page
 */
const Contact = () => {
  const navigate = useNavigate()

  /**
   * Navigate to specified path and scroll to top
   * @param {string} path - Route path to navigate to
   */
  const handleNavigation = (path) => {
    navigate(path)
    window.scrollTo(0, 0) // Scroll to top of page
  }

  return (
    <div>
      {/* Page title */}
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      {/* Main content - image and contact details */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        {/* Contact image */}
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt="Sensaloon Contact"
        />

        {/* Contact information */}
        <div className="flex flex-col justify-center items-start gap-6">
          {/* Office address */}
          <p className=" font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className=" text-gray-500">
            Colombo, <br /> Sri Lanka
          </p>

          {/* Phone and email */}
          <p className=" text-gray-500">
            Tel: +94 77 123 4567 <br /> Email: hello@sensaloon.lk
          </p>

          {/* Careers section */}
          <p className=" font-semibold text-lg text-gray-600">
            CAREERS AT SENSALOON
          </p>
          <p className=" text-gray-500">Learn more about our teams.</p>

          {/* Button linking to About page */}
          <button
            onClick={() => handleNavigation('/about')}
            className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500"
          >
            Learn About Us
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
