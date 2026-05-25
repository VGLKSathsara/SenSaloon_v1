import express from 'express'
import {
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
  confirmPayment,
} from '../controllers/userController.js'
import upload from '../middleware/multer.js'
import authUser from '../middleware/authUser.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post(
  '/update-profile',
  upload.single('image'),
  authUser,
  updateProfile,
)

userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)

// PayHere payment routes
userRouter.post('/payment-payhere', authUser, paymentPayHere)
userRouter.get('/verify-payhere', verifyPayHere)
userRouter.post('/payhere-notify', payHereNotification)
userRouter.post('/confirm-payment', authUser, confirmPayment)

export default userRouter
