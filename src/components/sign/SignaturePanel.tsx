'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
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

  if (signed) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-card shadow-xl">
        <div className="mx-auto max-w-2xl px-4 py-6 text-center">
          <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-green-500" />
          <p className="font-semibold text-foreground">Document Signed Successfully</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your signed copy has been recorded. Thank you, {signerName}!
          </p>
        </div>
      </div>
    )
  }

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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign document')
    } finally {
      setSigning(false)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t bg-card shadow-xl">
      <div className="mx-auto max-w-2xl px-4 py-5">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="esign-agree"
              checked={agreed}
              onCheckedChange={(v) => setAgreed(Boolean(v))}
              className="mt-0.5"
            />
            <Label htmlFor="esign-agree" className="cursor-pointer text-sm leading-snug">
              I agree to sign this document electronically under the ESIGN Act (15 U.S.C. § 7001).
              My electronic signature is legally binding.
            </Label>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="signer-name">Full legal name</Label>
              <Input
                id="signer-name"
                placeholder="Type your full legal name"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                disabled={!agreed}
              />
            </div>
            <Button
              onClick={handleSign}
              disabled={!agreed || !signerName.trim() || signing}
              className="shrink-0"
            >
              {signing ? 'Signing…' : 'Sign Document'}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Signing as: {signerEmail} · Powered by {' '}
            <span className="text-primary font-medium">FileCurrent</span>
          </p>
        </div>
      </div>
    </div>
  )
}
