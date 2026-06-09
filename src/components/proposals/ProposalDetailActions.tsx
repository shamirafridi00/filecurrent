'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { PaperPlaneTilt, Link as LinkIcon, ArrowSquareOut } from '@phosphor-icons/react'
import { APP_URL } from '@/lib/constants'

interface Props {
  proposalId: string
  shareToken: string | null
  status: string
  clientEmail: string | null
}

export function ProposalDetailActions({ proposalId, shareToken, status, clientEmail }: Props) {
  const [sending, setSending] = useState(false)

  const proposalUrl = shareToken ? `${APP_URL}/proposals/${shareToken}` : null

  async function handleSend() {
    if (!clientEmail) {
      toast.error('Client has no email address')
      return
    }
    setSending(true)
    try {
      const res = await fetch(`/api/proposals/${proposalId}/send`, { method: 'POST' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        toast.error(body.error ?? 'Failed to send proposal')
        return
      }
      toast.success('Proposal sent to client')
      window.location.reload()
    } catch {
      toast.error('Failed to send proposal')
    } finally {
      setSending(false)
    }
  }

  function handleCopyLink() {
    if (!proposalUrl) return
    navigator.clipboard.writeText(proposalUrl).then(() => {
      toast.success('Proposal link copied to clipboard')
    }).catch(() => {
      toast.error('Failed to copy link')
    })
  }

  const canSend = status === 'draft' || status === 'sent'

  return (
    <div className="flex flex-wrap gap-2">
      {canSend && (
        <Button onClick={handleSend} disabled={sending} size="sm">
          <PaperPlaneTilt className="mr-1.5 h-4 w-4" />
          {sending ? 'Sending…' : status === 'sent' ? 'Resend to Client' : 'Send to Client'}
        </Button>
      )}
      {proposalUrl && (
        <>
          <Button variant="outline" size="sm" onClick={handleCopyLink}>
            <LinkIcon className="mr-1.5 h-4 w-4" />
            Copy Link
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href={proposalUrl} target="_blank" rel="noopener noreferrer">
              <ArrowSquareOut className="mr-1.5 h-4 w-4" />
              Preview
            </a>
          </Button>
        </>
      )}
    </div>
  )
}
