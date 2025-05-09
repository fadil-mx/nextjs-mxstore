import { auth } from '@/auth'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import { getOrderById } from '@/lib/actions/order.action'
import { formatId } from '@/lib/utils'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

export async function generateMetadata(props: {
  params: {
    id: string
  }
}) {
  const { id } = await props.params
  return {
    title: `Order Details of  ${formatId(id)}`,
  }
}

type Props = { params: Promise<{ id: string }> }

const page = async ({ params }: Props) => {
  const Params = await params
  const { id } = Params
  const order = await getOrderById(id)
  if (!order) {
    return <div>Order Not Found</div>
  }
  const session = await auth()
  if (!session) {
    redirect('/login?callbackUrl=/account/orders')
  }

  return (
    <div>
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>
        <span>{'>'}</span>
        <Link href='/account/orders'>Your Orders</Link>
        <span>{'>'}</span>

        <span> Order {formatId(order._id)}</span>
      </div>
      <h1 className='h1-bold py-4'> Order {formatId(order._id)}</h1>
      <OrderDetailsForm order={order} isAdmin={true} />
    </div>
  )
}

export default page
