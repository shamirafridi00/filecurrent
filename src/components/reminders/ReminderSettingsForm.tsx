'use client'

import { useState } from 'react'
import { FloppyDisk, Plus, X, Bell, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { PageHeader } from '@/components/ui'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { ReminderSettingsRow } from '@/lib/db/supabase'

const BEFORE_DUE_OPTIONS = [7, 3, 1]
const AFTER_OVERDUE_OPTIONS = [3, 7, 14, 30]

interface Props {
  initial: ReminderSettingsRow
}

export function ReminderSettingsForm({ initial }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [enabled, setEnabled] = useState(initial.enabled)
  const [daysBefore, setDaysBefore] = useState<number[]>(initial.daysBefore)
  const [sendOnDueDate, setSendOnDueDate] = useState(initial.sendOnDueDate)
  const [daysAfterOverdue, setDaysAfterOverdue] = useState<number[]>(initial.daysAfterOverdue)
  const [autoStopOnPaid, setAutoStopOnPaid] = useState(initial.autoStopOnPaid)
  const [allowUnsubscribe, setAllowUnsubscribe] = useState(initial.allowUnsubscribe)
  const [skipBelowBalance, setSkipBelowBalance] = useState(String(initial.skipBelowBalance))

  // Custom interval inputs
  const [customBefore, setCustomBefore] = useState('')
  const [customAfter, setCustomAfter] = useState('')

  const toggleDay = (list: number[], setList: (v: number[]) => void, day: number) => {
    setList(list.includes(day) ? list.filter((d) => d !== day) : [...list, day].sort((a, b) => b - a))
  }

  const addCustomBefore = () => {
    const n = parseInt(customBefore)
    if (!n || n < 1 || daysBefore.includes(n)) return
    setDaysBefore([...daysBefore, n].sort((a, b) => b - a))
    setCustomBefore('')
  }

  const addCustomAfter = () => {
    const n = parseInt(customAfter)
    if (!n || n < 1 || daysAfterOverdue.includes(n)) return
    setDaysAfterOverdue([...daysAfterOverdue, n].sort((a, b) => a - b))
    setCustomAfter('')
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/reminders/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabled, daysBefore, sendOnDueDate, daysAfterOverdue,
          autoStopOnPaid, allowUnsubscribe,
          skipBelowBalance: parseFloat(skipBelowBalance) || 0,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Settings saved')
      router.refresh()
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Reminder Settings"
        subtitle="Configure your automated payment reminder schedule"
        backHref="/reminders"
        backLabel="Back to Reminders"
      />

      <div className="max-w-2xl space-y-5">
        {/* No-cap banner */}
        <Card className="border-l-4 border-l-primary">
          <CardContent className="flex items-start gap-3 p-4">
            <Lightning className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <p className="text-sm text-foreground">
              FileCurrent sends reminders automatically with <strong>no daily limits</strong>.
              You&apos;ll never miss a late payment because of an artificial cap.
            </p>
          </CardContent>
        </Card>

        {/* Master enable */}
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium">Enable automated reminders</p>
              <p className="text-sm text-muted-foreground">
                When on, reminders are sent based on the schedule below
              </p>
            </div>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </CardContent>
        </Card>

        {/* Before due */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Before Due Date</CardTitle>
            <CardDescription>Send reminders before the invoice is due</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {BEFORE_DUE_OPTIONS.map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={daysBefore.includes(d)}
                    onCheckedChange={() => toggleDay(daysBefore, setDaysBefore, d)}
                  />
                  <span className="text-sm">{d} {d === 1 ? 'day' : 'days'} before</span>
                </label>
              ))}
              {/* Custom values not in standard list */}
              {daysBefore.filter((d) => !BEFORE_DUE_OPTIONS.includes(d)).map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked onCheckedChange={() => setDaysBefore(daysBefore.filter((x) => x !== d))} />
                  <span className="text-sm">{d} days before</span>
                  <button onClick={() => setDaysBefore(daysBefore.filter((x) => x !== d))}
                    className="text-muted-foreground hover:text-destructive">
                    <X size={12} />
                  </button>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Custom days…"
                type="number"
                min="1"
                value={customBefore}
                onChange={(e) => setCustomBefore(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomBefore()}
                className="w-36"
              />
              <Button size="sm" variant="outline" onClick={addCustomBefore} disabled={!customBefore}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox checked={sendOnDueDate} onCheckedChange={(v) => setSendOnDueDate(Boolean(v))} id="on-due" />
              <Label htmlFor="on-due" className="cursor-pointer text-sm">Also send on the due date</Label>
            </div>
          </CardContent>
        </Card>

        {/* After overdue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">After Overdue</CardTitle>
            <CardDescription>Escalating reminders for unpaid overdue invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {AFTER_OVERDUE_OPTIONS.map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={daysAfterOverdue.includes(d)}
                    onCheckedChange={() => toggleDay(daysAfterOverdue, setDaysAfterOverdue, d)}
                  />
                  <span className="text-sm">{d} {d === 1 ? 'day' : 'days'} overdue</span>
                </label>
              ))}
              {daysAfterOverdue.filter((d) => !AFTER_OVERDUE_OPTIONS.includes(d)).map((d) => (
                <label key={d} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox checked onCheckedChange={() => setDaysAfterOverdue(daysAfterOverdue.filter((x) => x !== d))} />
                  <span className="text-sm">{d} days overdue</span>
                  <button onClick={() => setDaysAfterOverdue(daysAfterOverdue.filter((x) => x !== d))}
                    className="text-muted-foreground hover:text-destructive">
                    <X size={12} />
                  </button>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Custom days…"
                type="number"
                min="1"
                value={customAfter}
                onChange={(e) => setCustomAfter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomAfter()}
                className="w-36"
              />
              <Button size="sm" variant="outline" onClick={addCustomAfter} disabled={!customAfter}>
                <Plus className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Smart toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Smart Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Stop all reminders when invoice is marked paid</p>
                <p className="text-xs text-muted-foreground">No reminder will be sent after payment is recorded</p>
              </div>
              <Switch checked={autoStopOnPaid} onCheckedChange={setAutoStopOnPaid} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Allow clients to unsubscribe from reminders</p>
                <p className="text-xs text-muted-foreground">
                  Clients can opt out without affecting invoice or contract status
                </p>
              </div>
              <Switch checked={allowUnsubscribe} onCheckedChange={setAllowUnsubscribe} />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">Skip if balance below</p>
                <p className="text-xs text-muted-foreground">Don&apos;t send reminders for nearly-settled invoices</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">$</span>
                <Input
                  type="number" min="0" step="0.01"
                  value={skipBelowBalance}
                  onChange={(e) => setSkipBelowBalance(e.target.value)}
                  className="w-24"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button onClick={handleSave} disabled={saving}>
            <FloppyDisk className="mr-1 h-4 w-4" />
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  )
}
