import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import CheckoutForm from './checkoutForm'

export const metadata: Metadata = {
  title: 'Checkout',
}

const Page = async () => {
  const session = await auth()
  if (!session?.user) {
    redirect('/sign-in?callbackurl=/checkout')
  }
  return (
    <div>
      <CheckoutForm />
    </div>
  )
}

export default Page
