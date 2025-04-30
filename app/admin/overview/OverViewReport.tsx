'use client'
import { Skeleton } from '@/components/ui/skeleton'
import { getOrderSummery } from '@/lib/actions/order.action'
import { calculatePastDate, formatDateTime, formatNumber } from '@/lib/utils'
import React, { useEffect, useState, useTransition } from 'react'
import DateRange from './date-range-picker'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Barcode, CreditCard, LucideDollarSign, User2Icon } from 'lucide-react'
import ProductPrice from '@/components/shared/product/product-price'
import Link from 'next/link'
import SalesAreaChart from './SalesChart'
import Tablechart from './table-chart'
import SalesCategoryPieChart from './SalesPieChart'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const OverViewReport = () => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: calculatePastDate(30),
    to: new Date(),
  })
  interface OrderSummary {
    totalSales: number
    orderCount: number
    userCount: number
    productCount: number
    LatestOrders: {
      _id?: string
      user?: { name: string } | null
      createdAt?: string
      totalPrice?: number
    }[]
    salesChartDate: { date: string; totalSales: number }[]
  }

  const [data, setData] = useState<OrderSummary | undefined>()
  const [ispending, startTransition] = useTransition()
  useEffect(() => {
    if (date) {
      startTransition(async () => {
        setData(await getOrderSummery(date))
      })
    }
  }, [date])

  useEffect(() => {
    if (data) {
      console.log('Updated data:', data)
    }
  }, [data])

  if (!data) {
    return (
      <div className='space-y-4'>
        <div className=''>
          <h1 className=' h1-bold'>DashBoard</h1>
        </div>
        <div className='flex gap-4'>
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} className='h-36 w-full' />
          ))}
        </div>
        <div className=''>
          <Skeleton className='h-[30rem] w-full' />
        </div>
        <div className='flex gap-4'>
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className='h-60 w-full' />
          ))}
        </div>
        <div className='flex gap-4'>
          {[...Array(2)].map((_, index) => (
            <Skeleton key={index} className='h-60 w-full' />
          ))}
        </div>
      </div>
    )
  }
  return (
    <div className=''>
      <div className='flex items-center justify-between mb-2 px-5'>
        <h1 className='h1-bold'>Dashboard</h1>
        <DateRange defultDate={date} setDate={setDate} />
      </div>
      <div className='space-y-4'>
        <div className='grid gap-4 grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Revenue
              </CardTitle>
              <LucideDollarSign className=' text-primary' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>
                <ProductPrice price={data.totalSales} plain />
              </div>
              <div className=''>
                <Link href='/admin/orders' className='text-sm'>
                  View revenue
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Sales</CardTitle>
              <CreditCard className=' text-primary' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>
                {formatNumber(data.orderCount)}
              </div>
              <div className=''>
                <Link href='/admin/orders' className='text-sm'>
                  View Orders
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Customers</CardTitle>
              <User2Icon className=' text-primary' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>
                {formatNumber(data.userCount)}
              </div>
              <div className=''>
                <Link href='/admin/users' className='text-sm'>
                  View Customers
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Products</CardTitle>
              <Barcode className=' text-primary' />
            </CardHeader>
            <CardContent className='space-y-2'>
              <div className='text-2xl font-bold'>{data.productCount}</div>
              <div className=''>
                <Link href='/admin/products' className='text-sm'>
                  Products
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesAreaChart data={data.salesChartDate} />
            </CardContent>
          </Card>
        </div>
        <div className='grid gap-4 grid-cols-2 '>
          <Card>
            <CardHeader>
              <CardTitle>How much you&apos;re earning</CardTitle>
              <CardDescription>Estimated last: 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <Tablechart data={data.monthlySales} labelType='month' />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Product performance</CardTitle>
              <CardDescription>
                {formatDateTime(date!.from!).dateOnly} to{''}{' '}
                {formatDateTime(date!.to!).dateOnly}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tablechart data={data.topSalesProducts} labelType='product' />
            </CardContent>
          </Card>
        </div>
        <div className='grid gap-4 grid-cols-2 '>
          <Card>
            <CardHeader>
              <CardTitle>Best-Selling Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <SalesCategoryPieChart data={data.topSalesCategory} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.LatestOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                        {order.user ? order.user.name : 'Deleted User'}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(order.createdAt).dateOnly}
                      </TableCell>

                      <TableCell>
                        <ProductPrice price={order.totalPrice} plain />
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className='text-primary text-sm'
                        >
                          View Order
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default OverViewReport
