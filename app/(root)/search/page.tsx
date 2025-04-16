import CollapsibleOnMobile from '@/components/shared/collapsible-on-mobile'
import Pagination from '@/components/shared/pagination'
import Productsortselector from '@/components/shared/product/product-sort-selector'
import Productcard from '@/components/shared/product/Productcard'
import Rating from '@/components/shared/product/rating'
import { Button } from '@/components/ui/button'
import {
  getAllCategories,
  getAllProducts,
  getAllTags,
} from '@/lib/actions/product.action'
import { IProduct } from '@/lib/db/models/productmodel'
import { getFilterUrl, toSlug } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

const searchOrders = [
  { value: 'price-low-to-high', name: 'Price: Low to High' },
  { value: 'price-high-to-low', name: 'Price: High to Low' },
  { value: 'best-selling', name: 'Best Selling' },
  { value: 'avg-customer-review', name: 'Avg Customer Review' },
  { value: 'newest-arrivals', name: 'Newest arrivels' },
]

const prices = [
  { name: '$1 to $20', value: '1-20' },
  { name: '$21 to $50', value: '21-50' },
  { name: '$51 to $100', value: '51-100' },
]

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
    tag: string
  }>
}) {
  const searchparams = await searchParams
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    tag = 'all',
  } = searchparams
  if (
    (q !== 'all' && q !== '') ||
    category !== 'all' ||
    tag !== 'all' ||
    rating !== 'all' ||
    price !== 'all'
  ) {
    return {
      title: `Search ${q !== 'all' ? q : ''}
          ${category !== 'all' ? ` :Category ${category}` : ''}
          ${tag !== 'all' ? ` :Tag ${tag}` : ''}
          ${price !== 'all' ? ` :Price ${price}` : ''}
          ${rating !== 'all' ? ` :Rating ${rating}` : ''}`,
    }
  } else {
    return {
      title: 'Search Products',
    }
  }
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    q: string
    category: string
    price: string
    rating: string
    sort: string
    page: string
    tag: string
  }>
}) => {
  const searchparams = await searchParams
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'best-selling',
    page = '1',
    tag = 'all',
  } = searchparams
  const params = { q, category, tag, price, rating, sort, page }
  const categories = await getAllCategories()
  const tags = await getAllTags()
  const data = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  })

  return (
    <div className=''>
      <div className='my-2 bg-card md:border-b  flex-between flex-col md:flex-row '>
        <div className='flex items-center'>
          {data.totalProducts === 0
            ? 'No'
            : `${data.from}-${data.to}  of ${data.totalProducts}`}{' '}
          results
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all'
            ? ` for `
            : null}
          {q !== 'all' && q !== '' && '"' + q + '"'}
          {category !== 'all' && category !== '' && `  Category` + category}
          {tag !== 'all' && tag !== '' && `   Tag ` + tag}
          {price !== 'all' && `   Price: ` + price}
          {rating !== 'all' && `   Rating: ` + rating + ` & up`}
          &nbsp;
          {(q !== 'all' && q !== '') ||
          (category !== 'all' && category !== '') ||
          (tag !== 'all' && tag !== '') ||
          rating !== 'all' ||
          price !== 'all' ? (
            <Button variant={'link'} asChild>
              <Link href='/search'>Clear</Link>
            </Button>
          ) : null}
        </div>
        <div>
          <Productsortselector
            sortorder={searchOrders}
            sort={sort}
            params={params}
          />
        </div>
      </div>

      <div className='bg-card grid md:grid-cols-5 md:gap-4'>
        <CollapsibleOnMobile title='Filters'>
          <div className='space-y-4'>
            <div>
              <div className='font-bold'>Department</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === category || '' === category) && 'text-primary'
                    }`}
                    href={getFilterUrl({ category: 'all', params })}
                  >
                    All
                  </Link>
                </li>
                {categories.map((c: string) => (
                  <li key={c}>
                    <Link
                      className={`${c === category && 'text-primary'}`}
                      href={getFilterUrl({ category: c, params })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className='font-bold'>Price</div>
              <ul>
                <li>
                  <Link
                    className={`${'all' === price && 'text-primary'}`}
                    href={getFilterUrl({ price: 'all', params })}
                  >
                    All
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <Link
                      href={getFilterUrl({ price: p.value, params })}
                      className={`${p.value === price && 'text-primary'}`}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className='font-bold'>Customer Review</div>
              <ul>
                <li>
                  <Link
                    href={getFilterUrl({ rating: 'all', params })}
                    className={`${'all' === rating && 'text-primary'}`}
                  >
                    All
                  </Link>
                </li>

                <li>
                  <Link
                    href={getFilterUrl({ rating: '4', params })}
                    className={`${'4' === rating && 'text-primary'}`}
                  >
                    <div className='flex'>
                      <Rating size={4} rating={4} /> & Up
                    </div>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className='font-bold'>Tag</div>
              <ul>
                <li>
                  <Link
                    className={`${
                      ('all' === tag || '' === tag) && 'text-primary'
                    }`}
                    href={getFilterUrl({ tag: 'all', params })}
                  >
                    All
                  </Link>
                </li>
                {tags.map((t: string) => (
                  <li key={t}>
                    <Link
                      className={`${toSlug(t) === tag && 'text-primary'}`}
                      href={getFilterUrl({ tag: t, params })}
                    >
                      {t}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsibleOnMobile>

        <div className='md:col-span-4 space-y-4'>
          <div>
            <div className='font-bold text-xl'>Results</div>
            <div>Check each product page for other buying options</div>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2  lg:grid-cols-3  '>
            {data.products.length === 0 && <div>No product found</div>}
            {data.products.map((product: IProduct) => (
              <Productcard key={product._id} product={product} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={data.totalPages}
              urlParamName='page'
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default page
