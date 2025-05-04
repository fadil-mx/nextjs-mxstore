import Link from 'next/link'
import { Metadata } from 'next'
import Carouselform from '../carouselform'

export const metadata: Metadata = {
  title: 'Admin-Create-Product',
}

const CreateProductPage = () => {
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/carousels'>Products</Link>
        <span className='mx-1'>›</span>
        <p> Create </p>
      </div>

      <div className='my-8'>
        <Carouselform type='create' />
      </div>
    </main>
  )
}

export default CreateProductPage
