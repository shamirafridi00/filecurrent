'use client'

import { useState } from 'react'
import { Copy, Check, ArrowSquareOut } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props {
  shareToken: string
  compact?: boolean
}

export function InvoiceShareLink({ shareToken, compact = false }: Props) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? `${window.location.origin}/i/${shareToken}` : `https://filecurrent.com/i/${shareToken}`

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

  if (compact) {
    return (
      <div className="flex gap-1">
        <Button size="default" variant="outline" onClick={copy} className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800">
          {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copied ? 'Copied!' : 'Share your invoice'}
        </Button>
        <Button size="default" variant="ghost" asChild>
          <a href={`/i/${shareToken}`} target="_blank" rel="noopener noreferrer">
            <ArrowSquareOut className="h-4 w-4" />
          </a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        filecurrent.com/i/{shareToken.substring(0, 8)}…
      </p>
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
