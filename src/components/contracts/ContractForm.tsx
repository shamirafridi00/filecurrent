'use client'

import { useState, useMemo, useEffect } from 'react'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/ui'
import { UpgradePrompt } from '@/components/upgrade/UpgradePrompt'
import { TemplateSelector } from '@/components/contracts/TemplateSelector'
import { toast } from 'sonner'
import { formatDate } from '@/lib/utils'
import type { ClientRow, ContractTemplateRow } from '@/lib/db/supabase'
import { templateForProfession, type ContractTemplate } from '@/lib/contracts/templates'

interface ProposalDefaults {
  proposalId: string
  clientId: string
  title: string
  amount: number
  currency: string
  projectDescription: string
  additionalTerms: string
}

interface Props {
  clients: ClientRow[]
  templates: { my: ContractTemplateRow[]; global: ContractTemplateRow[] }
  defaultTemplateId?: string
  defaultClientId?: string
  returnTo?: string
  proposalDefaults?: ProposalDefaults
  profession?: string | null
  profile: { fullName: string; businessName: string | null }
}

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
const DRAFT_KEY = 'filecurrent_contract_draft'
const LAST_TEMPLATE_KEY = 'filecurrent_last_template'
// Set to '1' after any template choice (including skip/blank) so selector doesn't re-open on next visit
const TEMPLATE_CHOSEN_KEY = 'filecurrent_template_chosen'

function hasChosenTemplate(): boolean {
  if (typeof window === 'undefined') return false
  try { return localStorage.getItem(TEMPLATE_CHOSEN_KEY) === '1' } catch { return false }
}

function markTemplateChosen(): void {
  try { localStorage.setItem(TEMPLATE_CHOSEN_KEY, '1') } catch { /* ignore */ }
}

interface DraftState {
  clientId: string
  templateId: string
  title: string
  contractContent: string
  projectDescription: string
  amount: string
  currency: string
  paymentTerms: string
  startDate: string
  endDate: string
  additionalTerms: string
  appliedTemplateId: string | null
  appliedTemplateLabel: string | null
}

function loadDraft(): DraftState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? (JSON.parse(raw) as DraftState) : null
  } catch {
    return null
  }
}

interface SavedTemplate { id: ContractTemplate['id']; label: string }

function loadLastTemplate(): SavedTemplate | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LAST_TEMPLATE_KEY)
    return raw ? (JSON.parse(raw) as SavedTemplate) : null
  } catch {
    return null
  }
}

function saveLastTemplate(t: ContractTemplate) {
  try { localStorage.setItem(LAST_TEMPLATE_KEY, JSON.stringify({ id: t.id, label: t.label })) } catch { /* ignore */ }
}

