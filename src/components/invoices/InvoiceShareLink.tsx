'use client'

import { useState } from 'react'
import { Copy, Check, ArrowSquareOut } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function InvoiceShareLink({ shareToken }: { shareToken: string }) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/i/${shareToken}` : `/i/${shareToken}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('Link copied')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground break-all font-mono">/i/{shareToken}</p>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={copy} className="flex-1">
          {copied ? <Check className="mr-1 h-3.5 w-3.5 text-green-500" /> : <Copy className="mr-1 h-3.5 w-3.5" />}
          {copied ? 'Copied!' : 'Copy link'}
        </Button>
        <Button size="sm" variant="ghost" asChild>
          <a href={`/i/${shareToken}`} target="_blank" rel="noopener noreferrer">
            <ArrowSquareOut className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </div>
  )
}
