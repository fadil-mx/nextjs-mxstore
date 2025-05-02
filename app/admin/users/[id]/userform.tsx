'use client'
import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Updateuser } from '@/types'
import { UpdateUser } from '@/lib/validator'
import { getUserById, updateUserById } from '@/lib/actions/user.action'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

type Props = {
  id: string
}

const Userform = ({ id }: Props) => {
  const form = useForm<Updateuser>({
    resolver: zodResolver(UpdateUser),
    defaultValues: {
      name: '',
      email: '',
      role: '',
    },
  })

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(id)
      console.log(user)
      if (user) {
        form.setValue('id', user.data._id)
        form.setValue('name', user.data.name)
        form.setValue('email', user.data.email)
        form.setValue('role', user.data.role)
      }
    }
    fetchUser()
  }, [id, form])

  const onSubmit = async (values: Updateuser) => {
    try {
      const res = await updateUserById(values)
      if (!res.success) {
        toast.error(res.message)
      }
      toast.success(res.message)
    } catch (error) {
      console.log(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <h1 className='h1-bold mt-4'>User Details</h1>
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name='role'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className=''>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='Admin'>admin</SelectItem>
                      <SelectItem value='User'>user</SelectItem>
                    </SelectContent>
                  </Select>
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

export default Userform
