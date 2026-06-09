'use client'

import { useState } from 'react'
import { Copy, Check, ArrowsClockwise, Link as LinkIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui'
import { toast } from 'sonner'
import { APP_URL } from '@/lib/constants'

interface ClientPortalLinkProps {
  clientId: string
  portalToken: string
}

export function ClientPortalLink({ clientId, portalToken }: ClientPortalLinkProps) {
  const [token, setToken] = useState(portalToken)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [confirmRegen, setConfirmRegen] = useState(false)

  const portalUrl = `${APP_URL}/portal/${token}`

  async function handleCopy() {
    await navigator.clipboard.writeText(portalUrl)
    setCopied(true)
    toast.success('Portal link copied')
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRegenerate() {
    setRegenerating(true)
    try {
      const res = await fetch(`/api/clients/${clientId}/portal-token`, { method: 'POST' })
      if (!res.ok) throw new Error()
      const { token: newToken } = await res.json()
      setToken(newToken)
      toast.success('Portal link regenerated')
    } catch {
      toast.error('Failed to regenerate link')
    } finally {
      setRegenerating(false)
      setConfirmRegen(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground font-mono overflow-hidden">
        <LinkIcon size={12} className="shrink-0 text-primary" />
        <span className="truncate">{portalUrl}</span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" onClick={handleCopy}>
          {copied
            ? <><Check className="mr-1.5 h-3.5 w-3.5 text-green-600" /> Copied</>
            : <><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy Link</>}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setConfirmRegen(true)}
          disabled={regenerating}
          className="text-muted-foreground"
          title="Regenerate link (old link stops working)"
        >
          <ArrowsClockwise size={14} className={regenerating ? 'animate-spin' : ''} />
        </Button>
      </div>

      <ConfirmDialog
        open={confirmRegen}
        title="Regenerate Portal Link?"
        description="The old link will stop working immediately. Your client will need the new link to access their portal."
        confirmLabel={regenerating ? 'Regenerating...' : 'Regenerate'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleRegenerate}
        onCancel={() => setConfirmRegen(false)}
      />
    </div>
  )
}
