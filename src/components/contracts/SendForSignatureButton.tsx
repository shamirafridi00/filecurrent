'use client'

import { useState } from 'react'
import { PaperPlaneTilt, CheckCircle, Copy, Envelope } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
  const [sending, setSending] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const [signLink, setSignLink] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState(false)

  const createSession = async (sendEmailToo: boolean) => {
    if (!email.trim()) { toast.error('Email is required'); return }
    setSending(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail: email }),
      })
      if (!res.ok) throw new Error()
      const { token } = await res.json()
      const link = `${window.location.origin}/sign/${token}`
      setSignLink(link)
      if (sendEmailToo) {
        setEmailSent(true)
        toast.success(`Signing link sent to ${email}`)
      }
      router.refresh()
    } catch {
      toast.error('Failed to create signing session')
    } finally {
      setSending(false)
    }
  }

  const handleSendEmail = async () => {
    if (!email.trim()) { toast.error('Email is required'); return }
    setSendingEmail(true)
    try {
      const res = await fetch(`/api/contracts/${contractId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerEmail: email }),
      })
      if (!res.ok) throw new Error()
      const { token } = await res.json()
      const link = `${window.location.origin}/sign/${token}`
      setSignLink(link)
      setEmailSent(true)
      toast.success(`Signing link sent to ${email}`)
    } catch {
      toast.error('Failed to send email')
    } finally {
      setSendingEmail(false)
    }
  }

  const copyLink = () => {
    if (signLink) {
      navigator.clipboard.writeText(signLink)
      toast.success('Link copied to clipboard')
    }
  }

  const handleClose = () => {
    setOpen(false)
    // Reset so the dialog is fresh next time
    setSignLink(null)
    setEmailSent(false)
    setEmail(clientEmail)
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <PaperPlaneTilt className="mr-1 h-4 w-4" />
        Send for Signature
      </Button>
      <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send for Signature</DialogTitle>
          </DialogHeader>
          {!signLink ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Send <strong>{clientName}</strong> a signing link. They can review and sign without creating an account.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="signer-email">Client&apos;s Email</Label>
                <Input
                  id="signer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button variant="outline" onClick={() => createSession(false)} disabled={sending}>
                  {sending ? 'Generating…' : 'Generate Link Only'}
                </Button>
                <Button onClick={() => createSession(true)} disabled={sending}>
                  <Envelope className="mr-1.5 h-4 w-4" />
                  {sending ? 'Sending…' : 'Send via Email'}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-green-800">
                    {emailSent ? `Email sent to ${email}` : 'Signing Link Ready'}
                  </p>
                  <p className="text-xs text-green-700">
                    {emailSent
                      ? `${clientName} will receive an email with the signing link.`
                      : `Copy this link and share it with ${clientName}.`}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Signing Link</Label>
                <div className="flex items-center gap-2 rounded-md border bg-muted p-2">
                  <p className="flex-1 break-all text-xs font-mono text-foreground">{signLink}</p>
                  <Button size="sm" variant="default" onClick={copyLink} className="shrink-0 gap-1.5">
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </Button>
                </div>
              </div>

              {!emailSent && (
                <Button
                  className="w-full"
                  onClick={handleSendEmail}
                  disabled={sendingEmail}
                >
                  <Envelope className="mr-1.5 h-4 w-4" />
                  {sendingEmail ? 'Sending…' : `Send Email to ${clientName}`}
                </Button>
              )}

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-800">Security Notice</p>
                <p className="text-xs text-amber-700 mt-0.5">This link is unique to {clientName}. Only share it with the intended signer.</p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleClose}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
