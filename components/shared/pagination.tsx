'use client'
import { formUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { Button } from '../ui/button'

type Props = {
  page: number | string
  totalPages: number
  urlParamName: string
}

const Pagination = ({ page, totalPages, urlParamName }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const onClick = (btntype: string) => {
    const pageValue = btntype === 'next' ? Number(page) + 1 : Number(page) - 1
    const newurl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })
    router.push(newurl, { scroll: true })
  }
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        size='lg'
        className='w-28'
        onClick={() => onClick('pre')}
        disabled={Number(page) === 1}
      >
        previous
      </Button>
      <Button
        variant='outline'
        size='lg'
        className='w-28'
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        next
      </Button>
    </div>
  )
}

export default Pagination
