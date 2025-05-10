'use client'
import { UserNameSchema } from '@/lib/validator'
import { IUserName } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const ProfileForm = () => {
  const router = useRouter()
  const { data: session, update } = useSession()
  const form = useForm<IUserName>({
    resolver: zodResolver(UserNameSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
    },
  })

  const onSubmit = async (values: IUserName) => {
    try {
      //   const res = await updateUser(values)
      //   if (!res.success) {
      //     toast.error(res.error)
      //   }
      //   const { data, message } = res
      //   const newSession = {
      //     ...session,
      //     user: {
      //       ...session?.user,
      //       name: data.name,
      //     },
      //   }
      //   await update(newSession)
      //   toast.success(message)
      //   router.push('/account/manage')
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!data.success) {
        toast.error(data.error)
      }
      const newSession = {
        ...session,
        user: {
          ...session?.user,
          name: data.data.name,
        },
      }
      await update(newSession)
      toast.success(data.message)
      router.push('/account/manage')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      )
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5'
      >
        <div className=' flex flex-col gap-5'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>New Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter new name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type='submit'
          size='lg'
          disabled={form.formState.isSubmitting}
          className='button col-span-2 w-full'
        >
          {form.formState.isSubmitting ? 'submitting...' : 'save changes'}
        </Button>
      </form>
    </Form>
  )
}

export default ProfileForm
