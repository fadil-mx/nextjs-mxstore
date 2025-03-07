'use client'

import useBrowsingHistory from '@/hooks/Use-browsing-history'
import React, { useEffect, useState } from 'react'
import { Separator } from '../ui/separator'
import { cn } from '@/lib/utils'
import ProductSlider from './product/productSlider'

type Props = {
  className?: string
}

const ProductList = ({
  title,
  type = 'history',
  hideDetails = false,
}: {
  title: string
  type?: 'related' | 'history'
  hideDetails?: boolean
}) => {
  const { products } = useBrowsingHistory()
  const [data, setdata] = useState([])
  useEffect(() => {
    const fetchProducts = async () => {
      if (products.length === 0) return // Prevents unnecessary fetch when no products exist

      try {
        const res = await fetch(
          `/api/products/browsing-history?type=${type}&categories=${products
            .map((p) => p.category)
            .join(',')}&ids=${products.map((p) => p.id).join(',')}`
        )

        if (!res.ok) {
          throw new Error('Failed to fetch browsing history')
        }

        const data = await res.json()

        setdata(data)
      } catch (error) {
        console.error('Error fetching browsing history:', error)
      }
    }

    fetchProducts()
  }, [products, type])
  return (
    data.length !== 0 && (
      <ProductSlider title={title} products={data} hideDetails={hideDetails} />
    )
  )
}

const BrowsingHistory = ({ className }: Props) => {
  const { products } = useBrowsingHistory()
  return (
    products.length !== 0 && (
      <div className=' bg-background'>
        <Separator className={cn('mb-4', className)} />
        <ProductList
          title={"Related to items that you've viewed"}
          type='related'
        />

        <Separator className='mb-4' />
        <ProductList
          title={'Your browsing history'}
          type='history'
          hideDetails
        />
      </div>
    )
  )
}

export default BrowsingHistory
