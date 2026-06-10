'use client'

import { useState } from 'react'
import { Clock } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { TimeEntryRow } from '@/lib/db/supabase'

interface TimeLogImportButtonProps {
  clientId: string
  currency: string
  onImport: (items: Array<{ description: string; quantity: number; unitPrice: number; amount: number }>) => void
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

export function TimeLogImportButton({ clientId, currency, onImport }: TimeLogImportButtonProps) {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState<TimeEntryRow[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  async function handleOpen() {
    setOpen(true)
    setLoading(true)
    try {
      const url = clientId
        ? `/api/time-entries/unbilled?clientId=${clientId}`
        : '/api/time-entries/unbilled'
      const res = await fetch(url)
      const data: TimeEntryRow[] = await res.json()
      setEntries(data)
      setSelected(new Set(data.map((e) => e.id)))
    } finally {
      setLoading(false)
    }
  }

  function toggleAll() {
    if (selected.size === entries.length) setSelected(new Set())
    else setSelected(new Set(entries.map((e) => e.id)))
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
    const toImport = entries.filter((e) => selected.has(e.id))
    const items = toImport.map((e) => ({
      description: `${e.description} (${formatDuration(e.durationMinutes)})`,
      quantity: 1,
      unitPrice: e.amount,
      amount: e.amount,
    }))
    onImport(items)
    setOpen(false)
    Promise.all(
      toImport.map((e) =>
        fetch(`/api/time-entries/${e.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isInvoiced: true }),
        })
      )
    ).catch(() => {})
  }

  if (!clientId) return null

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={handleOpen}>
        <Clock className="mr-1.5 h-3.5 w-3.5" />
        Add from Time Log
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Import Unbilled Time Entries</DialogTitle>
          </DialogHeader>

          {loading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No unbilled time entries for this client.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{entries.length} unbilled {entries.length === 1 ? 'entry' : 'entries'}</p>
                <button onClick={toggleAll} className="text-xs text-primary hover:underline">
                  {selected.size === entries.length ? 'Deselect all' : 'Select all'}
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {entries.map((e) => (
                  <label
                    key={e.id}
                    className={cn(
                      'flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors',
                      selected.has(e.id) ? 'border-primary bg-accent' : 'border-border hover:bg-muted/30'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(e.id)}
                      onChange={() => toggle(e.id)}
                      className="mt-0.5 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{e.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(e.date)} · {formatDuration(e.durationMinutes)} · ${e.hourlyRate}/hr
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-foreground shrink-0">
                      {formatCurrency(e.amount, currency)}
                    </p>
                  </label>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t">
                <p className="text-sm font-medium">
                  Total:{' '}
                  {formatCurrency(
                    entries.filter((e) => selected.has(e.id)).reduce((s, e) => s + e.amount, 0),
                    currency
                  )}
                </p>
                <Button onClick={handleImport} disabled={selected.size === 0} size="sm">
                  Add {selected.size} {selected.size === 1 ? 'Entry' : 'Entries'} →
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
