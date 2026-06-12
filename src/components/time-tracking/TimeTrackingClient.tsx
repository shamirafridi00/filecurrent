'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Timer, Plus, PencilSimple, Trash, Clock } from '@phosphor-icons/react'
import { StatCard, PageHeader, EmptyState, ConfirmDialog } from '@/components/ui'
import { HelpHint } from '@/components/ui/HelpHint'
import { FeatureTour } from '@/components/ui/FeatureTour'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { formatCurrency, formatDate, cn } from '@/lib/utils'
import type { TimeEntryRow } from '@/lib/db/supabase'
import type { ClientRow } from '@/lib/db/supabase'

function formatHours(h: number): string {
  const hrs = Math.floor(h)
  const mins = Math.round((h - hrs) * 60)
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`
  if (hrs > 0) return `${hrs}h`
  return `${mins}m`
}

function formatDuration(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  if (h > 0 && m > 0) return `${h}h ${m}m`
  if (h > 0) return `${h}h`
  return `${m}m`
}

interface TimeSummary {
  totalHours: number
  billableHours: number
  unbilledAmount: number
  thisWeekHours: number
}

interface TimeTrackingClientProps {
  entries: TimeEntryRow[]
  summary: TimeSummary
  clients: ClientRow[]
}

interface FormState {
  date: string
  description: string
  clientId: string
  hours: string
  minutes: string
  hourlyRate: string
  isBillable: boolean
  notes: string
}

const BLANK_FORM: FormState = {
  date: new Date().toISOString().slice(0, 10),
  description: '',
  clientId: '',
  hours: '0',
  minutes: '0',
  hourlyRate: '0',
  isBillable: true,
  notes: '',
}

function TimeEntryForm({
  initial,
  clients,
  onSave,
  onCancel,
  isSubmitting,
}: {
  initial: FormState
  clients: ClientRow[]
  onSave: (data: FormState) => void
  onCancel: () => void
  isSubmitting: boolean
}) {
  const [form, setForm] = useState<FormState>(initial)

  function set(field: keyof FormState, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const hours = Number(form.hours) || 0
  const minutes = Number(form.minutes) || 0
  const rate = Number(form.hourlyRate) || 0
  const totalMins = hours * 60 + minutes
  const previewAmount = ((totalMins / 60) * rate)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.date || !form.description) {
      toast.error('Please fill in required fields')
      return
    }
    if (totalMins <= 0) {
      toast.error('Duration must be greater than 0')
      return
    }
    if (hours > 23) {
      toast.error('Hours must be between 0 and 23')
      return
    }
    if (minutes > 59) {
      toast.error('Minutes must be between 0 and 59')
      return
    }
    onSave(form)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          {initial.description ? 'Edit Time Entry' : 'Log Time'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="te-date">Date *</Label>
              <Input
                id="te-date"
                type="date"
                value={form.date}
                onChange={(e) => set('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="te-client">Client</Label>
              <Select value={form.clientId} onValueChange={(v) => set('clientId', v === '__none__' ? '' : v)}>
                <SelectTrigger id="te-client">
                  <SelectValue placeholder="No client / Internal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No client / Internal</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="te-description">Description *</Label>
            <Input
              id="te-description"
              type="text"
              autoComplete="off"
              placeholder="e.g. Design review, Client meeting, Development"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Duration *</Label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <Input
                    id="te-hours"
                    type="number"
                    min="0"
                    max="23"
                    step="1"
                    placeholder="0"
                    value={form.hours}
                    onChange={(e) => set('hours', e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground shrink-0">hrs</span>
                </div>
                <div className="flex items-center gap-1.5 flex-1">
                  <Input
                    id="te-minutes"
                    type="number"
                    min="0"
                    max="59"
                    step="1"
                    placeholder="0"
                    value={form.minutes}
                    onChange={(e) => set('minutes', e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-20"
                  />
                  <span className="text-sm text-muted-foreground shrink-0">min</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="te-rate">Hourly Rate</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="te-rate"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.hourlyRate}
                  onChange={(e) => set('hourlyRate', e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  className="pl-7"
                />
              </div>
            </div>
          </div>

          {totalMins > 0 && rate > 0 && (
            <p className="text-sm text-muted-foreground">
              = <span className="font-semibold text-foreground">{formatCurrency(previewAmount)}</span>
              {' '}({formatDuration(totalMins)} × ${rate}/hr)
            </p>
          )}

          <div className="flex items-center gap-3">
            <Switch
              id="te-billable"
              checked={form.isBillable}
              onCheckedChange={(v) => set('isBillable', v)}
            />
            <Label htmlFor="te-billable" className="cursor-pointer">Billable</Label>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="te-notes">Notes</Label>
            <Textarea
              id="te-notes"
              placeholder="Optional notes..."
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

type BillableFilter = 'all' | 'billable' | 'internal'

export function TimeTrackingClient({ entries: initialEntries, summary: initialSummary, clients }: TimeTrackingClientProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [entries, setEntries] = useState<TimeEntryRow[]>(initialEntries)
  const [summary, setSummary] = useState<TimeSummary>(initialSummary)
  const [showForm, setShowForm] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntryRow | null>(null)
  const [filterClient, setFilterClient] = useState(searchParams.get('client') ?? '')
  const [filterBillable, setFilterBillable] = useState<BillableFilter>(
    (searchParams.get('filter') as BillableFilter) ?? 'all'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()
    if (filterClient) params.set('client', filterClient)
    if (filterBillable !== 'all') params.set('filter', filterBillable)
    const qs = params.toString()
    router.replace(qs ? `/time-tracking?${qs}` : '/time-tracking', { scroll: false })
  }, [filterClient, filterBillable, router])

  const activeClientsInEntries = Array.from(
    new Set(entries.filter((e) => e.clientId).map((e) => e.clientId!))
  )

  const filteredEntries = entries.filter((e) => {
    const clientMatch = filterClient === '' || e.clientId === filterClient
    const billableMatch =
      filterBillable === 'all' ||
      (filterBillable === 'billable' && e.isBillable) ||
      (filterBillable === 'internal' && !e.isBillable)
    return clientMatch && billableMatch
  })

  async function reloadEntries() {
    try {
      const res = await fetch('/api/time-entries')
      if (!res.ok) return
      const data: TimeEntryRow[] = await res.json()
      setEntries(data)

      const totalHours = data.reduce((s, e) => s + e.durationMinutes, 0) / 60
      const billableHours = data.filter((e) => e.isBillable).reduce((s, e) => s + e.durationMinutes, 0) / 60
      const unbilledAmount = data.filter((e) => e.isBillable && !e.isInvoiced).reduce((s, e) => s + e.amount, 0)
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const weekStartStr = weekStart.toISOString().slice(0, 10)
      const thisWeekHours = data.filter((e) => e.date >= weekStartStr).reduce((s, e) => s + e.durationMinutes, 0) / 60
      setSummary({ totalHours, billableHours, unbilledAmount, thisWeekHours })
    } catch {
      // ignore
    }
  }

  async function handleSave(form: FormState) {
    setIsSubmitting(true)
    const durationMinutes = (Number(form.hours) || 0) * 60 + (Number(form.minutes) || 0)
    try {
      if (editingEntry) {
        const res = await fetch(`/api/time-entries/${editingEntry.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: form.clientId || null,
            description: form.description,
            date: form.date,
            durationMinutes,
            hourlyRate: Number(form.hourlyRate) || 0,
            isBillable: form.isBillable,
            notes: form.notes || undefined,
          }),
        })
        if (!res.ok) throw new Error('Failed to update')
        toast.success('Time entry updated')
        setEditingEntry(null)
        setShowForm(false)
        await reloadEntries()
      } else {
        const res = await fetch('/api/time-entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientId: form.clientId || undefined,
            description: form.description,
            date: form.date,
            durationMinutes,
            hourlyRate: Number(form.hourlyRate) || 0,
            isBillable: form.isBillable,
            notes: form.notes || undefined,
          }),
        })
        if (!res.ok) throw new Error('Failed to create')
        toast.success('Time logged')
        setShowForm(false)
        await reloadEntries()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/time-entries/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setEntries((prev) => prev.filter((e) => e.id !== id))
      toast.success('Time entry deleted')
      await reloadEntries()
    } catch {
      toast.error('Failed to delete time entry')
    } finally {
      setDeletingId(null)
      setConfirmDeleteId(null)
    }
  }

  function startEdit(entry: TimeEntryRow) {
    setEditingEntry(entry)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingEntry(null)
  }

  const formInitial: FormState = editingEntry
    ? {
        date: editingEntry.date,
        description: editingEntry.description,
        clientId: editingEntry.clientId ?? '',
        hours: String(Math.floor(editingEntry.durationMinutes / 60)),
        minutes: String(editingEntry.durationMinutes % 60),
        hourlyRate: String(editingEntry.hourlyRate),
        isBillable: editingEntry.isBillable,
        notes: editingEntry.notes ?? '',
      }
    : BLANK_FORM

  const clientNameMap = Object.fromEntries(clients.map((c) => [c.id, c.name]))

  return (
    <div>
      <PageHeader
        title="Time Tracking"
        subtitle="Log billable hours and pull them into invoices"
        help={
          <HelpHint
            title="Time Tracking"
            example="Log 3.5 hours at $80/hr for Acme Co — when invoicing Acme, 'Add from Time Log' turns it into a $280 line item."
          >
            Log hours worked on a project. When creating an invoice, use
            &ldquo;Add from Time Log&rdquo; to automatically convert unbilled
            hours into invoice line items.
          </HelpHint>
        }
        icon={<Timer size={24} weight="duotone" className="text-primary" />}
        action={
          <div className="flex items-center gap-2">
            <FeatureTour
              tourId="time-tracking"
              autoStartOnFirstVisit={false}
              steps={[
                { title: 'Track hours, bill them later', description: 'Log time as you work — every billable entry is ready to drop onto an invoice with one click.' },
                { element: '[data-tour="time-stats"]', title: 'Your hours at a glance', description: 'Total, billable, and unbilled hours plus the value of work you haven’t invoiced yet.' },
                { element: '[data-tour="log-time"]', title: 'Log an entry', description: 'Pick the client, describe the work, set the duration and your hourly rate — the amount is calculated live.' },
                { title: 'Pull entries into invoices', description: 'When you create an invoice, "Add from Time Log" converts unbilled entries into line items automatically.' },
              ]}
            />
            {!showForm && (
              <Button onClick={() => { setShowForm(true); setEditingEntry(null) }} data-tour="log-time">
                <Plus className="mr-1.5 h-4 w-4" />
                Log Time
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6" data-tour="time-stats">
        <StatCard
          label="Total Hours"
          value={formatHours(summary.totalHours)}
          accent="border-l-[#635BFF]"
        />
        <StatCard
          label="Billable Hours"
          value={formatHours(summary.billableHours)}
          valueColor="text-[#1DB954]"
          accent="border-l-[#1DB954]"
        />
        <StatCard
          label="Unbilled Amount"
          value={formatCurrency(summary.unbilledAmount)}
          valueColor="text-[#E6A817]"
          accent="border-l-[#E6A817]"
        />
        <StatCard
          label="This Week"
          value={formatHours(summary.thisWeekHours)}
          accent="border-l-[#8898AA]"
        />
      </div>

      {showForm && (
        <TimeEntryForm
          initial={formInitial}
          clients={clients}
          onSave={handleSave}
          onCancel={cancelForm}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterBillable('all')}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
              filterBillable === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-muted/30 text-foreground'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterBillable('billable')}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
              filterBillable === 'billable'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-muted/30 text-foreground'
            )}
          >
            Billable
          </button>
          <button
            onClick={() => setFilterBillable('internal')}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
              filterBillable === 'internal'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border hover:bg-muted/30 text-foreground'
            )}
          >
            Internal
          </button>
        </div>

        {activeClientsInEntries.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterClient('')}
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
                filterClient === ''
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border hover:bg-muted/30 text-foreground'
              )}
            >
              All Clients
            </button>
            {activeClientsInEntries.map((cid) => (
              <button
                key={cid}
                onClick={() => setFilterClient(cid === filterClient ? '' : cid)}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
                  filterClient === cid
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-muted/30 text-foreground'
                )}
              >
                {clientNameMap[cid] ?? cid}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock size={16} />
            {filteredEntries.length} {filteredEntries.length !== 1 ? 'Entries' : 'Entry'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {filteredEntries.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={<Timer size={40} weight="duotone" className="text-muted-foreground" />}
                title="No time entries yet"
                description="Start logging your hours to track billable time."
                action={
                  !showForm ? (
                    <Button onClick={() => { setShowForm(true); setEditingEntry(null) }}>
                      <Plus className="mr-1.5 h-4 w-4" />
                      Log Time
                    </Button>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell whitespace-nowrap">Duration</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell whitespace-nowrap">Rate</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">Amount</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {formatDate(entry.date)}
                      </td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-foreground font-medium">{entry.description}</p>
                        {entry.clientName && (
                          <span className="inline-block mt-0.5 text-xs px-1.5 py-0.5 rounded border bg-accent text-primary border-primary/20 font-medium">
                            {entry.clientName}
                          </span>
                        )}
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.notes}</p>
                        )}
                        <div className="sm:hidden mt-1 flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">{formatDuration(entry.durationMinutes)}</span>
                          {entry.isInvoiced ? (
                            <Badge variant="secondary" className="text-xs border bg-blue-50 text-blue-700 border-blue-200">Invoiced</Badge>
                          ) : entry.isBillable ? (
                            <Badge variant="secondary" className="text-xs border bg-green-50 text-green-700 border-green-200">Billable</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs border bg-muted text-muted-foreground border-border">Internal</Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground hidden sm:table-cell whitespace-nowrap">
                        {formatDuration(entry.durationMinutes)}
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground hidden md:table-cell whitespace-nowrap">
                        {entry.hourlyRate > 0 ? `$${entry.hourlyRate}/hr` : '—'}
                      </td>
                      <td className="px-6 py-3 text-right text-sm font-semibold text-primary whitespace-nowrap">
                        {entry.amount > 0 ? formatCurrency(entry.amount) : '—'}
                      </td>
                      <td className="px-6 py-3 hidden sm:table-cell">
                        {entry.isInvoiced ? (
                          <Badge variant="secondary" className="text-xs border bg-blue-50 text-blue-700 border-blue-200">Invoiced</Badge>
                        ) : entry.isBillable ? (
                          <Badge variant="secondary" className="text-xs border bg-green-50 text-green-700 border-green-200">Billable</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs border bg-muted text-muted-foreground border-border">Internal</Badge>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {entry.isInvoiced ? (
                          <span className="text-xs text-muted-foreground">—</span>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEdit(entry)}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors duration-150"
                              aria-label="Edit entry"
                            >
                              <PencilSimple size={14} />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(entry.id)}
                              disabled={deletingId === entry.id}
                              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-150 disabled:opacity-50"
                              aria-label="Delete entry"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmDeleteId !== null}
        title="Delete Time Entry"
        description="Are you sure you want to delete this time entry? This action cannot be undone."
        confirmLabel={deletingId ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => confirmDeleteId && handleDelete(confirmDeleteId)}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  )
}
