import React from 'react'
import Rating from './rating'
import { Progress } from '@/components/ui/progress'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { Separator } from '@radix-ui/react-select'
import Link from 'next/link'

type Props = {
  asPopover?: boolean
  avgRating: number
  numreviews: number
  ratingDistribution: {
    rating: number
    count: number
  }[]
}

const RatingSummary = ({
  asPopover,
  avgRating,
  numreviews,
  ratingDistribution,
}: Props) => {
  const Ratingdistribution = () => {
    const ratingPercentageDistribution = ratingDistribution.map((rating) => ({
      ...rating,
      percentage: Math.round((rating.count / numreviews) * 100),
    }))
    return (
      <>
        <div className=' flex   flex-wrap items-center gap-2 cursor-help'>
          <Rating rating={avgRating} />
          <span className=''>{avgRating.toFixed(1)} out of 5</span>
        </div>
        <div className='text-lg'>{numreviews} ratings</div>
        <div className='space-y-3'>
          {ratingPercentageDistribution
            .sort((a, b) => b.rating - a.rating)
            .map(({ rating, percentage }) => (
              <div className='flex  items-center gap-2 ' key={rating}>
                <div className=' text-sm'>{rating} star</div>
                <Progress className=' flex-1' value={percentage} />
                <div className='text-sm '>{percentage}%</div>
              </div>
            ))}
        </div>
      </>
    )
  }
  return asPopover ? (
    <div className='flex items-center gap-1'>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant='ghost' className='px-2 text-base [&_svg]:size-6'>
            <span className=''>{avgRating.toFixed(1)}</span>
            <Rating rating={avgRating} />
            <ChevronDown className='w-5 h-5 text-muted-foreground' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='  w-auto p-4' align='end'>
          <div className='flex flex-col gap-2'>
            <Ratingdistribution />
            <Separator />
            <Link className='highlight-link text-center' href='#reviews'>
              See customer reviews
            </Link>
          </div>
        </PopoverContent>
      </Popover>
      <div className=''>
        <Link className='highlite-link' href='#reviews'>
          {numreviews} ratings
        </Link>
      </div>
    </div>
  ) : (
    <Ratingdistribution />
  )
}

export default RatingSummary
