import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () =>
      console.log('✅ Database Connected'),
    )
    mongoose.connection.on('error', (err) =>
      console.log('❌ Database Error:', err),
    )

    // Remove the extra '/sensaloon' since it's already in the MONGODB_URI
    // Your MONGODB_URI should already include the database name
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB connection established')
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
