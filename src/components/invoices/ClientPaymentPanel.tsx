'use client'

import { useState } from 'react'
import { CheckCircle, UploadSimple, X } from '@phosphor-icons/react'
import { formatCurrency } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/types'

interface Props {
  shareToken: string
  freelancerName: string
  currency: string
  balance: number
  paymentInstructions?: string | null
}

/**
 * Real client-facing payment flow on the public invoice page. The client marks
 * how much they paid (full or partial), how, and optionally attaches a receipt.
 * This submits a *payment claim* — the freelancer confirms it on their side,
 * which records the actual payment. Replaces the old cosmetic-only button.
 */
export function ClientPaymentPanel({
  shareToken,
  freelancerName,
  currency,
  balance,
  paymentInstructions,
}: Props) {
  const [open, setOpen] = useState(false)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [amount, setAmount] = useState(balance > 0 ? balance.toFixed(2) : '')
  const [method, setMethod] = useState('bank_transfer')
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0])
  const [note, setNote] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const amt = parseFloat(amount)
    if (!amt || amt <= 0) {
      setError('Enter the amount you paid.')
      return
    }

    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('amount', String(amt))
      fd.append('method', method)
      fd.append('paymentDate', paymentDate)
      if (note.trim()) fd.append('note', note.trim())
      if (receipt) fd.append('receipt', receipt)

      const res = await fetch(`/api/i/${shareToken}/payment-claim`, { method: 'POST', body: fd })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-800">Thank you — your payment has been submitted.</p>
          <p className="mt-0.5 text-sm text-green-700">
            {freelancerName} will confirm receipt. You&apos;ll see it reflected here once they do.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 rounded-xl border bg-white shadow-sm">
      {/* Payment instructions from the freelancer */}
      {paymentInstructions && (
        <div className="border-b bg-gray-50 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">How to pay</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">{paymentInstructions}</p>
        </div>
      )}

      {!open ? (
        <div className="px-5 py-5 text-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#635BFF] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5249e6]"
          >
            <CheckCircle size={16} weight="bold" />
            I&apos;ve Paid This Invoice
          </button>
          <p className="mt-2 text-xs text-gray-400">
            Let {freelancerName} know you&apos;ve sent payment — full or partial.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Mark as paid</h3>
            <button type="button" onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          {balance > 0 && (
            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
              <span className="text-gray-500">Balance due</span>
              <span className="font-semibold text-gray-900">{formatCurrency(balance, currency)}</span>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Amount paid</label>
            <div className="flex items-center gap-2">
              <input
                type="number" min="0" step="0.01" inputMode="decimal"
                value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                placeholder="0.00"
              />
              {balance > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(balance.toFixed(2))}
                  className="whitespace-nowrap rounded-lg border border-gray-300 px-3 py-2 text-xs font-medium text-gray-600 hover:bg-gray-50"
                >
                  Pay in full
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Method</label>
              <select
                value={method} onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Date paid</label>
              <input
                type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Reference / note <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text" value={note} onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
              placeholder="Transaction ID, confirmation #…"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">
              Payment receipt <span className="text-gray-400">(optional — image or PDF)</span>
            </label>
            {receipt ? (
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                <span className="truncate text-gray-700">{receipt.name}</span>
                <button type="button" onClick={() => setReceipt(null)} className="ml-2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-3 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50">
                <UploadSimple size={16} />
                Upload receipt
                <input
                  type="file" accept="image/*,application/pdf" className="hidden"
                  onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit" disabled={submitting}
            className="w-full rounded-lg bg-[#635BFF] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#5249e6] disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit Payment'}
          </button>
          <p className="text-center text-xs text-gray-400">
            {freelancerName} will confirm receipt before the invoice is marked paid.
          </p>
        </form>
      )}
    </div>
  )
}
