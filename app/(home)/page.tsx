import Carouselhome from '@/components/home/Carousel'
import data from '@/lib/data'

export default function Home() {
  // console.log(data.carousels)
  return (
    <div className=''>
      <Carouselhome items={data.carousels} />
    </div>
  )
}
