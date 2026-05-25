import React, { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

/**
 * Reusable PayHere payment button (popup/JS-SDK flow).
 *
 * Props
 * ─────
 * appointmentId   – MongoDB _id of the appointment being paid (used to derive
 *                   the order_id and to store it for the /notify lookup)
 * amount          – Numeric payment amount, e.g. 2500
 * currency        – ISO currency code, defaults to "LKR"
 * items           – Short description shown in the PayHere popup
 * customerDetails – Optional override for { first_name, last_name, email,
 *                   phone, address, city }; falls back to AppContext userData
 * onSuccess(orderId) – Called when PayHere reports onCompleted
 * onDismissed()      – Called when the user closes the popup
 * onError(error)     – Called on PayHere SDK errors
 * className       – Extra CSS classes for the <button>
 * children        – Button label; defaults to "Pay Now"
 */
const PaymentButton = ({
  appointmentId,
  amount,
  currency = 'LKR',
  items = 'Salon Appointment',
  customerDetails,
  onSuccess,
  onDismissed,
  onError,
  className = '',
  children,
}) => {
  const { backendUrl, token, userData } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const handlePayment = async () => {
    if (!window.payhere) {
      toast.error('Payment SDK not loaded — please refresh the page.')
      return
    }

    if (!token) {
      toast.error('Please log in to make a payment.')
      return
    }

    setLoading(true)

    try {
      // Unique order_id per payment attempt
      const orderId = `ORDER_${appointmentId}_${Date.now()}`

      // Format amount to exactly 2 decimal places — MUST match what the backend
      // uses when computing the hash (PayHere hash formula uses number_format 2dp)
      const formattedAmount = parseFloat(amount).toFixed(2)

      // Fetch hash from backend (never computed on the client)
      const { data } = await axios.post(
        `${backendUrl}/api/payment/hash`,
        { order_id: orderId, amount: formattedAmount, currency, appointmentId },
        { headers: { token } },
      )

      if (!data.success) {
        throw new Error(data.message || 'Failed to generate payment hash')
      }

      // Resolve customer info: prop override → AppContext userData → safe defaults
      const nameParts = (userData?.name || 'Customer').split(' ')
      const customer = customerDetails ?? {
        first_name: nameParts[0] || 'Customer',
        last_name: nameParts.slice(1).join(' ') || '',
        email: userData?.email || '',
        phone: userData?.phone || '0000000000',
        address: userData?.address?.line1 || 'N/A',
        city: userData?.address?.line2 || 'Colombo',
      }

      const payment = {
        sandbox: true, // Switch to false and use HTTPS notify_url in production
        merchant_id: data.merchant_id,
        return_url: `${window.location.origin}/verify?status=success&appointmentId=${appointmentId}`,
        cancel_url: `${window.location.origin}/verify?status=cancel&appointmentId=${appointmentId}`,
        notify_url: `${import.meta.env.VITE_BACKEND_URL}/api/payment/notify`,
        order_id: orderId,
        items,
        amount: formattedAmount,  // same value used to build the hash
        currency,
        hash: data.hash,
        first_name: customer.first_name,
        last_name: customer.last_name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        country: 'Sri Lanka',
      }

      // Register callbacks before calling startPayment
      window.payhere.onCompleted = async (completedOrderId) => {
        // Persist payment in DB immediately so the re-fetch reflects the correct state.
        // This is the reliable path when PayHere cannot reach /notify on localhost.
        try {
          await axios.post(
            `${backendUrl}/api/user/confirm-payment`,
            { appointmentId },
            { headers: { token } },
          )
        } catch (err) {
          console.error('confirm-payment error:', err)
        }
        toast.success('Payment completed successfully!')
        setLoading(false)
        if (onSuccess) onSuccess(completedOrderId)
      }

      window.payhere.onDismissed = () => {
        toast.info('Payment was dismissed.')
        setLoading(false)
        if (onDismissed) onDismissed()
      }

      window.payhere.onError = (error) => {
        toast.error(`Payment error: ${error}`)
        setLoading(false)
        if (onError) onError(error)
      }

      window.payhere.startPayment(payment)
    } catch (error) {
      console.error('PaymentButton error:', error)
      toast.error(error.message || 'Payment initiation failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className={`flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        children ?? 'Pay Now'
      )}
    </button>
  )
}

export default PaymentButton
