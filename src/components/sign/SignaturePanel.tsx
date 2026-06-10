'use client'

import { useState } from 'react'
import { CheckCircle } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface Props {
  token: string
  signerEmail: string
}

export function SignaturePanel({ token, signerEmail }: Props) {
  const [agreed, setAgreed] = useState(false)
  const [signerName, setSignerName] = useState('')
  const [signing, setSigning] = useState(false)
  const [signed, setSigned] = useState(false)

  const handleSign = async () => {
    if (!agreed) { toast.error('Please agree to sign electronically'); return }
    if (!signerName.trim()) { toast.error('Please enter your full legal name'); return }
    setSigning(true)
    try {
      const res = await fetch(`/api/sign/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signerName }),
      })
      if (!res.ok) throw new Error((await res.json()).error || 'Failed')
      setSigned(true)
      // Reload after a short delay so the server re-renders with the signed
      // state. Any future visit to this URL will also show the signed screen.
      setTimeout(() => { window.location.reload() }, 2500)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign document')
      setSigning(false)
    }
  }

  if (signed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 px-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-9 w-9 text-green-500" weight="fill" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Contract Signed!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you, <strong>{signerName}</strong>. Your signature has been recorded.
          </p>
          <div className="mt-4 rounded-lg border bg-green-50 border-green-200 px-4 py-3 text-sm text-green-800">
            We will send a signed copy of this contract to <strong>{signerEmail}</strong>. Please check your inbox.
          </div>
          <p className="mt-5 text-xs text-muted-foreground">
            You may now close this window.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t bg-card shadow-sm">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="esign-agree"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(Boolean(v))}
              className="mt-0.5"
            />
            <Label htmlFor="esign-agree" className="cursor-pointer text-xs leading-relaxed sm:text-sm">
              By typing your name and clicking &ldquo;Sign Document&rdquo; you agree to sign this document
              electronically. Under the ESIGN Act (15 U.S.C. § 7001 et seq.) and UETA, your
              electronic signature has the same legal effect as a handwritten signature. You
              consent to conduct this transaction electronically. You may request a paper copy
              by contacting the service provider. Your IP address, timestamp, and name will be
              recorded as part of the audit trail.
            </Label>
          </div>

          <div className="rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary">
              ✎ Sign here
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="signer-name">Full legal name</Label>
                <Input
                  id="signer-name"
                  placeholder="Type your full legal name"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  disabled={!agreed || signing}
                  className="bg-white"
                />
              </div>
              <Button
                onClick={handleSign}
                disabled={!agreed || !signerName.trim() || signing}
                className="w-full sm:w-auto sm:shrink-0"
              >
                {signing ? 'Signing…' : 'Sign Document'}
              </Button>
            </div>
            {!agreed && (
              <p className="mt-2 text-xs text-muted-foreground">
                Check the consent box above to enable signing.
              </p>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Signing as: {signerEmail} · Powered by{' '}
            <span className="text-primary font-medium">FileCurrent</span>
          </p>
        </div>
      </div>
    </div>
  )
}
