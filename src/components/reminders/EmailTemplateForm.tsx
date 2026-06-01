'use client'

// ============================================================
// src/components/reminders/EmailTemplateForm.tsx
// Create/Edit email reminder template
// ============================================================

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, PageHeader, Card } from '@/components/ui'
import { EMAIL_PLACEHOLDERS } from '@/lib/constants'
import type { EmailTemplate, EmailTemplateFormData } from '@/types'

interface EmailTemplateFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<EmailTemplate>
  templateId?: string
}

const TIPS = [
  'Use professional, polite tone',
  'Include a clear call-to-action (CTA) button with payment link',
  'Keep emails mobile-friendly with reasonable line lengths',
  'Use HTML for formatting — support inline CSS',
  'Include your contact information for support requests',
  'Add an unsubscribe note for CAN-SPAM compliance',
]

export function EmailTemplateForm({ mode, initialData = {}, templateId }: EmailTemplateFormProps) {
  const router = useRouter()
  const bodyRef = useRef<HTMLTextAreaElement>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<EmailTemplateFormData>({
    name: initialData.name || '',
    key: initialData.key || '',
    description: initialData.description || '',
    subject: initialData.subject || '',
    body: initialData.body || '',
  })

  const set = (field: keyof EmailTemplateFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const insertPlaceholder = (key: string) => {
    const textarea = bodyRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newBody = formData.body.slice(0, start) + key + formData.body.slice(end)
    setFormData((prev) => ({ ...prev, body: newBody }))
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + key.length, start + key.length)
    }, 0)
  }

  const handleSubmit = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    router.push('/reminders/templates')
  }

  const isSystem = initialData.isSystem

  return (
    <div>
      <PageHeader
        title={mode === 'create' ? 'Create Email Template' : 'Edit Template'}
        subtitle={mode === 'edit' ? 'Modify your email template' : undefined}
        backHref="/reminders/templates"
        backLabel="Back to Templates"
      />

      <div className="max-w-3xl space-y-5">
        {/* Template Info */}
        <Card>
          <div className="space-y-4">
            <Input
              label="Template Name"
              required
              placeholder="e.g. Due in 3 Days"
              value={formData.name}
              onChange={set('name')}
            />
            <Input
              label="Template Key"
              required
              placeholder="e.g. default_due_3_days_before"
              value={formData.key}
              onChange={set('key')}
              disabled={isSystem}
              helper="Unique identifier. Use lowercase letters, numbers, and underscores."
            />
            <Textarea
              label="Description"
              rows={2}
              placeholder="Sent 3 days before invoice is due"
              value={formData.description}
              onChange={set('description')}
            />
          </div>
        </Card>

        {/* Email Subject */}
        <Card>
          <h2 className="font-semibold text-slate-800 mb-3">Email Subject</h2>
          <Input
            placeholder="Reminder: Invoice {{invoice_number}} due on {{due_date}}"
            value={formData.subject}
            onChange={set('subject')}
            helper="Subject line for the email. Supports placeholders like {{invoice_number}}, {{due_date}}"
          />
        </Card>

        {/* Email Body */}
        <Card>
          <h2 className="font-semibold text-slate-800 mb-3">Email Body</h2>
          <textarea
            ref={bodyRef}
            rows={18}
            placeholder="HTML email body with placeholders..."
            value={formData.body}
            onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
            className="w-full border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 px-3 py-2 font-mono resize-y"
          />
          <p className="text-xs text-slate-400 mt-1">HTML email body. Can contain placeholders.</p>
        </Card>

        {/* Placeholders + Tips */}
        <div className="grid grid-cols-2 gap-5">
          <Card>
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              🏷 Available Placeholders
            </h3>
            <div className="space-y-2">
              {EMAIL_PLACEHOLDERS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => insertPlaceholder(p.key)}
                  className="block text-left w-full hover:bg-indigo-50 rounded px-1 py-0.5 group"
                >
                  <code className="text-xs text-indigo-600 font-mono group-hover:text-indigo-800">
                    {p.key}
                  </code>
                  <p className="text-xs text-slate-500">{p.label}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              💡 Tips for Great Templates
            </h3>
            <ul className="space-y-2">
              {TIPS.map((tip, i) => (
                <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => router.push('/reminders/templates')}>
            Cancel
          </Button>
          <Button variant="primary" loading={saving} onClick={handleSubmit}>
            {mode === 'create' ? 'Create Template' : 'Update Template'}
          </Button>
        </div>
      </div>
    </div>
  )
}
