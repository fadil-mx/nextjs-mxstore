import { connectDB } from '@/lib/db'
import product from '@/lib/db/models/productmodel'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (request: NextRequest) => {
  const listType = request.nextUrl.searchParams.get('type') || 'history'
  const productIdsParam = request.nextUrl.searchParams.get('ids')
  const categoryParam = request.nextUrl.searchParams.get('categories')

  if (!productIdsParam || !categoryParam) {
    return NextResponse.json([])
  }

  const productIds = productIdsParam.split(',')
  const categories = categoryParam.split(',')

  const filter =
    listType === 'history'
      ? {
          _id: { $in: productIds },
        }
      : {
          category: { $in: categories },
          _id: { $nin: productIds },
        }

  await connectDB()
  const products = await product.find(filter)
  if (listType === 'history') {
    return NextResponse.json(
      products.sort(
        (a, b) =>
          productIds.indexOf(a._id.toString()) -
          productIds.indexOf(b._id.toString())
      )
    )
  }
  return NextResponse.json(products)
}
