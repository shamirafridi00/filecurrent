'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Receipt,
  FileText,
  CreditCard,
  Bell,
  CheckCircle,
  Eye,
  PaperPlaneTilt,
  PencilLine,
  Warning,
  Trash,
} from '@/components/icons'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { formatCurrency } from '@/lib/utils'
import type { ClientActivityLogRow } from '@/types'

type FilterType = 'all' | 'invoice' | 'contract' | 'payment' | 'reminder'

const FILTERS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Invoices', value: 'invoice' },
  { label: 'Contracts', value: 'contract' },
  { label: 'Payments', value: 'payment' },
  { label: 'Reminders', value: 'reminder' },
]

interface Props {
  events: ClientActivityLogRow[]
  emptyMessage?: string
  showReset?: boolean
}

function getEventIcon(eventType: string) {
  switch (eventType) {
    case 'invoice_created':      return <PencilLine size={16} className="text-indigo-500" />
    case 'invoice_sent':         return <PaperPlaneTilt size={16} className="text-indigo-500" />
    case 'invoice_viewed':       return <Eye size={16} className="text-indigo-400" />
    case 'invoice_paid':         return <CheckCircle size={16} className="text-emerald-500" />
    case 'invoice_partial_paid': return <CreditCard size={16} className="text-teal-500" />
    case 'invoice_overdue':      return <Warning size={16} className="text-amber-500" />
    case 'contract_created':     return <FileText size={16} className="text-emerald-500" />
    case 'contract_sent':        return <PaperPlaneTilt size={16} className="text-emerald-500" />
    case 'contract_viewed':      return <Eye size={16} className="text-emerald-400" />
    case 'contract_signed':      return <CheckCircle size={16} className="text-emerald-600" />
    case 'payment_recorded':     return <CreditCard size={16} className="text-teal-500" />
    case 'reminder_sent':        return <Bell size={16} className="text-amber-500" />
    default:                     return <Receipt size={16} className="text-muted-foreground" />
  }
}

function getEventIconBg(eventType: string): string {
  if (eventType.startsWith('invoice'))  return 'bg-indigo-50 border-indigo-100'
  if (eventType.startsWith('contract')) return 'bg-emerald-50 border-emerald-100'
  if (eventType === 'payment_recorded') return 'bg-teal-50 border-teal-100'
  if (eventType === 'reminder_sent')    return 'bg-amber-50 border-amber-100'
  return 'bg-muted border-border'
}

function getEventDescription(event: ClientActivityLogRow): string {
  const label = event.entity_label ?? ''
  const client = event.client_name
  const amt = event.amount != null ? formatCurrency(event.amount) : ''

  switch (event.event_type) {
    case 'invoice_created':      return `Invoice ${label} created for ${client}${amt ? ` — ${amt}` : ''}`
    case 'invoice_sent':         return `Invoice ${label} sent to ${client}${amt ? ` — ${amt}` : ''}`
    case 'invoice_viewed':       return `${client} viewed invoice ${label}`
    case 'invoice_paid':         return `${client} paid invoice ${label} in full${amt ? ` — ${amt}` : ''}`
    case 'invoice_partial_paid': return `${client} made a partial payment on ${label}${amt ? ` — ${amt}` : ''}`
    case 'invoice_overdue':      return `Invoice ${label} for ${client} is overdue`
    case 'contract_created':     return `Contract '${label}' created for ${client}`
    case 'contract_sent':        return `Contract '${label}' sent to ${client} for signing`
    case 'contract_viewed':      return `${client} viewed contract '${label}'`
    case 'contract_signed':      return `${client} signed contract '${label}'`
    case 'payment_recorded':     return `Payment recorded for ${client}${amt ? ` — ${amt}` : ''}`
    case 'reminder_sent':        return `Payment reminder sent to ${client} for ${label}`
    default:                     return `Activity for ${client}`
  }
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMin / 60)
  const diffDays = Math.floor(diffHr / 24)

  if (diffMin < 1)    return 'just now'
  if (diffMin < 60)   return `${diffMin}m ago`
  if (diffHr < 24)    return `${diffHr}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7)   return `${diffDays} days ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function filterEvents(events: ClientActivityLogRow[], filter: FilterType): ClientActivityLogRow[] {
  if (filter === 'all') return events
  if (filter === 'invoice')  return events.filter(e => e.event_type.startsWith('invoice'))
  if (filter === 'contract') return events.filter(e => e.event_type.startsWith('contract'))
  if (filter === 'payment')  return events.filter(e => e.event_type === 'payment_recorded' || e.event_type === 'invoice_paid' || e.event_type === 'invoice_partial_paid')
  if (filter === 'reminder') return events.filter(e => e.event_type === 'reminder_sent')
  return events
}

function groupByDate(events: ClientActivityLogRow[]): Array<{ label: string; events: ClientActivityLogRow[] }> {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 86400000)
  const weekAgo = new Date(today.getTime() - 7 * 86400000)

  const groups: Record<string, ClientActivityLogRow[]> = {
    Today: [], Yesterday: [], 'This Week': [], Earlier: [],
  }

  for (const event of events) {
    const d = new Date(event.created_at)
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    if (day.getTime() === today.getTime())     groups['Today'].push(event)
    else if (day.getTime() === yesterday.getTime()) groups['Yesterday'].push(event)
    else if (day >= weekAgo)                   groups['This Week'].push(event)
    else                                       groups['Earlier'].push(event)
  }

  return Object.entries(groups)
    .filter(([, evts]) => evts.length > 0)
    .map(([label, evts]) => ({ label, events: evts }))
}

export function ActivityFeed({ events, emptyMessage = 'No activity yet.', showReset = false }: Props) {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [resetting, setResetting] = useState(false)

  const filtered = filterEvents(events, activeFilter)
  const groups = groupByDate(filtered)

  async function handleReset() {
    setResetting(true)
    try {
      await fetch('/api/client-activity/reset', { method: 'DELETE' })
      router.refresh()
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar: filter pills + reset button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                activeFilter === f.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
              }`}
            >
              {f.label}
              {f.value !== 'all' && (
                <span className={`ml-1.5 ${activeFilter === f.value ? 'opacity-80' : 'opacity-50'}`}>
                  {filterEvents(events, f.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {showReset && events.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                disabled={resetting}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/5 transition-colors disabled:opacity-50"
              >
                <Trash size={13} />
                Clear log
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all activity?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {events.length} activity log entries. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleReset}
                >
                  Yes, clear log
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {/* Feed */}
      {filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center">
          {events.length === 0 ? emptyMessage : `No ${activeFilter} activity yet.`}
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map(({ label, events: groupEvents }) => (
            <div key={label}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{label}</p>
              <div className="space-y-2">
                {groupEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 rounded-lg border bg-card p-3">
                    <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${getEventIconBg(event.event_type)}`}>
                      {getEventIcon(event.event_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">
                        {event.client_id ? (
                          <>
                            {getEventDescription(event).split(event.client_name).map((part, i, arr) => (
                              i < arr.length - 1 ? (
                                <span key={i}>
                                  {part}
                                  <Link href={`/clients/${event.client_id}`} className="font-medium text-primary hover:underline">
                                    {event.client_name}
                                  </Link>
                                </span>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            ))}
                          </>
                        ) : (
                          getEventDescription(event)
                        )}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                      {relativeTime(event.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
