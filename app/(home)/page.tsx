import BrowsingHistory from '@/components/shared/BrowsingHistory'
import Carouselhome from '@/components/shared/home/Carousel'
import Homecard from '@/components/shared/home/Homecard'
import ProductSlider from '@/components/shared/product/productSlider'
import { Card, CardContent } from '@/components/ui/card'
import { getCarousels } from '@/lib/actions/carousel.action'
import {
  getAllCategories,
  getProductByTag,
  getProductsForCard,
} from '@/lib/actions/product.action'
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
  const c = await getCarousels()
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
  const bestSelling = await getProductByTag({ tag: 'best-seller', limit: 10 })
  // console.log(todayDeal)
  return (
    <div className=''>
      <Carouselhome items={c.data} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <Homecard cards={cards} />

        {/* todays deal section */}
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider products={todayDeal} title='Today Deals' />
            {/* <Productcard product={todayDeal[0]} hideborder /> */}
          </CardContent>
        </Card>

        {/* best selling products */}
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider
              products={bestSelling}
              title='Best Selling Product'
              hideDetails
            />
          </CardContent>
        </Card>
      </div>
      <div className=''>
        <BrowsingHistory />
      </div>
    </div>
  )
}
