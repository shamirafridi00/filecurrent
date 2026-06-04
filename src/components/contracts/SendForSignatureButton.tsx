'use client'

import { useState } from 'react'
import { PaperPlaneTilt, CheckCircle } from '@phosphor-icons/react'
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
  const [signLink, setSignLink] = useState<string | null>(null)

  const handleSend = async () => {
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
      router.refresh()
    } catch {
      toast.error('Failed to create signing session')
    } finally {
      setSending(false)
    }
  }

  const copyLink = () => {
    if (signLink) {
      navigator.clipboard.writeText(signLink)
      toast.success('Link copied to clipboard')
    }
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <PaperPlaneTilt className="mr-1 h-4 w-4" />
        Send for Signature
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send for Signature</DialogTitle>
          </DialogHeader>
          {!signLink ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Send a signing link to <strong>{clientName}</strong>. They will receive a unique link to review and sign the contract.
              </p>
              <div className="space-y-1.5">
                <Label htmlFor="signer-email">Signer&apos;s Email</Label>
                <Input
                  id="signer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSend} disabled={sending}>
                  {sending ? 'Creating link…' : 'Create Signing Link'}
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
                  <p className="text-sm font-semibold text-green-800">Signing Link Generated</p>
                  <p className="text-xs text-green-700">Share this link with {clientName} to sign the contract</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Signing Link</Label>
                <div className="flex items-center gap-2 rounded-md border bg-muted p-2">
                  <p className="flex-1 break-all text-xs font-mono text-foreground">{signLink}</p>
                  <Button size="sm" variant="outline" onClick={copyLink} className="shrink-0">
                    Copy
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border bg-muted/40 p-3 space-y-1.5">
                <p className="text-xs font-semibold text-foreground">How to use:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Send this link to {clientName} via email or message</li>
                  <li>• They can review and sign without creating an account</li>
                  <li>• You&apos;ll receive an email notification when they sign</li>
                </ul>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-800">Security Notice</p>
                <p className="text-xs text-amber-700 mt-0.5">This link is unique to {clientName}. Only share it with the intended signer.</p>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
