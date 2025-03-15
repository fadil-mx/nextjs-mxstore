import React from 'react'
import SignIn from './credentials-sighin-form'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SeparatorWithOr from '@/components/shared/separator-or'
import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Sign In',
}

type Props = {
  searchParams: Promise<{ callbackUrl: string }>
}

const page = async ({ searchParams }: Props) => {
  const searchparams = await searchParams
  const { callbackUrl = '/' } = searchparams
  const session = await auth()
  if (session) {
    return redirect(callbackUrl)
  }
  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <SignIn />
        </CardContent>
      </Card>
      <SeparatorWithOr> New to {APP_NAME}?</SeparatorWithOr>
      <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)} `}>
        <Button className=' w-full' variant='outline'>
          Create your {APP_NAME} account
        </Button>
      </Link>
    </div>
  )
}

export default page
