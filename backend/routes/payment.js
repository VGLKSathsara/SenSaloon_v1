import express from 'express'
import crypto from 'crypto'
import appointmentModel from '../models/appointmentModel.js'
import { sendPaymentConfirmationEmail } from '../utils/emailService.js'

const paymentRouter = express.Router()

const md5 = (str) => crypto.createHash('md5').update(str).digest('hex')

// Format amount to exactly 2 decimal places as required by PayHere
const toDecimal = (amount) => parseFloat(amount).toFixed(2)

/**
 * Build the PayHere hash:
 * md5( merchant_id + order_id + toDecimal(amount) + currency + md5(merchant_secret).toUpperCase() )
 */
const buildHash = (merchant_id, order_id, amount, currency) => {
  const secretHash = md5(process.env.PAYHERE_MERCHANT_SECRET).toUpperCase()
  return md5(merchant_id + order_id + toDecimal(amount) + currency + secretHash).toUpperCase()
}

/**
 * POST /api/payment/hash
 * Accepts: { order_id, amount, currency, appointmentId? }
 * Returns: { hash, merchant_id }
 * The optional appointmentId causes the order_id to be persisted on the
 * appointment document so the /notify handler can look it up later.
 */
paymentRouter.post('/hash', async (req, res) => {
  try {
    const { order_id, amount, currency, appointmentId } = req.body

    if (!order_id || !amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'order_id, amount, and currency are required',
      })
    }

    // Persist order_id on the appointment so /notify can find it
    if (appointmentId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payhere_order_id: order_id,
      })
    }

    const hash = buildHash(process.env.PAYHERE_MERCHANT_ID, order_id, amount, currency)

    res.json({ success: true, hash, merchant_id: process.env.PAYHERE_MERCHANT_ID })
  } catch (error) {
    console.error('Hash generation error:', error)
    res.status(500).json({ success: false, message: error.message })
  }
})

/**
 * POST /api/payment/notify
 * PayHere server-to-server payment notification.
 * Verifies authenticity by re-computing:
 * md5( merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret).toUpperCase() )
 * then updates appointment payment status on status_code === "2" (success).
 */
paymentRouter.post('/notify', async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body

    console.log('PayHere Notify received:', { order_id, status_code, payment_id })

    // Re-compute expected signature
    const secretHash = md5(process.env.PAYHERE_MERCHANT_SECRET).toUpperCase()
    const expectedSig = md5(
      merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretHash,
    ).toUpperCase()

    if (md5sig !== expectedSig) {
      console.warn('PayHere notify: signature mismatch — possible spoofed request')
      return res.status(400).send('Invalid signature')
    }

    const appointment = await appointmentModel.findOne({ payhere_order_id: order_id })

    if (!appointment) {
      console.warn('PayHere notify: no appointment found for order_id:', order_id)
      return res.status(200).send('OK') // Still 200 so PayHere stops retrying
    }

    if (status_code === '2') {
      // Guard: if already paid (confirm-payment already ran), skip to avoid double email
      if (appointment.payment) {
        console.log('ℹ️ Notify received but appointment already paid — skipping:', appointment._id)
        return res.status(200).send('OK')
      }

      await appointmentModel.findByIdAndUpdate(appointment._id, { payment: true })
      console.log('✅ Payment confirmed via notify for appointment:', appointment._id)

      sendPaymentConfirmationEmail({
        userData: appointment.userData,
        stylistData: appointment.stylistData,
        slotDate: appointment.slotDate,
        slotTime: appointment.slotTime,
        amount: appointment.amount,
      })
    } else {
      console.log(`Payment status ${status_code} for appointment:`, appointment._id)
    }

    res.status(200).send('OK')
  } catch (error) {
    console.error('PayHere notify error:', error)
    res.status(500).send('Error')
  }
})

export default paymentRouter
