import { ReviewInput } from '@/types'
import { Document, model, models, Schema } from 'mongoose'

interface IReview extends ReviewInput, Document {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'Product',
      required: true,
    },
    isVerifiedPurchase: { type: Boolean, required: true, default: false },
    rating: { type: Number, required: true, max: 5, min: 1 },
    title: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
)

const Review = models.Review || model<IReview>('Review', reviewSchema)
export default Review
