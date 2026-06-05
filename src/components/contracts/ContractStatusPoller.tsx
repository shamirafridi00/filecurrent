'use client'

import { useEffect } from 'react'

interface Props {
  contractId: string
  currentStatus: string
}

// Polls the contract status every 10 seconds.
// When it changes to 'signed', reloads the page so the server component
// re-renders with the signed state (badge, Download PDF button, etc.)
export function ContractStatusPoller({ contractId, currentStatus }: Props) {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/contracts/${contractId}/status`)
        if (!res.ok) return
        const { status } = await res.json() as { status: string }
        if (status !== currentStatus) {
          window.location.reload()
        }
      } catch {
        // Network error — silently ignore, try again next tick
      }
    }, 10_000)

    return () => clearInterval(interval)
  }, [contractId, currentStatus])

  return null
}
