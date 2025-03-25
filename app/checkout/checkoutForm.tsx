'use client'
import { usecarteStore } from '@/hooks/use-cart-store'
import useIsMounted from '@/hooks/use-is-mounted'
import {
  APP_NAME,
  AVAILABLE_DELIVERY_DATES,
  AVAILABLE_PAYMENT_METHODS,
  DEFAULT_PAYMENT_METHOD,
} from '@/lib/constants'
// import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { shippingAddress } from '@/types'
import { shippingAddressSchema } from '@/lib/validator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import ProductPrice from '@/components/shared/product/product-price'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  calculateFutureDate,
  formatDateTime,
  timeUntilMidnight,
} from '@/lib/utils'
import Image from 'next/image'
import Checkoutfooter from './Checkout-footer'
import { useRouter } from 'next/navigation'
import { createOrder } from '@/lib/actions/order.action'
import { toast } from 'sonner'

const defultValue =
  process.env.NODE_ENV === 'development'
    ? {
        fullName: 'fadil',
        street: '91991 ,65 wahsington st',
        city: 'new york',
        province: 'NY',
        postalCode: '10001',
        country: 'USA',
        phone: '123456789',
      }
    : {
        fullName: '',
        street: '',
        city: '',
        province: '',
        postalCode: '',
        country: '',
        phone: '',
      }

