import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  caption: string
  action: () => Promise<{
    message: string
    success: boolean
  }>
}

const ActionButton = ({ caption, action }: Props) => {
  const [ispending, setIsPending] = useState(false)
  const router = useRouter()
  const update = async () => {
    setIsPending(true)
    try {
      const res = await action()
      if (!res.success) {
        toast.error(res.message)
      }
      toast.success(res.message)
      router.refresh()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <Button disabled={ispending} onClick={update}>
        {ispending ? 'updating' : caption}
      </Button>
    </div>
  )
}

export default ActionButton
