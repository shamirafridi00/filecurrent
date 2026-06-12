'use client'

import { useEffect } from 'react'
import { Warning, ArrowsClockwise } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

/**
 * Route-group error boundary for all dashboard pages. Without this, a server
 * error during render produced a blank screen with no way to recover — the
 * "blank or error state" reported after client creation and rapid navigation.
 */
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[dashboard error boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <Warning size={24} weight="duotone" className="text-destructive" />
      </div>
      <h2 className="text-lg font-semibold text-foreground">Something went wrong</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        This page hit an unexpected error. Your data is safe — try loading it again.
      </p>
      <div className="mt-5 flex gap-2">
        <Button onClick={reset}>
          <ArrowsClockwise className="mr-1.5 h-4 w-4" /> Try again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = '/dashboard')}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
