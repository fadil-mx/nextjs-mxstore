'use server'

// import { signIn, signOut } from '@/auth'
import { signIn, signOut as authSignOut } from '@/auth'
import { userSignIn } from '@/types'
import { redirect } from 'next/navigation'

export async function signInWithCredentials(user: userSignIn) {
  return await signIn('credentials', { ...user, redirect: false })
}

export async function SignOut() {
  const redirectTO = await authSignOut({ redirect: false })
  redirect(redirectTO.redirect)
}
