import { productInputSchema } from '@/lib/validator'
import { z } from 'zod'

export type IProductInput = z.infer<typeof productInputSchema>

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
