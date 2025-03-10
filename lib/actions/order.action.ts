import { orderItem } from '@/types'
import { round2 } from '../utils'
import { FREE_SHIPPING_MIN_PRICE } from '../constants'

export const calDeliveryDateAndPrice = async ({
  items,
  deliveryDateIndex,
}: {
  deliveryDateIndex?: number
  items: orderItem[]
}) => {
  const itemsprice = round2(
    items.reduce((acc, item) => acc + item.price * item.quentity, 0)
  )
  const shippingPrice = itemsprice > FREE_SHIPPING_MIN_PRICE ? 0 : 5
  const taxPrice = round2(itemsprice * 0.15) // 15% tax
  const totalPiece = round2(
    itemsprice + (shippingPrice ? round2(shippingPrice) : 0) + taxPrice
  )
  return {
    itemsprice,
    shippingPrice,
    taxPrice,
    totalPiece,
  }
}
