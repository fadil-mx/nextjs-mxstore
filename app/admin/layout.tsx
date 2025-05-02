import Image from 'next/image'
import Link from 'next/link'
import Adminnav from './admin-nav'
import Menu from '@/components/shared/header/menu'
import { Toaster } from '@/components/ui/sonner'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className='flex flex-col'>
        <div className='bg-black text-white'>
          <div className='flex h-16 items-center justify-between px-2'>
            <div className=' flex items-center'>
              <Link href='/' className=''>
                <Image src='/icons/logo.svg' alt='img' width={88} height={88} />
              </Link>
              <Adminnav className='mx-6 hidden md:flex' />
            </div>
            <div className=' mx-6 flex items-center  space-x-4'>
              <Menu forAdmin />
            </div>
          </div>
          <div className=''>
            <Adminnav className='px-4 pb-2 flex md:hidden' />
          </div>
        </div>
        <div className='flex-1 p-4'>{children}</div>
        <Toaster />
      </div>
    </div>
  )
}
