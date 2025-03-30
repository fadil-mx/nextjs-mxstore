'use client'

import Rating from '@/components/shared/product/rating'
import RatingSummary from '@/components/shared/product/rating-summary'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  createUpdatedReview,
  getReview,
  getReviewById,
} from '@/lib/actions/review.action'
import { IProduct } from '@/lib/db/models/productmodel'
import { ReviewInputSchema } from '@/lib/validator'
import { ReviewDetails, ReviewInput } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Check, StarIcon, User } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { toast } from 'sonner'

type Props = {
  userId: string | undefined
  product: IProduct
}

const reviewDefaultValue = {
  title: '',
  comment: '',
  rating: 0,
}

const ReviewList = ({ userId, product }: Props) => {
  const [page, setpage] = useState(2)
  const [totalPages, setTotalPages] = useState(0)
  const [reviews, setReviews] = useState([])
  const [open, setopen] = useState(false)
  const { ref, inView } = useInView({ triggerOnce: true })
  const [loading, setLoading] = useState(false)
  const relode = async () => {
    try {
      const res = await getReview({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const loadMorereviews = async () => {
    if (totalPages !== 0 && page > totalPages) return
    setLoading(true)
    const res = await getReview({ productId: product._id, page })
    setLoading(false)
    setReviews([...reviews, ...res.data])
    setTotalPages(res.totalPages)
    setpage(page + 1)
  }

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true)
      const res = await getReview({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      setLoading(false)
    }
    if (inView) loadReviews()
  }, [inView])

  const form = useForm<ReviewInput>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: reviewDefaultValue,
  })

  const { handleSubmit } = form
  const submit = async (values) => {
    const res = await createUpdatedReview({
      data: { ...values, product: product._id },
      path: `/product/${product.slug}`,
    })
    if (!res.success) {
      toast.error(res.message)
    }
    setopen(false)
    relode()
    toast.success(res.message)
  }

  const handleOpenForm = async () => {
    form.setValue('product', product._id)
    form.setValue('user', userId!)
    form.setValue('isVerifiedPurchase', true)
    const review = await getReviewById({ productId: product._id })
    if (review) {
      form.setValue('title', review.title)
      form.setValue('comment', review.comment)
      form.setValue('rating', review.rating)
    }
    setopen(true)
  }

  return (
    <div className='space-y-2'>
      {reviews.length === 0 && <div className=''>No reviews yet</div>}
      <div className=' grid grid-cols-1 md:grid-cols-4 gap-8'>
        <div className='flex flex-col gap-2'>
          {reviews.length !== 0 && (
            <RatingSummary
              avgRating={product.avgRating}
              numreviews={product.numReviews}
              ratingDistribution={product.ratingDistribution}
            />
          )}
          <Separator className='my-2' />
          <div className='space-y-3'>
            <h3 className='font-bold text-lg lg:text-xl'>
              Review this product
            </h3>
            <p className='text-sm'>Share your thoughts with other customers</p>
            {userId ? (
              <Dialog open={open} onOpenChange={setopen}>
                <Button
                  variant='outline'
                  className='rounded-full w-full'
                  onClick={handleOpenForm}
                >
                  {' '}
                  Write a customer review
                </Button>
                <DialogContent className='sm:max-w-[445px]'>
                  <Form {...form}>
                    <form
                      method='post'
                      onSubmit={handleSubmit(submit)}
                      className='space-y-4'
                    >
                      <DialogHeader>
                        <DialogTitle>Write a customer review</DialogTitle>
                        <DialogDescription>
                          Share your thoughts with other customers
                        </DialogDescription>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='flex flex-col gap-5'>
                          <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input placeholder='Enter title' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='comment'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Comment</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder='Enter Comment'
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name='rating'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Rating</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={'Select a rating'}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 5 }).map(
                                      (_, index) => (
                                        <SelectItem
                                          key={index}
                                          value={(index + 1).toString()}
                                        >
                                          <div className='flex items-center gap-1'>
                                            {index + 1}{' '}
                                            <StarIcon className='h-4 w-4' />
                                          </div>
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          type='submit'
                          size='lg'
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting
                            ? 'Submitting...'
                            : 'Submit'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <div>
                Please
                <Link
                  href={`/sign-in?callbackUrl=/product/${product.slug}`}
                  className='highlight-link'
                >
                  sign in
                </Link>{' '}
                to write a review
              </div>
            )}
          </div>
        </div>
        <div className='md:col-span-3 flex flex-col gap-3 ' id='reviews'>
          {reviews.map((review: ReviewDetails) => (
            <Card key={review._id}>
              <CardHeader>
                <div className='flex justify-between'>
                  <h1 className='font-bold text-base'>{review.title}</h1>
                  <div className='flex items-center gap-2 italic text-sm'>
                    <Check className='h-4 w-4 ' /> Verified Purchase
                  </div>
                </div>
                <CardDescription>{review.comment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex space-x-4 text-sm text-muted-foreground'>
                  <Rating rating={review.rating} />
                  <div className='flex items-center'>
                    <User className='mr-1 h-4 w-4' />
                    {review.user ? review.user.name : 'deleted user'}
                  </div>
                  <div className='flex items-center'>
                    <Calendar className='mr-1 h-4 w-4' />
                    {review.createdAt.toString().slice(0, 10)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className='' ref={ref}>
            {page <= totalPages && (
              <Button variant='link' onClick={loadMorereviews}>
                See more reviews
              </Button>
            )}
            {page < totalPages && loading && 'Loading...'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewList
