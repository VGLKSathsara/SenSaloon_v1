import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import userModel from '../models/userModel.js'
import stylistModel from '../models/stylistModel.js'
import appointmentModel from '../models/appointmentModel.js'
import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'

// PayHere Configuration
const PAYHERE_MERCHANT_ID = process.env.PAYHERE_MERCHANT_ID
const PAYHERE_SECRET = process.env.PAYHERE_SECRET
const PAYHERE_CURRENCY = process.env.PAYHERE_CURRENCY || 'LKR'
const PAYHERE_SANDBOX = process.env.PAYHERE_SANDBOX === 'true'

// PayHere API endpoints
const PAYHERE_CHECKOUT_URL = PAYHERE_SANDBOX
  ? 'https://sandbox.payhere.lk/pay/checkout'
  : 'https://www.payhere.lk/pay/checkout'

/**
 * Generate MD5 signature for PayHere payment
 * @param {Object} paymentData - Payment details
 * @returns {string} MD5 hash signature
 */
const generatePayHereSignature = (paymentData) => {
  const { merchant_id, order_id, amount, currency, merchant_secret } =
    paymentData
  const hashString = `${merchant_id}${order_id}${amount}${currency}${merchant_secret}`
  return crypto.createHash('md5').update(hashString).digest('hex').toUpperCase()
}

/**
 * Register new user
 * Creates user account with hashed password and returns JWT token
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate required fields
    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing Details' })
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: 'Please enter a valid email' })
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({
        success: false,
        message: 'Please enter a strong password',
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user data
    const userData = {
      name,
      email,
      password: hashedPassword,
    }

    // Save user to database
    const newUser = new userModel(userData)
    const user = await newUser.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * User Login
 * Authenticates user and returns JWT token
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'User does not exist' })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      res.json({ success: true, token })
    } else {
      res.json({ success: false, message: 'Invalid credentials' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Get User Profile
 * Returns user data (excluding password)
 */
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body
    const userData = await userModel.findById(userId).select('-password')

    res.json({ success: true, userData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Update User Profile
 * Updates user details and optionally profile image
 */
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body
    const imageFile = req.file

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: 'Data Missing' })
    }

    // Update user details
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    })

    // Upload new image if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: 'image',
      })
      const imageURL = imageUpload.secure_url
      await userModel.findByIdAndUpdate(userId, { image: imageURL })
    }

    res.json({ success: true, message: 'Profile Updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Book Appointment
 * Creates new appointment and updates stylist's booked slots
 */
const bookAppointment = async (req, res) => {
  try {
    const { userId, stylId, slotDate, slotTime } = req.body

    // Validate required fields
    if (!userId || !stylId || !slotDate || !slotTime) {
      return res.json({
        success: false,
        message: 'Missing required fields',
      })
    }

    // Find stylist and check if exists
    const stylistData = await stylistModel.findById(stylId).select('-password')

    if (!stylistData) {
      return res.json({
        success: false,
        message: 'Stylist not found',
      })
    }

    // Check availability with safe navigation
    if (stylistData.available === false) {
      return res.json({
        success: false,
        message: 'Stylist Not Available',
      })
    }

    // Initialize slots_booked if it doesn't exist
    let slots_booked = stylistData.slots_booked || {}

    // Check if slot is already booked
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: 'Slot Not Available',
        })
      } else {
        slots_booked[slotDate].push(slotTime)
      }
    } else {
      slots_booked[slotDate] = [slotTime]
    }

    // Find user data
    const userData = await userModel.findById(userId).select('-password')
    if (!userData) {
      return res.json({
        success: false,
        message: 'User not found',
      })
    }

    // Create appointment data
    const appointmentData = {
      userId,
      stylistId: stylId,
      userData,
      stylistData,
      amount: stylistData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    }

    const newAppointment = new appointmentModel(appointmentData)
    await newAppointment.save()

    // Update stylist's slots
    await stylistModel.findByIdAndUpdate(stylId, { slots_booked })

    res.json({
      success: true,
      message: 'Appointment Booked Successfully',
    })
  } catch (error) {
    console.log('Error in bookAppointment:', error)
    res.json({
      success: false,
      message: error.message,
    })
  }
}

