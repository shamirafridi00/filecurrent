'use client'

import { useState } from 'react'
import { PaperPlaneTilt, CheckCircle, Copy, Envelope, Warning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
  contractId: string
  clientEmail: string
  clientName: string
}

export function SendForSignatureButton({ contractId, clientEmail, clientName }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState(clientEmail)
  const [loading, setLoading] = useState<'email' | 'link' | null>(null)
  const [signLink, setSignLink] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [emailFailed, setEmailFailed] = useState(false)

  const handleSendEmail = async () => {
    if (!email.trim()) { toast.error('Email is required'); return }
    setLoading('email')
    try {
      const res = await fetch(`/api/contracts/${contractId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail: email, sendEmail: true }),
      })
      if (!res.ok) { toast.error('Failed to generate signing session'); return }

      const data = await res.json()
      const link = `${window.location.origin}/sign/${data.signPath ?? data.token}`
      setSignLink(link)
      router.refresh()

      if (data.emailFailed) {
        setEmailFailed(true)
        setEmailSent(false)
        toast.warning('Signing link created, but email delivery failed. Copy the link and send it manually.')
      } else {
        setEmailFailed(false)
        setEmailSent(true)
        toast.success(`Signing link sent to ${email}`)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setLoading(null)
    }
  }

  const handleGenerateLink = async () => {
    setLoading('link')
    try {
      const res = await fetch(`/api/contracts/${contractId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail: email || 'noemail@placeholder.local', sendEmail: false }),
      })
      if (!res.ok) { toast.error('Failed to generate signing link'); return }
      const data = await res.json()
      const link = `${window.location.origin}/sign/${data.signPath ?? data.token}`
      setSignLink(link)
      setEmailFailed(false)
      router.refresh()
    } catch {
      toast.error('Failed to generate signing link')
    } finally {
      setLoading(null)
    }
  }

  const copyLink = () => {
    if (!signLink) return
    navigator.clipboard.writeText(signLink)
    toast.success('Link copied to clipboard')
  }

  const handleClose = () => {
    setOpen(false)
    setSignLink(null)
    setEmailSent(false)
    setEmailFailed(false)
    setEmail(clientEmail)
  }

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)} size="sm">
        <PaperPlaneTilt className="mr-1 h-4 w-4" />
        Send for Signature
      </Button>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v && loading) return
          if (!v) handleClose()
        }}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-md p-0">
          <div className="max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <DialogHeader>
              <DialogTitle>Send for Signature</DialogTitle>
            </DialogHeader>

            {/* Email field */}
            <div className="space-y-1.5">
              <Label htmlFor="signer-email">Client&apos;s Email</Label>
              <Input
                id="signer-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                disabled={!!loading}
              />
              <p className="text-xs text-muted-foreground">
                {clientName} can review and sign without creating an account.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <Button type="button" className="w-full" onClick={handleSendEmail} disabled={!!loading}>
                <Envelope className="mr-1.5 h-4 w-4" />
                {loading === 'email' ? 'Sending…' : emailSent ? 'Resend Email' : 'Send Email'}
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={handleGenerateLink} disabled={!!loading}>
                <Copy className="mr-1.5 h-4 w-4" />
                {loading === 'link' ? 'Generating…' : 'Generate Link Only'}
              </Button>
            </div>

            {/* Signing link — shown once generated */}
            {signLink && (
              <div className="space-y-2">
                <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${emailFailed ? 'border-amber-200 bg-amber-50' : 'border-green-200 bg-green-50'}`}>
                  {emailFailed
                    ? <Warning className="h-4 w-4 shrink-0 text-amber-600" />
                    : <CheckCircle className="h-4 w-4 shrink-0 text-green-600" />
                  }
                  <p className={`text-xs font-medium ${emailFailed ? 'text-amber-800' : 'text-green-800'}`}>
                    {emailFailed
                      ? 'Email delivery failed — copy the link and send it manually'
                      : emailSent
                        ? `Email sent to ${email}`
                        : 'Link ready — copy and share it'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-md border bg-muted px-3 py-2 min-w-0">
                  <p className="flex-1 truncate text-xs font-mono text-foreground min-w-0">{signLink}</p>
                  <Button type="button" size="sm" variant="default" onClick={copyLink} className="shrink-0">
                    <Copy className="mr-1 h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-1">
              <Button type="button" variant="ghost" size="sm" onClick={handleClose}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