export function ContractForm({ clients, templates, defaultTemplateId, defaultClientId, returnTo, proposalDefaults, profession, profile }: Props) {
  const router = useRouter()
  const allTemplates = [...templates.my, ...templates.global]

  // When arriving from a proposal, skip the draft restore so proposal values take priority
  const draft = proposalDefaults ? null : (typeof window !== 'undefined' ? loadDraft() : null)
  const lastTemplate = typeof window !== 'undefined' ? loadLastTemplate() : null
  const alreadyChosen = typeof window !== 'undefined' ? hasChosenTemplate() : false

  const [saving, setSaving] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  // First-ever visit with a known onboarding profession → auto-apply that
  // profession's template instead of asking again (the user already chose
  // their profession during onboarding).
  const professionTemplate = templateForProfession(profession)
  const isFirstVisit = !alreadyChosen && !draft && !lastTemplate
  const autoApplyProfession = isFirstVisit && !proposalDefaults && !!professionTemplate
  // Open selector when: coming from proposal (always pick template), OR
  // first-ever visit with no profession match to fall back on.
  const [showTemplateSelector, setShowTemplateSelector] = useState(
    !!proposalDefaults || (isFirstVisit && !professionTemplate)
  )
  const [pendingTemplate, setPendingTemplate] = useState<ContractTemplate | null>(null)
  const [clientId, setClientId] = useState(draft?.clientId ?? proposalDefaults?.clientId ?? defaultClientId ?? '')
  const [templateId, setTemplateId] = useState(draft?.templateId ?? defaultTemplateId ?? allTemplates[0]?.id ?? '')
  const [title, setTitle] = useState(draft?.title ?? proposalDefaults?.title ?? '')
  const [contractContent, setContractContent] = useState(draft?.contractContent ?? '')
  const [projectDescription, setProjectDescription] = useState(draft?.projectDescription ?? proposalDefaults?.projectDescription ?? '')
  const [amount, setAmount] = useState(draft?.amount ?? (proposalDefaults ? String(proposalDefaults.amount) : ''))
  const [currency, setCurrency] = useState(draft?.currency ?? proposalDefaults?.currency ?? 'USD')
  const [paymentTerms, setPaymentTerms] = useState(draft?.paymentTerms ?? '50% upfront, 50% on delivery')
  const [startDate, setStartDate] = useState(draft?.startDate ?? new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(draft?.endDate ?? '')
  const [additionalTerms, setAdditionalTerms] = useState(draft?.additionalTerms ?? proposalDefaults?.additionalTerms ?? '')
  const [appliedTemplate, setAppliedTemplate] = useState<ContractTemplate | null>(
    draft?.appliedTemplateId
      ? { id: draft.appliedTemplateId as ContractTemplate['id'], label: draft.appliedTemplateLabel ?? '', description: '', icon: '', suggestedTitle: '', suggestedPaymentTerms: '', content: draft.contractContent }
      : lastTemplate
        ? { id: lastTemplate.id, label: lastTemplate.label, description: '', icon: '', suggestedTitle: '', suggestedPaymentTerms: '', content: '' }
        : null
  )

  // Persist draft to localStorage whenever any field changes
  useEffect(() => {
    const draftState: DraftState = {
      clientId, templateId, title, contractContent, projectDescription,
      amount, currency, paymentTerms, startDate, endDate, additionalTerms,
      appliedTemplateId: appliedTemplate?.id ?? null,
      appliedTemplateLabel: appliedTemplate?.label ?? null,
    }
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(draftState)) } catch { /* ignore */ }
  }, [clientId, templateId, title, contractContent, projectDescription, amount, currency, paymentTerms, startDate, endDate, additionalTerms, appliedTemplate])

  const selectedClient = clients.find((c) => c.id === clientId)
  const selectedDbTemplate = allTemplates.find((t) => t.id === templateId)

  const applyTemplate = (template: ContractTemplate) => {
    setAppliedTemplate(template)
    markTemplateChosen()
    // Keep the proposal title if we came from a proposal; only use template's suggested title otherwise
    if (!proposalDefaults) setTitle(template.suggestedTitle)
    setPaymentTerms(template.suggestedPaymentTerms)
    setContractContent(template.id === 'blank' ? '' : template.content)
    if (template.id !== 'blank') {
      saveLastTemplate(template)
      toast.success(`${template.label} template applied`, {
        description: 'This will be pre-selected next time you create a contract.',
        action: {
          label: 'Change',
          onClick: () => setShowTemplateSelector(true),
        },
        duration: 5000,
      })
    }
  }

  // First visit with a known profession: apply its template immediately so the
  // onboarding choice carries through (previously the chooser re-asked).
  useEffect(() => {
    if (autoApplyProfession && professionTemplate) {
      applyTemplate(professionTemplate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTemplateSelect = (template: ContractTemplate) => {
    setShowTemplateSelector(false)
    if (contractContent.trim() && appliedTemplate?.id !== template.id) {
      setPendingTemplate(template)
      return
    }
    applyTemplate(template)
  }

  const handleChangeTemplate = () => {
    setShowTemplateSelector(true)
  }

  // Preview uses contractContent when a niche template is applied, otherwise falls back to DB template
  const previewContent = contractContent || selectedDbTemplate?.content || null

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
    if (!templateId) { toast.error('Please select a base template'); return }
    if (!title.trim()) { toast.error('Contract title is required'); return }
    if (!startDate) { toast.error('Start date is required'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          templateId,
          title,
          projectDescription,
          amount: Number(amount) || 0,
          currency,
          paymentTerms,
          startDate,
          endDate,
          additionalTerms,
          nicheContent: contractContent.trim() || undefined,
        }),
      })
      if (res.status === 402) { setShowUpgrade(true); return }
      if (!res.ok) throw new Error()
      const { id } = await res.json()
      try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }

      // If created from a proposal, link the contract back to that proposal
      if (proposalDefaults?.proposalId) {
        await fetch(`/api/proposals/${proposalDefaults.proposalId}/link-contract`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contractId: id }),
        }).catch(() => {})
      }

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
        onSelect={handleTemplateSelect}
        onSkip={() => { markTemplateChosen(); setShowTemplateSelector(false) }}
        profession={profession}
      />
      <AlertDialog open={!!pendingTemplate} onOpenChange={(v) => { if (!v) setPendingTemplate(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Replace contract content?</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current contract content with the{' '}
              <strong>{pendingTemplate?.label}</strong> template. Any edits you&apos;ve made will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingTemplate(null)}>Keep current</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingTemplate) applyTemplate(pendingTemplate)
                setPendingTemplate(null)
              }}
            >
              Replace with template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div>
        <PageHeader
          title="New Contract"
          backHref={returnTo ?? '/contracts'}
          backLabel={returnTo ? 'Back' : 'Back to Contracts'}
        />

        {proposalDefaults && (
          <div className="mb-5 rounded-lg bg-blue-50 border border-blue-200 px-5 py-3 text-sm text-blue-700">
            Fields pre-filled from accepted proposal. Choose a contract template, review everything, then save.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Form */}
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Contract Details</CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={handleChangeTemplate}
                  >
                    <Shapes className="h-3.5 w-3.5" />
                    {appliedTemplate ? 'Change Template' : 'Choose Template'}
                  </Button>
                </div>
                {appliedTemplate && appliedTemplate.id !== 'blank' && (
                  <p className="text-xs text-primary font-medium mt-1">
                    Using: {appliedTemplate.label}
                  </p>
                )}
              </CardHeader>
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

                {!appliedTemplate || appliedTemplate.id === 'blank' ? (
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
                      <Link href="/contracts/templates" className="text-primary underline">Manage templates →</Link>
                    </p>
                  </div>
                ) : null}

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
              <CardHeader><CardTitle className="text-base">Contract Content</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="content">Contract Text</Label>
                    {appliedTemplate && appliedTemplate.id !== 'blank' && (
                      <span className="text-xs text-muted-foreground">
                        Pre-filled from {appliedTemplate.label} template — edit freely
                      </span>
                    )}
                  </div>
                  <Textarea
                    id="content"
                    rows={20}
                    placeholder="Your contract content will appear here after selecting a template, or type your own…"
                    value={contractContent}
                    onChange={(e) => setContractContent(e.target.value)}
                    className="font-mono text-xs leading-relaxed resize-y"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use variables like <code className="bg-muted px-1 rounded">{'{{client_name}}'}</code>, <code className="bg-muted px-1 rounded">{'{{rate}}'}</code>, <code className="bg-muted px-1 rounded">{'{{start_date}}'}</code> — they are filled automatically.
                  </p>
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
              <Button variant="outline" onClick={() => { try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ } router.push('/contracts') }}>
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
                  {appliedTemplate && appliedTemplate.id !== 'blank' && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {appliedTemplate.label}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
                {previewContent ? (
                  <ContractPreview content={previewContent} values={previewValues} />
                ) : (
                  <p className="text-sm text-muted-foreground">Select a template or type contract content to see preview</p>
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
        if (line.startsWith('### ')) return <h3 key={i} className="mt-2 font-medium">{line.slice(4)}</h3>
        if (line.startsWith('## ')) return <h2 key={i} className="mt-3 font-semibold text-sm">{line.slice(3)}</h2>
        if (line.startsWith('# ')) return <h1 key={i} className="mt-4 font-bold text-base">{line.slice(2)}</h1>
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
