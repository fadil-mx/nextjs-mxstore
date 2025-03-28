import Productgallery from '@/components/shared/product/Productgallery'
import {
  getProductBySlug,
  getRelatedProductsByCategory,
} from '@/lib/actions/product.action'
import React from 'react'
import Rating from '@/components/shared/product/rating'
import { Separator } from '@/components/ui/separator'
import ProductPrice from '@/components/shared/product/product-price'
import Selectvariant from '@/components/shared/product/Selectvariant'
import { Card, CardContent } from '@/components/ui/card'
import ProductSlider from '@/components/shared/product/productSlider'
import BrowsingHistory from '@/components/shared/BrowsingHistory'
import Addtobrowsinghistory from '@/components/shared/product/Add-to-browsing-history'
import Addtocart from '@/components/shared/product/Addtocart'
import { generateId, round2 } from '@/lib/utils'
import RatingSummary from '@/components/shared/product/rating-summary'
import ReviewList from './review-list'

export async function generateMetadata(props: {
  params: Promise<{
    slug: string
  }>
}) {
  const params = await props.params
  const product = await getProductBySlug(params.slug)
  if (!product) {
    return {
      title: 'Not Found',
      description: 'Product not found',
    }
  }
  return {
    title: product.name,
    description: product.description,
  }
}

const ProductDetail = async ({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams?: { page?: string; color?: string; size?: string }
}) => {
  const { page, color, size } = (await searchParams) || {}
  const { slug } = await params

  const product = await getProductBySlug(slug)

  const relatedProducts = await getRelatedProductsByCategory({
    category: product.category,
    productId: product._id,

    page: Number(page),
  })

  // console.log(relatedProducts.data.length)
  return (
    <div>
      <Addtobrowsinghistory id={product._id} category={product.category} />
      <section>
        <div className='grid grid-cols-2 md:grid-cols-5'>
          <div className='col-span-2'>
            <Productgallery image={product.images} />
          </div>
          <div className='flex flex-col col-span-2 gap-2 md:p-5 w-full '>
            <div className='flex flex-col  gap-3'>
              <p className='p-medium-16 rounded-full  '>
                Brand {product.brand}
                {product.category}
              </p>
              <h1 className='font-bold text-lg lg:text-xl'>{product.name}</h1>
              <div className='flex items-center gap-2'>
                <span>{product.avgRating.toFixed(1)}</span>
                <Rating rating={product.avgRating} />
                <span className=''>{product.numReviews} rating</span>
              </div>
              <Separator />
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                <div className='flex gap-3'>
                  <ProductPrice
                    price={product.price}
                    listPrice={product.listPrice}
                    isDeal={product.tags.includes('todays-deal')}
                    forListing={false}
                  />
                </div>
              </div>
              <div>
                <Selectvariant
                  product={product}
                  size={size || product.sizes[0]}
                  color={color || product.colors[0]}
                />
              </div>
              <Separator className='my-2' />
              <div className=' flex flex-col gap-2'>
                <p className='text-base text-gray-600'>Description:</p>
                <p className='text-sm'>{product.description}</p>
              </div>
            </div>
          </div>
          <div>
            <Card>
              <CardContent className='flex flex-col gap-4 p-4'>
                <ProductPrice price={product.price} />
                {product.countInStock > 0 && product.countInStock <= 3 && (
                  <p className='text-red-500'>
                    {`Hurry! Only ${product.countInStock} left in stock`}
                  </p>
                )}
                {product.countInStock !== 0 ? (
                  <div className='text-green-700 text-xl '> In Stock</div>
                ) : (
                  <div className='text-destructive text-xl '> Out of Stock</div>
                )}
                {product.countInStock !== 0 && (
                  <div className=''>
                    <Addtocart
                      item={{
                        clientId: generateId(),
                        product: product._id,
                        name: product.name,
                        slug: product.slug,
                        countInstock: product.countInStock,
                        category: product.category,
                        price: round2(product.price),
                        quantity: 1,
                        image: product.images[0],
                        size: size || product.sizes[0],
                        color: color || product.colors[0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <RatingSummary
          avgRating={product.avgRating}
          numreviews={product.numReviews}
          ratingDistribution={product.ratingDistribution}
          // asPopover='true'
        />
        <ReviewList userId={undefined} product={product} />
      </section>

      <section className='mt-10'>
        <ProductSlider
          products={relatedProducts.data}
          title={`Best Seller in ${product.category}`}
        />
      </section>
      <section className=' bg-background'>
        <BrowsingHistory className='mt-10' />
      </section>
    </div>
  )
}

export default ProductDetail
