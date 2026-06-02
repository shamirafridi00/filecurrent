'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FloppyDisk, X, UserPlus } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui'
import { toast } from 'sonner'

interface Props {
  mode: 'create' | 'edit'
  clientId?: string
  returnTo?: string
  initial?: {
    name: string; email: string; phone: string
    company: string; address: string; notes: string
  }
}

export function ClientFormPage({ mode, clientId, returnTo, initial }: Props) {
  const router = useRouter()
  const backHref = returnTo || (mode === 'edit' && clientId ? `/clients/${clientId}` : '/clients')

  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(initial?.name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [phone, setPhone] = useState(initial?.phone ?? '')
  const [company, setCompany] = useState(initial?.company ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [notes, setNotes] = useState(initial?.notes ?? '')

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error('Client name is required'); return }
    setSaving(true)
    try {
      const url = mode === 'create' ? '/api/clients' : `/api/clients/${clientId}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, company, address, notes }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      toast.success(mode === 'create' ? 'Client added' : 'Client updated')
      router.push(mode === 'create' ? `/clients/${data.id}` : backHref)
      router.refresh()
    } catch {
      toast.error('Failed to save client')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={mode === 'create' ? 'Add New Client' : 'Edit Client'}
        backHref={backHref}
        backLabel={mode === 'edit' ? 'Back to Client' : 'Back to Clients'}
      />

      <Card className="max-w-2xl">
        <CardHeader><CardTitle className="text-base">Client Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="cl-name">Name <span className="text-destructive">*</span></Label>
              <Input id="cl-name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cl-email">Email</Label>
              <Input id="cl-email" type="email" placeholder="client@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cl-phone">Phone</Label>
              <Input id="cl-phone" placeholder="+1 (555) 123-4567" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cl-company">Company</Label>
              <Input id="cl-company" placeholder="Company name" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-address">Address</Label>
            <Textarea id="cl-address" rows={2} placeholder="Street, City, State, Postal Code" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cl-notes">Internal Notes</Label>
            <Textarea id="cl-notes" rows={3} placeholder="Notes visible only to you…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => router.push(backHref)}>
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {mode === 'create' ? <UserPlus className="mr-1 h-4 w-4" /> : <FloppyDisk className="mr-1 h-4 w-4" />}
              {saving ? 'Saving…' : mode === 'create' ? 'Add Client' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
