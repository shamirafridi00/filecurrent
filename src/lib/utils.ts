// ============================================================
// src/lib/utils.ts
// ============================================================

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { InvoiceStatus, ContractStatus } from '@/types'

// ── Tailwind class merge helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── Currency formatting
export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

// ── Date formatting
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d)
}

export function formatDatetime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatInputDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toISOString().split('T')[0]
}

// ── Invoice number generator
export function generateInvoiceNumber(nextSequence: number): string {
  const year = new Date().getFullYear()
  const seq = String(nextSequence).padStart(4, '0')
  return `INV-${year}-${seq}`
}

// ── Invoice calculations
export function calculateInvoiceTotals(
  items: { quantity: number; unitPrice: number }[],
  taxRate: number,
  discountAmount: number
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
  const taxAmount = (subtotal * taxRate) / 100
  const total = subtotal + taxAmount - discountAmount
  return {
    subtotal,
    taxAmount,
    total: Math.max(0, total),
  }
}

// ── Status badge config
export function getInvoiceStatusConfig(status: InvoiceStatus) {
  const configs = {
    draft: {
      label: 'Draft',
      className: 'bg-slate-100 text-slate-600 border border-slate-200',
    },
    sent: {
      label: 'Sent',
      className: 'bg-blue-100 text-blue-700 border border-blue-200',
    },
    partial: {
      label: 'Partial',
      className: 'bg-amber-100 text-amber-700 border border-amber-200',
    },
    paid: {
      label: 'Paid',
      className: 'bg-green-100 text-green-700 border border-green-200',
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-red-100 text-red-700 border border-red-200',
    },
  }
  return configs[status]
}

export function getContractStatusConfig(status: ContractStatus) {
  const configs = {
    draft: {
      label: 'Draft',
      className: 'bg-slate-100 text-slate-600 border border-slate-200',
    },
    sent: {
      label: 'Sent',
      className: 'bg-blue-100 text-blue-700 border border-blue-200',
    },
    opened: {
      label: 'Opened',
      className: 'bg-purple-100 text-purple-700 border border-purple-200',
    },
    signed: {
      label: 'Signed',
      className: 'bg-green-100 text-green-700 border border-green-200',
    },
  }
  return configs[status]
}

// ── Parse JSON array input (for reminder settings)
export function parseJsonArray(value: string): number[] {
  try {
    const parsed = JSON.parse(value)
    if (Array.isArray(parsed) && parsed.every((n) => typeof n === 'number')) {
      return parsed
    }
  } catch {
    // invalid
  }
  return []
}

// ── Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// ── Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// ── Trial days remaining
export function trialDaysRemaining(trialEndsAt: Date): number {
  const now = new Date()
  const diff = trialEndsAt.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

// ── Replace template placeholders with actual values
export function replacePlaceholders(
  template: string,
  values: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }
  return result
}

// ── Debounce
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
