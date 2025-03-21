import { calDeliveryDateAndPrice } from '@/lib/actions/order.action'
import { cart, orderItem, shippingAddress } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState: cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: undefined,
  shippingPrice: undefined,
  totalPrice: 0,
  paymentMethode: undefined,
  shippingAddress: undefined,
  deliveryDateIndex: undefined,
}

type CartState = {
  cart: cart
  additems: (item: orderItem, quantity: number) => Promise<string>
  updateItem: (item: orderItem, quantity: number) => void
  removeItem: (item: orderItem) => void
  clearCart: () => void
  setShippingAddress: (shippingAddress: shippingAddress) => Promise<void>
  setPaymentMethode: (paymentMethode: string) => void
  setDeliveryDateIndex: (index: number) => void
}

export const usecarteStore = create(
  persist<CartState>(
    (set, get) => ({
      cart: initialState,
      additems: async (item: orderItem, quantity: number) => {
        const { items, shippingAddress } = get().cart
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
            ...(await calDeliveryDateAndPrice({
              items: updateitems,
              shippingAddress,
            })),
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
      updateItem: async (item: orderItem, quantity: number) => {
        const { items, shippingAddress } = get().cart
        const existingItem = items.find(
          (x) =>
            x.product === item.product &&
            x.size === item.size &&
            x.color === item.color
        )
        if (!existingItem) return
        const updateitems = items.map((x) =>
          x.product === item.product &&
          x.size === item.size &&
          x.color === item.color
            ? {
                ...x,
                quantity: quantity,
              }
            : x
        )
        set({
          cart: {
            ...get().cart,
            items: updateitems,
            ...(await calDeliveryDateAndPrice({
              items: updateitems,
              shippingAddress,
            })),
          },
        })
      },
      removeItem: async (item: orderItem) => {
        const { items, shippingAddress } = get().cart
        const updateitems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.size !== item.size ||
            x.color !== item.color
        )
        set({
          cart: {
            ...get().cart,
            items: updateitems,
            ...(await calDeliveryDateAndPrice({
              items: updateitems,
              shippingAddress,
            })),
          },
        })
      },
      setShippingAddress: async (shippingAddress: shippingAddress) => {
        const { items } = get().cart
        set({
          cart: {
            ...get().cart,
            shippingAddress,
            ...(await calDeliveryDateAndPrice({
              items,
              shippingAddress,
            })),
          },
        })
      },
      setDeliveryDateIndex: async (index: number) => {
        const { items, shippingAddress } = get().cart
        set({
          cart: {
            ...get().cart,
            ...(await calDeliveryDateAndPrice({
              items,
              deliveryDateIndex: index,
              shippingAddress,
            })),
          },
        })
      },
      setPaymentMethode: (paymentMethode: string) => {
        set({
          cart: {
            ...get().cart,
            paymentMethode: paymentMethode,
          },
        })
      },
      clearCart: () => set({ cart: { ...get().cart, items: [] } }),
      init: () => set({ cart: initialState }),
    }),
    { name: 'cartStore' }
  )
)
