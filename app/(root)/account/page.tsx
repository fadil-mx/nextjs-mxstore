import { auth } from '@/auth'
import { Metadata } from 'next'
import React from 'react'

const PAGE_TITLE = 'Login & Security'
export const metadata: Metadata = {
  title: PAGE_TITLE,
}

const page = async () => {
  const session = await auth()
  return <div></div>
}

export default page
