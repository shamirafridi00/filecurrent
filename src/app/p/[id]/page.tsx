export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProposalByShareToken, markProposalViewed } from '@/lib/db/supabase'
import { createClient } from '@/lib/supabase/server'
import { formatCurrency, formatDate } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'
import { ProposalActions } from '@/components/proposals/ProposalActions'

export default async function PublicProposalPage({ params }: { params: { id: string } }) {
  const [proposal, supabase] = await Promise.all([
    getProposalByShareToken(params.id),
    createClient(),
  ])
  if (!proposal) notFound()

  void markProposalViewed(proposal.id)

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === proposal.userId

  const isExpired = proposal.validUntil && new Date(proposal.validUntil) < new Date()
  const isResponded = proposal.status === 'accepted' || proposal.status === 'declined'

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {proposal.freelancerLogo && (
              <img src={proposal.freelancerLogo} alt="Logo" className="h-8 w-auto object-contain" />
            )}
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {proposal.freelancerBusiness ?? proposal.freelancerName}
              </p>
              <p className="text-xs text-gray-500">Project Proposal</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{proposal.clientName}</p>
            {proposal.clientCompany && <p className="text-xs text-gray-500">{proposal.clientCompany}</p>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-5">
        {/* Freelancer preview banner — shown when the proposal owner visits the public link */}
        {isOwner && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 px-5 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-blue-700 font-medium">
              You are previewing this proposal as your client sees it.
            </p>
            <Link
              href={`/proposals/${proposal.id}`}
              className="shrink-0 text-sm font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-900"
            >
              Open in Dashboard →
            </Link>
          </div>
        )}

        {/* Status banners — only show to client (non-owner) */}
        {!isOwner && proposal.status === 'accepted' && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-5 py-3 text-sm text-green-700 font-medium">
            You accepted this proposal on {formatDate(proposal.acceptedAt!)}
          </div>
        )}
        {!isOwner && proposal.status === 'declined' && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-700 font-medium">
            You declined this proposal
          </div>
        )}
        {/* Owner status view */}
        {isOwner && proposal.status === 'accepted' && (
          <div className="rounded-lg bg-green-50 border border-green-200 px-5 py-3 text-sm text-green-700 font-medium">
            {proposal.clientName} accepted this proposal on {formatDate(proposal.acceptedAt!)}
          </div>
        )}
        {isOwner && proposal.status === 'declined' && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-5 py-3 text-sm text-red-700 font-medium">
            {proposal.clientName} declined this proposal
          </div>
        )}
        {isExpired && !isResponded && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-5 py-3 text-sm text-amber-700 font-medium">
            This proposal expired on {formatDate(proposal.validUntil!)}
          </div>
        )}

        {/* Proposal header card */}
        <div className="rounded-lg border bg-white shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{proposal.title}</h1>
          {proposal.summary && <p className="text-gray-600 text-sm mt-2">{proposal.summary}</p>}
          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(proposal.total, proposal.currency)}</p>
            </div>
            {proposal.validUntil && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Valid Until</p>
                <p className="text-sm font-medium text-gray-700">{formatDate(proposal.validUntil)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Line items */}
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-semibold text-gray-900">Scope of Work</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">Qty</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Price</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {proposal.lineItems.map((item, i) => (
                <tr key={i}>
                  <td className="px-5 py-3 text-sm text-gray-900">{item.description}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 text-center">{item.quantity}</td>
                  <td className="px-5 py-3 text-sm text-gray-500 text-right">{formatCurrency(item.unitPrice, proposal.currency)}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-gray-900 text-right">{formatCurrency(item.amount, proposal.currency)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-200">
              {proposal.taxRate > 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-2 text-sm text-right text-gray-500">Subtotal</td>
                  <td className="px-5 py-2 text-sm text-right text-gray-900">{formatCurrency(proposal.subtotal, proposal.currency)}</td>
                </tr>
              )}
              {proposal.taxRate > 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-2 text-sm text-right text-gray-500">Tax ({proposal.taxRate}%)</td>
                  <td className="px-5 py-2 text-sm text-right text-gray-900">{formatCurrency(proposal.taxAmount, proposal.currency)}</td>
                </tr>
              )}
              {proposal.discountAmount > 0 && (
                <tr>
                  <td colSpan={3} className="px-5 py-2 text-sm text-right text-gray-500">Discount</td>
                  <td className="px-5 py-2 text-sm text-right text-green-600">-{formatCurrency(proposal.discountAmount, proposal.currency)}</td>
                </tr>
              )}
              <tr>
                <td colSpan={3} className="px-5 py-3 text-base font-bold text-right text-gray-900">Total</td>
                <td className="px-5 py-3 text-xl font-bold text-right text-gray-900">{formatCurrency(proposal.total, proposal.currency)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes */}
        {proposal.notes && (
          <div className="rounded-lg border bg-white shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-2">Notes</h2>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{proposal.notes}</p>
          </div>
        )}

        {/* Accept / Decline actions — only for clients, not the proposal owner */}
        {!isOwner && !isResponded && !isExpired && (
          <ProposalActions shareToken={params.id} />
        )}

        <p className="text-center text-xs text-gray-400 pb-4">
          Sent via <a href="https://filecurrent.com" className="hover:underline">{APP_NAME}</a>
        </p>
      </main>
    </div>
  )
}
