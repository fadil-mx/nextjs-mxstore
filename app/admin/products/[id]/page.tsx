import Link from 'next/link'
import { Metadata } from 'next'
import Productform from '../Product-form'
import { getProductById } from '@/lib/actions/product.action'

export const metadata: Metadata = {
  title: 'Admin-Edit-Product',
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsId = await params
  const id = paramsId.id
  const productDetails = await getProductById(id)
  if (!productDetails) {
    return <div>Product not found</div>
  }
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link>
        <span className='mx-1'>›</span>
        <p className=''>{id}</p>
      </div>

      <div className='my-8'>
        <Productform
          type='update'
          product={productDetails.product}
          productId={id}
        />
      </div>
    </main>
  )
}

export default page
