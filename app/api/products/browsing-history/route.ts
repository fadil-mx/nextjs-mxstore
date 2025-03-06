import ProductDetail from '@/app/(root)/product/[slug]/page'
import { NextRequest } from 'next/server'

export const GET = async (request: NextRequest) => {
  const listType = request.nextUrl.searchParams.get('type') || 'history'
  const productIdsParam = request.nextUrl.searchParams.get('ids')
  const categoryParam = request.nextUrl.searchParams.get('categories')
}
