'use client'

import { getReview } from '@/lib/actions/review.action'
import { IProduct } from '@/lib/db/models/productmodel'
import { ReviewInputSchema } from '@/lib/validator'
import { ReviewInput } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
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
  const [open, setopen] = useState(false)
  const { handleSubmit, register } = form
  const submit = async (values) => {}
  return <div>review-list</div>
}

export default ReviewList
