'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [signerName, setSignerName] = useState('')
  const [signing, setSigning] = useState(false)

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
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to sign document')
      setSigning(false)
    }
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
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
              className="w-full sm:w-auto sm:shrink-0"
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
