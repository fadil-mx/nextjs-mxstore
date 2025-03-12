import { IProduct } from '@/lib/db/models/productmodel'
import Link from 'next/link'
import React from 'react'
import ImageHover from './ImageHover'
import Image from 'next/image'
import Rating from './rating'
import { formatNumbers, generateId, round2 } from '@/lib/utils'
import ProductPrice from './product-price'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Addtocart from './Addtocart'

type Props = {
  product: IProduct
  hiddeDetails?: boolean
  hideborder?: boolean
  hideAddToCart?: boolean
}

const Productcard = ({
  product,
  hideborder = false,
  hiddeDetails = false,
  hideAddToCart = false,
}: Props) => {
  const ProductImage = () => (
    <Link href={`/product/${product.slug}`}>
      <div className='relative h-52'>
        {product.images.length > 1 ? (
          <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
          />
        ) : (
          <div className='relative  h-52'>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className='object-contain'
              sizes='80vw'
            />
          </div>
        )}
      </div>
    </Link>
  )

  const ProductDetails = () => (
    <div className='flex-1 space-y-2 '>
      <p className='font-bold'>{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className='overflow-hidden text-ellipsis'
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {product.name}
      </Link>
      <div className='flex gap-2 justify-center'>
        <Rating rating={product.avgRating} />
        <span className=''>({formatNumbers(product.numReviews)})</span>
      </div>
      <ProductPrice
        price={product.price}
        listPrice={product.listPrice}
        forListing
        isDeal={product.tags.includes('todays-deal')}
      />
    </div>
  )
  const AddButton = () => (
    <div className='w-full text-center'>
      <Addtocart
        item={{
          clientId: generateId(),
          product: product._id,
          name: product.name,
          slug: product.slug,
          countInstock: product.countInStock,
          category: product.category,
          price: round2(product.price),
          quantity: 10,
          image: product.images[0],
          size: product.sizes[0],
          color: product.colors[0],
        }}
      />
    </div>
  )

  return hideborder ? (
    <div className='flex flex-col'>
      <ProductImage />
      {!hiddeDetails && (
        <>
          <div className=' p-3 flex-1 text-center'>
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <Card className='flex flex-col '>
      <CardHeader className='p-3'>
        <ProductImage />
        <CardHeader>
          {!hiddeDetails && (
            <>
              <CardContent className='p-3 text-center flex-1'>
                <ProductDetails />
              </CardContent>
              <CardFooter className='p-3'>
                {!hideAddToCart && <AddButton />}{' '}
              </CardFooter>
            </>
          )}
        </CardHeader>
      </CardHeader>
    </Card>
  )
}

export default Productcard
