'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
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
        <Send className="mr-1 h-4 w-4" />
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
              <p className="text-sm text-green-600 font-medium">Signing link created successfully!</p>
              <div className="rounded-md border bg-muted p-3">
                <p className="break-all text-sm font-mono">{signLink}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link with {clientName} via email or any channel. The link is unique and single-use.
              </p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
                <Button onClick={copyLink}>Copy Link</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
