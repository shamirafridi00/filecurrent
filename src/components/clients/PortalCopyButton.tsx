'use client'

import { useState } from 'react'
import { Link as LinkIcon, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { APP_URL } from '@/lib/constants'

export function PortalCopyButton({ portalToken, clientName }: { portalToken: string; clientName: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    const url = `${APP_URL}/portal/${portalToken}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success(`Portal link copied for ${clientName}`)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy client portal link"
      className="flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-xs font-medium text-muted-foreground hover:bg-muted/40 hover:text-primary transition-colors duration-150"
    >
      {copied
        ? <Check size={14} className="text-green-600" />
        : <LinkIcon size={14} />}
      Client Portal
    </button>
  )
}
