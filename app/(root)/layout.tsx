import Footer from '@/components/shared/Footer'
import Header from '@/components/shared/header'
import { Toaster } from '@/components/ui/sonner'
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <main className=' flex-1 flex flex-col p-4'>{children}</main>
      <Toaster />
      <Footer />
    </div>
  )
}
