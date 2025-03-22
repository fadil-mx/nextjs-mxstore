import { HelpCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Toaster } from 'sonner'
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='p-4'>
      <header className='bg-card mb-4 border-b'>
        <div className='max-w-6xl mx-auto flex justify-between items-center p-3 '>
          <Link href='/ '>
            <Image
              src='/icons/logosignin.svg'
              alt='Logo'
              width={104}
              height={104}
              priority
              style={{
                height: 'auto',
                maxWidth: '100%',
              }}
            />
          </Link>
          <h1 className='text-3xl'>Checkout</h1>
          <div>
            <Link href='/page/help'>
              <HelpCircle className='w-6 h-6' />
            </Link>
          </div>
        </div>
      </header>
      <Toaster />
      {children}
    </div>
  )
}
