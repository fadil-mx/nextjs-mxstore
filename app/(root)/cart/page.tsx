'use client'
import ProductPrice from '@/components/shared/product/product-price'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usecarteStore } from '@/hooks/use-cart-store'
import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

const page = () => {
  const {
    cart: { items, itemsPrice },
    updateItem,
    removeItem,
  } = usecarteStore()
  return (
    <div>
      <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4'>
        {items.length === 0 ? (
          <Card className=' col-span-4'>
            <CardHeader className='text-3xl'>
              Your shopping Cart is empty.
            </CardHeader>
            <CardContent>
              Continue shopping on <Link href='/'> Mx-store</Link> home page
            </CardContent>
          </Card>
        ) : (
          <>
            <div className=' col-span-3'>
              <Card className='rounded-none'>
                <CardHeader className='text-3xl pb-0'>
                  {' '}
                  Shopping Cart
                </CardHeader>
                <CardContent>
                  <div className='flex justify-end  border-b-2'>
                    <p>price</p>
                  </div>
                  {items.map((item) => (
                    <div
                      className='flex flex-col md:flex-row justify-between py-4 border-b-2 gap-4'
                      key={item.clientId}
                    >
                      <Link href={`/product/${item.slug}`}>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={60}
                          height={60}
                        />
                      </Link>
                      <div className=' flex-1 space-y-4'>
                        <Link
                          className='text-lg'
                          href={`/product/${item.slug}`}
                        >
                          {item.name}
                        </Link>
                        <div className=''>
                          <p className=' text-sm'>
                            Color:{' '}
                            <span className='font-bold '>
                              {item.color ?? 'default'}
                            </span>
                          </p>
                          <p className=' text-sm'>
                            Size:{' '}
                            <span className='font-bold'>
                              {item.size ?? 'default'}
                            </span>
                          </p>
                        </div>
                        <div className='flex gap-2 items-center'>
                          <Select
                            value={item.quantity.toString()}
                            onValueChange={(i) => updateItem(item, Number(i))}
                          >
                            <SelectTrigger className='w-fit'>
                              <SelectValue>
                                Quantity: {item.quantity}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent position='popper'>
                              {Array.from({ length: item.countInstock }).map(
                                (_, i) => (
                                  <SelectItem key={i + 1} value={`${i + 1}`}>
                                    {i + 1}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <Button
                            variant='outline'
                            onClick={() => {
                              removeItem(item)
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className=''>
                        <p className='text-right flex flex-col'>
                          {item.quantity > 1 && (
                            <>
                              {item.quantity} x{'    '}
                              <ProductPrice price={item.price} plain />
                            </>
                          )}{' '}
                          <span className=' font-bold text-lg'>
                            <ProductPrice
                              price={item.price * item.quantity}
                              plain
                            />
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className=' text-end text-lg mt-2'>
                    Subtotal (
                    {items.reduce((acc, item) => acc + item.quantity, 0)} ):
                    <span className=' font-bold'>
                      {' '}
                      <ProductPrice price={itemsPrice} plain />{' '}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className='col-span-1'>
              <Card className='rounded-none'>
                <CardContent>
                  {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                    <div className=''></div>
                  ) : (
                    <div className='text-sm space-y-4 pt-2'>
                      <span className=' text-green-700'>
                        Your order qualifies for FREE Shipping.
                      </span>
                      Choose this option at checkout.
                      <div className='  text-lg '>
                        Subtotal ({' '}
                        {items.reduce((acc, item) => acc + item.quantity, 0)} ):
                        <span className=' font-bold'>
                          {' '}
                          <ProductPrice price={itemsPrice} plain />{' '}
                        </span>
                      </div>
                      <Link
                        href='/checkout '
                        className={cn(buttonVariants(), 'rounded-full w-full ')}
                      >
                        Proceed to Checkout
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default page
