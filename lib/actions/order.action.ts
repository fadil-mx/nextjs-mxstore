'use server'
import { cart, IorderList, orderItem, shippingAddress } from '@/types'
import { formatError, round2 } from '../utils'
import { AVAILABLE_DELIVERY_DATES, PAGE_SIZE } from '../constants'
import { connectDB } from '../db'
import { auth } from '@/auth'
import { orderInputSchema } from '../validator'
import Order, { IOrder } from '../db/models/order.model'
import { paypal } from '../paypal'
import { sendPurchaseReceipt } from '@/emails'
import { revalidatePath } from 'next/cache'
import { DateRange } from 'react-day-picker'
import product from '../db/models/productmodel'
import User from '../db/models/user.model'

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

//paypal
export async function getOrderById(orderId: string): Promise<IOrder> {
  await connectDB()
  const order = await Order.findById(orderId)
  return JSON.parse(JSON.stringify(order))
}

export async function createPaypalOrder(orderId: string) {
  try {
    const order = await Order.findById(orderId)
    if (order) {
      const paypalOrder = await paypal.createOrder(order.totalPrice)
      order.paymentResult = {
        id: paypalOrder.id,
        status: '',
        email_address: '',
        pricePaid: '0',
      }
      await order.save()
      return {
        sucess: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (error) {
    return {
      sucess: false,
      message: formatError(error),
    }
  }
}

export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  try {
    await connectDB()
    const order = await Order.findById(orderId).populate('user', 'email')
    if (!order) {
      throw new Error('Order not found')
    }
    const captureData = await paypal.capturePayment(data.orderID)
    if (
      !captureData ||
      captureData.status !== 'COMPLETED' ||
      captureData.id !== order.paymentResult?.id
    ) {
      throw new Error('Error in paypal payment')
    }
    order.isPaid = true
    order.paidAt = new Date()
    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    }
    await order.save()
    await sendPurchaseReceipt({ order })
    revalidatePath(`/account/orders/${order._id}`)
    return {
      sucess: true,
      message: 'Your Order has been paid successfully by PayPal',
    }
  } catch (error) {
    return {
      sucess: false,
      message: formatError(error),
    }
  }
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

//getting users orders
export async function getOrders({
  limit,
  page = 1,
}: {
  limit?: number
  page: number
}) {
  limit = limit || PAGE_SIZE
  const skip = (page - 1) * limit
  try {
    const session = await auth()
    if (!session) {
      throw new Error('Unauthorized')
    }
    await connectDB()
    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: 'desc' })
      .skip(skip)
      .limit(limit)
    const totalOrders = await Order.countDocuments({ user: session.user.id })
    return {
      data: JSON.parse(JSON.stringify(orders)) as IOrder[],
      totalPages: Math.ceil(totalOrders / limit), // if totalOrders is 0, return 1
    }
  } catch (error) {
    throw new Error(formatError(error))
  }
}

export async function getOrderSummery(date: DateRange) {
  try {
    await connectDB()
    const orderCount = await Order.countDocuments({
      createdAt: {
        $gte: date.from,
        $lt: date.to,
      },
    })

    const productCount = await product.countDocuments({
      createdAt: {
        $gte: date.from,
        $lt: date.to,
      },
    })

    const userCount = await User.countDocuments({
      createdAt: {
        $gte: date.from,
        $lt: date.to,
      },
    })

    const totalSalesresult = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: date.from,
            $lt: date.to,
          },
        },
      },
      {
        $group: {
          _id: null,
          sales: { $sum: '$totalPrice' },
        },
      },
      {
        $project: {
          totalSales: { $ifNull: ['$sales', 0] },
        },
      },
    ])
    const totalSales = totalSalesresult[0] ? totalSalesresult[0].totalSales : 0
    const date = new Date()

    const sixMonthsEarlier = new Date()
    sixMonthsEarlier.setMonth(sixMonthsEarlier.getMonth() - 6)

    const monthlySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sixMonthsEarlier,
          },
        },
      },
      {
        $group: {
          _id: { format: '%Y-%m', date: '$createdAt' },
          totalSales: { $sum: '$totalPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          values: '$totalSales',
        },
      },
      {
        $sort: {
          label: -1,
        },
      },
    ])
    const topSalesProducts = await getTopSalesProducts(date)
    const topSalesCategory = await getTopSalesCategories(date)

    const LatestOrders = await Order.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(PAGE_SIZE)
    return {
      orderCount,
      productCount,
      userCount,
      totalSales,
      monthlySales: JSON.parse(JSON.stringify(monthlySales)),
      salesChartDate: JSON.parse(JSON.stringify(await getSalesChartData(date))),
      topSalesProducts: JSON.parse(JSON.stringify(topSalesProducts)),
      topSalesCategory: JSON.parse(JSON.stringify(topSalesCategory)),
      LatestOrders: JSON.parse(JSON.stringify(LatestOrders)) as IorderList[],
    }
  } catch (error) {
    throw new Error(formatError(error))
  }
}

async function getSalesChartData(date: Date) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lt: date.to,
        },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        totalSales: { $sum: '$totalPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            { $toString: '$_id.month' },
            '-',
            { $toString: '$_id.day' },
          ],
        },
        totalSales: 1,
      },
    },
    {
      $sort: {
        date: 1,
      },
    },
  ])
  return result
}

async function getTopSalesProducts(date: DateRange) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    // Step 1: Unwind orderItems array
    { $unwind: '$items' },

    // Step 2: Group by productId to calculate total sales per product
    {
      $group: {
        _id: {
          name: '$items.name',
          image: '$items.image',
          _id: '$items.product',
        },
        totalSales: {
          $sum: { $multiply: ['$items.quantity', '$items.price'] },
        }, // Assume quantity field in orderItems represents units sold
      },
    },
    {
      $sort: {
        totalSales: -1,
      },
    },
    { $limit: 6 },

    // Step 3: Replace productInfo array with product name and format the output
    {
      $project: {
        _id: 0,
        id: '$_id._id',
        label: '$_id.name',
        image: '$_id.image',
        value: '$totalSales',
      },
    },

    // Step 4: Sort by totalSales in descending order
    { $sort: { _id: 1 } },
  ])

  return result
}

async function getTopSalesCategories(date: DateRange, limit = 5) {
  const result = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: date.from,
          $lte: date.to,
        },
      },
    },
    // Step 1: Unwind orderItems array
    { $unwind: '$items' },
    // Step 2: Group by productId to calculate total sales per product
    {
      $group: {
        _id: '$items.category',
        totalSales: { $sum: '$items.quantity' }, // Assume quantity field in orderItems represents units sold
      },
    },
    // Step 3: Sort by totalSales in descending order
    { $sort: { totalSales: -1 } },
    // Step 4: Limit to top N products
    { $limit: limit },
  ])

  return result
}
