'use client'

// ============================================================
// src/components/clients/ClientForm.tsx
// Reusable form for Add Client and Edit Client
// ============================================================

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus, FloppyDisk } from '@phosphor-icons/react'
import { Button, Input, Textarea, PageHeader } from '@/components/ui'
import type { Client, ClientFormData } from '@/types'

interface ClientFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<Client>
  clientId?: string
}

export function ClientForm({ mode, initialData = {}, clientId }: ClientFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<ClientFormData>({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    address: initialData.address || '',
    notes: initialData.notes || '',
  })

  const set = (field: keyof ClientFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async () => {
    if (!formData.name.trim()) return
    setSaving(true)
    // Replace with your API call
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    router.push(mode === 'edit' && clientId ? `/clients/${clientId}` : '/clients')
  }

  const handleCancel = () => {
    router.push(mode === 'edit' && clientId ? `/clients/${clientId}` : '/clients')
  }

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={mode === 'create' ? 'Add New Client' : 'Edit Client'}
        backHref="/clients"
        backLabel="Back to Clients"
      />

      <div className="bg-card rounded-lg border border-border shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Client Name"
            required
            placeholder="John Doe"
            value={formData.name}
            onChange={set('name')}
          />
          <Input
            label="Email"
            type="email"
            placeholder="client@example.com"
            value={formData.email}
            onChange={set('email')}
          />
          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={formData.phone}
            onChange={set('phone')}
          />
          <Input
            label="Company"
            placeholder="Company name"
            value={formData.company}
            onChange={set('company')}
          />
        </div>

        <Textarea
          label="Address"
          rows={2}
          placeholder="Street address, city, state, postal code"
          value={formData.address}
          onChange={set('address')}
        />

        <Textarea
          label="Notes"
          rows={3}
          placeholder="Internal notes about this client (not visible to client)"
          helper="These notes are for your reference only."
          value={formData.notes}
          onChange={set('notes')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={handleCancel}>
            × Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={saving}
            icon={mode === 'create' ? <UserPlus size={16} /> : <FloppyDisk size={16} />}
          >
            {mode === 'create' ? 'Create Client' : 'Update Client'}
          </Button>
        </div>
      </div>
    </div>
  )
}
