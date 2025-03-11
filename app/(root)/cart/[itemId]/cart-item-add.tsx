'use client'
import BrowsingHistory from '@/components/shared/BrowsingHistory'
import ProductPrice from '@/components/shared/product/product-price'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { usecarteStore } from '@/hooks/use-cart-store'
import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { CheckCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = { itemId: string }

const CartItemAdd = ({ itemId }: Props) => {
  const {
    cart: { items, itemsPrice },
  } = usecarteStore()

  const item = items.find((item) => item.clientId === itemId)
  if (!item)
    return (
      <div className='flex  justify-center items-center text-3xl h-96 text-red-800'>
        Item is not founded
      </div>
    )
  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
        <Card className='rounded-non w-full '>
          <CardContent className='flex justify-center items-center h-full gap-3 py-5'>
            <Link href={`/product/${item.slug}`}>
              <Image
                src={item.image}
                alt={item.name}
                style={{
                  height: 'auto',
                  maxWidth: '100%',
                }}
                width={100}
                height={100}
              />
            </Link>
            <div className=''>
              <h3 className='text-xl font-bold flex gap-2 my-2'>
                <CheckCircle2Icon size={24} className='text-green-700  ' />
                Added to cart
              </h3>
              <p className='text-base'>
                <span className='font-bold'>Color:- </span>
                {item.color ?? 'default'}
              </p>
              <p className='text-base'>
                <span className='font-bold'>Size:- </span>
                {item.size ?? 'default'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className='rounded-non w-full '>
          <CardContent className='p-5 h-full'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              <div className='flex justify-center items-center '>
                {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                  <div className=' text-center'>
                    Add{' '}
                    <span className=''>
                      <ProductPrice
                        price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                        plain
                      />{' '}
                    </span>{' '}
                    of eligible items to your order to qualify for FREE
                    Shipping.
                  </div>
                ) : (
                  <div className='flex items-center'>
                    <div className=''>
                      <span className='text-green-700'>
                        {' '}
                        Your order quantity for FREE shipping{' '}
                      </span>
                      Choose this option at checkout
                    </div>
                  </div>
                )}
              </div>
              <div className=' space-y-3 items-center lg:pl-3 lg:border-muted'>
                <div className='flex gap-3 w-full justify-center items-center'>
                  <span className='font-bold text-lg'>Cart subtotal: </span>
                  <ProductPrice price={itemsPrice} className='text-2xl' />
                </div>
                <Link
                  href='/checkout'
                  className={cn(buttonVariants(), 'rounded-full w-full')}
                >
                  Proceed to checkout
                </Link>
                <Link
                  href='/cart'
                  className={cn(
                    buttonVariants({ variant: 'outline' }),
                    'rounded-full w-full'
                  )}
                >
                  Proceed to checkout
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <BrowsingHistory />
    </>
  )
}

export default CartItemAdd
