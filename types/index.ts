import {
  Cartschema,
  orderInputSchema,
  OrderItemSchema,
  productInputSchema,
  productUpdateSchema,
  ReviewInputSchema,
  shippingAddressSchema,
  UpdateUser,
  userInputSchema,
  UserNameSchema,
  userSignInSchema,
  userSignUpSchema,
} from '@/lib/validator'
import { z } from 'zod'

export type IProductInput = z.infer<typeof productInputSchema>
export type IProductUpdate = z.infer<typeof productUpdateSchema>
export type orderItem = z.infer<typeof OrderItemSchema>
export type cart = z.infer<typeof Cartschema>
export type userInput = z.infer<typeof userInputSchema>
export type userSignIn = z.infer<typeof userSignInSchema>
export type userSignUp = z.infer<typeof userSignUpSchema>
export type shippingAddress = z.infer<typeof shippingAddressSchema>
export type orderInput = z.infer<typeof orderInputSchema>
export type IorderList = orderInput & {
  _id: string
  user: {
    name: string
    email: string
  }
  createdAt: Data
}
export type ReviewInput = z.infer<typeof ReviewInputSchema>
export type IUserName = z.infer<typeof UserNameSchema>
export type Updateuser = z.infer<typeof UpdateUser>
export type ReviewInputType = z.infer<typeof ReviewInputSchema>
export type ReviewDetails = ReviewInput & {
  _id: string
  createdAt: string
  user: {
    name: string
  }
}

export type Data = {
  users: userInput[]
  products: IProductInput[]
  reviews: {
    title: string
    comment: string
    rating: number
  }[]
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
