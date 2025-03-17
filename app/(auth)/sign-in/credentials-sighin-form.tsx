'use client'
import { useForm } from 'react-hook-form'

import { redirect, useSearchParams } from 'next/navigation'
import { userSignIn } from '@/types'
import { userSignInSchema } from '@/lib/validator'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithCredentials } from '@/lib/actions/user.action'
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

const signIndevelopmentMode =
  process.env.NODE_ENV === 'development'
    ? { email: 'admin@example.com', password: '' }
    : {
        email: '',
        password: '',
      }

const SignIn = () => {
  const searchparams = useSearchParams()
  const callbackUrl = searchparams.get('callbackUrl') || '/'

  const form = useForm<userSignIn>({
    resolver: zodResolver(userSignInSchema),
    defaultValues: signIndevelopmentMode,
  })

  const { control, handleSubmit } = form

  const onSubmit = async (data: userSignIn) => {
    try {
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
      toast.error((error as Error).message)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type='hidden' name='callbackUrl' value={callbackUrl} />
        <div className=' space-y-6'>
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
          <div className=''>
            <Button type='submit'>Sign In</Button>
          </div>
          <div className='text-sm'>
            By signing in, you agree to MXSTORE&apos;s{' '}
            {/* {APP_NAME}&apos;s{' '} */}
            <Link href='/page/conditions-of-use'>
              Conditions of Use
            </Link> and <Link href='/page/Privacy-policy'>Privacy Notice.</Link>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default SignIn
