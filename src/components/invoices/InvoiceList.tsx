'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { InvoiceBadge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { InvoiceListRow } from '@/lib/db/supabase'
import type { InvoiceStatus } from '@/types'

const STATUS_OPTIONS: Array<{ value: InvoiceStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'draft', label: 'Draft' },
  { value: 'sent', label: 'Sent' },
  { value: 'partial', label: 'Partial' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
]

interface Props {
  invoices: InvoiceListRow[]
}

export function InvoiceList({ invoices }: Props) {
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const inv of invoices) {
      counts[inv.status] = (counts[inv.status] ?? 0) + 1
    }
    return counts
  }, [invoices])

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false
      if (
        search &&
        !inv.clientName.toLowerCase().includes(search.toLowerCase()) &&
        !inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
      )
        return false
      if (dateFrom && inv.invoiceDate < dateFrom) return false
      if (dateTo && inv.invoiceDate > dateTo) return false
      return true
    })
  }, [invoices, statusFilter, search, dateFrom, dateTo])

  const isFiltered = statusFilter !== 'all' || search !== '' || dateFrom !== '' || dateTo !== ''

  function clearFilters() {
    setStatusFilter('all')
    setSearch('')
    setDateFrom('')
    setDateTo('')
  }

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative w-56">
          <MagnifyingGlass
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or invoice #…"
            className="pl-8 h-8 text-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Date range */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">To</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="h-8 rounded-md border border-input bg-background px-2.5 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>

        {/* Clear */}
        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs gap-1">
            <X size={12} />
            Clear
          </Button>
        )}
      </div>

      {/* Status pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {STATUS_OPTIONS.map(({ value, label }) => {
          const count = value === 'all' ? invoices.length : (statusCounts[value] ?? 0)
          const isActive = statusFilter === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {label}
              {count > 0 && (
                <span className={`ml-1.5 ${isActive ? 'opacity-75' : 'opacity-60'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Count summary */}
      {isFiltered && (
        <p className="text-xs text-muted-foreground">
          Showing {filtered.length} of {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <p className="text-sm text-muted-foreground">No invoices match your filters.</p>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="divide-y">
          {filtered.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors"
            >
              <div className="min-w-0">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="font-medium text-foreground hover:text-primary transition-colors"
                >
                  {inv.invoiceNumber}
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {inv.clientName} · {formatDate(inv.invoiceDate)}
                  {inv.dueDate && ` · Due ${formatDate(inv.dueDate)}`}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-sm font-medium">{formatCurrency(inv.total, inv.currency)}</span>
                <InvoiceBadge status={inv.status as InvoiceStatus} />
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/invoices/${inv.id}`}>View →</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
