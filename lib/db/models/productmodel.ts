import { IProductInput } from '@/types'
import { Document, model, Model, models, Schema } from 'mongoose'

export interface IProduct extends Document, IProductInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    description: { type: String, trim: true },
    isPublished: { type: Boolean, required: true },
    price: { type: Number, required: true },
    listPrice: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    tags: { type: [String], default: ['new arrival'] },
    sizes: { type: [String], default: ['S', 'M', 'L'] },
    colors: { type: [String], default: ['white', 'red', 'black'] },
    avgRating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    ratingDistribution: {
      type: [
        {
          rating: { type: Number, require: true },
          count: { type: Number, require: true },
        },
      ],
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
)

const product =
  (models.product as Model<IProduct>) ||
  model<IProduct>('Product', productSchema)
export default product
