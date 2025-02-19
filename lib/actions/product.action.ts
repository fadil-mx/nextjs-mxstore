'use server'

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
