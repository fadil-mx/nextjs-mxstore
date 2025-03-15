import { userInput } from '@/types'
import { Document, model, models, Schema } from 'mongoose'

export interface IUser extends Document, userInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true, default: 'User' },
    password: { type: String },
    image: { type: String },
    emailVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const User = models.User || model<IUser>('User', userSchema)

export default User
