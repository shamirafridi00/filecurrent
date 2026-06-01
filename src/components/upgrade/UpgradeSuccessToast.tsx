'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export function UpgradeSuccessToast() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    if (searchParams.get('upgraded') === '1') {
      toast.success('Welcome to FileCurrent Pro! Unlimited documents unlocked.')
      router.replace('/dashboard', { scroll: false })
    }
  }, [searchParams, router])

  return null
}
