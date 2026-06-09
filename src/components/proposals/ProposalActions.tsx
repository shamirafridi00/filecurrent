'use client'

import { useState } from 'react'

export function ProposalActions({ shareToken }: { shareToken: string }) {
  const [status, setStatus] = useState<'idle' | 'accepting' | 'declining' | 'accepted' | 'declined'>('idle')

  async function handleAccept() {
    setStatus('accepting')
    const res = await fetch(`/api/proposals/${shareToken}/accept`, { method: 'POST' })
    if (res.ok) setStatus('accepted')
    else setStatus('idle')
  }

  async function handleDecline() {
    setStatus('declining')
    const res = await fetch(`/api/proposals/${shareToken}/decline`, { method: 'POST' })
    if (res.ok) setStatus('declined')
    else setStatus('idle')
  }

  if (status === 'accepted') return (
    <div className="rounded-lg bg-green-50 border border-green-200 p-6 text-center">
      <p className="text-xl font-bold text-green-700 mb-1">Proposal Accepted!</p>
      <p className="text-sm text-green-600">The service provider has been notified. You&apos;ll hear from them shortly.</p>
    </div>
  )

  if (status === 'declined') return (
    <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 text-center">
      <p className="text-lg font-semibold text-gray-700 mb-1">Proposal Declined</p>
      <p className="text-sm text-gray-500">The service provider has been notified.</p>
    </div>
  )

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <h2 className="font-semibold text-gray-900 mb-1">Ready to proceed?</h2>
      <p className="text-sm text-gray-500 mb-5">Accept this proposal to move forward with the project.</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAccept}
          disabled={status === 'accepting'}
          className="flex-1 rounded-lg bg-indigo-600 text-white py-3 px-6 font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {status === 'accepting' ? 'Accepting...' : 'Accept Proposal'}
        </button>
        <button
          onClick={handleDecline}
          disabled={status === 'declining'}
          className="rounded-lg border border-gray-300 text-gray-600 py-3 px-6 font-semibold text-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          {status === 'declining' ? 'Declining...' : 'Decline'}
        </button>
      </div>
    </div>
  )
}
