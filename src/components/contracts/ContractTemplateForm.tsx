'use client'

// ============================================================
// src/components/contracts/ContractTemplateForm.tsx
// Create/Edit contract template with placeholders + styling guide
// ============================================================

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Textarea, PageHeader, Card } from '@/components/ui'
import { CONTRACT_PLACEHOLDERS, CONTRACT_STYLING_GUIDE } from '@/lib/constants'
import type { ContractTemplate, ContractTemplateFormData } from '@/types'

interface ContractTemplateFormProps {
  mode: 'create' | 'edit'
  initialData?: Partial<ContractTemplate>
  templateId?: string
}

export function ContractTemplateForm({ mode, initialData = {}, templateId }: ContractTemplateFormProps) {
  const router = useRouter()
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState<ContractTemplateFormData>({
    name: initialData.name || '',
    description: initialData.description || '',
    content: initialData.content || '',
    isDefault: initialData.isDefault || false,
  })

  const set = (field: keyof ContractTemplateFormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  // Insert placeholder at cursor position
  const insertPlaceholder = (key: string) => {
    const textarea = contentRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newContent =
      formData.content.slice(0, start) + key + formData.content.slice(end)
    setFormData((prev) => ({ ...prev, content: newContent }))
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + key.length, start + key.length)
    }, 0)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.content.trim()) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    router.push('/contracts/templates')
  }

  return (
    <div>
      <PageHeader
        title={mode === 'create' ? 'Create New Template' : 'Edit Template'}
        backHref="/contracts/templates"
        backLabel="Back to Templates"
      />

      <div className="max-w-4xl space-y-5">
        {/* Template Info */}
        <Card>
          <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            ℹ Template Information
          </h2>
          <div className="space-y-4">
            <Input
              label="Template Name"
              required
              placeholder="e.g., Standard Service Agreement"
              value={formData.name}
              onChange={set('name')}
            />
            <Textarea
              label="Description"
              rows={2}
              placeholder="Brief description of when to use this template"
              value={formData.description}
              onChange={set('description')}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
                }
                className="w-4 h-4 rounded accent-indigo-600"
              />
              <span className="text-sm text-foreground">
                Set as default template{' '}
                <span className="text-muted-foreground">(will be pre-selected when creating contracts)</span>
              </span>
            </label>
          </div>
        </Card>

        {/* Template Content */}
        <Card>
          <h2 className="font-semibold text-foreground mb-1 flex items-center gap-2">
            📋 Template Content <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-muted-foreground mb-3">Contract Text</p>
          <textarea
            ref={contentRef}
            rows={20}
            placeholder="Enter your contract template text here. Use placeholders like {{client_name}} to automatically fill in details."
            value={formData.content}
            onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
            className="w-full border border-input rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring px-3 py-2 font-mono resize-y"
          />
          <p className="text-xs text-muted-foreground mt-1">HTML email body. Can contain placeholders.</p>
        </Card>

        {/* Placeholders + Styling Guide */}
        <div className="grid grid-cols-2 gap-5">
          {/* Placeholders */}
          <Card>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              🏷 Available Placeholders
            </h3>
            <p className="text-xs text-muted-foreground mb-3">Click to insert at cursor position</p>
            <div className="space-y-2">
              {CONTRACT_PLACEHOLDERS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => insertPlaceholder(p.key)}
                  className="block text-left w-full hover:bg-indigo-50 rounded px-1 py-0.5 group"
                >
                  <code className="text-xs text-indigo-600 font-mono group-hover:text-indigo-800">
                    {p.key}
                  </code>
                  <span className="text-xs text-muted-foreground ml-2">- {p.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Styling guide */}
          <Card>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              🎨 Contract Styling Guide
            </h3>
            <div className="space-y-2">
              {CONTRACT_STYLING_GUIDE.map((entry) => (
                <div key={entry.label}>
                  <p className="text-xs text-muted-foreground">{entry.label}:</p>
                  <code className="text-xs font-mono text-foreground whitespace-pre">{entry.syntax}</code>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
              💡 Keep formatting simple and professional
            </div>
          </Card>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => router.push('/contracts/templates')}>
            × Cancel
          </Button>
          <Button
            variant="primary"
            loading={saving}
            onClick={handleSubmit}
            icon={<span>💾</span>}
          >
            {mode === 'create' ? 'Create Template' : 'Update Template'}
          </Button>
        </div>
      </div>
    </div>
  )
}
