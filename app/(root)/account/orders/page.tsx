import { getOrders } from '@/lib/actions/order.action'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDateTime, formatId } from '@/lib/utils'
import ProductPrice from '@/components/shared/product/product-price'
import Pagination from '@/components/shared/pagination'
import BrowsingHistory from '@/components/shared/BrowsingHistory'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Your orders',
}

type Props = {
  searchParams: Promise<{ page: string }>
}

const page = async ({ searchParams }: Props) => {
  const searchparams = await searchParams
  const page = Number(searchparams.page) || 1
  const orders = await getOrders({ page })
  return (
    <>
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>
        <span className=''>{'>'}</span>
        <span className=''>Your order</span>
      </div>
      <h1 className='h1-bold pt-4'>Your Orders</h1>
      <div className='overflox-x-auto'></div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead> Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Delivered</TableHead>

            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className='text-center'>
                No orders found
              </TableCell>
            </TableRow>
          )}

          {orders.data.map((order) => (
            <TableRow key={order._id}>
              <TableCell className='font-medium'>
                <Link href={`/account/orders/${order._id}`}>
                  {formatId(order._id)}
                </Link>
              </TableCell>
              <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
              <TableCell>
                <ProductPrice price={order.totalPrice} plain />
              </TableCell>
              <TableCell> {order.isPaid ? 'yes' : 'no'}</TableCell>
              <TableCell>
                {order.isPaid && order.deliveredAt
                  ? formatDateTime(order.deliveredAt).dateTime
                  : 'no'}
              </TableCell>

              <TableCell className='font-medium'>
                <Link href={`/account/orders/${order._id}`}>
                  <span className=''>Details</span>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {orders.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={orders.totalPages}
          urlParamName='page'
        />
      )}
      <BrowsingHistory className='mt-16' />
    </>
  )
}

export default page
