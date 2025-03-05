'use server'

import { PAGE_SIZE } from '../constants'
import { connectDB } from '../db'
import product, { IProduct } from '../db/models/productmodel'

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
