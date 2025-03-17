import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Checkout',
}

const Page = async () => {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackurl=/checkout')
  }
  return <div>page</div>
}

export default Page
