export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Receipt, FileText, Files } from '@phosphor-icons/react/dist/ssr'
import { getClientPortalData } from '@/lib/db/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid:     'bg-green-100 text-green-700',
    sent:     'bg-blue-100 text-blue-700',
    partial:  'bg-amber-100 text-amber-700',
    overdue:  'bg-red-100 text-red-700',
    draft:    'bg-gray-100 text-gray-600',
    signed:   'bg-green-100 text-green-700',
    opened:   'bg-blue-100 text-blue-700',
    accepted: 'bg-green-100 text-green-700',
    declined: 'bg-red-100 text-red-700',
    viewed:   'bg-blue-100 text-blue-700',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

type Tab = 'invoices' | 'contracts' | 'proposals'

export default async function ClientPortalPage({
  params,
  searchParams,
}: {
  params: { token: string }
  searchParams: { tab?: string }
}) {
  const data = await getClientPortalData(params.token)
  if (!data) notFound()

  const activeTab: Tab =
    searchParams.tab === 'contracts' ? 'contracts'
    : searchParams.tab === 'proposals' ? 'proposals'
    : 'invoices'

  const outstanding = data.invoices
    .filter((i) => i.status !== 'paid' && i.status !== 'draft')
    .reduce((sum, i) => sum + (i.total - i.paidAmount), 0)

  const totalPaid = data.invoices
    .filter((i) => i.status === 'paid' || i.paidAmount > 0)
    .reduce((sum, i) => sum + i.paidAmount, 0)

  const currency = data.invoices[0]?.currency ?? 'USD'
  const hasAnything = data.invoices.length > 0 || data.contracts.length > 0 || data.proposals.length > 0

  const tabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: 'invoices', label: 'Invoices', count: data.invoices.length },
    { key: 'contracts', label: 'Contracts', count: data.contracts.length },
    { key: 'proposals', label: 'Proposals', count: data.proposals.length },
  ]

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {data.freelancerLogo ? (
              <img
                src={data.freelancerLogo}
                alt={data.freelancerBusiness ?? data.freelancerName}
                width={120}
                height={32}
                loading="eager"
                decoding="async"
                className="h-8 w-auto object-contain"
              />
            ) : null}
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {data.freelancerBusiness ?? data.freelancerName}
              </p>
              <p className="text-xs text-gray-500">Client Portal</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">{data.clientName}</p>
            {data.clientCompany && (
              <p className="text-xs text-gray-500">{data.clientCompany}</p>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        {/* Balance summary — always visible */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className={`rounded-lg border p-4 shadow-sm ${outstanding > 0 ? 'border-amber-200 bg-amber-50' : 'bg-white'}`}>
            <p className={`text-xs mb-1 ${outstanding > 0 ? 'text-amber-700' : 'text-gray-500'}`}>Outstanding balance</p>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(outstanding, currency)}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Paid</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalPaid, currency)}</p>
          </div>
          <div className="rounded-lg border bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-500 mb-1">Documents</p>
            <p className="text-xl font-bold text-gray-900">
              {data.invoices.length + data.contracts.length + data.proposals.length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        {hasAnything && (
          <div className="flex gap-1 border-b">
            {tabs.map((t) => (
              <Link
                key={t.key}
                href={t.key === 'invoices' ? `/portal/${params.token}` : `/portal/${params.token}?tab=${t.key}`}
                className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  activeTab === t.key
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.label}{t.count > 0 ? ` (${t.count})` : ''}
              </Link>
            ))}
          </div>
        )}

        {/* Invoices */}
        {activeTab === 'invoices' && data.invoices.length > 0 && (
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                <Receipt size={16} className="text-gray-400" />
                Invoices
              </h2>
            </div>
            <div className="divide-y">
              {data.invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{inv.invoiceNumber}</span>
                      <StatusPill status={inv.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(inv.invoiceDate)}
                      {inv.dueDate ? ` · Due ${formatDate(inv.dueDate)}` : ''}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(inv.total, inv.currency)}</p>
                      {inv.paidAmount > 0 && inv.status !== 'paid' && (
                        <p className="text-xs text-gray-500">{formatCurrency(inv.paidAmount, inv.currency)} paid</p>
                      )}
                    </div>
                    {inv.shareToken && (
                      <Link
                        href={`/i/${inv.shareToken}`}
                        className={`text-xs font-medium whitespace-nowrap rounded-md px-2.5 py-1 ${
                          inv.status !== 'paid' && inv.status !== 'draft'
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'text-indigo-600 hover:underline'
                        }`}
                        target="_blank"
                      >
                        {inv.status !== 'paid' && inv.status !== 'draft' ? 'View & Pay →' : 'View →'}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'invoices' && data.invoices.length === 0 && hasAnything && (
          <p className="text-center text-sm text-gray-500 py-8">No invoices yet.</p>
        )}

        {/* Contracts */}
        {activeTab === 'contracts' && data.contracts.length > 0 && (
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                <FileText size={16} className="text-gray-400" />
                Contracts
              </h2>
            </div>
            <div className="divide-y">
              {data.contracts.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{c.title}</span>
                      <StatusPill status={c.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(c.createdAt)}
                      {c.signedAt ? ` · Signed ${formatDate(c.signedAt)}` : ''}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(c.amount, c.currency)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'contracts' && data.contracts.length === 0 && hasAnything && (
          <p className="text-center text-sm text-gray-500 py-8">No contracts yet.</p>
        )}

        {/* Proposals */}
        {activeTab === 'proposals' && data.proposals.length > 0 && (
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h2 className="flex items-center gap-2 font-semibold text-gray-900">
                <Files size={16} className="text-gray-400" />
                Proposals
              </h2>
            </div>
            <div className="divide-y">
              {data.proposals.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{p.title}</span>
                      <StatusPill status={p.status} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(p.createdAt)}
                      {p.validUntil && p.status === 'sent' ? ` · Valid until ${formatDate(p.validUntil)}` : ''}
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(p.total, p.currency)}</p>
                    {p.shareToken && (
                      <Link
                        href={`/p/${p.shareToken}`}
                        className={`text-xs font-medium whitespace-nowrap rounded-md px-2.5 py-1 ${
                          p.status === 'sent' || p.status === 'viewed'
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'text-indigo-600 hover:underline'
                        }`}
                        target="_blank"
                      >
                        {p.status === 'sent' || p.status === 'viewed' ? 'Review →' : 'View →'}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'proposals' && data.proposals.length === 0 && hasAnything && (
          <p className="text-center text-sm text-gray-500 py-8">No proposals yet.</p>
        )}

        {/* Empty state */}
        {!hasAnything && (
          <div className="rounded-lg border bg-white shadow-sm p-12 text-center">
            <p className="font-medium text-gray-900">No documents yet</p>
            <p className="text-sm text-gray-500 mt-1">Your documents will appear here once they&apos;re shared with you.</p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-4">
          Powered by <a href="https://filecurrent.com" className="hover:underline">{APP_NAME}</a>
        </p>
      </main>
    </div>
  )
}
