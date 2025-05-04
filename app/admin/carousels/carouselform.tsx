'use client'
import { Icarousel } from '@/lib/db/models/carouselmodel'
import { Carousel } from '@/types'
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { carouselsSchema } from '@/lib/validator'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { UploadButton } from '@/lib/uploadthing'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import Image from 'next/image'
import { formatError } from '@/lib/utils'
import { Ccreate, updateCarousel } from '@/lib/actions/carousel.action'

type Props = {
  type: 'create' | 'update'
  carousel?: Icarousel
  carouselId?: string
}

const defaultValues: Carousel =
  process.env.NODE_ENV === 'development'
    ? {
        title: 'example',
        buttonCaption: 'example',
        image: '/images/banner1.jpg',
        url: '/search?category=T-Shirts',
        isPublished: true,
      }
    : {
        title: '',
        buttonCaption: '',
        image: '',
        url: '',
        isPublished: false,
      }

const Carouselform = ({ carouselId, type, carousel }: Props) => {
  const router = useRouter()
  const form = useForm<Carousel>({
    resolver: zodResolver(carouselsSchema),
    defaultValues: type === 'update' ? carousel : defaultValues,
  })

  const onSubmit = async (values: Carousel) => {
    console.log(values)
    if (type === 'create') {
      try {
        const res = await Ccreate(values)
        if (!res.success) {
          toast.error(res.message)
        }
        toast.success(res.message)
        router.push('/admin/carousels')
      } catch (error) {
        toast.error(formatError(error))
      }
    } else if (type === 'update') {
      try {
        const res = await updateCarousel(carouselId, values)
        if (!res.success) {
          toast.error(res.message)
        }
        toast.success(res.message)
        router.push('/admin/carousels')
      } catch (error) {
        toast.error(formatError(error))
      }
    }
  }
  const image = form.watch('image')
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <h1 className='h1-bold mt-4'>Carousel Details</h1>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='buttonCaption'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Button Caption</FormLabel>
                  <FormControl>
                    <Input placeholder='buttonCaption' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='url'
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder='url' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='image'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Image</FormLabel>
                <div className='flex flex-col md:flex-row items-start gap-4'>
                  {image && (
                    <Image
                      src={image}
                      alt='carousel image'
                      className='w-32 h-20 object-cover rounded'
                      width={128}
                      height={80}
                    />
                  )}
                  <FormControl>
                    <UploadButton
                      endpoint='imageUploader'
                      onClientUploadComplete={(res: { url: string }[]) => {
                        if (res && res[0]?.url) {
                          form.setValue('image', res[0].url)
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`Image Upload Error: ${error.message}`)
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

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

export default Carouselform
