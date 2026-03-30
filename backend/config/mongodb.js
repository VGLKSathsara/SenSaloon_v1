import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    // Remove the extra '/sensaloon' since it's now in the URI
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('✅ MongoDB Connected Successfully')
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message)
    console.log('Please check your MONGODB_URI in .env file')
    process.exit(1)
  }
}

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connection Established')
})

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB Connection Error:', err)
})

export default connectDB
