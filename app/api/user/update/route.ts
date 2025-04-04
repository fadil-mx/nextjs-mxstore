import { auth } from '@/auth'
import { connectDB } from '@/lib/db'
import User from '@/lib/db/models/user.model'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    await connectDB()
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: 'No session found', success: false })

    const user = await User.findById(session?.user.id)
    if (!user)
      return NextResponse.json({ error: 'User not found', success: false })
    user.name = data.name
    const updateduser = await user.save()
    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      data: updateduser,
    })
  } catch (error) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : 'An unexpected error occurred',
      success: false,
    })
  }
}
