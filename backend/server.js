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
// ROUTES
// ============================================
app.use('/api/user', userRouter)
app.use('/api/admin', adminRouter)
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

// Test route for PayHere configuration
app.get('/test-payhere', (req, res) => {
  res.json({
    success: true,
    message: 'PayHere Configuration Status',
    config: {
      merchant_id: process.env.PAYHERE_MERCHANT_ID ? '✓' : '✗',
      secret: process.env.PAYHERE_SECRET ? '✓' : '✗',
      app_id: process.env.PAYHERE_APP_ID ? '✓' : '✗',
      currency: process.env.PAYHERE_CURRENCY,
      sandbox: process.env.PAYHERE_SANDBOX,
      frontend_url: process.env.FRONTEND_URL,
      backend_url: process.env.BACKEND_URL,
    },
  })
})

// Test route for Delete Stylist
app.post('/test-delete-stylist', async (req, res) => {
  try {
    const { stylistId } = req.body

    if (!stylistId) {
      return res.json({
        success: false,
        message: 'Stylist ID is required',
      })
    }

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
    <!DOCTYPE html>
    <html>
    <head>
      <title>Sensaloon API</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1 { color: #5F6FFF; }
        .container { max-width: 800px; margin: 0 auto; }
        .status { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .success { color: green; }
        .error { color: red; }
        ul { list-style: none; padding: 0; }
        li { margin: 10px 0; }
        a { color: #5F6FFF; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌟 Sensaloon API Working</h1>
        <div class="status">
          <p>✅ Server Status: <strong class="success">Running</strong></p>
          <p>📅 Date: ${new Date().toLocaleString()}</p>
          <p>💳 Payment Gateway: <strong>PayHere</strong> (Sandbox: ${process.env.PAYHERE_SANDBOX === 'true' ? 'Yes' : 'No'})</p>
        </div>
        <h2>Available Routes:</h2>
        <ul>
          <li>📸 <a href="/test-cloudinary">/test-cloudinary</a> - Test Cloudinary Connection</li>
          <li>💳 <a href="/test-payhere">/test-payhere</a> - Test PayHere Configuration</li>
          <li>👨‍⚕️ <a href="/api/admin/all-stylists">/api/admin/all-stylists</a> - Get All Stylists (Admin Token Required)</li>
          <li>🗑️ POST /api/admin/delete-stylist - Delete Stylist (Admin Token Required)</li>
          <li>💵 POST /api/user/payment-payhere - Initiate PayHere Payment (User Token Required)</li>
          <li>✅ GET /api/user/verify-payhere - Verify PayHere Payment</li>
          <li>🔔 POST /api/user/payhere-notify - PayHere Notification Webhook (Public)</li>
        </ul>
        <p><strong>Note:</strong> Make sure your frontend is running on ${process.env.FRONTEND_URL || 'http://localhost:5173'}</p>
      </div>
    </body>
    </html>
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
  console.log(`💳 Test PayHere: http://localhost:${port}/test-payhere`)
  console.log(
    `🗑️  Delete Stylist Endpoint: POST http://localhost:${port}/api/admin/delete-stylist`,
  )
  console.log(
    `💰 PayHere Payment Endpoint: POST http://localhost:${port}/api/user/payment-payhere`,
  )
  console.log(
    `🔔 PayHere Notification: POST http://localhost:${port}/api/user/payhere-notify`,
  )
  console.log('=================================\n')
})
