import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { IProduct } from '@/lib/db/models/productmodel'
import React from 'react'
import Productcard from './Productcard'

type Props = {
  title?: string
  products: IProduct[]
  hideDetails?: boolean
}

const ProductSlider = ({ title, products, hideDetails = false }: Props) => {
  return (
    <div className='w-full bg-background'>
      <h2 className='h2-bold mb-5'>{title}</h2>
      <Carousel opts={{ align: 'start' }} className='w-full'>
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem
              className={
                hideDetails
                  ? 'md:basis-1/4 lg:basis-1/6'
                  : 'md:basis-1/3 lg:basis-1/5'
              }
              key={product.slug}
            >
              <Productcard
                product={product}
                hideAddToCart
                hideborder
                hiddeDetails={hideDetails}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='left-0' />
        <CarouselNext className='right-0' />
      </Carousel>
    </div>
  )
}

export default ProductSlider
