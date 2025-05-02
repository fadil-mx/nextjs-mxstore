import { formatId } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import Userform from './userform'

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const Params = await params
  const { id } = Params
  return (
    <div className='max-w-5xl mx-auto higlight-link space-y-4'>
      <div className='flex gap-2'>
        <Link href='/admin/users'>User</Link>
        <span>{'>'}</span>

        <span> {formatId(id)}</span>
      </div>
      <Userform id={id} />
    </div>
  )
}

export default page
