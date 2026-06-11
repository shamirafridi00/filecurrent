'use client'

import { useState } from 'react'
import { CheckCircle, X, Paperclip } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/types'

interface Claim {
  id: string
  amount: number
  method: string
  paymentDate: string | null
  note: string | null
  receiptUrl: string | null
  createdAt: string
}

interface Props {
  invoiceId: string
  currency: string
  claims: Claim[]
}

const methodLabel = (v: string) => PAYMENT_METHODS.find((m) => m.value === v)?.label ?? v

/**
 * Freelancer-side review of client-submitted payment claims. Confirming records
 * a real payment (server-side) and updates the invoice; rejecting dismisses it.
 */
export function PendingClaimsReview({ invoiceId, currency, claims }: Props) {
  const router = useRouter()
  const [busyId, setBusyId] = useState<string | null>(null)

  async function review(claimId: string, action: 'confirm' | 'reject') {
    setBusyId(claimId)
    try {
      const res = await fetch(`/api/invoices/${invoiceId}/payment-claims/${claimId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) throw new Error()
      toast.success(action === 'confirm' ? 'Payment confirmed' : 'Claim dismissed')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setBusyId(null)
    }
  }

  if (claims.length === 0) return null

  return (
    <div className="space-y-3">
      {claims.map((c) => (
        <div key={c.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(c.amount, currency)}</p>
              <p className="text-xs text-amber-700">
                {methodLabel(c.method)}
                {c.paymentDate ? ` · ${formatDate(c.paymentDate)}` : ''}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-amber-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-800">
              Client reported
            </span>
          </div>

          {c.note && <p className="mt-1.5 text-xs text-gray-600">&ldquo;{c.note}&rdquo;</p>}

          {c.receiptUrl && (
            <a
              href={c.receiptUrl} target="_blank" rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-[#635BFF] hover:underline"
            >
              <Paperclip size={12} /> View receipt
            </a>
          )}

          <div className="mt-3 flex gap-2">
            <Button
              size="sm" className="h-8 flex-1"
              disabled={busyId === c.id}
              onClick={() => review(c.id, 'confirm')}
            >
              <CheckCircle className="mr-1 h-3.5 w-3.5" />
              Confirm
            </Button>
            <Button
              size="sm" variant="outline" className="h-8"
              disabled={busyId === c.id}
              onClick={() => review(c.id, 'reject')}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
