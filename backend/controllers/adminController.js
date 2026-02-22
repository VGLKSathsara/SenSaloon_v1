import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import stylistModel from '../models/stylistModel.js'
import bcrypt from 'bcrypt'
import validator from 'validator'
import { v2 as cloudinary } from 'cloudinary'
import userModel from '../models/userModel.js'

/**
 * Admin Login API
 * Validates admin credentials and returns JWT token
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET)
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
 * Get all appointments
 * Returns list of all appointments in the system
 */
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({})
    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Cancel appointment
 * Updates appointment status to cancelled
 */
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body
    await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
    res.json({ success: true, message: 'Appointment Cancelled' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Add new stylist
 * Creates stylist account with image upload to Cloudinary
 */
const addStylist = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      serviceType,
      qualification,
      experience,
      about,
      fees,
      address,
    } = req.body
    const imageFile = req.file

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !serviceType ||
      !qualification ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
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

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: 'image',
    })
    const imageUrl = imageUpload.secure_url

    // Create stylist data object
    const stylistData = {
      name,
      email,
      image: imageUrl,
      password: hashedPassword,
      serviceType,
      qualification,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    }

    // Save to database
    const newStylist = new stylistModel(stylistData)
    await newStylist.save()
    res.json({ success: true, message: 'Stylist Added' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Get all stylists
 * Returns list of all stylists (excluding passwords)
 */
const allStylists = async (req, res) => {
  try {
    const stylists = await stylistModel.find({}).select('-password')
    res.json({ success: true, stylists })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Admin Dashboard Data
 * Returns statistics and latest appointments
 */
const adminDashboard = async (req, res) => {
  try {
    const stylists = await stylistModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
      stylists: stylists.length,
      appointments: appointments.length,
      customers: users.length,
      latestAppointments: appointments.reverse(),
    }

    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Delete Stylist
 * Permanently removes stylist from database
 */
const deleteStylist = async (req, res) => {
  try {
    const { stylistId } = req.body

    // Validate stylist ID
    if (!stylistId) {
      return res.json({
        success: false,
        message: 'Stylist ID is required',
      })
    }

    // Check if stylist exists
    const stylist = await stylistModel.findById(stylistId)
    if (!stylist) {
      return res.json({
        success: false,
        message: 'Stylist not found',
      })
    }

    // Delete stylist
    await stylistModel.findByIdAndDelete(stylistId)

    res.json({
      success: true,
      message: 'Stylist deleted successfully',
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message,
    })
  }
}

export {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addStylist,
  allStylists,
  adminDashboard,
  deleteStylist,
}
