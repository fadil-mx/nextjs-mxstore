'use client'

import useBrowsingHistory from '@/hooks/Use-browsing-history'
import { useEffect } from 'react'

type Props = {
  id: string
  category: string
}

const Addtobrowsinghistory = ({ id, category }: Props) => {
  const { addItems } = useBrowsingHistory()
  useEffect(() => {
    addItems({ id, category })
  }, [])
  return null
}

export default Addtobrowsinghistory
