export const APP_NAME = 'MXSTORE'
export const APP_SLOGAN =
  process.env.NEXT_PUBLIC_APP_SLONGAN || 'Spend less, get more'
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  'The best place to buy and sell online'
export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 12)
export const FREE_SHIPPING_MIN_PRICE = Number(
  process.env.FREE_SHIPPING_MIN_PRICE || 35
)

export const APP_COPYRIGHT =
  process.env.NEXT_PUBLIC_APP_COPYRIGHT ||
  `copyright © 2025  ${APP_NAME} .All rights reserved`

export const AVAILABLE_PAYMENT_METHODS = [
  {
    name: 'PayPal',
    commission: 0,
    isDefault: true,
  },
  {
    name: 'Stripe',
    commission: 0,
    isDefault: true,
  },
  {
    name: 'Cash on delivery',
    commission: 0,
    isDefault: false,
  },
]
export const DEFAULT_PAYMENT_METHOD =
  process.env.DEFAULT_PAYMENT_METHOD || 'PayPal'

export const AVAILABLE_DELIVERY_DATES = [
  {
    name: 'Tomorrow',
    daysToDeliver: 1,
    shippingPrice: 12.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 3 day',
    daysToDeliver: 3,
    shippingPrice: 6.9,
    freeShippingMinPrice: 0,
  },
  {
    name: 'Next 5 day',
    daysToDeliver: 5,
    shippingPrice: 4.9,
    freeShippingMinPrice: 35,
  },
]
