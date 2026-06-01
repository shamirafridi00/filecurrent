'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import type { PlanKey } from '@/lib/lemonsqueezy'

export function useCheckout() {
  const [loading, setLoading] = useState<PlanKey | null>(null)

  async function startCheckout(plan: PlanKey) {
    setLoading(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.error || !data.url) {
        toast.error(data.error ?? 'Checkout failed. Please try again.')
        return
      }
      window.location.href = data.url
    } catch {
      toast.error('Checkout failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return { startCheckout, loading }
}
