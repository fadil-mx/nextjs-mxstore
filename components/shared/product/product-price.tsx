'use client'
import { cn, formatCurrency } from '@/lib/utils'
import React from 'react'

type Props = {
  price: number
  isDeal?: boolean
  listPrice?: number
  className?: string
  forListing?: boolean
  plain?: boolean
}

const ProductPrice = ({
  price,
  isDeal = false,
  listPrice = 0,
  className,
  forListing = true,
  plain = false,
}: Props) => {
  const discountPercentage = Math.round(100 - (price / listPrice) * 100)
  const stringValue = price.toString()
  const [intvalue, floatvalue] = stringValue.includes('.')
    ? stringValue.split('.')
    : [stringValue, '']

  return plain ? (
    formatCurrency(price)
  ) : listPrice == 0 ? (
    <div className={cn('text-3xl', className)}>
      <span className='text-xs align-super'>$</span>
      {intvalue} <span className='text-xs align-super'>{floatvalue}</span>
    </div>
  ) : isDeal ? (
    <div className='space-y-2 '>
      <div className=' flex justify-center items-center gap-2'>
        <span className='bg-red-700 rounded-sm p-1 text-white text-sm font-semibold'>
          {discountPercentage}% off
        </span>
        <span className='text-red-700 text-xs font-bold'>
          Limited time deal
        </span>
      </div>
      <div
        className={cn(
          'flex',
          forListing && 'justify-center',
          'items-center gap-2'
        )}
      >
        <div className={cn('text-xl', className)}>
          <span className='align-super text-sm'>$</span>
          {intvalue}
          <span className='align-super text-sm'>{floatvalue}</span>
        </div>
        <div className='text-muted-foreground text-xs py-2'>
          Was: <span className='line-through'>{formatCurrency(listPrice)}</span>
        </div>
      </div>
    </div>
  ) : (
    <div className=''>
      <div className='flex justify-center gap-3'>
        <div className='text-3xl text-orange-700 gap-3'>
          <div className={cn('text-3xl', className)}>
            <span className='align-super text-sm'>$</span>
            {intvalue}
            <span className='align-super text-sm'>{floatvalue}</span>
          </div>
        </div>
        <div className='text-muted-foreground text-xs py-2'>
          List Price:{' '}
          <span className='line-through'>{formatCurrency(listPrice)}</span>
        </div>
      </div>
    </div>
  )
}

export default ProductPrice
