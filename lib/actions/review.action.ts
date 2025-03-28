'use server'

import { auth } from '@/auth'
import { ReviewInput } from '@/types'
import { ReviewInputSchema } from '../validator'
import { connectDB } from '../db'
import Review from '../db/models/reviewmodel'
import { formatError } from '../utils'
import mongoose from 'mongoose'
import product from '../db/models/productmodel'
import { PAGE_SIZE } from '../constants'

export async function createUpdatedReview({
  data,
  path,
}: {
  data: ReviewInput
  path: string
}) {
  try {
    const session = await auth()
    if (!session) {
      throw new Error('Unauthorized')
    }

    const review = ReviewInputSchema.parse({
      ...data,
      user: session.user.id,
    })

    await connectDB()
    const existReview = await Review.findOne({
      user: review.user,
      product: review.product,
    })

    if (existReview) {
      existReview.title = review.title
      existReview.comment = review.comment
      existReview.rating = review.rating
      await existReview.save()
      await updateProductReview(review.product)
      return {
        success: true,
        message: 'Review updated successfully',
      }
    } else {
      await Review.create(review)
      await updateProductReview(review.product)
      revalidatePath(path)
      return {
        success: true,
        message: 'Review created successfully',
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

const updateProductReview = async (productId: string) => {
  const result = await Review.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ])

  //   calculate total number of reviews
  const totalReviews = result.reduce((acc, cur) => acc + cur.count, 0)
  const avgRating =
    result.reduce((acc, cur) => acc + cur._id * cur.count, 0) / totalReviews

  // convert raggregate result to map
  const ratingMap = result.reduce((map, { _id, count }) => {
    map[_id] = count
    return map
  }, {})

  const ratingDistribution = []
  for (let i = 1; i <= 5; i++) {
    ratingDistribution.push({ rating: i, count: ratingMap[i] || 0 })
  }
  await product.findByIdAndUpdate(productId, {
    avgRating: avgRating.toFixed(1),
    numReviews: totalReviews,
    ratingDistribution,
  })
}

export async function getReview({
  productId,
  limit,
  page = 1,
}: {
  productId: string
  limit?: number
  page: number
}) {
  try {
    limit = limit || PAGE_SIZE
    const skip = (page - 1) * limit
    await connectDB()
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)
    const totalReviews = await Review.countDocuments({
      product: productId,
    })
    return {
      data: JSON.parse(JSON.stringify(reviews)) as ReviewInput[],
      totalPages: totalReviews === 0 ? 1 : Math.ceil(totalReviews / limit), // if totalReviews is 0, return 1
    }
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export async function getReviewById({ productId }: { productId: string }) {
  try {
    await connectDB()
    const session = await auth()
    if (!session) {
      throw new Error('Unauthorized')
    }
    const review = await Review.findOne({
      user: session.user.id,
      product: productId,
    })
    return JSON.parse(JSON.stringify(review)) as ReviewInput
  } catch (error) {
    throw new Error(formatError(error))
  }
}
