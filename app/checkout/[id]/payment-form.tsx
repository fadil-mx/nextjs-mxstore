'use client'
import { IOrder } from '@/lib/db/models/order.model'
import { redirect, useRouter } from 'next/navigation'
import React from 'react'
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js'
import {
  approvePayPalOrder,
  createPaypalOrder,
} from '@/lib/actions/order.action'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import ProductPrice from '@/components/shared/product/product-price'
import { Button } from '@/components/ui/button'
import { calculateFutureDate, formatDateTime } from '@/lib/utils'
import { AVAILABLE_DELIVERY_DATES } from '@/lib/constants'
import Checkoutfooter from '../Checkout-footer'
type Props = {
  order: IOrder
  paypalClientId: string
  isAdmin: boolean
}

const Paymentform = ({ order, paypalClientId, isAdmin }: Props) => {
  const router = useRouter()
  const {
    shippingAddress,
    itemsPrice,
    shippingPrice,
    items,
    taxPrice,
    totalPrice,
    paymentMethode,
    expectedDeliveryDate,
    isPaid,
  } = order
  if (isPaid) {
    redirect(`/account/orders/${order._id}`)
  }

  function printLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer()
    let status = ''
    if (isPending) {
      status = 'Loading PayPal...'
    } else if (isRejected) {
      status = 'Failed to load PayPal'
    }
    return status
  }
  const handleCratOrderPayPal = async () => {
    try {
      const res = await createPaypalOrder(order._id)
      if (!res.sucess) {
        toast.error(res.message)
      }
      return res.data
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleApprovelPayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(order._id, data)
    if (res.sucess) {
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }

  const CheckoutSummary = () => (
    <Card>
      <CardContent className='p-4'>
        <div className=''>
          <p className=' text-lg font-bold'>Order summary</p>
          <div className='space-y-2'>
            <div className=' flex justify-between'>
              <span className=''>items:</span>
              <span className=''>
                <ProductPrice price={itemsPrice} plain />
              </span>
            </div>
            <div className=' flex justify-between'>
              <span className=''>Shipping & Handling:</span>
              <span className=''>
                {shippingPrice === undefined ? (
                  '--'
                ) : shippingPrice === 0 ? (
                  'Free'
                ) : (
                  <ProductPrice price={shippingPrice} plain />
                )}
              </span>
            </div>{' '}
            <div className=' flex justify-between'>
              <span className=''>Tax:</span>
              <span className=''>
                {taxPrice === undefined ? (
                  '--'
                ) : (
                  <ProductPrice price={taxPrice} plain />
                )}
              </span>
            </div>
            <div className=' flex justify-between pt-4 font-bold text-lg'>
              <span className=''>Order Total:</span>
              <span className=''>
                <ProductPrice price={totalPrice} plain />
              </span>
            </div>
            {!isPaid && paymentMethode === 'PayPal' && (
              <div className=''>
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                  }}
                >
                  <PayPalButtons
                    createOrder={handleCratOrderPayPal}
                    onApprove={handleApprovelPayPalOrder}
                  />
                </PayPalScriptProvider>
              </div>
            )}
            {!isPaid && paymentMethode === 'Cash on delivery' && (
              <Button
                className='w-full rounded-full'
                onClick={() => {
                  router.push(`/account/orders/${order._id}`)
                }}
              >
                View Order
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <main className='max-w-6xl mx-auto higlight-link'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3 '>
          {/* address */}
          <div className='grid grid-cols-1   md:grid-cols-3 my-3 pb-3'>
            <div className='  flex text-lg font-bold'>
              <span className=''> shippingAddress</span>
            </div>
            <div className='col-span-2 '>
              <p className=''>
                {shippingAddress?.fullName}
                <br />
                {shippingAddress?.street}
                <br />
                {shippingAddress?.city}, {shippingAddress?.province},{' '}
                {shippingAddress?.postalCode},{shippingAddress?.country}
              </p>
            </div>
          </div>
          {/* payment */}
          <div className='grid grid-cols-1  border-y md:grid-cols-3 my-3 py   -3'>
            <div className='flex font-bold text-lg  text-primary'>
              <span className=''>Payment method</span>
            </div>
            <div className='col-span-2 '>
              <p>{paymentMethode}</p>
            </div>
          </div>

          {/* items */}

          <div className='grid grid-cols-1  md:grid-cols-3 my-3 pb-3'>
            <div className='  flex text-lg font-bold '>
              <span className=''> Items and shipping</span>
            </div>
            <div className='col-span-2 pr-4 '>
              <p className='border-b-2  border-blue-200'>
                Delivery date:
                {
                  formatDateTime(calculateFutureDate(expectedDeliveryDate))
                    .dateOnly
                }
              </p>
              <ul className=''>
                {items.map((item, index) => (
                  <li key={index} className='border-b-2 border-blue-200 p-1'>
                    {item.name} x {item.quantity} = {item.price}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='block md:hidden'>
            <CheckoutSummary />
          </div>
        </div>
        <CheckoutSummary />
      </div>
      <Checkoutfooter />
    </main>
  )
}

export default Paymentform
