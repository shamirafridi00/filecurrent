'use client'

import { useState } from 'react'
import { CheckCircle } from '@phosphor-icons/react'

interface Props {
  freelancerName: string
}

/**
 * Client-anxiety reducer on the public invoice page. Purely visual — the
 * freelancer still records the payment manually in the dashboard.
 */
export function PaymentSentButton({ freelancerName }: Props) {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
        <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-green-600" />
        <div>
          <p className="text-sm font-medium text-green-800">Thank you! Your payment has been noted.</p>
          <p className="mt-0.5 text-sm text-green-700">{freelancerName} will confirm receipt.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 text-center">
      <button
        type="button"
        onClick={() => setSent(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
      >
        <CheckCircle size={16} />
        I Have Sent Payment
      </button>
      <p className="mt-2 text-xs text-gray-400">
        Already paid? Let {freelancerName} know.
      </p>
    </div>
  )
}
