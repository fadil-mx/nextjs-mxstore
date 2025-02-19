import Carouselhome from '@/components/shared/home/Carousel'
import Homecard from '@/components/shared/home/Homecard'
import Product from '@/components/shared/product/product-price'
import Productcard from '@/components/shared/product/Productcard'
import ProductSlider from '@/components/shared/product/productSlider'
import { Card, CardContent } from '@/components/ui/card'
import {
  getAllCategories,
  getProductByTag,
  getProductsForCard,
} from '@/lib/actions/product.action'
import data, { products } from '@/lib/data'
import { toSlug } from '@/lib/utils'

export default async function Home() {
  const categories = (await getAllCategories()).slice(0, 4)
  // console.log(categories)
  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
    limit: 4,
  })
  // console.log(newArrivals)
  const featureds = await getProductsForCard({ tag: 'featured', limit: 4 })
  // console.log(featureds)
  const bestseller = await getProductsForCard({ tag: 'best-seller', limit: 4 })
  // console.log(bestseller)
  const cards = [
    {
      title: 'Categories To Explore',
      link: {
        text: 'see more',
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category,
        image: `/images/${toSlug(category)}.jpg`,
        href: `/search?category=${category}`,
      })),
    },
    {
      title: 'Explore New Arrivals',
      items: newArrivals,
      link: {
        text: 'View All',
        href: '/search?tag=new-arrivals',
      },
    },
    {
      title: 'Discover Best Sellers',
      items: bestseller,
      link: {
        text: 'View All',
        href: '/search?tag=new-arrivals',
      },
    },
    {
      title: 'Featured Products',
      items: featureds,
      link: {
        text: 'Shop Now',
        href: '/search?tag=new-arrivals',
      },
    },
  ]

  const todayDeal = await getProductByTag({ tag: 'todays-deal', limit: 10 })
  console.log(todayDeal)

  return (
    <div className=''>
      <Carouselhome items={data.carousels} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <Homecard cards={cards} />
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider products={todayDeal} title='Today Deals' />
            {/* <Productcard product={todayDeal[0]} hideborder /> */}
          </CardContent>
        </Card>
      </div>
      {/* <Product
        price={49.99}
        listPrice={110}
        isDeal={true}
        className='text-lg text-gray-800'
      /> */}
    </div>
  )
}
