'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

type Props = {
  image: string[]
}

const Productgallery = ({ image }: Props) => {
  const [selectedImage, setSelectedImage] = useState(0)
  return (
    <div className='flex gap-2'>
      <div className='flex flex-col gap-2 mt-8'>
        {image.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            onMouseOver={() => setSelectedImage(index)}
            className={cn(
              'bg-white rounded-lg overflow-hidden',
              selectedImage === index
                ? 'ring-2 ring-blue-500'
                : 'ring-1 ring-blue-300'
            )}
          >
            <Image
              src={image}
              alt='product'
              width={48}
              height={48}
              className='object-cover'
            />
          </button>
        ))}
      </div>
      <div className='w-full h-[500px] '>
        <Zoom>
          <div className='relative h-[500px]'>
            <Image
              src={image[selectedImage]}
              alt='product'
              fill
              sizes='98vw'
              className='object-contain'
              priority
            />
          </div>
        </Zoom>
      </div>
    </div>
  )
}

export default Productgallery
