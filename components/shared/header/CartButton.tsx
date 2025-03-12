'use client'
import { usecarteStore } from '@/hooks/use-cart-store'
import useIsMounted from '@/hooks/use-is-mounted'
import { cn } from '@/lib/utils'
import { ShoppingCartIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CartButton = () => {
  const {
    cart: { items },
  } = usecarteStore()
  const isMounted = useIsMounted()
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0)
  return (
    <Link href='/cart' className='header-button px-2'>
      <div className=' relative flex items-end text-xs'>
        <ShoppingCartIcon className='size-8 ' />
        {isMounted && (
          <span
            className={cn(
              'bg-black px-1 rounded-full text-base text-primary font-bold absolute top-[-4px] right-[-3px] z-10',
              cartItemCount >= 10 && 'text-sm px-1'
            )}
          >
            {cartItemCount}
          </span>
        )}
      </div>
    </Link>
  )
}

export default CartButton
