import { auth } from '@/auth'
import { Metadata } from 'next'
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

const page = async () => {
  const session = await auth()

  return (
    <div className='mb-4'>
      <SessionProvider session={session}>
        <div className=' flex gap-2'>
          <Link href='/account'>Your Account</Link>
          <span className=''> {'>'}</span>
          <span>Login & Security</span>
        </div>
        <h1 className='h1-bold py-4'>{PAGE_TITLE}</h1>
        <Card className='max-w-2xl'>
          <CardContent>
            <div className=' p-2 flex items-center justify-between flex-wrap'>
              <div className=''>
                <h3 className='font-bold'>Name</h3>
                <p>{session?.user.name}</p>
              </div>
              <Link
                href='/account/manage/name'
                className={cn(
                  buttonVariants({ variant: 'outline' }),
                  'rounded-full w-32'
                )}
              >
                Edit
              </Link>
            </div>
          </CardContent>
          <Separator />
          <CardContent>
            <div className=' p-2 flex items-center justify-between flex-wrap'>
              <div className=''>
                <h3 className='font-bold'>Email</h3>
                <p>{session?.user.email}</p>
                <p className=''>will be implemented in the next version</p>
              </div>
              <Link href='#'>
                <Button
                  disabled
                  variant='outline'
                  className='rounded-full w-32'
                >
                  {' '}
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
          <Separator />
          <CardContent>
            <div className=' p-2 flex items-center justify-between flex-wrap'>
              <div className=''>
                <h3 className='font-bold'>Password</h3>
                <p>**********</p>
                <p className=''>will be implemented in the next version</p>
              </div>
              <Link href='#'>
                <Button
                  disabled
                  variant='outline'
                  className='rounded-full w-32'
                >
                  {' '}
                  Edit
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </SessionProvider>
    </div>
  )
}

export default page
