import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Search from './Search'
import Menu from './menu'

import data from '@/lib/data'
import Sidebar from './sidebar'
import { getAllCategories } from '@/lib/actions/product.action'

const Header = async () => {
  const categorie = await getAllCategories()
  return (
    <header className='bg-black text-white '>
      <div className='px-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center '>
            <Link href='/ '>
              <Image
                src='/icons/logo.svg'
                alt='Logo'
                width={140}
                height={100}
              />
            </Link>
          </div>
          <div className='hidden md:block flex-1 max-w-xl'>
            <Search />
          </div>
          <Menu />
        </div>
        <div className='md:hidden block py-2'>
          <Search />
        </div>
      </div>
      <div className='flex items-center px-3 mb-1 bg-gray-800 min-h-10 '>
        {/* <Button
          variant='ghost'
          className=' dark  header-button flex flex-wrap gap-3 overflow-hidden max-h-[142px]'
        >
          <MenuIcon />
          ALL
        </Button> */}
        <Sidebar categories={categorie} />
        <div className='ml-5 flex items-center  gap-4 flex-wrap  max-h-[142px]'>
          {data.headerMenus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className='flex items-center '
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
