'use client'

import { useEffect, useState } from 'react'

const useIsMounted = () => {
  const [ismounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  return ismounted
}

export default useIsMounted
