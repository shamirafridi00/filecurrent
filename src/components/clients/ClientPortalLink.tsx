'use client'

import { useState } from 'react'
import { Copy, Check, ArrowsClockwise, ArrowSquareOut, PaperPlaneTilt } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ui'
import { toast } from 'sonner'
import { APP_URL } from '@/lib/constants'

interface ClientPortalLinkProps {
  clientId: string
  portalToken: string
  clientEmail: string | null
}

export function ClientPortalLink({ clientId, portalToken, clientEmail }: ClientPortalLinkProps) {
  const [token, setToken] = useState(portalToken)
  const [copied, setCopied] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [sending, setSending] = useState(false)
  const [confirmRegen, setConfirmRegen] = useState(false)

  const portalUrl = `${APP_URL}/portal/${token}`

  async function handleCopy() {
    await navigator.clipboard.writeText(portalUrl)
    setCopied(true)
    toast.success('Portal link copied')
    setTimeout(() => setCopied(false), 2000)
  }

  function handleOpen() {
    window.open(portalUrl, '_blank', 'noopener,noreferrer')
  }

  async function handleSend() {
    if (!clientEmail) {
      toast.error('This client has no email address')
      return
    }
    setSending(true)
    try {
      const res = await fetch(`/api/clients/${clientId}/send-portal`, { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? 'Failed to send')
      }
      toast.success('Portal link sent to client')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send portal link')
    } finally {
      setSending(false)
    }
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
      {/* URL display — click to copy */}
      <div
        className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground font-mono overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={handleCopy}
        title="Click to copy"
      >
        <span className="truncate">{portalUrl}</span>
      </div>

      {/* Primary actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={handleCopy}>
          {copied
            ? <><Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />Copied</>
            : <><Copy className="mr-1.5 h-3.5 w-3.5" />Copy Link</>}
        </Button>
        <Button size="sm" variant="outline" onClick={handleOpen}>
          <ArrowSquareOut className="mr-1.5 h-3.5 w-3.5" />
          Open Portal
        </Button>
      </div>

      {/* Send to client */}
      <Button
        size="sm"
        className="w-full"
        onClick={handleSend}
        disabled={sending || !clientEmail}
        title={!clientEmail ? 'Add client email to send portal link' : undefined}
      >
        <PaperPlaneTilt className="mr-1.5 h-3.5 w-3.5" />
        {sending ? 'Sending...' : 'Send to Client'}
      </Button>
      {!clientEmail && (
        <p className="text-xs text-muted-foreground text-center">
          Add a client email to enable sending
        </p>
      )}

      {/* Regenerate — subtle, bottom */}
      <div className="pt-1 flex justify-end">
        <button
          onClick={() => setConfirmRegen(true)}
          disabled={regenerating}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          title="Regenerate link — old link will stop working"
        >
          <ArrowsClockwise size={11} className={regenerating ? 'animate-spin' : ''} />
          Regenerate link
        </button>
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
