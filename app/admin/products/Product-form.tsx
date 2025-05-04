'use client'
import { IProduct } from '@/lib/db/models/productmodel'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { IProductInput } from '@/types'
import { productInputSchema } from '@/lib/validator'
import { UploadButton } from '@/lib/uploadthing'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { createProduct, updateProduct } from '@/lib/actions/product.action'
import { formatError } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
  type: 'create' | 'update'
  product?: IProduct
  productId?: string
}

const productDefaultValues: IProductInput =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'Sample Product',
        slug: 'sample-product',
        category: 'Shoes',
        images: ['/images/p11-1.jpg'],
        brand: 'Sample Brand',
        description: 'This is a sample description of the product.',
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: '',
        slug: '',
        category: '',
        images: [],
        brand: '',
        description: '',
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }

const Productform = ({ type, product, productId }: Props) => {
  const router = useRouter()

  const form = useForm<IProductInput>({
    resolver: zodResolver(productInputSchema),
    defaultValues: type === 'update' ? product : productDefaultValues,
  })

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control: form.control,
    name: 'sizes',
  })
  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({
    control: form.control,
    name: 'colors',
  })
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: 'tags',
  })

  const onSubmit = async (values: IProductInput) => {
    if (type === 'update') {
      try {
        const res = await updateProduct(productId, values)
        if (!res.success) {
          toast.error(res.message)
        }
        toast.success(res.message)
        router.push('/admin/products')
      } catch (error) {
        toast.error(formatError(error))
      }
    } else if (type === 'create') {
      try {
        const res = await createProduct(values)
        if (!res.success) {
          toast.error(res.message)
        }
        toast.success(res.message)
        router.push('/admin/products')
      } catch (error) {
        toast.error(formatError(error))
      }
    }
  }
  const images = form.watch('images')

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <h1 className='h1-bold mt-4'>Product Details</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='slug'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>slug</FormLabel>
                  <FormControl>
                    <Input placeholder='Slug' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className=''>
                          <SelectValue>{field.value}</SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Jeans'>admin</SelectItem>
                        <SelectItem value='Shoes'>Shoes</SelectItem>
                        <SelectItem value='T-Shirts'>T-Shirts</SelectItem>
                        <SelectItem value='Wrist Watches'>
                          Wrist Watches
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='brand'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input placeholder='Brand' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <FormField
              control={form.control}
              name='listPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>List Price</FormLabel>
                  <FormControl>
                    <Input placeholder='listPrice' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder='Price' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='countInStock'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>count In Stock</FormLabel>
                  <FormControl>
                    <Input placeholder='countInStock' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className='flex flex-col gap-5 md:flex-row'>
            <FormField
              control={form.control}
              name='images'
              render={() => (
                <FormItem className='w-full'>
                  <FormLabel>Images</FormLabel>
                  <Card>
                    <CardContent className='space-y-2 mt-2 min-h-48'>
                      <div className='flex justify-start items-center space-x-2'>
                        {images.map((image: string) => (
                          <Image
                            key={image}
                            src={image}
                            alt='product image'
                            className='w-20 h-20 object-cover object-center rounded-sm'
                            width={100}
                            height={100}
                          />
                        ))}
                        <FormControl>
                          <UploadButton
                            endpoint='imageUploader'
                            onClientUploadComplete={(
                              res: { url: string }[]
                            ) => {
                              form.setValue('images', [...images, res[0].url])
                            }}
                            onUploadError={(error: Error) => {
                              toast.error(`ERROR! ${error.message}`)
                            }}
                          />
                        </FormControl>
                      </div>
                    </CardContent>
                  </Card>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>description</FormLabel>
                <FormControl>
                  <Input placeholder='description' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* arrayitems */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='space-x-2 '>
              <FormLabel>Sizes</FormLabel>
              {sizeFields.map((item, index) => (
                <div key={item.id} className='flex gap-2 items-center mb-2'>
                  <Input {...form.register(`sizes.${index}`)} />
                  <Button type='button' onClick={() => removeSize(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type='button' onClick={() => appendSize('')}>
                Add Size
              </Button>
            </div>

            <div className='space-x-4'>
              <FormLabel>tags</FormLabel>
              {tagFields.map((item, index) => (
                <div key={item.id} className='flex gap-2 items-center mb-2'>
                  <Input {...form.register(`tags.${index}`)} />
                  <Button type='button' onClick={() => removeTag(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type='button' onClick={() => appendTag('')}>
                Add Tags
              </Button>
            </div>
            <div className='space-x-1'>
              <FormLabel>colors</FormLabel>
              {colorFields.map((item, index) => (
                <div key={item.id} className='flex gap-2 items-center mb-2'>
                  <Input {...form.register(`colors.${index}`)} />
                  <Button type='button' onClick={() => removeColor(index)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type='button' onClick={() => appendColor('')}>
                Add Color
              </Button>
            </div>
          </div>
          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className=' space-x-2'>
                <FormLabel className=''> Published</FormLabel>
                <FormControl>
                  <Checkbox
                    id='terms'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  )
}

export default Productform
