'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sparkle, FloppyDisk, X, Shapes } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui'
import { UpgradePrompt } from '@/components/upgrade/UpgradePrompt'
import { TemplateSelector } from '@/components/contracts/TemplateSelector'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import type { ClientRow, ContractTemplateRow } from '@/lib/db/supabase'
import type { NicheContractTemplate } from '@/lib/contracts/templates'

interface Props {
  clients: ClientRow[]
  templates: { my: ContractTemplateRow[]; global: ContractTemplateRow[] }
  defaultTemplateId?: string
  defaultClientId?: string
  returnTo?: string
  profile: { fullName: string; businessName: string | null }
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']

export function ContractForm({ clients, templates, defaultTemplateId, defaultClientId, returnTo, profile }: Props) {
  const router = useRouter()
  const allTemplates = [...templates.my, ...templates.global]

  const [saving, setSaving] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [clientId, setClientId] = useState(defaultClientId ?? '')
  const [templateId, setTemplateId] = useState(defaultTemplateId ?? allTemplates[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [paymentTerms, setPaymentTerms] = useState('50% upfront, 50% on delivery')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState('')
  const [additionalTerms, setAdditionalTerms] = useState('')
  const [nicheTemplate, setNicheTemplate] = useState<NicheContractTemplate | null>(null)

  const selectedClient = clients.find((c) => c.id === clientId)
  const selectedTemplate = allTemplates.find((t) => t.id === templateId)

  const handleNicheSelect = (template: NicheContractTemplate | null) => {
    if (!template) {
      setNicheTemplate(null)
      return
    }
    if ((title.trim() || nicheTemplate) && title !== nicheTemplate?.suggestedTitle) {
      if (!window.confirm('This will replace your current title and payment terms with the template defaults. Continue?')) return
    }
    setNicheTemplate(template)
    setTitle(template.suggestedTitle)
    setPaymentTerms(template.suggestedPaymentTerms)
  }

  const activeContent = nicheTemplate?.content ?? selectedTemplate?.content ?? null

  const previewValues: Record<string, string> = useMemo(() => ({
    client_name: selectedClient?.name ?? '',
    client_company: selectedClient?.company ?? '',
    client_email: selectedClient?.email ?? '',
    freelancer_name: profile.fullName,
    freelancer_business: profile.businessName ?? '',
    project_description: projectDescription,
    rate: amount,
    currency,
    start_date: startDate ? formatDate(startDate) : '',
    end_date: endDate ? formatDate(endDate) : '',
    payment_terms: paymentTerms,
  }), [selectedClient, profile, projectDescription, amount, currency, startDate, endDate, paymentTerms])

  const handleSubmit = async () => {
    if (!clientId) { toast.error('Please select a client'); return }
    if (!templateId) { toast.error('Please select a template'); return }
    if (!title.trim()) { toast.error('Contract title is required'); return }
    if (!startDate) { toast.error('Start date is required'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, templateId, title, projectDescription, amount: Number(amount) || 0, currency, paymentTerms, startDate, endDate, additionalTerms, nicheContent: nicheTemplate?.content ?? undefined }),
      })
      if (res.status === 402) { setShowUpgrade(true); return }
      if (!res.ok) throw new Error()
      const { id } = await res.json()
      toast.success('Contract created')
      router.push(`/contracts/${id}`)
      router.refresh()
    } catch {
      toast.error('Failed to create contract')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
    <UpgradePrompt open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    <TemplateSelector
      open={showTemplateSelector}
      onClose={() => setShowTemplateSelector(false)}
      onSelect={handleNicheSelect}
    />
    <div>
      <PageHeader
        title="New Contract"
        backHref={returnTo ?? '/contracts'}
        backLabel={returnTo ? 'Back' : 'Back to Contracts'}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Form */}
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="text-base">Contract Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {clients.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    No clients yet.{' '}
                    <Link href="/clients/new" className="text-primary underline">Add a client first</Link>
                  </p>
                )}
              </div>

