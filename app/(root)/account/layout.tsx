import { Toaster } from '@/components/ui/sonner'
export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex-1 p-4'>
      <main className='max-w-5xl mx-auto higlight-link space-y-4'>
        {children}
      </main>
      <Toaster />
    </div>
  )
}
