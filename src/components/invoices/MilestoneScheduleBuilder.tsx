'use client'

import { useState } from 'react'
import { Plus, Trash, CaretDown, CaretRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/utils'

interface Milestone {
  label: string
  mode: 'pct' | 'flat'
  value: number
  due: string
}

interface Props {
  total: number
  currency: string
  /** Writes the generated schedule into the invoice's payment terms */
  onApply: (paymentTermsText: string, firstMilestoneDeposit: number | null) => void
}

const PRESETS: Array<{ label: string; milestones: Milestone[] }> = [
  {
    label: '50 / 50',
    milestones: [
      { label: 'Deposit', mode: 'pct', value: 50, due: 'upon acceptance' },
      { label: 'Final payment', mode: 'pct', value: 50, due: 'on delivery' },
    ],
  },
  {
    label: '30 / 30 / 40',
    milestones: [
      { label: 'Deposit', mode: 'pct', value: 30, due: 'upon acceptance' },
      { label: 'Midpoint', mode: 'pct', value: 30, due: 'at project midpoint' },
      { label: 'Final payment', mode: 'pct', value: 40, due: 'on delivery' },
    ],
  },
]

/**
 * Milestone billing for a single invoice (50% upfront / 50% on delivery, etc.).
 * Milestones can be a percentage or a fixed amount of the invoice total. The
 * generated schedule is written into the invoice's Payment Terms (shown on the
 * document, public page, and PDF), and the first milestone can be marked as
 * the deposit due now (uses the existing deposit feature, so the balance math
 * stays correct).
 */
export function MilestoneScheduleBuilder({ total, currency, onApply }: Props) {
  const [open, setOpen] = useState(false)
  const [milestones, setMilestones] = useState<Milestone[]>(PRESETS[0].milestones)
  const [firstIsDeposit, setFirstIsDeposit] = useState(true)

  const amountOf = (m: Milestone) =>
    m.mode === 'pct' ? (total * m.value) / 100 : m.value

  const allocated = milestones.reduce((sum, m) => sum + amountOf(m), 0)
  const mismatch = total > 0 && Math.abs(allocated - total) > 0.01

  const updateMilestone = (i: number, patch: Partial<Milestone>) =>
    setMilestones((prev) => prev.map((m, j) => (j === i ? { ...m, ...patch } : m)))

  const buildText = (): string => {
    const lines = milestones.map((m, i) => {
      const amt = formatCurrency(amountOf(m), currency)
      const pct = m.mode === 'pct' ? ` (${m.value}%)` : ''
      return `${i + 1}. ${m.label || `Milestone ${i + 1}`} — ${amt}${pct}${m.due ? `, due ${m.due}` : ''}`
    })
    return `Payment schedule:\n${lines.join('\n')}`
  }

  const handleApply = () => {
    const deposit = firstIsDeposit && milestones.length > 0 ? amountOf(milestones[0]) : null
    onApply(buildText(), deposit)
  }

  return (
    <div className="rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted/30 transition-colors"
      >
        <span>Milestone billing <span className="font-normal text-muted-foreground">(50% upfront, 50% on delivery, …)</span></span>
        {open ? <CaretDown className="h-4 w-4" /> : <CaretRight className="h-4 w-4" />}
      </button>

      {open && (
        <div className="space-y-3 border-t px-3 py-3">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setMilestones(p.milestones.map((m) => ({ ...m })))}
                className="rounded-md border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {milestones.map((m, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_5rem_1fr_auto] items-center gap-2">
              <Input
                className="h-8 text-sm"
                placeholder={`Milestone ${i + 1}`}
                value={m.label}
                onChange={(e) => updateMilestone(i, { label: e.target.value })}
              />
              <button
                type="button"
                onClick={() => updateMilestone(i, { mode: m.mode === 'pct' ? 'flat' : 'pct' })}
                className="rounded-md border border-border px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
                title="Toggle percent / fixed amount"
              >
                {m.mode === 'pct' ? '%' : currency}
              </button>
              <Input
                className="h-8 text-sm"
                type="number"
                min="0"
                step="0.01"
                value={String(m.value)}
                onChange={(e) => updateMilestone(i, { value: parseFloat(e.target.value) || 0 })}
              />
              <Input
                className="h-8 text-sm"
                placeholder="due …"
                value={m.due}
                onChange={(e) => updateMilestone(i, { due: e.target.value })}
              />
              <Button
                type="button" variant="ghost" size="sm" className="h-8 w-8 p-0"
                onClick={() => setMilestones((prev) => prev.filter((_, j) => j !== i))}
              >
                <Trash className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <Button
              type="button" variant="outline" size="sm"
              onClick={() => setMilestones((prev) => [...prev, { label: '', mode: 'pct', value: 0, due: '' }])}
            >
              <Plus className="mr-1 h-3 w-3" /> Add milestone
            </Button>
            <p className={`text-xs ${mismatch ? 'text-amber-600' : 'text-muted-foreground'}`}>
              Allocated: {formatCurrency(allocated, currency)} of {formatCurrency(total, currency)}
              {mismatch && ' — doesn’t match the invoice total'}
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={firstIsDeposit}
              onChange={(e) => setFirstIsDeposit(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border"
            />
            First milestone is due now (sets it as the invoice deposit, so the balance reflects it)
          </label>

          <Button type="button" size="sm" className="w-full" onClick={handleApply} disabled={total <= 0}>
            Apply schedule to invoice
          </Button>
          <p className="text-xs text-muted-foreground">
            Writes the schedule into Payment Terms (shown on the invoice and PDF)
            {firstIsDeposit ? ' and sets the first milestone as the deposit due' : ''}.
          </p>
        </div>
      )}
    </div>
  )
}
