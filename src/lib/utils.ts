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
      className: 'bg-[#F6F9FC] text-[#425466] border border-[#CFD7E0]',
    },
    sent: {
      label: 'Sent',
      className: 'bg-[#F0EFFF] text-[#635BFF] border border-[#C7C4FF]',
    },
    partial: {
      label: 'Partial',
      className: 'bg-[#FFF9ED] text-[#E6A817] border border-[#FDD87A]',
    },
    paid: {
      label: 'Paid',
      className: 'bg-[#F0FBF4] text-[#1DB954] border border-[#A3E6C0]',
    },
    overdue: {
      label: 'Overdue',
      className: 'bg-[#FFF0F3] text-[#DF1B41] border border-[#FFC4CF]',
    },
  }
  return configs[status]
}

export function getContractStatusConfig(status: ContractStatus) {
  const configs = {
    draft: {
      label: 'Draft',
      className: 'bg-[#F6F9FC] text-[#425466] border border-[#CFD7E0]',
    },
    sent: {
      label: 'Sent',
      className: 'bg-[#F0EFFF] text-[#635BFF] border border-[#C7C4FF]',
    },
    opened: {
      label: 'Opened',
      className: 'bg-[#FFF9ED] text-[#E6A817] border border-[#FDD87A]',
    },
    signed: {
      label: 'Signed',
      className: 'bg-[#F0FBF4] text-[#1DB954] border border-[#A3E6C0]',
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

// ── Strip markdown syntax for plain-text rendering
// Removes headings (#), bold/italic (* _ **), inline code (`), and horizontal rules (---)
export function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')           // headings
    .replace(/\*\*([^*]+)\*\*/g, '$1')     // bold ** (first, so single-* doesn't corrupt it)
    .replace(/\*([^*]+)\*/g, '$1')         // italic *
    .replace(/__([^_]+)__/g, '$1')         // bold __
    .replace(/_([^_]+)_/g, '$1')           // italic _ (won't touch ____ signature lines)
    .replace(/`([^`]+)`/g, '$1')           // inline code
    .replace(/^---+$/gm, '')               // horizontal rules
    .replace(/^\s*[-*]\s+/gm, '')          // unordered list markers
    .trim()
}

// ── Slugify a title into a filename-safe string with underscores
export function slugifyTitle(title: string, maxLength = 60): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')   // strip non-alphanumeric
    .replace(/\s+/g, '_')           // spaces → underscores
    .replace(/_+/g, '_')            // collapse multiple underscores
    .slice(0, maxLength)
    .replace(/_$/, '')              // trim trailing underscore
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
