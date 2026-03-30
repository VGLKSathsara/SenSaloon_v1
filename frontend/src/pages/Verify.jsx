import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

/**
 * Verify Component
 * Handles payment callback from PayHere
 * Shows loading spinner while processing payment confirmation
 */
const Verify = () => {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const appointmentId = searchParams.get('appointmentId')
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'success' && appointmentId) {
      // Payment successful - appointment will be updated by notification
      toast.success('Payment Successful!')
      navigate('/my-appointments')
    } else if (status === 'cancel') {
      toast.info('Payment Cancelled')
      navigate('/my-appointments')
    } else if (status === 'failed') {
      toast.error('Payment Failed')
      navigate('/my-appointments')
    } else {
      // No params, redirect to appointments
      navigate('/my-appointments')
    }
  }, [status, appointmentId, navigate])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Processing payment confirmation...</p>
      </div>
    </div>
  )
}

export default Verify
