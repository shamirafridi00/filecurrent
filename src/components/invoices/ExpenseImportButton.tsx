'use client'

import { useState } from 'react'
import { CurrencyDollar } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ExpenseRow } from '@/lib/db/supabase'

interface Props {
  currency: string
  onImport: (items: Array<{ description: string; quantity: number; unitPrice: number; amount: number }>) => void
}

/**
 * "Add from Expenses" on the invoice form — pick recorded expenses and bill
 * them to the client as line items (mirrors the time-log import).
 */
export function ExpenseImportButton({ currency, onImport }: Props) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())

  async function load() {
    setOpen(true)
    setLoading(true)
    try {
      const res = await fetch('/api/expenses')
      const data: ExpenseRow[] = await res.json()
      setExpenses(Array.isArray(data) ? data : [])
      setSelected(new Set())
    } catch {
      setExpenses([])
    } finally {
      setLoading(false)
    }
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleImport() {
    const items = expenses
      .filter((e) => selected.has(e.id))
      .map((e) => ({
        description: `Expense: ${e.description}${e.date ? ` (${formatDate(e.date)})` : ''}`,
        quantity: 1,
        unitPrice: e.amount,
        amount: e.amount,
      }))
    if (items.length > 0) onImport(items)
    setOpen(false)
  }

  const selectedTotal = expenses
    .filter((e) => selected.has(e.id))
    .reduce((sum, e) => sum + e.amount, 0)

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={load}>
        <CurrencyDollar className="mr-1.5 h-3.5 w-3.5" /> Add from Expenses
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Bill Expenses to Client</DialogTitle>
          </DialogHeader>

          {loading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading…</p>
          ) : expenses.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground">No expenses recorded yet.</p>
              <a
                href="/expenses" target="_blank" rel="noopener noreferrer"
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                Record an expense first →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Selected expenses are added as line items at cost — adjust the price on
                the invoice afterwards if you add a markup.
              </p>
              <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {expenses.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => toggle(e.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg border p-2.5 text-left transition-colors',
                      selected.has(e.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:bg-muted/30'
                    )}
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{e.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(e.date)} · {e.category}
                      </p>
                    </div>
                    <span className="ml-3 shrink-0 text-sm font-semibold">{formatCurrency(e.amount, currency)}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <p className="text-sm text-muted-foreground">
                  {selected.size} selected · {formatCurrency(selectedTotal, currency)}
                </p>
                <Button type="button" size="sm" onClick={handleImport} disabled={selected.size === 0}>
                  Add to Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
