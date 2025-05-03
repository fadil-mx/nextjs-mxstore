import { buttonVariants } from '@/components/ui/button'
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
import { deleteProduct, getAllProducts } from '@/lib/actions/product.action'
import { IProduct } from '@/lib/db/models/productmodel'
import Link from 'next/link'
import { cn, formatDateTime, formatId } from '@/lib/utils'
import ProductPrice from '@/components/shared/product/product-price'
import Pagination from '@/components/shared/pagination'
import Adminsearch from '@/components/shared/product/adimProduct/Adminsearch'
import Deleteuser from '@/components/shared/Delete-user'

export const metadata: Metadata = {
  title: 'Admin-Products',
  description: 'Products page',
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ page: string; q: string }>
}) => {
  const searchparams = await searchParams
  const page = Number(searchparams.page) || 1
  const query = searchparams.q || ''
  const products = await getAllProducts({ page, query })

  // console.log(products)
  // console.log(products.products.length)
  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <Link href='/admin/products'>
            <h2 className='h1-bold'>Products</h2>
          </Link>
          <Adminsearch />
        </div>
        <Link href='/admin/products/create' className={cn(buttonVariants())}>
          Create product
        </Link>
      </div>
      <div className=''>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>stock</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>LastUpdate</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.products.map((value: IProduct) => (
              <TableRow key={value._id}>
                <TableCell>
                  <Link
                    href={`/admin/products/${value._id}`}
                    className='text-blue-500 hover:underline'
                  >
                    {formatId(value._id)}
                  </Link>
                </TableCell>
                <TableCell>{value.name}</TableCell>
                <TableCell>
                  <ProductPrice price={value.price} plain />
                </TableCell>
                <TableCell>{value.category}</TableCell>
                <TableCell>
                  {value.countInStock > 0 ? (
                    <span className='text-green-500'>{value.countInStock}</span>
                  ) : (
                    <span className='text-red-500'>Out of stock</span>
                  )}
                </TableCell>
                <TableCell>
                  {value.avgRating > 0 ? (
                    <span className='text-green-500'>{value.avgRating}</span>
                  ) : (
                    <span className='text-red-500'>0</span>
                  )}
                </TableCell>
                <TableCell>
                  {value.isPublished ? (
                    <span className=''>yes</span>
                  ) : (
                    <span className='text-red-500'>Not published</span>
                  )}
                </TableCell>
                <TableCell className='text-xs'>
                  {formatDateTime(value.updatedAt).dateOnly}
                </TableCell>
                <TableCell className='flex gap-2'>
                  <Link
                    className={cn(buttonVariants({ variant: 'outline' }))}
                    href={`/admin/products/${value._id}`}
                  >
                    Edit
                  </Link>
                  <Deleteuser
                    id={value._id}
                    deleteAction={deleteProduct}
                    textname='the product'
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination
          page={page}
          totalPages={products.totalPages}
          urlParamName='page'
        />
      </div>
    </div>
  )
}

export default page
