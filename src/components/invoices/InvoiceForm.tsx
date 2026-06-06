'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash, FileText, FloppyDisk, X, CaretDown, Check, Minus } from '@phosphor-icons/react'
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
  const [taxRate, setTaxRate] = useState<number>(
    (defaultTemplate?.defaultTaxRate != null && defaultTemplate.defaultTaxRate > 0)
      ? defaultTemplate.defaultTaxRate
      : (profile.defaultTaxRate ?? 0)
  )
  const [discountAmount, setDiscountAmount] = useState(0)
  const [depositAmount, setDepositAmount] = useState(0)

  // Display strings for decimal fields — kept in sync on blur/stepper
  const initTaxDisplay = (defaultTemplate?.defaultTaxRate != null && defaultTemplate.defaultTaxRate > 0)
    ? defaultTemplate.defaultTaxRate.toFixed(2)
    : (profile.defaultTaxRate > 0 ? profile.defaultTaxRate.toFixed(2) : '0.00')
  const [taxRateDisplay, setTaxRateDisplay] = useState(initTaxDisplay)
  const [discountDisplay, setDiscountDisplay] = useState('0.00')
  const [depositDisplay, setDepositDisplay] = useState('')
  const [notes, setNotes] = useState(defaultTemplate?.defaultNotes ?? '')
  const [paymentTerms, setPaymentTerms] = useState(defaultTemplate?.defaultPaymentTerms ?? '')
  const [paymentInstructions, setPaymentInstructions] = useState(defaultTemplate?.paymentInstructions ?? '')
  const [items, setItems] = useState<ItemRow[]>([
    { _id: crypto.randomUUID(), description: '', quantity: 1, unitPrice: 0, amount: 0 },
  ])

  const DRAFT_KEY = 'filecurrent_invoice_draft'
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (!saved) return
      const d = JSON.parse(saved) as {
        clientId?: string; templateId?: string; invoiceNumber?: string
        invoiceDate?: string; dueDate?: string; currency?: string
        taxRate?: number; discountAmount?: number; depositAmount?: number
        notes?: string; paymentTerms?: string; paymentInstructions?: string
        items?: ItemRow[]
      }
      if (d.clientId) setClientId(d.clientId)
      if (d.templateId) setTemplateId(d.templateId)
      if (d.invoiceNumber) setInvoiceNumber(d.invoiceNumber)
      if (d.invoiceDate) setInvoiceDate(d.invoiceDate)
      if (d.dueDate) setDueDate(d.dueDate)
      if (d.currency) setCurrency(d.currency)
      if (d.taxRate != null) setTaxRate(d.taxRate)
      if (d.discountAmount != null) setDiscountAmount(d.discountAmount)
      if (d.depositAmount != null) setDepositAmount(d.depositAmount)
      if (d.notes != null) setNotes(d.notes)
      if (d.paymentTerms != null) setPaymentTerms(d.paymentTerms)
      if (d.paymentInstructions != null) setPaymentInstructions(d.paymentInstructions)
      if (d.items?.length) setItems(d.items)
    } catch {
      // corrupted draft — ignore
    }
  }, [])

  // Persist draft to localStorage (debounced 500ms)
  const persistDraft = useCallback(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    draftTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify({
          clientId, templateId, invoiceNumber, invoiceDate, dueDate,
          currency, taxRate, discountAmount, depositAmount,
          notes, paymentTerms, paymentInstructions, items,
        }))
      } catch {
        // storage full — ignore
      }
    }, 500)
  }, [clientId, templateId, invoiceNumber, invoiceDate, dueDate, currency, taxRate, discountAmount, depositAmount, notes, paymentTerms, paymentInstructions, items])

  useEffect(() => {
    persistDraft()
  }, [persistDraft])

  const clearDraft = () => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
  }

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
          paymentInstructions: paymentInstructions || undefined,
          markAsSent,
        }),
      })
      if (res.status === 402) { setShowUpgrade(true); return }
      if (!res.ok) throw new Error()
      const { id } = await res.json()
      clearDraft()
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
                  setTaxRate(
                    (t.defaultTaxRate != null && t.defaultTaxRate > 0)
                      ? t.defaultTaxRate
                      : (profile.defaultTaxRate ?? 0)
                  )
                  if (t.defaultNotes) setNotes(t.defaultNotes)
                  if (t.defaultPaymentTerms) setPaymentTerms(t.defaultPaymentTerms)
                  if (t.paymentInstructions) setPaymentInstructions(t.paymentInstructions)
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
                  {/* Qty */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => updateItem(item._id, 'quantity', Math.max(1, item.quantity - 1))}
                      className="flex h-9 w-7 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={item.quantity}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value
                        const n = parseInt(v, 10)
                        if (v === '' || (!isNaN(n) && n >= 0)) updateItem(item._id, 'quantity', isNaN(n) ? 0 : n)
                      }}
                      className="h-9 w-full min-w-0 rounded-none border border-input bg-background px-1 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateItem(item._id, 'quantity', item.quantity + 1)}
                      className="flex h-9 w-7 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                  {/* Unit Price */}
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => updateItem(item._id, 'unitPrice', Math.max(0, item.unitPrice - 1))}
                      className="flex h-9 w-7 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Minus size={11} />
                    </button>
                    <input
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9.]*"
                      value={item.unitPrice}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value
                        const n = parseFloat(v)
                        if (v === '' || v === '.' || (!isNaN(n) && n >= 0)) updateItem(item._id, 'unitPrice', isNaN(n) ? 0 : n)
                      }}
                      className="h-9 w-full min-w-0 rounded-none border border-input bg-background px-1 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => updateItem(item._id, 'unitPrice', item.unitPrice + 1)}
                      className="flex h-9 w-7 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <Plus size={11} />
                    </button>
                  </div>
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
                  <div className="flex items-center">
                    <button type="button"
                      onClick={() => { const n = Math.max(0, parseFloat((taxRate - 0.25).toFixed(2))); setTaxRate(n); setTaxRateDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Minus size={11} /></button>
                    <input id="tax-rate" type="text" inputMode="decimal" pattern="[0-9.]*"
                      value={taxRateDisplay}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value
                        if (/^[0-9]*\.?[0-9]*$/.test(v)) {
                          setTaxRateDisplay(v)
                          const n = parseFloat(v)
                          if (!isNaN(n)) setTaxRate(n)
                        }
                      }}
                      onBlur={() => setTaxRateDisplay(taxRate.toFixed(2))}
                      className="h-9 w-full min-w-0 rounded-none border border-input bg-background px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button type="button"
                      onClick={() => { const n = parseFloat((taxRate + 0.25).toFixed(2)); setTaxRate(n); setTaxRateDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Plus size={11} /></button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="discount">Discount Amount</Label>
                  <div className="flex items-center">
                    <button type="button"
                      onClick={() => { const n = Math.max(0, parseFloat((discountAmount - 1).toFixed(2))); setDiscountAmount(n); setDiscountDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Minus size={11} /></button>
                    <input id="discount" type="text" inputMode="decimal" pattern="[0-9.]*"
                      value={discountDisplay}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value
                        if (/^[0-9]*\.?[0-9]*$/.test(v)) {
                          setDiscountDisplay(v)
                          const n = parseFloat(v)
                          if (!isNaN(n)) setDiscountAmount(n)
                        }
                      }}
                      onBlur={() => setDiscountDisplay(discountAmount.toFixed(2))}
                      className="h-9 w-full min-w-0 rounded-none border border-input bg-background px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button type="button"
                      onClick={() => { const n = parseFloat((discountAmount + 1).toFixed(2)); setDiscountAmount(n); setDiscountDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Plus size={11} /></button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deposit">Deposit Received (optional)</Label>
                  <div className="flex items-center">
                    <button type="button"
                      onClick={() => { const n = Math.max(0, parseFloat((depositAmount - 1).toFixed(2))); setDepositAmount(n); setDepositDisplay(n > 0 ? n.toFixed(2) : '') }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Minus size={11} /></button>
                    <input id="deposit" type="text" inputMode="decimal" pattern="[0-9.]*"
                      value={depositDisplay}
                      placeholder="0.00"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const v = e.target.value
                        if (/^[0-9]*\.?[0-9]*$/.test(v)) {
                          setDepositDisplay(v)
                          const n = parseFloat(v)
                          setDepositAmount(isNaN(n) ? 0 : n)
                        }
                      }}
                      onBlur={() => setDepositDisplay(depositAmount > 0 ? depositAmount.toFixed(2) : '')}
                      className="h-9 w-full min-w-0 rounded-none border border-input bg-background px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button type="button"
                      onClick={() => { const n = parseFloat((depositAmount + 1).toFixed(2)); setDepositAmount(n); setDepositDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Plus size={11} /></button>
                  </div>
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
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Notes (visible to client)</Label>
                <Textarea rows={3} placeholder="Thank you for your business!" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Payment Terms</Label>
                <Textarea rows={3} placeholder="Payment due within 30 days" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Payment Instructions</Label>
              <Textarea
                rows={3}
                placeholder="e.g. Pay via Zelle to email@example.com, PayPal @handle, or bank transfer. Include invoice number as reference."
                value={paymentInstructions}
                onChange={(e) => setPaymentInstructions(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Shown on the invoice so clients always know how to pay.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => { clearDraft(); router.push('/invoices') }}>
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
      <div className="relative flex-1">
        <Input
          placeholder="Service or product description"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pr-8"
        />
        {presets.length > 0 && (
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              <CaretDown className="h-3.5 w-3.5" />
            </button>
          </PopoverTrigger>
        )}
      </div>
      {presets.length > 0 && (
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search presets…" />
            <CommandList>
              <div className="px-3 py-1.5 text-[11px] text-muted-foreground border-b">
                Select a preset or type your own description
              </div>
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
