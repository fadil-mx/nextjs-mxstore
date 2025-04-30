import React from 'react'
import OverViewReport from './OverViewReport'
import { Metadata } from 'next'
import { auth } from '@/auth'

export const metadata: Metadata = {
  title: 'Overview',
  description: 'Admin overview page',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

const page = async () => {
  const sessiion = await auth()
  if (sessiion?.user.role !== 'Admin') {
    throw new Error('Admin permission required')
  }
  return (
    <div>
      <OverViewReport />
    </div>
  )
}

export default page
