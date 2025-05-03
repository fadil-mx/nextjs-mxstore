'use server'

import { PAGE_SIZE } from '../constants'
import { connectDB } from '../db'
import product, { IProduct } from '../db/models/productmodel'
import { formatError } from '../utils'

export async function getAllCategories() {
  await connectDB()
  const categories = await product
    .find({ isPublished: true })
    .distinct('category')
  return categories
}

export async function getProductsForCard({
  tag,
  limit = 4,
}: {
  tag: string
  limit?: number
}) {
  await connectDB()
  const products = await product
    .find(
      { tags: { $in: [tag] }, isPublished: true },
      {
        name: 1,
        href: { $concat: ['/product/', '$slug'] },
        image: { $arrayElemAt: ['$images', 0] },
      }
    )
    .sort({ createdAt: 'desc' })
    .limit(limit)
  return JSON.parse(JSON.stringify(products)) as {
    name: string
    href: string
    image: string
  }[]
}

export async function getProductByTag({
  tag,
  limit = 10,
}: {
  tag: string
  limit?: number
}) {
  await connectDB()
  const products = await product
    .find({
      tags: { $in: [tag] },
      isPublished: true,
    })
    .sort({ createdAt: 'desc' })
    .limit(limit)

  return JSON.parse(JSON.stringify(products)) as IProduct[]
}

export async function getProductBySlug(slug: string) {
  await connectDB()
  const products = await product.findOne({ slug, isPublished: true })
  if (!products) throw new Error('Product not found')
  return JSON.parse(JSON.stringify(products)) as IProduct
}

export async function getRelatedProductsByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string
  productId: string
  limit?: number
  page?: number
}) {
  await connectDB()
  const skip = (Number(page) - 1) * limit
  const products = await product
    .find({
      isPublished: true,
      category,
      _id: { $ne: productId },
    })
    .sort({ createdAt: 'desc' })
    .skip(skip)
    .limit(limit)
  const productsCount = await product.countDocuments({
    isPublished: true,
    category,
    _id: { $ne: productId },
  })
  return {
    data: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPage: Math.ceil(productsCount / limit),
  }
}

export async function getAllProducts({
  query,
  limit,
  page,
  category,
  sort,
  price,
  rating,
  tag,
}: {
  query?: string
  limit?: number
  page?: number
  category?: string
  sort?: string
  price?: string
  rating?: string
  tag?: string
}) {
  const limits = limit || PAGE_SIZE
  await connectDB()
  const queryFilter =
    query && query !== 'all'
      ? {
          name: {
            $regex: query,
            $options: 'i',
          },
        }
      : {}
  const categoryFilter = category && category !== 'all' ? { category } : {}
  const tagFilter = tag && tag !== 'all' ? { tags: tag } : {}

  const ratingFilter =
    rating && rating !== 'all' ? { avgRating: { $gte: Number(rating) } } : {}
  const priceFilter =
    price && price !== 'all'
      ? {
          price: {
            $gte: Number(price.split('-')[0]),
            $lte: Number(price.split('-')[1]),
          },
        }
      : {}
  const order: Record<string, 1 | -1> =
    sort === 'best-selling'
      ? { numSales: -1 }
      : sort === 'price-low-to-high'
        ? { price: 1 }
        : sort === 'price-high-to-low'
          ? { price: -1 }
          : sort === 'avg-customer-review'
            ? { avgRating: -1 }
            : { _id: -1 }
  const isPublished = { isPublished: true }

  // {
  //   isPublished: true,           // Only published products
  //   name: { $regex: 'shoe', $options: 'i' },
  //   category: 'men',
  //   tags: 'sale',
  //   avgRating: { $gte: 4 },
  //   price: { $gte: 50, $lte: 200 },
  // }

  const products = await product
    .find({
      ...isPublished,
      ...queryFilter,
      ...tagFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
    .sort(order)
    .skip(limits * (Number(page) - 1))
    .limit(limits)
    .lean()

  const countProducts = await product.countDocuments({
    ...queryFilter,
    ...tagFilter,
    ...categoryFilter,
    ...priceFilter,
    ...ratingFilter,
  })
  return {
    products: JSON.parse(JSON.stringify(products)) as IProduct[],
    totalPages: Math.ceil(countProducts / limits),
    totalProducts: countProducts,
    from: limits * (Number(page) - 1) + 1,
    to: limits * (Number(page) - 1) + products.length,
  }
}

export async function getAllTags() {
  const tags = await product.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
    { $project: { _id: 0, uniqueTags: 1 } },
  ])
  return (
    (tags[0]?.uniqueTags
      .sort((a: string, b: string) => a.localeCompare(b))
      .map((x: string) =>
        x
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      ) as string[]) || []
  )
}

//admin
export async function getProductById(id: string) {
  try {
    await connectDB()
    const productDetails = await product.findById(id)
    if (!productDetails) throw new Error('Product not found')
    return {
      product: JSON.parse(JSON.stringify(productDetails)) as IProduct,
      success: true,
      message: 'Product found',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}
