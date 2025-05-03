import Link from 'next/link'
import { Metadata } from 'next'
import Productform from '../Product-form'

export const metadata: Metadata = {
  title: 'Admin-Create-Product',
}

const CreateProductPage = () => {
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link>
        <span className='mx-1'>›</span>
        <Link href='/admin/products/create'>Create</Link>
      </div>

      <div className='my-8'>
        <Productform type='create' />
      </div>
    </main>
  )
}

export default CreateProductPage
