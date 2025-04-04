'use server'

// import { signIn, signOut } from '@/auth'
import { signIn, signOut as authSignOut, auth } from '@/auth'
import { IUserName, userSignIn, userSignUp } from '@/types'
import { redirect } from 'next/navigation'
import { userSignUpSchema } from '../validator'
import { connectDB } from '../db'
import User from '../db/models/user.model'
import bcrypt from 'bcryptjs'
import { formatError } from '../utils'

export async function signInWithCredentials(user: userSignIn) {
  try {
    return await signIn('credentials', { ...user, redirect: false })
  } catch (error) {
    console.log(error)
    throw new Error('Invalid email or password')
  }
}

export async function SignOut() {
  const redirectTO = await authSignOut({ redirect: false })
  redirect(redirectTO.redirect)
}

export async function signInWithGoogle() {
  await signIn('google')
}

export const registerUser = async (userSignUp: userSignUp) => {
  try {
    const user = await userSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword,
    })

    await connectDB()
    await User.create({
      ...user,
      password: await bcrypt.hash(user.password, 5),
    })
    return { message: 'User created successfully', sucess: true }
  } catch (error) {
    return { error: formatError(error), sucess: false }
  }
}

export async function updateUser(username: IUserName) {
  try {
    await connectDB()
    const session = await auth()
    if (!session) throw new Error('No session found')
    const user = await User.findById(session?.user.id)
    if (!user) throw new Error('User not found')
    user.name = username.name
    const updateduser = await user.save()
    return {
      message: 'User updated successfully',
      success: true,
      data: JSON.parse(JSON.stringify(updateduser)),
    }
  } catch (error) {
    return { error: formatError(error), success: false }
  }
}
