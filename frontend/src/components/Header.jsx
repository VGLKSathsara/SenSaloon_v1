import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className="flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 ">
      {/* Left section - Text content and CTA */}
      <div className="md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]">
        {/* Main headline */}
        <p className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight">
          Book Appointment <br /> With Trusted Stylists
        </p>

        {/* Customer testimonials / social proof section */}
        <div className="flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light">
          <img
            className="w-28"
            src={assets.group_profiles}
            alt="Happy Customers"
          />
          <p>
            Simply browse through our extensive list of expert stylists,{' '}
            <br className="hidden sm:block" /> schedule your makeover
            hassle-free.
          </p>
        </div>

        {/* Smooth scroll link to services section */}
        <a
          href="#services"
          className="flex items-center gap-2 bg-white px-8 py-3 rounded-full text-[#595959] text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
        >
          Book appointment{' '}
          <img className="w-3" src={assets.arrow_icon} alt="arrow" />
        </a>
      </div>

      {/* Right section - Hero image */}
      <div className="md:w-1/2 relative">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-lg"
          src={assets.header_img}
          alt="Sensaloon Salon"
        />
      </div>
    </div>
  )
}

export default Header
