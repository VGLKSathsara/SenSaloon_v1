import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import stylistModel from '../models/stylistModel.js'
import appointmentModel from '../models/appointmentModel.js'

/**
 * Stylist Login API
 * Authenticates stylist and returns JWT token
 */
const loginStylist = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await stylistModel.findOne({ email })

    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' })
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
 * Get Stylist's Appointments
 * Returns all appointments for the logged-in stylist
 */
const appointmentsStylist = async (req, res) => {
  try {
    const { stylistId } = req.body
    const appointments = await appointmentModel.find({ stylistId })

    res.json({ success: true, appointments })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Cancel Appointment
 * Allows stylist to cancel their own appointments
 */
const appointmentCancel = async (req, res) => {
  try {
    const { stylistId, appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData && appointmentData.stylistId === stylistId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      })
      return res.json({ success: true, message: 'Appointment Cancelled' })
    }

    res.json({ success: false, message: 'Action Failed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Complete Appointment
 * Marks appointment as completed by stylist
 */
const appointmentComplete = async (req, res) => {
  try {
    const { stylistId, appointmentId } = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)
    if (appointmentData && appointmentData.stylistId === stylistId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      })
      return res.json({ success: true, message: 'Appointment Completed' })
    }

    res.json({ success: false, message: 'Action Failed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Get All Stylists for Frontend
 * Returns list of stylists without sensitive information
 */
const stylistList = async (req, res) => {
  try {
    const stylists = await stylistModel.find({}).select(['-password', '-email'])
    res.json({ success: true, stylists })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Change Availability Status
 * Toggles stylist's availability for bookings
 */
const changeAvailablity = async (req, res) => {
  try {
    const { stylistId } = req.body

    const stylistData = await stylistModel.findById(stylistId)
    await stylistModel.findByIdAndUpdate(stylistId, {
      available: !stylistData.available,
    })
    res.json({ success: true, message: 'Availability Changed' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Get Stylist Profile
 * Returns stylist's profile information (excluding password)
 */
const stylistProfile = async (req, res) => {
  try {
    const { stylistId } = req.body
    const profileData = await stylistModel
      .findById(stylistId)
      .select('-password')

    res.json({ success: true, profileData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Update Stylist Profile
 * Updates fees, address, and availability settings
 */
const updateStylistProfile = async (req, res) => {
  try {
    const { stylistId, fees, address, available } = req.body

    await stylistModel.findByIdAndUpdate(stylistId, {
      fees,
      address,
      available,
    })

    res.json({ success: true, message: 'Profile Updated' })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

/**
 * Stylist Dashboard Data
 * Returns earnings, appointment counts, and statistics
 */
const stylistDashboard = async (req, res) => {
  try {
    const { stylistId } = req.body

    const appointments = await appointmentModel.find({ stylistId })

    // Calculate total earnings from completed/paid appointments
    let earnings = 0
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount
      }
    })

    // Get unique customers
    let customers = []
    appointments.map((item) => {
      if (!customers.includes(item.userId)) {
        customers.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      customers: customers.length,
      latestAppointments: appointments.reverse(),
    }

    res.json({ success: true, dashData })
  } catch (error) {
    console.log(error)
    res.json({ success: false, message: error.message })
  }
}

export {
  loginStylist,
  appointmentsStylist,
  appointmentCancel,
  stylistList,
  changeAvailablity,
  appointmentComplete,
  stylistDashboard,
  stylistProfile,
  updateStylistProfile,
}
