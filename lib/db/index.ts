import mongoose from 'mongoose'

const cached = global.mongoose || { conn: null, promise: null }
export const connectDB = async (MONOD_URL = process.env.MONGO_URL) => {
  if (cached.conn) {
    console.log('=> using existing database connection')
    return cached.conn
  }

  if (!MONOD_URL) {
    throw new Error(
      'Please define the MONGO_URL environment variable inside .env.local'
    )
  }

  cached.promise = cached.promise || mongoose.connect(MONOD_URL)
  console.log('=> using new database connection')

  cached.conn = await cached.promise

  return cached.conn
}
