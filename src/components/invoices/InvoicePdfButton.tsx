'use client'

import { useState } from 'react'
import { DownloadSimple } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { UpgradePrompt } from '@/components/upgrade/UpgradePrompt'

interface Props {
  invoiceId: string
  isPro: boolean
}

export function InvoicePdfButton({ invoiceId, isPro }: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleClick() {
    if (!isPro) {
      setShowUpgrade(true)
      return
    }
    setLoading(true)
    // Trigger browser download by navigating to the PDF route
    window.open(`/api/invoices/${invoiceId}/pdf`, '_blank')
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
        <DownloadSimple className="mr-1.5 h-3.5 w-3.5" />
        {loading ? 'Generating…' : 'Download PDF'}
      </Button>
      <UpgradePrompt open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </>
  )
}
