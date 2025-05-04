import { Carousel } from '@/types'
import { Document, model, models, Schema } from 'mongoose'

export interface Icarousel extends Document, Carousel {
  _id: string
  createdAt: Date
  updatedAt: Date
}

const carouselSchema = new Schema<Icarousel>(
  {
    title: { type: String, required: true },
    buttonCaption: { type: String, required: true },
    image: { type: String, required: true },
    url: { type: String, required: true },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

const Carouselmodel =
  models.Carousel || model<Icarousel>('Carousel', carouselSchema)

export default Carouselmodel
