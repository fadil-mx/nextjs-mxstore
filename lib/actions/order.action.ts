'use server'
import { cart, orderItem, shippingAddress } from '@/types'
import { formatError, round2 } from '../utils'
import { AVAILABLE_DELIVERY_DATES } from '../constants'
import { connectDB } from '../db'
import { auth } from '@/auth'
import { orderInputSchema } from '../validator'
import Order from '../db/models/order.model'

// create
export const createOrder = async (clientSideCart: cart) => {
  try {
    await connectDB()
    const session = await auth()
    if (!session) {
      throw new Error('Unauthorized')
    }
    //reclalculate the price and delivery date on the server
    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )
    return {
      sucess: true,
      message: 'Order palced successfully',
      data: { orderId: createdOrder._id.toString() },
    }
  } catch (error) {
    console.log(error)
    return { sucess: false, message: formatError(error) }
  }
}

export const createOrderFromCart = async (
  clientSideCart: cart,
  userId: string
) => {
  const cart = {
    ...clientSideCart,
    ...calDeliveryDateAndPrice({
      items: clientSideCart.items,
      shippingAddress: clientSideCart.shippingAddress!,
      deliveryDateIndex: clientSideCart.deliveryDateIndex,
    }),
  }
  const order = orderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethode: cart.paymentMethode,
    itemsPrice: cart.itemsPrice,
    taxPrice: cart.taxPrice,
    shippingPrice: cart.shippingPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliverydate,
  })
  return await Order.create(order)
}

//for calculating delivery date and price
export const calDeliveryDateAndPrice = async ({
  items,
  deliveryDateIndex,
  shippingAddress,
}: {
  deliveryDateIndex?: number
  items: orderItem[]
  shippingAddress: shippingAddress
}) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliveryDate =
    AVAILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ]
  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
        itemsPrice >= deliveryDate.freeShippingMinPrice
      ? 0
      : deliveryDate.shippingPrice

  const taxPrice = !shippingAddress ? undefined : round2(itemsPrice * 0.15) // 15% tax
  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )
  return {
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}
