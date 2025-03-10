import {
  Cartschema,
  OrderItemSchema,
  productInputSchema,
} from '@/lib/validator'
import { z } from 'zod'

export type IProductInput = z.infer<typeof productInputSchema>
export type orderItem = z.infer<typeof OrderItemSchema>
export type cart = z.infer<typeof Cartschema>

export type data = {
  products: IProductInput[]
  headerMenus: {
    name: string
    href: string
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttoncaption: string
    ispublished: boolean
  }[]
}
