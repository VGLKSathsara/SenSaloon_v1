import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import validator from 'validator'
import userModel from '../models/userModel.js'
import stylistModel from '../models/stylistModel.js'
import appointmentModel from '../models/appointmentModel.js'
import { v2 as cloudinary } from 'cloudinary'
import stripe from 'stripe'
import razorpay from 'razorpay'

// Initialize Payment Gateways
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

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
 * Razorpay Payment Initiation
 * Creates Razorpay order for appointment payment
 */
const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body
    const appointmentData = await appointmentModel.findById(appointmentId)

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: 'Appointment Cancelled or not found',
      })
    }

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    }

    const order = await razorpayInstance.orders.create(options)
    res.json({ success: true, order })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Verify Razorpay Payment
 * Confirms payment status and updates appointment
 */
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

    if (orderInfo.status === 'paid') {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      })
      res.json({ success: true, message: 'Payment Successful' })
    } else {
      res.json({ success: false, message: 'Payment Failed' })
    }
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Stripe Payment Initiation
 * Creates Stripe checkout session for appointment payment
 */
const paymentStripe = async (req, res) => {
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

    const currency = process.env.CURRENCY.toLowerCase()

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: 'Appointment Fees',
          },
          unit_amount: appointmentData.amount * 100,
        },
        quantity: 1,
      },
    ]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
      line_items: line_items,
      mode: 'payment',
    })

    res.json({ success: true, session_url: session.url })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Verify Stripe Payment
 * Updates appointment payment status after successful payment
 */
const verifyStripe = async (req, res) => {
  try {
    const { appointmentId, success } = req.body

    if (success === 'true') {
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
      return res.json({ success: true, message: 'Payment Successful' })
    }

    res.json({ success: false, message: 'Payment Failed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
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
  paymentRazorpay,
  verifyRazorpay,
  paymentStripe,
  verifyStripe,
}
