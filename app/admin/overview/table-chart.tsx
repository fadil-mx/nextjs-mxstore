'use client'
import ProductPrice from '@/components/shared/product/product-price'
import { getMonthName } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
  labelType: 'month' | 'product'
  data: {
    label: string
    value: number
    image?: string
    id?: string
  }[]
}

interface progressBarProps {
  value: number
  // className?: string
}

const ProgressBar = ({ value }: progressBarProps) => {
  const boundedValue = Math.min(Math.max(value, 0), 100) // Ensure value is between 0 and 1 00
  return (
    <div className='w-full relative h-4 overflow-hidden rounded-lg border-2 border-gray-200 '>
      <div
        className='bg-primary h-full  transition-all duration-300  rounded-lg'
        style={{ width: `${boundedValue}%`, float: 'right' }}
      ></div>
    </div>
  )
}

const Tablechart = ({ labelType = 'month', data = [] }: Props) => {
  const max = Math.max(...data.map((item) => item.value))
  const dateWithPercentage = data.map((item) => ({
    ...item,
    label: labelType === 'month' ? getMonthName(item.label) : item.label,
    percentage: Math.round((item.value / max) * 100), // Calculate percentage based on max value
  }))
  return (
    <div className='space-y-3'>
      {dateWithPercentage.map(({ label, id, value, image, percentage }) => (
        <div
          key={label}
          className='grid grid-cols-[100px_1fr_80px] md:grid-cols-[250px_1fr_80px] gap-2 space-y-4'
        >
          {image ? (
            <Link href={`/admin/products/${id}`} className='flex items-end'>
              <Image
                src={image}
                alt={label}
                width={36}
                height={36}
                className=' rounded border aspect-square object-scale-down max-w-full h-auto mx-auto mr-1'
              />
              <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                {label}
              </p>
            </Link>
          ) : (
            <p className='text-sm flex items-end'>{label}</p>
          )}
          <ProgressBar value={percentage} />
          <div className='text-sm text-right flex items-center'>
            <ProductPrice price={value} plain />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Tablechart
