import React from 'react'
import { assets } from '../assets/assets'

/**
 * About Component
 * Displays information about the salon, its mission, vision, and values
 */
const About = () => {
  return (
    <div>
      {/* Page title */}
      <div className="text-center text-2xl pt-10 text-[#707070]">
        <p>
          ABOUT <span className="text-gray-700 font-semibold">OUR SALON</span>
        </p>
      </div>

      {/* Main content section with image and description */}
      <div className="my-10 flex flex-col md:flex-row gap-12">
        {/* Salon interior image */}
        <img
          className="w-full md:max-w-[360px] rounded-lg shadow-md"
          src={assets.about_image}
          alt="Sensaloon Interior"
        />

        {/* About text content */}
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
          <p>
            Welcome to <b>Sensaloon</b>, your premier destination for
            personalized grooming and beauty transformations. We understand that
            your hair and skin are a reflection of your identity, and we are
            dedicated to helping you look and feel your absolute best.
          </p>
          <p>
            We are committed to excellence in the beauty industry. Our platform
            bridges the gap between expert stylists and clients, making it
            easier than ever to book top-tier services that fit your schedule.
            From classic cuts to modern makeovers, we support your journey
            toward self-confidence.
          </p>
          <b className="text-gray-800">Our Vision</b>
          <p>
            Our vision is to revolutionize the salon experience by providing a
            seamless, digital-first approach to beauty. We aim to empower both
            stylists and customers through technology, ensuring that premium
            grooming services are accessible to everyone, everywhere.
          </p>
        </div>
      </div>

      {/* "Why Choose Us" section title */}
      <div className="text-xl my-4">
        <p>
          WHY <span className="text-gray-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      {/* Three key value propositions */}
      <div className="flex flex-col md:flex-row mb-20">
        {/* Efficiency card */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>EFFICIENCY:</b>
          <p>
            Real-time booking system that respects your time and busy lifestyle.
          </p>
        </div>

        {/* Trusted stylists card */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>TRUSTED STYLISTS:</b>
          <p>
            A handpicked network of certified professionals with years of
            experience.
          </p>
        </div>

        {/* Personalization card */}
        <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer">
          <b>PERSONALIZATION:</b>
          <p>
            Tailored beauty recommendations and services designed specifically
            for you.
          </p>
        </div>
      </div>
    </div>
  )
}

export default About
