'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ClipboardText,
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  ArrowSquareOut,
  Eye,
} from '@phosphor-icons/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ConfirmDialog, PageHeader } from '@/components/ui'
import { ClientFormPreview } from '@/components/intake-forms/ClientFormPreview'
import { toast } from 'sonner'
import { APP_URL } from '@/lib/constants'
import type { IntakeField, IntakeFieldType, IntakeForm } from '@/types'

interface IntakeFormBuilderProps {
  existingForm?: IntakeForm
}

const FIELD_TYPE_LABELS: Record<IntakeFieldType, string> = {
  text: 'Short Text',
  textarea: 'Long Text',
  email: 'Email',
  phone: 'Phone',
  number: 'Number',
  date: 'Date',
  select: 'Dropdown',
  checkbox: 'Checkbox',
  heading: 'Section Heading',
}

const FIELD_TYPES: IntakeFieldType[] = [
  'text', 'textarea', 'email', 'phone', 'number', 'date', 'select', 'checkbox', 'heading',
]

function defaultLabel(type: IntakeFieldType): string {
  return FIELD_TYPE_LABELS[type]
}

export function IntakeFormBuilder({ existingForm }: IntakeFormBuilderProps) {
  const router = useRouter()
  const [title, setTitle] = useState(existingForm?.title ?? '')
  const [description, setDescription] = useState(existingForm?.description ?? '')
  const [fields, setFields] = useState<IntakeField[]>(existingForm?.fields ?? [])
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [shareUrl] = useState<string | null>(
    existingForm ? `${APP_URL}/intake/${existingForm.shareToken}` : null
  )

  function addField(type: IntakeFieldType) {
    setFields((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        label: defaultLabel(type),
        placeholder: '',
        required: type !== 'heading' && type !== 'checkbox',
        options: type === 'select' ? ['Option 1', 'Option 2'] : undefined,
        helpText: '',
      },
    ])
  }

  function updateField(id: string, patch: Partial<IntakeField>) {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  function moveField(index: number, direction: 'up' | 'down') {
    setFields((prev) => {
      const next = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  function deleteField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id))
    setDeleteTarget(null)
  }

  async function handleCopyLink() {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSave() {
    if (!title.trim()) {
      toast.error('Form title is required')
      return
    }
    if (fields.length === 0) {
      toast.error('Add at least one field')
      return
    }
    const emptyLabel = fields.find((f) => !f.label.trim())
    if (emptyLabel) {
      toast.error('All fields must have a label')
      return
    }

    setSaving(true)
    try {
      if (!existingForm?.id) {
        const res = await fetch('/api/intake-forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description: description || null, fields }),
        })
        if (!res.ok) throw new Error()
        const { id } = await res.json()
        toast.success('Form created')
        router.push(`/intake-forms/${id}`)
      } else {
        const res = await fetch(`/api/intake-forms/${existingForm.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description: description || null, fields }),
        })
        if (!res.ok) throw new Error()
        toast.success('Form saved')
        router.refresh()
      }
    } catch {
      toast.error('Failed to save form')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={existingForm ? 'Edit Form' : 'New Intake Form'}
        backHref="/intake-forms"
        backLabel="All Forms"
        icon={<ClipboardText size={24} weight="duotone" className="text-primary" />}
        action={
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : existingForm ? 'Save Changes' : 'Create Form'}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        {/* Left: builder */}
        <div className="space-y-5">
          {/* Title & description */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="form-title">Form Title</Label>
                <Input
                  id="form-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. New Client Intake"
                  autoComplete="off"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="form-description">Description <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Textarea
                  id="form-description"
                  value={description ?? ''}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what this form is for..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add field type pills */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Add Field</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {FIELD_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => addField(type)}
                    className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    {FIELD_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Field list */}
          {fields.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-sm text-muted-foreground">Click a field type above to add your first field.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <FieldEditor
                  key={field.id}
                  field={field}
                  index={index}
                  total={fields.length}
                  onChange={(patch) => updateField(field.id, patch)}
                  onMoveUp={() => moveField(index, 'up')}
                  onMoveDown={() => moveField(index, 'down')}
                  onDelete={() => setDeleteTarget(field.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: preview + share */}
        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          {/* Share link (only when editing) */}
          {existingForm && shareUrl && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Share Link</p>
                <div
                  className="flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground font-mono overflow-hidden cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={handleCopyLink}
                  title="Click to copy"
                >
                  <span className="truncate">{shareUrl}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={handleCopyLink}>
                    {copied ? (
                      <><Check className="mr-1.5 h-3.5 w-3.5 text-green-600" />Copied</>
                    ) : (
                      <><Copy className="mr-1.5 h-3.5 w-3.5" />Copy Link</>
                    )}
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => window.open(shareUrl, '_blank')}>
                    <ArrowSquareOut className="mr-1.5 h-3.5 w-3.5" /> Preview
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Share this link with your client to collect their info
                </p>
              </CardContent>
            </Card>
          )}

          {/* Live preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm text-muted-foreground font-medium uppercase tracking-wide">Preview</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-7"
                onClick={() => setPreviewOpen(true)}
                disabled={fields.length === 0 && !title}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview as client
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {title && <h2 className="text-base font-bold text-foreground mb-1">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

              {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Add fields to preview your form</p>
              ) : (
                <div className="space-y-4 opacity-60 pointer-events-none select-none">
                  {fields.map((field) => (
                    <FieldPreview key={field.id} field={field} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5">
            <DialogTitle>Client view</DialogTitle>
          </DialogHeader>
          <div className="px-5 pb-5">
            <ClientFormPreview title={title} description={description} fields={fields} />
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete Field?"
        description="This field and any responses to it will no longer be shown."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => deleteTarget && deleteField(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}

function FieldEditor({
  field,
  index,
  total,
  onChange,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  field: IntakeField
  index: number
  total: number
  onChange: (patch: Partial<IntakeField>) => void
  onMoveUp: () => void
  onMoveDown: () => void
  onDelete: () => void
}) {
  const hasPlaceholder = ['text', 'textarea', 'email', 'phone', 'number', 'date'].includes(field.type)

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {FIELD_TYPE_LABELS[field.type]}
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onMoveUp} disabled={index === 0} className="h-7 w-7 p-0">
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onMoveDown} disabled={index === total - 1} className="h-7 w-7 p-0">
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete} className="h-7 w-7 p-0">
              <Trash className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Label</Label>
          <Input
            value={field.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Field label"
            autoComplete="off"
          />
        </div>

        {hasPlaceholder && (
          <div className="space-y-1.5">
            <Label className="text-xs">Placeholder</Label>
            <Input
              value={field.placeholder ?? ''}
              onChange={(e) => onChange({ placeholder: e.target.value })}
              placeholder="Placeholder text..."
              autoComplete="off"
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label className="text-xs">Help Text <span className="text-muted-foreground">(optional)</span></Label>
          <Input
            value={field.helpText ?? ''}
            onChange={(e) => onChange({ helpText: e.target.value })}
            placeholder="Additional instructions..."
            autoComplete="off"
          />
        </div>

        {field.type === 'select' && (
          <div className="space-y-2">
            <Label className="text-xs">Options</Label>
            {(field.options ?? []).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={opt}
                  onChange={(e) => {
                    const opts = [...(field.options ?? [])]
                    opts[i] = e.target.value
                    onChange({ options: opts })
                  }}
                  placeholder={`Option ${i + 1}`}
                  autoComplete="off"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 shrink-0"
                  onClick={() => {
                    const opts = (field.options ?? []).filter((_, j) => j !== i)
                    onChange({ options: opts })
                  }}
                >
                  <Trash className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ options: [...(field.options ?? []), `Option ${(field.options?.length ?? 0) + 1}`] })}
            >
              <Plus className="mr-1.5 h-3 w-3" /> Add option
            </Button>
          </div>
        )}

        {field.type !== 'heading' && (
          <div className="flex items-center gap-2 pt-1">
            <Switch
              id={`required-${field.id}`}
              checked={field.required}
              onCheckedChange={(checked) => onChange({ required: checked })}
            />
            <Label htmlFor={`required-${field.id}`} className="text-xs cursor-pointer">Required</Label>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function FieldPreview({ field }: { field: IntakeField }) {
  if (field.type === 'heading') {
    return (
      <div className="pt-1">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide border-b border-border pb-1">{field.label || 'Section Heading'}</h3>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-foreground">
        {field.label || 'Field Label'}
        {field.required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {field.helpText && <p className="text-xs text-muted-foreground">{field.helpText}</p>}
      {field.type === 'textarea' && (
        <div className="h-16 rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          {field.placeholder || ''}
        </div>
      )}
      {field.type === 'select' && (
        <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          Select an option...
        </div>
      )}
      {field.type === 'checkbox' && (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-border bg-muted/20" />
          <span className="text-xs text-muted-foreground">{field.placeholder || 'Yes'}</span>
        </div>
      )}
      {!['textarea', 'select', 'checkbox'].includes(field.type) && (
        <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          {field.placeholder || ''}
        </div>
      )}
    </div>
  )
}
