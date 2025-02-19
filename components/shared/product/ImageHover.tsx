'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import React, { useState, useRef } from 'react'

type Props = {
  src: string
  hoverSrc: string
  alt: string
}

const ImageHover = ({ src, alt, hoverSrc }: Props) => {
  const [isHoverd, setisHoverd] = useState(false)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setisHoverd(true)
    }, 1000)
  }

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
    }
    setisHoverd(false)
  }
  return (
    <div
      className=' relative h-52'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Image
        src={src}
        alt={alt}
        objectFit='contain'
        fill
        className={cn(
          'object-contain transition-opacity duration-500',
          isHoverd ? 'opacity-0' : 'opacity-100'
        )}
      />
      <Image
        src={hoverSrc}
        alt={alt}
        objectFit='contain'
        fill
        className={cn(
          'object-contain absolute inset-0 transition-opacity duration-500',
          isHoverd ? 'opacity-100' : 'opacity-0'
        )}
      />
    </div>
  )
}

export default ImageHover
