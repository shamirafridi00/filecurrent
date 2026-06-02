'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FloppyDisk, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader, PlaceholderGrid } from '@/components/ui'
import { toast } from 'sonner'
import { CONTRACT_PLACEHOLDERS } from '@/lib/constants'

interface Props {
  mode: 'create' | 'edit'
  templateId?: string
  initialData?: {
    name: string
    description: string
    content: string
    isDefault: boolean
  }
}

export function ContractTemplateFormPage({ mode, templateId, initialData }: Props) {
  const router = useRouter()
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState(initialData?.name ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [content, setContent] = useState(initialData?.content ?? '')
  const [isDefault, setIsDefault] = useState(initialData?.isDefault ?? false)

  const insertPlaceholder = (key: string) => {
    const el = contentRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = content.slice(0, start) + key + content.slice(end)
    setContent(next)
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + key.length, start + key.length)
    }, 0)
  }

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error('Template name is required'); return }
    if (!content.trim()) { toast.error('Template content is required'); return }
    setSaving(true)
    try {
      const url = mode === 'create'
        ? '/api/contracts/templates'
        : `/api/contracts/templates/${templateId}`
      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, content, isDefault }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success(mode === 'create' ? 'Template created' : 'Template updated')
      router.push('/contracts/templates')
      router.refresh()
    } catch {
      toast.error('Failed to save template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title={mode === 'create' ? 'New Contract Template' : 'Edit Template'}
        backHref="/contracts/templates"
        backLabel="Back to Templates"
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_280px]">
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Template Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="tmpl-name">Template Name</Label>
                <Input
                  id="tmpl-name"
                  placeholder="e.g., Standard Service Agreement"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tmpl-desc">Description</Label>
                <Textarea
                  id="tmpl-desc"
                  rows={2}
                  placeholder="Brief description of when to use this template"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="tmpl-default"
                  checked={isDefault}
                  onCheckedChange={setIsDefault}
                />
                <Label htmlFor="tmpl-default" className="cursor-pointer">
                  Set as default template
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Template Content</CardTitle></CardHeader>
            <CardContent>
              <textarea
                ref={contentRef}
                rows={24}
                placeholder="Enter your contract template. Use {{placeholders}} for dynamic values."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Use ## for headings, **bold**, --- for dividers.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Insert Placeholder</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-3 text-xs text-muted-foreground">Click to insert at cursor position</p>
              <PlaceholderGrid
                placeholders={CONTRACT_PLACEHOLDERS}
                onInsert={insertPlaceholder}
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                {[
                  { label: 'Bold', syntax: '**text**' },
                  { label: 'Heading', syntax: '## Section Title' },
                  { label: 'Divider', syntax: '---' },
                  { label: 'Bullet', syntax: '- Point' },
                ].map((g) => (
                  <div key={g.label}>
                    <span className="text-xs text-muted-foreground">{g.label}: </span>
                    <code className="text-xs font-mono text-foreground">{g.syntax}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push('/contracts/templates')}>
          <X className="mr-1 h-4 w-4" /> Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          <FloppyDisk className="mr-1 h-4 w-4" />
          {saving ? 'Saving…' : mode === 'create' ? 'Create Template' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
}
