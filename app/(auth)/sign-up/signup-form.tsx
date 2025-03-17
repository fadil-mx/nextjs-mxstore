'use client'
import { useForm } from 'react-hook-form'

import { redirect, useSearchParams } from 'next/navigation'
import { userSignIn, userSignUp } from '@/types'
import { userSignUpSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerUser, signInWithCredentials } from '@/lib/actions/user.action'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { toast } from 'sonner'
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
// import { APP_NAME } from '@/lib/constants'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const defultValue =
  process.env.NODE_ENV === 'development'
    ? {
        name: 'john doe',
        email: 'john@me.com',
        password: '123456',
        confirmPassword: '123456',
      }
    : {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      }

const Signupform = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  const form = useForm<userSignIn>({
    resolver: zodResolver(userSignUpSchema),
    defaultValues: defultValue,
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: userSignUp) => {
    try {
      const res = await registerUser(data)
      if (!res.sucess) {
        toast.error(res.error)
        return
      }
      toast.success(res.message)
      await signInWithCredentials({
        email: data.email,
        password: data.password,
      })
      redirect(callbackUrl)
    } catch (error) {
      if (isRedirectError(error)) {
        throw error
      }
      console.error(error)
      toast.error('Invalid email or password')
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className=' space-y-6'>
          <FormField
            control={control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter name address' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='email'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='Enter email address' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='password'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter Password'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Confirm Password'
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <div className=''>
            <Button type='submit'>Sign Up</Button>
          </div>
          <div className='text-sm'>
            By creating an account, you agree to MXSTORE&apos;s{' '}
            {/* {APP_NAME}&apos;s{' '} */}
            <Link href='/page/conditions-of-use'>
              Conditions of Use
            </Link> and <Link href='/page/Privacy-policy'>Privacy Notice.</Link>
          </div>
          <Separator />
          <div className='text-sm'>
            Already have an account?
            <Link href={`/sign-in?callbackUrl=${callbackUrl}`}>Sign In</Link>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default Signupform
