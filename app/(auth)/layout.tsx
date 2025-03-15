import { APP_COPYRIGHT } from '@/lib/constants'
import Image from 'next/image'
import Link from 'next/link'

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen items-center highlight-link '>
      <header className='mt-8'>
        <Link href='/ '>
          <Image
            src='/icons/logosignin.svg'
            alt='Logo'
            width={84}
            height={84}
            priority
            style={{
              height: 'auto',
              maxWidth: '100%',
            }}
          />
        </Link>
      </header>
      <main className=' mx-auto max-w-sm min-w-80 p-6'>{children}</main>
      <footer className=' mt-8 flex-1 flex flex-col gap-4 bg-gray-800 w-full p-8 items-center text-sm'>
        <div className=' flex justify-center space-x-4 '>
          <Link href='/page/conditions-of-use' className=''>
            Conditions of Use
          </Link>
          <Link href='/page/privacy-policy' className=''>
            Privacy Notice
          </Link>
          <Link href='/page/help' className=''>
            Help
          </Link>
        </div>
        <p className='text-gray-400'>{APP_COPYRIGHT}</p>
      </footer>
    </div>
  )
}
