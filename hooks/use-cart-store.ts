import { calDeliveryDateAndPrice } from '@/lib/actions/order.action'
import { cart, orderItem } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState: cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethode: undefined,
  deliveryDateIndex: undefined,
}

type CartState = {
  cart: cart
  additems: (item: orderItem, quantity: number) => Promise<string>
}

export const usecarteStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,
      additems: async (item: orderItem, quantity: number) => {
        const { items } = get().cart
        const existingItem = items.find(
          (x) =>
            x.product === item.product &&
            x.size === item.size &&
            x.color === item.color
        )
        if (existingItem) {
          if (existingItem.countInstock < quantity + existingItem.quantity) {
            throw new Error('Not enough stock')
          }
        } else {
          if (item.countInstock < quantity) {
            throw new Error('Not enough stock')
          }
        }
        const updateitems = existingItem
          ? items.map((x) =>
              x.product === item.product &&
              x.size === item.size &&
              x.color === item.color
                ? {
                    ...x,
                    quantity: x.quantity + quantity,
                  }
                : x
            )
          : [...items, { ...item, quantity: quantity }]
        set({
          cart: {
            ...get().cart,
            items: updateitems,
            ...(await calDeliveryDateAndPrice({ items: updateitems })),
          },
        })
        const foundItem = updateitems.find(
          (x) =>
            x.product === item.product &&
            x.size === item.size &&
            x.color === item.color
        )
        if (!foundItem) {
          throw new Error('Item not found')
        }
        return foundItem.clientId
      },
      init: () => set({ cart: initialState }),
    }),
    { name: 'cartStore' }
  )
)
