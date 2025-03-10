import { z } from 'zod'
import { formatNumber } from './utils'

const price = (field: string) =>
  z.coerce
    .number()
    .refine(
      (Value) => /^\d+(\.\d{2})?$/.test(formatNumber(Value)),
      `${field} must have exactly two decimal places (e.g., 49.99)`
    )

export const productInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'),
  category: z.string().min(1, 'Catagory must be at least 1 characters long'),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  brand: z.string().min(1, 'Brand is required'),
  description: z.string().min(1, 'Description is required'),
  isPublished: z.boolean(),
  price: price('Price'),
  listPrice: price('List Price'),
  countInStock: z.coerce
    .number()
    .int()
    .nonnegative('Count in stock must be a non-negative integer'),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default([]),
  colors: z.array(z.string()).default([]),
  avgRating: z.coerce
    .number()
    .min(0, 'Average rating must be at least 0')
    .max(5, 'Average rating must be at most 5'),
  numReviews: z.coerce
    .number()
    .int()
    .nonnegative('Number of reviews must be a non-negative number'),
  ratingDistribution: z
    .array(z.object({ rating: z.number(), count: z.number() }))
    .max(5),
  reviews: z.array(z.string()).default([]),
  numSales: z.coerce
    .number()
    .int()
    .nonnegative('Number of sales must be a non-negative number'),
})

export const OrderItemSchema = z.object({
  clientId: z.string().min(1, 'clientId is required'),
  product: z.string().min(1, 'product is required'),
  name: z.string().min(1, 'name is required'),
  slug: z.string().min(1, 'slug is required'),
  category: z.string().min(1, 'category is required'),
  quantity: z
    .number()
    .int()
    .nonnegative('quantity must be a non-negative number'),
  countInstock: z
    .number()
    .int()
    .nonnegative('countInstock must be a non-negative number'),
  image: z.string().min(1, 'image is required'),
  price: price('Price'),
  size: z.string().optional(),
  color: z.string().optional(),
})

export const Cartschema = z.object({
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  itemsPrice: z.number(),
  taxPrice: z.number().optional(),
  shippingPrice: z.number().optional(),
  totalPrice: z.number(),
  paymentMethode: z.optional(z.string()),
  deliveryDateIndex: z.number().optional(),
  expectedDeliverydate: z.optional(z.date()),
})
