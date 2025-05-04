import Link from 'next/link'
import { Metadata } from 'next'
import Carouselform from '../carouselform'
import { getCarouselById } from '@/lib/actions/carousel.action'

export const metadata: Metadata = {
  title: 'Admin-Edit-Product',
}

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const paramsId = await params
  const id = paramsId.id
  const carouseDetails = await getCarouselById(id)
  if (!carouseDetails) {
    return <div>Product not found</div>
  }
  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/carousels'>Carousels</Link>
        <span className='mx-1'>›</span>
        <p className=''>{id}</p>
      </div>

      <div className='my-8'>
        <Carouselform
          type='update'
          carousel={carouseDetails.data}
          carouselId={id.toString()}
        />
      </div>
    </main>
  )
}

export default page
