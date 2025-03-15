export const APP_NAME = process.env.NEXT_APP_NAME || 'MXSTORE'
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
