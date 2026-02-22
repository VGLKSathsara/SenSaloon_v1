import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const navigate = useNavigate()

  /**
   * Opens WhatsApp chat with predefined number
   */
  const handleWhatsAppClick = () => {
    window.open('https://wa.me/94771234567', '_blank')
  }

  /**
   * Opens default email client with predefined address
   */
  const handleEmailClick = () => {
    window.location.href = 'mailto:hello@sensaloon.lk'
  }

  /**
   * Navigates to specified route and scrolls to top
   * @param {string} path - Route path to navigate to
   */
  const handleNavigation = (path) => {
    navigate(path)
    window.scrollTo(0, 0)
  }

  return (
    <div className="md:mx-10">
      {/* Main footer content - 3 column layout on desktop */}
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        {/* Column 1: Logo and company description */}
        <div>
          <img
            onClick={() => handleNavigation('/')}
            className="mb-5 w-40 cursor-pointer hover:opacity-80 transition-opacity"
            src={assets.logo}
            alt="Sensaloon Logo"
          />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            Sensaloon is Sri Lanka's premier salon booking platform, connecting
            you with expert stylists for all your beauty needs. Book
            appointments hassle-free and transform your look with confidence.
          </p>
        </div>

        {/* Column 2: Company navigation links */}
        <div>
          <p className="text-xl font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li
              onClick={() => handleNavigation('/')}
              className="cursor-pointer hover:text-primary hover:translate-x-1 transition-all"
            >
              Home
            </li>
            <li
              onClick={() => handleNavigation('/about')}
              className="cursor-pointer hover:text-primary hover:translate-x-1 transition-all"
            >
              About us
            </li>
            <li
              onClick={() => handleNavigation('/stylists')}
              className="cursor-pointer hover:text-primary hover:translate-x-1 transition-all"
            >
              Our Stylists
            </li>
            <li
              onClick={() => handleNavigation('/contact')}
              className="cursor-pointer hover:text-primary hover:translate-x-1 transition-all"
            >
              Contact
            </li>
            <li
              onClick={() => window.open('/privacy-policy', '_blank')}
              className="cursor-pointer hover:text-primary hover:translate-x-1 transition-all"
            >
              Privacy policy
            </li>
          </ul>
        </div>

        {/* Column 3: Contact information and social media */}
        <div>
          <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
          <ul className="flex flex-col gap-2 text-gray-600">
            {/* WhatsApp contact */}
            <li
              onClick={handleWhatsAppClick}
              className="cursor-pointer hover:text-green-600 hover:translate-x-1 transition-all flex items-center gap-2"
            >
              <span>📞</span> +94 77 123 4567
            </li>
            {/* Email contact */}
            <li
              onClick={handleEmailClick}
              className="cursor-pointer hover:text-blue-600 hover:translate-x-1 transition-all flex items-center gap-2"
            >
              <span>✉️</span> hello@sensaloon.lk
            </li>
            {/* Physical address */}
            <li className="flex items-center gap-2 mt-2">
              <span>📍</span> Colombo, Sri Lanka
            </li>
          </ul>

          {/* Social media links */}
          <div className="flex gap-4 mt-6">
            <a
              href="https://facebook.com/sensaloon"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
            >
              <span>f</span>
            </a>
            <a
              href="https://instagram.com/sensaloon"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all"
            >
              <span>📷</span>
            </a>
            <a
              href="https://wa.me/94771234567"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"
            >
              <span>💬</span>
            </a>
          </div>
        </div>
      </div>

      {/* Copyright section with dynamic year */}
      <div>
        <hr className="border-gray-300" />
        <p className="py-5 text-sm text-center text-gray-600">
          Copyright © {new Date().getFullYear()}{' '}
          <span
            onClick={() => handleNavigation('/')}
            className="font-semibold cursor-pointer hover:text-primary transition-colors"
          >
            Sensaloon.lk
          </span>{' '}
          - All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default Footer
