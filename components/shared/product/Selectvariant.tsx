import { Button } from '@/components/ui/button'
import { IProduct } from '@/lib/db/models/productmodel'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

type Props = {
  product: IProduct
  size: string
  color: string
}

const Selectvariant = ({ product, size, color }: Props) => {
  const usedcolor = color || product.colors[0]
  const usedsize = size || product.sizes[0]
  return (
    <>
      {product.colors.length > 0 && (
        <div className='space-x-2 space-y-2 '>
          <div className=''>Color:</div>
          {product.colors.map((x) => (
            <Button
              asChild
              variant='outline'
              key={x}
              className={cn(
                usedcolor === x ? 'border-2 border-primary' : 'border-2 '
              )}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: x,
                  size: usedsize,
                })}`}
                key={x}
              >
                <div
                  style={{ backgroundColor: x }}
                  className={` rounded-full h-4 w-4 border border-muted-foreground `}
                ></div>
                {x}
              </Link>
            </Button>
          ))}
        </div>
      )}

      {product.sizes.length > 0 && (
        <div className=' mt-2 space-x-2 space-y-2 '>
          <div className=''>Size:</div>
          {product.sizes.map((size) => (
            <Button
              asChild
              variant='outline'
              key={size}
              className={cn(
                usedsize === size ? 'border-2 border-primary' : 'border-2 '
              )}
            >
              <Link
                replace
                scroll={false}
                href={`?${new URLSearchParams({
                  color: color,
                  size: size,
                })}`}
                key={size}
              >
                {size}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </>
  )
}

export default Selectvariant