const CheckoutForm = () => {
  const router = useRouter()
  const [isAddressSlected, setIsAddressSlected] = useState(false)
  const [isPaymentMethodeSlected, setIsPaymentMethodeSlected] = useState(false)
  const [isDeliveryDateSlected, setIsDeliveryDateSlected] = useState(false)

  const {
    cart: {
      items,
      itemsPrice,
      shippingAddress,
      taxPrice,
      totalPrice,
      shippingPrice,
      deliveryDateIndex,
      paymentMethode = DEFAULT_PAYMENT_METHOD,
    },
    setShippingAddress,
    setDeliveryDateIndex,
    setPaymentMethode,
    updateItem,
    removeItem,
    clearCart,
  } = usecarteStore()

  const isMounted = useIsMounted()

  const shippingAddressForm = useForm<shippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: defultValue,
  })

  const onSubmitShippingAddress: SubmitHandler<shippingAddress> = (values) => {
    setShippingAddress(values)
    setIsAddressSlected(true)
  }
  useEffect(() => {
    if (!isMounted || !shippingAddress) return
    shippingAddressForm.setValue('fullName', shippingAddress.fullName)
    shippingAddressForm.setValue('street', shippingAddress.street)
    shippingAddressForm.setValue('city', shippingAddress.city)
    shippingAddressForm.setValue('province', shippingAddress.province)
    shippingAddressForm.setValue('postalCode', shippingAddress.postalCode)
    shippingAddressForm.setValue('country', shippingAddress.country)
    shippingAddressForm.setValue('phone', shippingAddress.phone)
  }, [items, isMounted, router, shippingAddress, shippingAddressForm])

  const handlePlaceholder = async () => {
    try {
      const res = await createOrder({
        items,
        expectedDeliverydate: calculateFutureDate(
          AVAILABLE_DELIVERY_DATES[deliveryDateIndex!].daysToDeliver
        ),
        shippingAddress,
        deliveryDateIndex,
        paymentMethode,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      })
      if (!res.sucess) {
        toast.error(res.message)
        return
      }
      toast.success(res.message)
      clearCart()
      router.push(`/checkout/${res.data?.orderId}`)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSelectedPaymentMethode = () => {
    setIsAddressSlected(true)
    setIsPaymentMethodeSlected(true)
  }

  const handleSelectedShippingAddress = () => {
    shippingAddressForm.handleSubmit(onSubmitShippingAddress)()
  }

  const OrderSummery = () => (
    <Card className='md:mt-12 '>
      <CardContent className='p-4  highlight-link'>
        {!isAddressSlected && (
          <div className='border-b mb-4'>
            <Button
              className='rounded-full w-full'
              onClick={handleSelectedShippingAddress}
            >
              {' '}
              Ship to this address
            </Button>
            <p className=' text-xs text-center py-2'>
              Choose a shipping address and payment method in order to calculate
              shipping, handling, and tax.
            </p>
          </div>
        )}
        {!isPaymentMethodeSlected && isAddressSlected && (
          <div className='mb-4'>
            <Button
              className='rounded-full w-full'
              onClick={handleSelectedPaymentMethode}
            >
              {' '}
              Use this payment method{' '}
            </Button>
            <p className=' text-xs text-center py-2'>
              Choose a payment method to countinue checking out .you&apos;ll
              still have a chance to review and edit your order before it&apos;s
              final.
            </p>
          </div>
        )}
        {isPaymentMethodeSlected && isAddressSlected && (
          <div className=''>
            <Button className='rounded-full w-full' onClick={handlePlaceholder}>
              {' '}
              Place Your Order{' '}
            </Button>
            <p className=' text-xs text-center py-2'>
              By placing your order, you agree to {APP_NAME}{' '}
              <Link href='/page/privacy-policy'>privacy notice</Link> and{' '}
              <Link href='/page/conditions-of-use'>conditions of use.</Link>
            </p>
          </div>
        )}
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
  return (
    <main className='max-w-6xl mx-auto higlight-link'>
      <div className='grid md:grid-cols-4 gap-6'>
        <div className='md:col-span-3'>
          {}
          <div className=''>
            {isAddressSlected && shippingAddress ? (
              <div className='grid grid-cols-1  md:grid-cols-12 my-3 pb-3'>
                <div className=' col-span-5 flex text-lg font-bold'>
                  <span className=' w-8'>1</span>
                  <span className=''> shippingAddress</span>
                </div>
                <div className='col-span-5 '>
                  <p className=''>
                    {shippingAddress?.fullName}
                    <br />
                    {shippingAddress?.street}
                    <br />
                    {shippingAddress?.city}, {shippingAddress?.province},{' '}
                    {shippingAddress?.postalCode},{shippingAddress?.country}
                  </p>
                </div>
                <div className='col-span-2 '>
                  <Button
                    className=''
                    variant='outline'
                    onClick={() => {
                      setIsAddressSlected(false)
                      setIsPaymentMethodeSlected(true)
                      setIsDeliveryDateSlected(true)
                    }}
                  >
                    Change{' '}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className=' flex  text-primary font-bold text-lg my-2 '>
                  <span className='pr-7'>1</span>
                  <span className=''>Enter shipping address</span>
                </div>
                <Form {...shippingAddressForm}>
                  <form
                    method='post'
                    onSubmit={shippingAddressForm.handleSubmit(
                      onSubmitShippingAddress
                    )}
                    className='space-y-4'
                  >
                    <Card className='md:ml-8 my-4'>
                      <CardContent className='p-4 space-y-2'>
                        <div className=' font-bold text-lg mb-2'>
                          Your address
                        </div>
                        <div className=''>
                          <FormField
                            control={shippingAddressForm.control}
                            name='fullName'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter full name'
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='street'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter address'
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='city'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder='Enter city' {...field} />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='province'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>province</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter province'
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='country'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter country'
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='postalCode'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter postal code'
                                    {...field}
                                  />
                                </FormControl>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={shippingAddressForm.control}
                            name='phone'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone number</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter Phone number'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </CardContent>
                      <CardFooter className='p-4'>
                        <Button
                          type='submit'
                          className='font-bold rounded-full'
                        >
                          Ship to this address
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
              </>
            )}
          </div>
          {/* payment method */}
          <div className='border-y'>
            {isPaymentMethodeSlected && paymentMethode ? (
              <div className='grid grid-cols-1  md:grid-cols-12 my-3 pb-3'>
                <div className='flex font-bold text-lg col-span-5 text-primary'>
                  <span className='w-8'>2</span>
                  <span className=''>Payment method</span>
                </div>
                <div className='col-span-5 '>
                  <p>{paymentMethode}</p>
                </div>
                <div className='col-span-2   '>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsPaymentMethodeSlected(false)
                      if (paymentMethode) setIsDeliveryDateSlected(true)
                    }}
                  >
                    Change
                  </Button>
                </div>
              </div>
            ) : isAddressSlected ? (
              <>
                <div className='flex font-bold text-lg  text-primary my-2'>
                  <span className='w-8'>2</span>
                  <span className=''>Choose a payment method</span>
                </div>
                <Card className='md:ml-8 my-4'>
                  <CardContent className='p-4'>
                    <RadioGroup
                      value={paymentMethode}
                      onValueChange={(value) => setPaymentMethode(value)}
                    >
                      {AVAILABLE_PAYMENT_METHODS.map((method) => (
                        <div
                          key={method.name}
                          className='flex items-center space-x-2'
                        >
                          <RadioGroupItem
                            value={method.name}
                            id={`payment-${method.name}`}
                          />
                          <Label
                            htmlFor={`payment-${method.name}`}
                            className='font-bold pl-2  cursor-pointer'
                          >
                            {method.name}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <CardFooter className='p-4'>
                      <Button
                        className='font-bold rounded-full'
                        onClick={handleSelectedPaymentMethode}
                      >
                        Use this payment method
                      </Button>
                    </CardFooter>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className='flex text-muted-foreground font-bold text-lg   my-6'>
                <span className='w-8'>2</span>
                <span className=''>Choose a payment method</span>
              </div>
            )}
          </div>
          {/* delivery date */}
          {isDeliveryDateSlected && deliveryDateIndex !== undefined ? (
            <div className='grid grid-cols-1  md:grid-cols-12 my-3 pb-3'>
              <div className=' col-span-5 flex text-lg font-bold '>
                <span className=' w-8'>3</span>
                <span className=''> Items and shipping</span>
              </div>
              <div className='col-span-5 pr-4 '>
                <p className='border-b-2  border-blue-200'>
                  Delivery date:
                  {
                    formatDateTime(
                      calculateFutureDate(
                        AVAILABLE_DELIVERY_DATES[deliveryDateIndex]
                          .daysToDeliver
                      )
                    ).dateOnly
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
              <div className='col-span-2 '>
                <Button
                  className=''
                  variant='outline'
                  onClick={() => {
                    setIsPaymentMethodeSlected(true)
                    setIsDeliveryDateSlected(false)
                  }}
                >
                  Change{' '}
                </Button>
              </div>
            </div>
          ) : isPaymentMethodeSlected && isAddressSlected ? (
            <>
              <div className='text-primary  flex text-lg font-bold my-2 '>
                <span className=' w-8'>3</span>
                <span className=''> Items and shipping</span>
              </div>

              <Card className='md:ml-8 my-4'>
                <CardContent className='p-4'>
                  <p className='mb-2'>
                    <span className='text-lg font-bold text-green-700 '>
                      Arriving{''}
                      {
                        formatDateTime(
                          calculateFutureDate(
                            AVAILABLE_DELIVERY_DATES[deliveryDateIndex!]
                              .daysToDeliver
                          )
                        ).dateOnly
                      }
                    </span>{' '}
                    {''}
                    If you order in the next {timeUntilMidnight().hours} hours
                    and {timeUntilMidnight().minutes} minutes
                  </p>
                  <div className='grid md:grid-cols-2 gap-6'>
                    <div className=''>
                      {items.map((item, index) => (
                        <div className='flex gap-4 py-2' key={index}>
                          <div className=' relative h-16 w-16 '>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              objectFit='contain'
                            />
                          </div>
                          <div className='  flex-1'>
                            <p className='font-semibold line-clamp-2 overflow-hidden text-ellipsis '>
                              {item.name}, {item.size}, {item.color}
                            </p>

                            <ProductPrice price={item.price} plain />
                            <div className='flex gap-6'>
                              <Select
                                value={item.quantity.toString()}
                                onValueChange={(i) => {
                                  updateItem(item, Number(i))
                                }}
                              >
                                <SelectTrigger className='w-24'>
                                  <SelectValue>
                                    Qty: {item.quantity}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent position='popper'>
                                  {Array.from({
                                    length: item.countInstock,
                                  }).map((_, i) => (
                                    <SelectItem key={i + 1} value={`${i + 1}`}>
                                      {i + 1}
                                    </SelectItem>
                                  ))}
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
                        </div>
                      ))}
                    </div>
                    <div className=''>
                      <div className='font-bold'>
                        <p className=''>Choose a shipping speed:</p>
                        <ul>
                          <RadioGroup
                            value={
                              AVAILABLE_DELIVERY_DATES[deliveryDateIndex!].name
                            }
                            onValueChange={(value) =>
                              setDeliveryDateIndex(
                                AVAILABLE_DELIVERY_DATES.findIndex(
                                  (d) => d.name === value
                                )!
                              )
                            }
                          >
                            {AVAILABLE_DELIVERY_DATES.map((method) => (
                              <div
                                key={method.name}
                                className='flex items-center space-x-2'
                              >
                                <RadioGroupItem
                                  value={method.name}
                                  id={`address-${method.name}`}
                                />
                                <Label
                                  htmlFor={`address-${method.name}`}
                                  className=' pl-2 space-y-2  cursor-pointer'
                                >
                                  <div className='text-green-700 font-semibold'>
                                    {
                                      formatDateTime(
                                        calculateFutureDate(
                                          method.daysToDeliver
                                        )
                                      ).dateOnly
                                    }
                                  </div>
                                  <div className=''>
                                    {method.freeShippingMinPrice > 0 &&
                                    itemsPrice >=
                                      method.freeShippingMinPrice ? (
                                      'FREE Shipping'
                                    ) : (
                                      <ProductPrice
                                        price={method.shippingPrice}
                                        plain
                                      />
                                    )}
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className='text-muted-foreground   flex text-lg font-bold my-4 py-3 '>
              <span className=' w-8'>3</span>
              <span className=''> Items and shipping</span>
            </div>
          )}
          {isPaymentMethodeSlected && isAddressSlected && (
            <div className='mt-6'>
              <div className='block md:hidden'>
                <OrderSummery />
              </div>

              <Card className='hidden md:block '>
                <CardContent className='p-4 flex flex-col md:flex-row justify-between items-center gap-3'>
                  <Button onClick={handlePlaceholder} className='rounded-full'>
                    Place Your Order
                  </Button>
                  <div className='flex-1'>
                    <p className='font-bold text-lg'>
                      Order Total: <ProductPrice price={totalPrice} plain />
                    </p>
                    <p className='text-xs'>
                      {' '}
                      By placing your order, you agree to {APP_NAME}&apos;s{' '}
                      <Link href='/page/privacy-policy'>privacy notice</Link>{' '}
                      and
                      <Link href='/page/conditions-of-use'>
                        {' '}
                        conditions of use
                      </Link>
                      .
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
        <div className='hidden md:block'>
          <OrderSummery />
        </div>
      </div>
      <Checkoutfooter />
    </main>
  )
}

export default CheckoutForm