              {/* Niche template picker */}
              <div className="space-y-1.5">
                <Label>Niche Contract Template</Label>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-2 h-auto py-2.5 px-3 text-left"
                  onClick={() => setShowTemplateSelector(true)}
                >
                  <Shapes className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    {nicheTemplate ? (
                      <span className="text-sm font-medium text-foreground">{nicheTemplate.label}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">Choose a niche-specific template…</span>
                    )}
                  </div>
                  {nicheTemplate && (
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={(e) => { e.stopPropagation(); setNicheTemplate(null) }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  7 professional templates for web, photo, design, copy, video &amp; social.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label>Base Template</Label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.my.length > 0 && (
                      <>
                        <SelectItem value="_heading_my" disabled>— My Templates —</SelectItem>
                        {templates.my.map((t) => (
                          <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                        ))}
                      </>
                    )}
                    <SelectItem value="_heading_global" disabled>— Template Library —</SelectItem>
                    {templates.global.map((t) => (
                      <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {nicheTemplate
                    ? 'Niche template overrides this content in the final contract.'
                    : <Link href="/contracts/templates" className="text-primary underline">Manage templates →</Link>
                  }
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="title">Contract Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Website Redesign Project"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Project Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="desc">Project Description</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs text-muted-foreground"
                    onClick={() => toast.info('AI generation coming soon')}
                  >
                    <Sparkle className="mr-1 h-3 w-3" /> Generate from AI
                  </Button>
                </div>
                <Textarea
                  id="desc"
                  rows={4}
                  placeholder="Describe the project scope, deliverables, and any specific requirements…"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="amount">Contract Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="terms">Payment Terms</Label>
                <Input
                  id="terms"
                  placeholder="e.g., 50% upfront, 50% on delivery"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="start">Start Date</Label>
                  <Input id="start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="end">End Date (optional)</Label>
                  <Input id="end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="extra">Additional Terms (optional)</Label>
                <Textarea
                  id="extra"
                  rows={3}
                  placeholder="Any additional clauses or terms…"
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/contracts')}>
              <X className="mr-1 h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              <FloppyDisk className="mr-1 h-4 w-4" />
              {saving ? 'Creating…' : 'Create Contract'}
            </Button>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">Live Preview</CardTitle>
                {nicheTemplate && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {nicheTemplate.label}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="max-h-[70vh] overflow-y-auto">
              {activeContent ? (
                <ContractPreview content={activeContent} values={previewValues} />
              ) : (
                <p className="text-sm text-muted-foreground">Select a template to see preview</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}

function ContractPreview({ content, values }: { content: string; values: Record<string, string> }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1.5 text-xs leading-relaxed text-foreground">
      {lines.map((line, i) => {
        if (line.startsWith('## ')) return <h2 key={i} className="mt-3 font-semibold text-sm">{line.slice(3)}</h2>
        if (line.startsWith('### ')) return <h3 key={i} className="mt-2 font-medium">{line.slice(4)}</h3>
        if (line === '---') return <hr key={i} className="my-2 border-border" />
        return <p key={i} className="whitespace-pre-wrap">{renderLine(line, values)}</p>
      })}
    </div>
  )
}

function renderLine(text: string, values: Record<string, string>) {
  const parts = text.split(/({{[^}]+}})/)
  return parts.map((part, i) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      const key = part.slice(2, -2)
      const val = values[key]
      if (val) {
        return <span key={i} className="font-medium text-primary">{val}</span>
      }
      return (
        <span key={i} className="rounded bg-muted px-1 text-muted-foreground">
          {part}
        </span>
      )
    }
    const boldParts = part.split(/(\*\*[^*]+\*\*)/)
    return boldParts.map((bp, j) => {
      if (bp.startsWith('**') && bp.endsWith('**')) return <strong key={j}>{bp.slice(2, -2)}</strong>
      return <span key={j}>{bp}</span>
    })
  })
}
