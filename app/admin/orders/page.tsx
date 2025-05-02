import { Metadata } from 'next'
import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { deleteOrderById, getOrdersAdmin } from '@/lib/actions/order.action'
import { IOrder } from '@/lib/db/models/order.model'
import { cn, formatDateTime, formatId } from '@/lib/utils'
import ProductPrice from '@/components/shared/product/product-price'
import { buttonVariants } from '@/components/ui/button'
import Deleteuser from '@/components/shared/Delete-user'
import Pagination from '@/components/shared/pagination'

export const metadata: Metadata = {
  title: 'Admin-order-page',
  description: 'Order  page',
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>
}) => {
  const searchparams = await searchParams
  const page = Number(searchparams.page) || 1
  const orders = await getOrdersAdmin({ page })
  //   console.log(orders)
  return (
    <div className='space-y-4'>
      <h1 className='h1-bold'>Order</h1>
      <div className=''>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((value: IOrder) => (
              <TableRow key={value._id}>
                <TableCell>
                  <Link
                    href={`/admin/orders/${value._id}`}
                    className='text-blue-500 hover:underline'
                  >
                    {formatId(value._id)}
                  </Link>
                </TableCell>
                <TableCell>
                  {formatDateTime(value.createdAt).dateTime}
                </TableCell>
                <TableCell>
                  {value.user?.name ? value.user?.name : 'Deleted user'}
                </TableCell>
                <TableCell>
                  <ProductPrice price={value.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {value.isPaid
                    ? formatDateTime(value.paidAt).dateOnly
                    : 'Not paid'}
                </TableCell>
                <TableCell>
                  {value.isDelivered
                    ? formatDateTime(value.deliveredAt).dateOnly
                    : 'Not delivered'}
                </TableCell>
                <TableCell className='flex gap-2'>
                  <Link
                    className={cn(buttonVariants({ variant: 'secondary' }))}
                    href={`/admin/orders/${value._id}`}
                  >
                    Details
                  </Link>
                  <Deleteuser
                    id={value._id}
                    deleteAction={deleteOrderById}
                    textname='order'
                  />
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
      </div>
    </div>
  )
}

export default page
