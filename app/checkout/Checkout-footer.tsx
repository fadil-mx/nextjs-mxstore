import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'
import React from 'react'

const Checkoutfooter = () => {
  return (
    <div className='border-t-2 py-4 my-4 space-y-2 highlight-link  '>
      <p className=''>
        Need help? Check our
        <Link href='/page/help'> Help Center</Link>
        {''} or <Link href='/page/contact-us'>Contact Us</Link>
      </p>
      <p className=''>
        For an item ordered from {APP_NAME}: When you click the &apos;Place Your
        Order&apos; button, we will send you an e-mail acknowledging receipt of
        your order. Your contract to purchase an item will not be complete until
        we send you an e-mail notifying you that the item has been shipped to
        you. By placing your order, you agree to {APP_NAME}{' '}
        <Link href='/page/privacy-policy'>privacy notice</Link> and{' '}
        <Link href='/page/conditions-of-use'>conditions of use.</Link>
      </p>
      <p className=''>
        Within 30 days of delivery, you may return new, unopened merchandise in
        its original condition. Exceptions and restrictions apply. See{' '}
        {APP_NAME} <Link href='/page/returns-policy'> Returns Policy.</Link>
      </p>
    </div>
  )
}

export default Checkoutfooter
