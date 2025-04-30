// import { UserIcon } from 'lucide-react'
// import Link from 'next/link'

import React from 'react'
import CartButton from './CartButton'
import Userbutton from './User-button'

const Menu = ({ forAdmin = false }: { forAdmin?: boolean }) => {
  return (
    <div className='flex justify-end py-3'>
      <nav className='flex gap-3 w-full items-center'>
        {/* <Link href='/signup' className='header-button'>
          <UserIcon className=' h-6 w-6' />
          <span className='font-medium'>Sign in</span>
        </Link> */}
        <Userbutton />
        {forAdmin ? null : <CartButton />}
      </nav>
    </div>
  )
}

export default Menu
