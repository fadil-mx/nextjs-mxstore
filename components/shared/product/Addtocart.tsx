'use client'
import { Button } from '@/components/ui/button'
import { usecarteStore } from '@/hooks/use-cart-store'
import { orderItem } from '@/types'
import { toast } from 'sonner'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Props = { item: orderItem; minimal?: boolean }

const Addtocart = ({ item, minimal = false }: Props) => {
  const router = useRouter()
  const { additems } = usecarteStore()
  const [quantity, setQuantity] = useState(1)

  return minimal ? (
    <Button
      className='rounded-full w-auto '
      onClick={() => {
        try {
          additems(item, 1)
          toast('Added to Cart', {
            action: {
              label: 'Go to Cart',
              onClick: () => router.push('/cart'),
            },
          })
        } catch (error) {
          toast.error(error.message)
        }
      }}
    >
      {' '}
      Add to Cart
    </Button>
  ) : (
    <div className='w-full space-y-2'>
      <Select
        value={quantity.toString()}
        onValueChange={(i) => setQuantity(Number(i))}
      >
        <SelectTrigger className=''>
          <SelectValue>Quantity: {quantity}</SelectValue>
        </SelectTrigger>
        <SelectContent position='popper'>
          {Array.from({ length: item.countInstock }).map((_, i) => (
            <SelectItem key={i + 1} value={`${i + 1}`}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className='rounded-full w-full'
        type='button'
        onClick={async () => {
          try {
            const itemId = await additems(item, quantity)
            router.push(`/cart/${itemId}`)
          } catch (error: any) {
            toast.error(error.message)
          }
        }}
      >
        Add to Cart
      </Button>
      <Button
        variant='secondary'
        onClick={() => {
          try {
            additems(item, quantity)
            router.push(`/checkout`)
          } catch (error: any) {
            toast.error(error.message)
          }
        }}
        className='w-full rounded-full '
      >
        Buy Now
      </Button>
    </div>
  )
}

export default Addtocart