/**
 * Cancel Appointment
 * Allows user to cancel their appointment and frees up the slot
 */
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData) {
      return res.json({ success: false, message: 'Appointment not found' })
    }

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: 'Unauthorized action' })
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

    const { stylistId, slotDate, slotTime } = appointmentData
    const stylistData = await stylistModel.findById(stylistId)

    if (stylistData && stylistData.slots_booked) {
      let slots_booked = stylistData.slots_booked
      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (e) => e !== slotTime,
        )
        await stylistModel.findByIdAndUpdate(stylistId, { slots_booked })
      }
    }

    res.json({ success: true, message: 'Appointment Cancelled' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * List User Appointments
 * Returns all appointments for the logged-in user
 */
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body
    const appointments = await appointmentModel.find({ userId })

    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * PayHere Payment Initiation
 * Creates payment session and redirects to PayHere hosted page
 */
const paymentPayHere = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const { origin } = req.headers

    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: 'Appointment Cancelled or not found',
      })
    }

    // Generate unique order ID
    const orderId = `ORDER_${appointmentId}_${Date.now()}`

    // Prepare payment data for signature
    const paymentData = {
      merchant_id: PAYHERE_MERCHANT_ID,
      order_id: orderId,
      amount: appointmentData.amount.toString(),
      currency: PAYHERE_CURRENCY,
      merchant_secret: PAYHERE_SECRET,
    }

    const signature = generatePayHereSignature(paymentData)

    // Store order_id in appointment for later reference
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      payhere_order_id: orderId,
    })

    // Build PayHere payment URL with parameters
    const paymentUrl = `${PAYHERE_CHECKOUT_URL}?merchant_id=${PAYHERE_MERCHANT_ID}&order_id=${orderId}&amount=${appointmentData.amount}&currency=${PAYHERE_CURRENCY}&return_url=${origin}/verify?status=success&appointmentId=${appointmentId}&cancel_url=${origin}/verify?status=cancel&notify_url=${process.env.BACKEND_URL}/api/user/payhere-notify&signature=${signature}&item_name=Salon%20Appointment&item_id=${appointmentId}`

    res.json({ success: true, payment_url: paymentUrl })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Verify PayHere Payment
 * Handles return from PayHere payment page
 */
const verifyPayHere = async (req, res) => {
  try {
    const { appointmentId, status } = req.query

    if (status === 'cancel') {
      return res.redirect(
        `${process.env.FRONTEND_URL}/my-appointments?payment=cancelled`,
      )
    }

    if (status === 'success' && appointmentId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
      return res.redirect(
        `${process.env.FRONTEND_URL}/my-appointments?payment=success`,
      )
    }

    return res.redirect(
      `${process.env.FRONTEND_URL}/my-appointments?payment=failed`,
    )
  } catch (error) {
    console.log(error)
    return res.redirect(
      `${process.env.FRONTEND_URL}/my-appointments?payment=failed`,
    )
  }
}

/**
 * PayHere Notification Endpoint
 * Receives payment status updates from PayHere (server-to-server)
 */
const payHereNotification = async (req, res) => {
  try {
    // PayHere sends POST data to this endpoint
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
    } = req.body

    console.log('PayHere Notification Received:', { order_id, status_code })

    // Verify signature
    const verificationData = {
      merchant_id: merchant_id,
      order_id: order_id,
      amount: payhere_amount,
      currency: payhere_currency,
      status_code: status_code,
      merchant_secret: PAYHERE_SECRET,
    }

    const expectedHash = generatePayHereSignature(verificationData)

    if (md5sig !== expectedHash) {
      console.log('Invalid signature')
      return res.status(400).send('Invalid signature')
    }

    // Find appointment by order_id
    const appointment = await appointmentModel.findOne({
      payhere_order_id: order_id,
    })

    if (appointment && status_code === '2') {
      // Status code 2 = Success
      await appointmentModel.findByIdAndUpdate(appointment._id, {
        payment: true,
      })
      console.log(`Payment confirmed for appointment: ${appointment._id}`)
    } else if (appointment && status_code !== '2') {
      console.log(
        `Payment failed for appointment: ${appointment._id}, status: ${status_code}`,
      )
    }

    // Respond with success to PayHere
    res.status(200).send('OK')
  } catch (error) {
    console.log('PayHere Notification Error:', error)
    res.status(500).send('Error')
  }
}

export {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentPayHere,
  verifyPayHere,
  payHereNotification,
}
