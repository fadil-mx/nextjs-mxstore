import { ShoppingCartIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'

import React from 'react'

const Menu = () => {
  return (
    <div className='flex justify-end'>
      <nav className='flex gap-3 w-full items-center'>
        <Link href='/signup' className='header-button'>
          <UserIcon className=' h-6 w-6' />
          <span className='font-medium'>Sign in</span>
        </Link>

        <Link href='/cart' className='header-button'>
          <ShoppingCartIcon className='h-6 w-6' />
          <span className='font-medium'>Cart</span>
        </Link>
      </nav>
    </div>
  )
}

export default Menu
