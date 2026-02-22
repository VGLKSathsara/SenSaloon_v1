import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import stylistRouter from './routes/stylistRoute.js'
import adminRouter from './routes/adminRoute.js'
import dns from 'node:dns'
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1'])

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// ============================================
// ADMIN ROUTES - Delete Option එක ඇතුළත්
// ============================================
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter) // ✅ delete-stylist route එක adminRouter එකේ තියෙනවා
app.use('/api/stylist', stylistRouter)

// ============================================
// TEST ROUTES
// ============================================

// Test route for Cloudinary
app.get('/test-cloudinary', async (req, res) => {
  try {
    const { v2: cloudinary } = await import('cloudinary')

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    const result = await cloudinary.api.ping()

    console.log('✅ Cloudinary Test Successful')
    res.json({
      success: true,
      message: 'Cloudinary Connected Successfully!',
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key_exists: !!process.env.CLOUDINARY_API_KEY,
      api_secret_exists: !!process.env.CLOUDINARY_API_SECRET,
      result,
    })
  } catch (error) {
    console.log('❌ Cloudinary Test Failed:', error.message)
    res.json({
      success: false,
      message: error.message,
      env: {
        cloud_name: process.env.CLOUDINARY_NAME ? '✓' : '✗',
        api_key: process.env.CLOUDINARY_API_KEY ? '✓' : '✗',
        api_secret: process.env.CLOUDINARY_API_SECRET ? '✓' : '✗',
      },
    })
  }
})

// Test route for Delete Stylist (Direct test කරන්න)
app.post('/test-delete-stylist', async (req, res) => {
  try {
    const { stylistId } = req.body

    if (!stylistId) {
      return res.json({
        success: false,
        message: 'Stylist ID is required',
      })
    }

    // මෙතනින් කෙලින්ම stylistModel එක import කරලා delete කරන්න පුළුවන්
    // නමුත් අපි adminRouter එකේ delete-stylist route එක already තියෙනවා

    res.json({
      success: true,
      message:
        'Delete test route working. Use /api/admin/delete-stylist instead',
      received_stylistId: stylistId,
    })
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    })
  }
})

// ============================================
// HOME ROUTE
// ============================================
app.get('/', (req, res) => {
  res.send(`
    <h1>🌟 Sensaloon API Working</h1>
    <p>Available Routes:</p>
    <ul>
      <li><a href="/test-cloudinary">/test-cloudinary</a> - Test Cloudinary Connection</li>
      <li><a href="/api/admin/all-stylists">/api/admin/all-stylists</a> - Get All Stylists (Admin Token Required)</li>
      <li><a href="/api/admin/delete-stylist">/api/admin/delete-stylist</a> - Delete Stylist (POST, Admin Token Required)</li>
    </ul>
  `)
})

// ============================================
// START SERVER
// ============================================
app.listen(port, () => {
  console.log('\n=================================')
  console.log(`✅ Server started on PORT: ${port}`)
  console.log(`🌐 Local: http://localhost:${port}`)
  console.log(`📝 Test Cloudinary: http://localhost:${port}/test-cloudinary`)
  console.log(
    `🗑️  Delete Stylist Endpoint: POST http://localhost:${port}/api/admin/delete-stylist`,
  )
  console.log('=================================\n')
})
