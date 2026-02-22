import axios from 'axios'
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

/**
 * Verify Component
 * Handles Stripe payment verification after redirect
 * Displays loading spinner while verifying payment
 */
const Verify = () => {
  const [searchParams] = useSearchParams()
  const success = searchParams.get('success')
  const appointmentId = searchParams.get('appointmentId')
  const { backendUrl, token } = useContext(AppContext)
  const navigate = useNavigate()

  /**
   * Verify Stripe payment status with backend
   * Updates appointment payment status on success
   */
  const verifyStripe = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/user/verifyStripe',
        { success, appointmentId },
        { headers: { token } },
      )

      if (data.success) {
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
      navigate('/my-appointments')
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  // Trigger verification when component mounts with required params
  useEffect(() => {
    if (token && appointmentId && success) {
      verifyStripe()
    }
  }, [token])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      {/* Loading spinner while verifying payment */}
      <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-primary rounded-full animate-spin"></div>
    </div>
  )
}

export default Verify
