'use server'
import { Carousel } from '@/types'
import Carouselmodel, { Icarousel } from '../db/models/carouselmodel'
import { formatError } from '../utils'
import { carouselsSchema } from '../validator'
import { connectDB } from '../db'

export async function getCarousels() {
  try {
    await connectDB()
    const data = await Carouselmodel.find({}).sort({ createdAt: -1 })
    return {
      success: true,
      message: 'Carousels fetched successfully',
      data: JSON.parse(JSON.stringify(data)) as Icarousel[],
    }
  } catch (error) {
    return {
      success: true,
      message: formatError(error),
    }
  }
}

export async function Ccreate(data: Carousel) {
  try {
    await connectDB()
    const v = await carouselsSchema.parseAsync(data)
    await Carouselmodel.create(v)
    return {
      success: true,
      message: 'Carousel created successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function DeleteCarousel(id: string) {
  try {
    await connectDB()
    const carousel = await Carouselmodel.findByIdAndDelete(id)
    if (!carousel) {
      return {
        success: false,
        message: 'Carousel not found',
      }
    }
    return {
      success: true,
      message: 'Carousel deleted successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getCarouselById(id: string) {
  try {
    await connectDB()
    const carousel = await Carouselmodel.findById(id)
    if (!carousel) {
      return {
        success: false,
        message: 'Carousel not found',
      }
    }
    return {
      success: true,
      message: 'Carousel fetched successfully',
      data: JSON.parse(JSON.stringify(carousel)) as Icarousel,
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function updateCarousel(id: string, data: Carousel) {
  try {
    await connectDB()
    const v = await carouselsSchema.parseAsync(data)
    const carousel = await Carouselmodel.findByIdAndUpdate(id, v)
    if (!carousel) {
      return {
        success: false,
        message: 'Carousel not found',
      }
    }
    return {
      success: true,
      message: 'Carousel updated successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
