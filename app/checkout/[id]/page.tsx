import Paymentform from './payment-form'
import { getOrderById } from '@/lib/actions/order.action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Payment',
}

type Props = {
  params: { id: string }
}

const page = async ({ params }: Props) => {
  const { id } = await params
  const order = await getOrderById(id)
  if (!order) {
    notFound()
  }
  const session = await auth()
  return (
    <div>
      <Paymentform
        order={order}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        isAdmin={session?.user?.role === 'admin' || false}
      />
    </div>
  )
}

export default page
