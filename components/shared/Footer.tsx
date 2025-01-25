'use client'
import React from 'react'
import { Button } from '../ui/button'
import { ChevronUp } from 'lucide-react'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'

const Footer = () => {
  return (
    <footer className='bg-black text-white underline-link'>
      <div className=' w-full'>
        <Button
          variant='ghost'
          className=' bg-gray-800 w-full rounded-none
        
        '
          onClick={() => {
            Window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <ChevronUp className='mr-2' />
          Back To Top
        </Button>
      </div>
      <div className='p-4'>
        <div className=' flex justify-center gap-4 text-sm'>
          <Link href='/page/Conditions-Of-Use'>Conditions Of Use</Link>
          <Link href='/page/Privacy-Notice'>Privacy Notice</Link>
          <Link href='/page/Help'>Help</Link>
        </div>
        <div className='flex justify-center text-sm '>
          <p> © 2000-2026, MAXSTORE.com, Inc. or its affiliates</p>
        </div>
        <div className='m-8 flex justify-center text-sm text-gray-400 font-lato'>
          123, Main Street, Anytown, CA, Zip 12345 | +1 (123) 456-7890
        </div>
      </div>
    </footer>
  )
}

export default Footer
