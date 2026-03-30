import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI

    if (!uri) {
      throw new Error('MONGODB_URI is not defined in .env file')
    }

    console.log('📡 Connecting to MongoDB...')

    // Check for port number in SRV URI
    if (uri.includes('mongodb+srv') && uri.includes(':27017')) {
      throw new Error(
        'mongodb+srv URI cannot have port number (:27017). Please remove the port from your MONGODB_URI',
      )
    }

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
    })

    console.log('✅ MongoDB Connected Successfully')
    console.log(`📀 Database: ${mongoose.connection.db.databaseName}`)
  } catch (error) {
    console.log('❌ MongoDB Connection Failed:', error.message)
    console.log('\n💡 Troubleshooting Tips:')
    console.log('1. Check your MONGODB_URI in .env file')
    console.log(
      '2. For mongodb+srv URIs, DO NOT include a port number (:27017)',
    )
    console.log('3. Make sure MongoDB Atlas cluster is active')
    console.log('4. Whitelist your IP address in MongoDB Atlas Network Access')
    console.log(
      '5. If using local MongoDB, use: mongodb://localhost:27017/sensaloon',
    )
    process.exit(1)
  }
}

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connection Established')
})

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB Connection Error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB Disconnected')
})

export default connectDB
