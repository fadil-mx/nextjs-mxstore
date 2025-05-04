import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Metadata } from 'next'
import { DeleteCarousel, getCarousels } from '@/lib/actions/carousel.action'
import { Icarousel } from '@/lib/db/models/carouselmodel'
import Link from 'next/link'
import { cn, formatId } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import Deleteuser from '@/components/shared/Delete-user'

export const metadata: Metadata = {
  title: 'Carousels-Admin',
  description: 'Carousels',
}

const page = async () => {
  const carousels = await getCarousels()
  // console.log(carousels)
  return (
    <div>
      <div className='space-y-4'>
        <div className=' flex items-center justify-between'>
          <h1 className='h1-bold'>Users</h1>
          <Link
            className={cn(buttonVariants())}
            href={`/admin/carousels/create`}
          >
            Create Carousel
          </Link>
        </div>
        <div className=''>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Url</TableHead>
                <TableHead>isPublished</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carousels.data?.map((value: Icarousel) => (
                <TableRow key={value._id}>
                  <TableCell>
                    <Link
                      href={`/admin/carousels/${value._id}`}
                      className='text-blue-500 hover:underline'
                    >
                      {formatId(value._id)}
                    </Link>
                  </TableCell>
                  <TableCell>{value.title}</TableCell>

                  <TableCell>{value.url}</TableCell>
                  <TableCell>
                    {value.isPublished ? (
                      <span className='text-green-600'>yes</span>
                    ) : (
                      <span className='text-red-600'>no</span>
                    )}
                  </TableCell>
                  <TableCell className=' flex gap-2'>
                    <Link
                      className={cn(buttonVariants({ variant: 'secondary' }))}
                      href={`/admin/carousels/${value._id}`}
                    >
                      Edit
                    </Link>
                    <Deleteuser
                      id={value._id}
                      deleteAction={DeleteCarousel}
                      textname='this carousel'
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export default page
