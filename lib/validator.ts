import { z } from 'zod'
import { formatNumber } from './utils'

const price = (field: string) =>
  z.coerce
    .number()
    .refine(
      (Value) => /^\d+(\.\d{2})?$/.test(formatNumber(Value)),
      `${field} must have exactly two decimal places (e.g., 49.99)`
    )

const MongoId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoId')

export const ReviewInputSchema = z.object({
  product: MongoId,
  user: MongoId,
  isVerifiedPurchase: z.boolean().optional(),
  title: z.string().min(1, 'Title is required'),
  comment: z.string().min(1, 'Comment is required'),
  rating: z.coerce
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
})

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
  reviews: z.array(ReviewInputSchema).default([]),
  numSales: z.coerce
    .number()
    .int()
    .nonnegative('Number of sales must be a non-negative number'),
})

export const productUpdateSchema = productInputSchema.extend({
  _id: MongoId,
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

export const shippingAddressSchema = z.object({
  fullName: z.string().min(1, 'full name is required'),
  street: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  province: z.string().min(1, 'Province is required'),
  phone: z.string().min(1, 'Phone number is required'),
  country: z.string().min(1, 'Country is required'),
})

export const Cartschema = z.object({
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  itemsPrice: z.number(),
  taxPrice: z.number().optional(),
  shippingPrice: z.number().optional(),
  totalPrice: z.number(),
  paymentMethode: z.optional(z.string()),
  shippingAddress: z.optional(shippingAddressSchema),
  deliveryDateIndex: z.number().optional(),
  expectedDeliverydate: z.optional(z.date()),
})

export const userInputSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long'),
  email: z.string().min(1, 'Invalid email address'),
  password: z.string().min(3, 'Password must be at least 3 characters long'),
  role: z.string().min(1, 'UserRole is required'),
  image: z.string().optional(),
  emailVerified: z.boolean().optional(),
  paymentMethode: z.string().min(1, 'paymentMethode is required'),
  address: z.object({
    fullName: z.string().min(1, 'fullName is required'),
    street: z.string().min(1, 'street is required'),
    city: z.string().min(1, 'city is required'),
    postalCode: z.string().min(1, 'postalCode is required'),
    province: z.string().min(1, 'province is required'),
    country: z.string().min(1, 'country is required'),
    phone: z.string().min(1, 'phone is required'),
  }),
})

export const userSignInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(5, 'Password must be at least 5 characters long'),
})

export const userSignUpSchema = userSignInSchema
  .extend({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be at most 50 characters long'),
    confirmPassword: z
      .string()
      .min(5, 'Password must be at least 5 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const orderInputSchema = z.object({
  user: z.union([
    MongoId,
    z.object({
      name: z.string(),
      email: z.string().email(),
    }),
  ]),
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
  paymentMethode: z.string().min(1, 'paymentmethode is required'),
  paymentResult: z
    .object({
      id: z.string(),
      status: z.string(),
      email_address: z.string(),
      pricePaid: z.string(),
    })
    .optional(),
  itemsPrice: price('itemPrice'),
  shippingPrice: price('shippigPrice'),
  taxPrice: price('taxPrice'),
  totalPrice: price('totalPrice'),
  expectedDeliveryDate: z
    .date()
    .refine(
      (date) => date > new Date(),
      'Expected delivery date must be in the future'
    ),
  isDelivered: z.boolean().default(false),
  deliveredAt: z.date().optional(),
  isPaid: z.boolean().default(false),
  paidAt: z.date().optional(),
})

export const UserNameSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long'),
})

export const UpdateUser = z.object({
  id: MongoId,
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be at most 50 characters long'),
  role: z.string().min(1, 'UserRole is required'),
  email: z.string().min(1, 'Invalid email address').optional(),
})
