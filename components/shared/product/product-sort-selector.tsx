'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getFilterUrl } from '@/lib/utils'

import { useRouter } from 'next/navigation'
import React from 'react'

type Props = {
  sortorder: { value: string; name: string }[]
  sort: string
  params: {
    q?: string
    category?: string
    sort?: string
    price?: string
    rating?: string
    page?: string
  }
}

const Productsortselector = ({ sortorder, sort, params }: Props) => {
  const router = useRouter()
  return (
    <Select
      value={sort}
      onValueChange={(e) => {
        router.push(getFilterUrl({ params, sort: e }))
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder='Sort by' className='text-sm'>
          sort By:{sortorder.find((s) => s.value === sort)!.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortorder.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default Productsortselector
