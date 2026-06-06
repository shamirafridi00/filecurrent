'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash, FileText, FloppyDisk, X, CaretDown, Check } from '@phosphor-icons/react'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { PageHeader } from '@/components/ui'
import { UpgradePrompt } from '@/components/upgrade/UpgradePrompt'
import { InvoicePreview } from '@/components/invoices/InvoicePreview'
import { toast } from 'sonner'
import { formatCurrency, generateInvoiceNumber, calculateInvoiceTotals } from '@/lib/utils'
import { CURRENCIES, PAYMENT_METHODS } from '@/types'
import type { ClientRow, InvoiceTemplateRow, LineItemPreset } from '@/lib/db/supabase'

interface ItemRow {
  _id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface Props {
  clients: ClientRow[]
  templates: InvoiceTemplateRow[]
  lineItemPresets: LineItemPreset[]
  nextSequence: number
  defaultTemplateId?: string
  defaultClientId?: string
  returnTo?: string
  profile: { fullName: string; businessName: string | null; defaultTaxRate: number }
}

export function InvoiceForm({ clients, templates, lineItemPresets, nextSequence, defaultTemplateId, defaultClientId, returnTo, profile }: Props) {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const defaultTemplate = defaultTemplateId
    ? templates.find((t) => t.id === defaultTemplateId)
    : templates.find((t) => t.isDefault) ?? templates[0]

  const [saving, setSaving] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [templateId, setTemplateId] = useState(defaultTemplate?.id ?? '')
  const [clientId, setClientId] = useState(defaultClientId ?? '')
  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber(nextSequence))
  const [invoiceDate, setInvoiceDate] = useState(today)
  const [dueDate, setDueDate] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [taxRate, setTaxRate] = useState(defaultTemplate?.defaultTaxRate ?? profile.defaultTaxRate ?? 0)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0)
  const [notes, setNotes] = useState(defaultTemplate?.defaultNotes ?? '')
  const [paymentTerms, setPaymentTerms] = useState(defaultTemplate?.defaultPaymentTerms ?? '')
  const [items, setItems] = useState<ItemRow[]>([
    { _id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ])

  const updateItem = (id: string, field: keyof Omit<ItemRow, '_id'>, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item._id !== id) return item
        const updated = { ...item, [field]: value }
        updated.amount = updated.quantity * updated.unitPrice
        return updated
      })
    )
  }

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { _id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, amount: 0 },
    ])

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i._id !== id))

  const { subtotal, taxAmount, total } = calculateInvoiceTotals(items, taxRate, discountAmount)
  const balanceDue = Math.max(0, total - depositAmount)

  const handleSave = async (markAsSent: boolean) => {
    if (!clientId) { toast.error('Please select a client'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId, templateId: templateId || null, invoiceNumber, invoiceDate,
          dueDate: dueDate || undefined, currency,
          items: items.map(({ description, quantity, unitPrice, amount }) => ({
            description, quantity, unitPrice, amount,
          })),
          subtotal, taxRate, taxAmount, discountAmount, depositAmount, total,
          notes: notes || undefined, paymentTerms: paymentTerms || undefined,
          markAsSent,
        }),
      })
      if (res.status === 402) { setShowUpgrade(true); return }
      if (!res.ok) throw new Error()
      const { id } = await res.json()
      toast.success(markAsSent ? 'Invoice created and marked as sent' : 'Draft invoice created')
      router.push(`/invoices/${id}`)
      router.refresh()
    } catch {
      toast.error('Failed to create invoice')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
    <UpgradePrompt open={showUpgrade} onClose={() => setShowUpgrade(false)} />
    <div>
      <PageHeader
        title="New Invoice"
        backHref={returnTo ?? '/invoices'}
        backLabel={returnTo ? 'Back' : 'Back to Invoices'}
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-8 items-start">
      <div className="space-y-5">
        {/* Template selector */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Invoice Template</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Select value={templateId} onValueChange={(v) => {
                setTemplateId(v)
                const t = templates.find((x) => x.id === v)
                if (t) {
                  setTaxRate(t.defaultTaxRate)
                  if (t.defaultNotes) setNotes(t.defaultNotes)
                  if (t.defaultPaymentTerms) setPaymentTerms(t.defaultPaymentTerms)
                }
              }}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choose a template…" />
                </SelectTrigger>
                <SelectContent>
                  {templates.length === 0 && (
                    <SelectItem value="_none" disabled>No templates yet</SelectItem>
                  )}
                  {templates.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}{t.isDefault ? ' (Default)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Link href="/invoices/templates" className="text-sm text-primary hover:underline shrink-0">
                Manage templates →
              </Link>
            </div>
            {templates.length === 0 && (
              <p className="mt-2 text-sm text-muted-foreground">
                <Link href="/invoices/templates/new" className="text-primary underline">Create a template first →</Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Basic Information */}
        <Card>
          <CardHeader><CardTitle className="text-base">Invoice Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Client</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client…" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}{c.company ? ` — ${c.company}` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-num">Invoice Number</Label>
                <Input id="inv-num" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="inv-date">Invoice Date</Label>
                <Input id="inv-date" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="due-date">Due Date</Label>
                <Input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Line Items</CardTitle>
            <Button size="sm" variant="outline" onClick={addItem}>
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Item
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_80px_110px_90px_32px] gap-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Description</span>
                <span>Qty</span>
                <span>Unit Price</span>
                <span className="text-right">Amount</span>
                <span />
              </div>
              {items.map((item) => (
                <div key={item._id} className="grid grid-cols-[1fr_80px_110px_90px_32px] gap-2 items-center">
                  <DescriptionInput
                    value={item.description}
                    onChange={(v) => updateItem(item._id, 'description', v)}
                    onRateChange={(rate) => { if (rate !== null) updateItem(item._id, 'unitPrice', rate) }}
                    presets={lineItemPresets}
                  />
                  <Input
                    type="number" min="0" step="0.01"
                    value={item.quantity}
                    onChange={(e) => updateItem(item._id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="text-center"
                  />
                  <Input
                    type="number" min="0" step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item._id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                  <span className="text-sm font-medium text-right">
                    {formatCurrency(item.amount, currency)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item._id)}
                    className="flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash size={15} />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Calculations */}
        <Card>
          <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" min="0" step="0.1" value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="discount">Discount Amount</Label>
                  <Input id="discount" type="number" min="0" step="0.01" value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deposit">Deposit Received (optional)</Label>
                  <Input id="deposit" type="number" min="0" step="0.01" value={depositAmount || ''}
                    placeholder="0.00"
                    onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)} />
                </div>
              </div>
              <div className="rounded-lg border bg-muted/30 p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal, currency)}</span>
                </div>
                {taxRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({taxRate}%)</span>
                    <span>{formatCurrency(taxAmount, currency)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-destructive">−{formatCurrency(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{formatCurrency(total, currency)}</span>
                </div>
                {depositAmount > 0 && (
                  <>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Deposit received</span>
                      <span>−{formatCurrency(depositAmount, currency)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-semibold text-primary">Balance Due</span>
                      <span className="font-bold text-primary text-lg">{formatCurrency(balanceDue, currency)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes + Terms */}
        <Card>
          <CardHeader><CardTitle className="text-base">Additional Information</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Notes (visible to client)</Label>
              <Textarea rows={3} placeholder="Thank you for your business!" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Payment Terms</Label>
              <Textarea rows={3} placeholder="Payment due within 30 days" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push('/invoices')}>
            <X className="mr-1 h-4 w-4" /> Cancel
          </Button>
          <Button variant="outline" onClick={() => handleSave(false)} disabled={saving}>
            <FileText className="mr-1 h-4 w-4" />
            {saving ? 'Saving…' : 'Save as Draft'}
          </Button>
          <Button onClick={() => handleSave(true)} disabled={saving}>
            <FloppyDisk className="mr-1 h-4 w-4" />
            {saving ? 'Saving…' : 'Save & Mark as Sent'}
          </Button>
        </div>
      </div>

      {/* Live preview — desktop only */}
      <div className="hidden xl:block">
        <InvoicePreview
          data={{
            invoiceNumber: invoiceNumber || '',
            invoiceDate: invoiceDate || '',
            dueDate: dueDate || undefined,
            clientName: clients.find(c => c.id === clientId)?.name || '',
            items: items.map(item => ({
              description: item.description || '',
              quantity: Number(item.quantity) || 0,
              unitPrice: Number(item.unitPrice) || 0,
            })),
            subtotal: Number(subtotal) || 0,
            taxRate: Number(taxRate) || 0,
            taxAmount: Number(taxAmount) || 0,
            discountAmount: Number(discountAmount) || 0,
            depositAmount: Number(depositAmount) || 0,
            total: Number(total) || 0,
            balanceDue: Math.max(0, (Number(total) || 0) - (Number(depositAmount) || 0)),
            notes: notes || undefined,
            paymentTerms: paymentTerms || undefined,
            currency: currency || 'USD',
          }}
          template={templates.find(t => t.id === templateId) ?? null}
          freelancerName={profile.businessName || profile.fullName}
        />
      </div>

      </div>
    </div>
    </>
  )
}

function DescriptionInput({
  value, onChange, onRateChange, presets,
}: {
  value: string
  onChange: (v: string) => void
  onRateChange: (rate: number | null) => void
  presets: LineItemPreset[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          placeholder="Service or product description"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => presets.length > 0 && setOpen(true)}
        />
      </PopoverTrigger>
      {presets.length > 0 && (
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search presets…" />
            <CommandList>
              <CommandEmpty>No presets found</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {presets.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={p.label}
                    onSelect={() => {
                      onChange(p.label)
                      onRateChange(p.defaultRate)
                      setOpen(false)
                    }}
                  >
                    <div className="flex flex-col">
                      <span>{p.label}</span>
                      {p.description && (
                        <span className="text-xs text-muted-foreground">{p.description}</span>
                      )}
                    </div>
                    {value === p.label && <Check className="ml-auto h-4 w-4 text-primary" />}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  )
}
