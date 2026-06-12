'use client'

import { Copy } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props {
  contractId: string
  clientEmail: string
}

export function CopySigningLinkButton({ contractId, clientEmail }: Props) {
  const handleCopy = async () => {
    try {
      const res = await fetch(`/api/contracts/${contractId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail: clientEmail }),
      })
      if (!res.ok) throw new Error()
      const { token, signPath } = await res.json()
      const link = `${window.location.origin}/sign/${signPath ?? token}`
      await navigator.clipboard.writeText(link)
      toast.success('Signing link copied to clipboard')
    } catch {
      toast.error('Failed to generate signing link')
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      <Copy className="mr-1.5 h-3.5 w-3.5" />
      Copy Link
    </Button>
  )
}
