'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash, Minus } from '@phosphor-icons/react'
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
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { CURRENCIES } from '@/types'
import type { ClientRow } from '@/lib/db/supabase'

interface ItemRow {
  _id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

interface Props {
  clients: ClientRow[]
  defaultClientId?: string
  defaultCurrency?: string
  defaultTaxRate?: number
}

export function ProposalForm({ clients, defaultClientId, defaultCurrency = 'USD', defaultTaxRate = 0 }: Props) {
  const router = useRouter()

  const [saving, setSaving] = useState(false)
  const [clientId, setClientId] = useState(defaultClientId ?? '')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [currency, setCurrency] = useState(defaultCurrency)
  const [taxRate, setTaxRate] = useState(defaultTaxRate)
  const [taxRateDisplay, setTaxRateDisplay] = useState(defaultTaxRate > 0 ? defaultTaxRate.toFixed(2) : '0.00')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountDisplay, setDiscountDisplay] = useState('0.00')
  const [validUntil, setValidUntil] = useState('')
  const [notes, setNotes] = useState('')
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

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = parseFloat(((subtotal * taxRate) / 100).toFixed(2))
  const total = parseFloat((subtotal + taxAmount - discountAmount).toFixed(2))

  const handleSave = async () => {
    if (!clientId) { toast.error('Please select a client'); return }
    if (!title.trim()) { toast.error('Please enter a proposal title'); return }
    if (items.every((i) => !i.description.trim())) { toast.error('Please add at least one line item'); return }

    setSaving(true)
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId, title: title.trim(), summary: summary.trim() || undefined,
          lineItems: items.map(({ description, quantity, unitPrice, amount }) => ({
            description, quantity, unitPrice, amount,
          })),
          subtotal, taxRate, taxAmount, discountAmount, total, currency,
          validUntil: validUntil || undefined,
          notes: notes.trim() || undefined,
        }),
      })
      if (!res.ok) throw new Error()
      const { id } = await res.json()
      toast.success('Proposal created')
      router.push(`/proposals/${id}`)
      router.refresh()
    } catch {
      toast.error('Failed to create proposal')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="New Proposal"
        backHref="/proposals"
        backLabel="Back to Proposals"
      />

      <div className="space-y-5 max-w-3xl">
        {/* Client & Title */}
        <Card>
          <CardHeader><CardTitle className="text-base">Proposal Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Client *</Label>
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
                <Label htmlFor="proposal-currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="proposal-currency"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proposal-title">Proposal Title *</Label>
              <Input
                id="proposal-title"
                placeholder="e.g. Website Redesign Project"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="proposal-summary">Project Summary</Label>
              <Textarea
                id="proposal-summary"
                placeholder="Brief overview of the project scope and objectives…"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="valid-until">Valid Until</Label>
              <Input
                id="valid-until"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Line Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Line Items</CardTitle>
            <Button size="sm" variant="outline" onClick={addItem} type="button">
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
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item._id, 'description', e.target.value)}
                    placeholder="Service or deliverable…"
                    autoComplete="off"
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
                      onWheel={(e) => e.currentTarget.blur()}
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

        {/* Summary */}
        <Card>
          <CardHeader><CardTitle className="text-base">Summary</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                {/* Tax Rate */}
                <div className="space-y-1.5">
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <div className="flex items-center">
                    <button type="button"
                      onClick={() => { const n = Math.max(0, parseFloat((taxRate - 0.25).toFixed(2))); setTaxRate(n); setTaxRateDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Minus size={11} /></button>
                    <input
                      id="tax-rate"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9.]*"
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
                      onWheel={(e) => e.currentTarget.blur()}
                      className="h-9 w-full min-w-0 rounded-none border border-input bg-background px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button type="button"
                      onClick={() => { const n = parseFloat((taxRate + 0.25).toFixed(2)); setTaxRate(n); setTaxRateDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Plus size={11} /></button>
                  </div>
                </div>
                {/* Discount */}
                <div className="space-y-1.5">
                  <Label htmlFor="discount">Discount ($)</Label>
                  <div className="flex items-center">
                    <button type="button"
                      onClick={() => { const n = Math.max(0, parseFloat((discountAmount - 1).toFixed(2))); setDiscountAmount(n); setDiscountDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-l-md border border-r-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Minus size={11} /></button>
                    <input
                      id="discount"
                      type="text"
                      inputMode="decimal"
                      pattern="[0-9.]*"
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
                      onWheel={(e) => e.currentTarget.blur()}
                      className="h-9 w-full min-w-0 rounded-none border border-input bg-background px-2 text-center text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button type="button"
                      onClick={() => { const n = parseFloat((discountAmount + 1).toFixed(2)); setDiscountAmount(n); setDiscountDisplay(n.toFixed(2)) }}
                      className="flex h-9 w-8 shrink-0 items-center justify-center rounded-r-md border border-l-0 border-input bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                    ><Plus size={11} /></button>
                  </div>
                </div>
              </div>

              {/* Totals */}
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
                    <span className="text-green-600">-{formatCurrency(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 font-bold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(total, currency)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader><CardTitle className="text-base">Notes</CardTitle></CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any additional notes, terms, or context for the client…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Create Proposal'}
          </Button>
          <Button variant="ghost" onClick={() => router.back()} type="button">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
