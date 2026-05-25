import React from 'react'
import { Link } from 'react-router-dom'

const PaymentCancel = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-6">
        {/* X circle */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Payment Cancelled</h1>
        <p className="text-gray-500 mb-1">
          You cancelled the payment. No charge has been made.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Your appointment slot is still reserved. You can pay any time from your appointments page.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/my-appointments"
            className="bg-primary text-white px-6 py-2.5 rounded hover:bg-primary/90 transition-all duration-300 font-medium"
          >
            Back to Appointments
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

export default PaymentCancel
