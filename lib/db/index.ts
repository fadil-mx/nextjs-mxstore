import mongoose from 'mongoose'

const cached = (global as any).mongoose || { conn: null, promise: null }
export const connectDB = async (MONOD_URL = process.env.MONGO_URL) => {
  if (cached.conn) {
    return cached.conn
  }

  if (!MONOD_URL) {
    throw new Error(
      'Please define the MONGO_URL environment variable inside .env.local'
    )
  }

  cached.promise = cached.promise || mongoose.connect(MONOD_URL)

  cached.conn = await cached.promise

  return cached.conn
}
