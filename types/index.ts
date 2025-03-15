import {
  Cartschema,
  OrderItemSchema,
  productInputSchema,
  userInputSchema,
  userSignInSchema,
} from '@/lib/validator'
import { z } from 'zod'

export type IProductInput = z.infer<typeof productInputSchema>
export type orderItem = z.infer<typeof OrderItemSchema>
export type cart = z.infer<typeof Cartschema>
export type userInput = z.infer<typeof userInputSchema>
export type userSignIn = z.infer<typeof userSignInSchema>

export type Data = {
  users: userInput[]
  products: IProductInput[]
  headerMenus: {
    name: string
    href: string
  }[]
  carousels: {
    image: string
    url: string
    title: string
    buttonCaption: string
    isPublished: boolean
  }[]
}
