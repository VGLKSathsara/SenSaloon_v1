import React from 'react'
import { Link } from 'react-router-dom'

const PaymentSuccess = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-6">
        {/* Checkmark circle */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-1">
          Your payment was processed and your appointment is confirmed.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          You will receive a confirmation shortly.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/my-appointments"
            className="bg-primary text-white px-6 py-2.5 rounded hover:bg-primary/90 transition-all duration-300 font-medium"
          >
            View My Appointments
          </Link>
          <Link
            to="/"
            className="border border-gray-300 text-gray-600 px-6 py-2.5 rounded hover:bg-gray-50 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
