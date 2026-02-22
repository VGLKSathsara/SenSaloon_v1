import express from 'express'
import {
  loginStylist,
  appointmentsStylist,
  appointmentCancel,
  stylistList,
  changeAvailablity,
  appointmentComplete,
  stylistDashboard,
  stylistProfile,
  updateStylistProfile,
} from '../controllers/stylistController.js'
import authStylist from '../middleware/authStylist.js'

const stylistRouter = express.Router()

stylistRouter.post('/login', loginStylist)
stylistRouter.post('/cancel-appointment', authStylist, appointmentCancel)
stylistRouter.get('/appointments', authStylist, appointmentsStylist)
stylistRouter.get('/list', stylistList)
stylistRouter.post('/change-availability', authStylist, changeAvailablity)
stylistRouter.post('/complete-appointment', authStylist, appointmentComplete)
stylistRouter.get('/dashboard', authStylist, stylistDashboard)
stylistRouter.get('/profile', authStylist, stylistProfile)
stylistRouter.post('/update-profile', authStylist, updateStylistProfile)

export default stylistRouter
