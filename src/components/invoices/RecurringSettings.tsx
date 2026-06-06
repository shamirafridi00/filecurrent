'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowsClockwise } from '@phosphor-icons/react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

type Interval = 'weekly' | 'biweekly' | 'monthly' | 'quarterly'

interface Props {
  invoiceId: string
  isRecurring: boolean
  recurrenceInterval: string | null
  recurrenceNextDate: string | null
  recurrenceEndDate: string | null
}

const INTERVAL_OPTIONS: Array<{ value: Interval; label: string }> = [
  { value: 'weekly',    label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly',  label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
]

export function RecurringSettings({ invoiceId, isRecurring, recurrenceInterval, recurrenceNextDate, recurrenceEndDate }: Props) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(isRecurring)
  const [interval, setInterval] = useState<Interval>((recurrenceInterval as Interval) ?? 'monthly')
  const [nextDate, setNextDate] = useState(recurrenceNextDate ?? '')
  const [endDate, setEndDate] = useState(recurrenceEndDate ?? '')
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (enabled && !nextDate) { toast.error('Set a start date for recurring'); return }
    setSaving(true)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/recurring`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isRecurring: enabled,
          interval: enabled ? interval : null,
          nextDate: enabled ? nextDate : null,
          endDate: enabled && endDate ? endDate : null,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(enabled ? 'Recurring enabled' : 'Recurring disabled')
      router.refresh()
    } catch {
      toast.error('Failed to save recurring settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <ArrowsClockwise className="h-4 w-4" />
          Recurring
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Switch id="recurring-toggle" checked={enabled} onCheckedChange={setEnabled} />
          <Label htmlFor="recurring-toggle" className="cursor-pointer">
            {enabled ? 'Enabled' : 'Disabled'}
          </Label>
        </div>

        {enabled && (
          <>
            <div className="space-y-1.5">
              <Label className="text-xs">Frequency</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {INTERVAL_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setInterval(opt.value)}
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      interval === opt.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-input bg-background text-muted-foreground hover:border-muted-foreground'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">First generation date</Label>
              <input
                type="date"
                value={nextDate}
                onChange={(e) => setNextDate(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">End date <span className="text-muted-foreground">(optional)</span></Label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
          </>
        )}

        <Button size="sm" onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Saving…' : 'Save'}
        </Button>

        {isRecurring && recurrenceNextDate && (
          <p className="text-xs text-muted-foreground text-center">
            Next copy generates on {recurrenceNextDate}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
