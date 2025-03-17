import React from 'react'
import { Metadata } from 'next'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import Signupform from './signup-form'

export const metadata: Metadata = {
  title: 'Sign Un',
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
          <CardTitle className='text-2xl'>Create a account</CardTitle>
        </CardHeader>
        <CardContent>
          <Signupform />
        </CardContent>
      </Card>
    </div>
  )
}

export default page
