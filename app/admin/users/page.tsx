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
import { allUsers, deleteUserById } from '@/lib/actions/user.action'
import { cn, formatId } from '@/lib/utils'
import { IUser } from '@/lib/db/models/user.model'
import Pagination from '@/components/shared/pagination'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import Deleteuser from '@/components/shared/Delete-user'

export const metadata: Metadata = {
  title: 'Users',
  description: 'Users page',
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page: string
  }>
}) => {
  const searchparams = await searchParams
  const page = Number(searchparams.page) || 1
  const user = await allUsers({ page })
  // console.log(user)

  return (
    <div>
      <div className='space-y-4'>
        <h1 className='h1-bold'>Users</h1>
        <div className=''>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.data.map((value: IUser) => (
                <TableRow key={value._id}>
                  <TableCell>
                    <Link
                      href={`/admin/users/${value._id}`}
                      className='text-blue-500 hover:underline'
                    >
                      {formatId(value._id)}
                    </Link>
                  </TableCell>
                  <TableCell>{value.name}</TableCell>

                  <TableCell>{value.email}</TableCell>
                  <TableCell>{value.role}</TableCell>
                  <TableCell className=' flex gap-2'>
                    <Link
                      className={cn(buttonVariants({ variant: 'secondary' }))}
                      href={`admin/users/${value._id}`}
                    >
                      Details
                    </Link>
                    <Deleteuser
                      id={value._id}
                      deleteAction={deleteUserById}
                      textname='user account'
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {user.total && user.total > 1 && (
            <Pagination
              page={page}
              totalPages={user.total}
              urlParamName='page'
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default page
