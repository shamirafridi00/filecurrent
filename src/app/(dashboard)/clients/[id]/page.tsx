export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Users, Plus, FileText, Receipt, PencilSimple, Envelope, Buildings, Phone, MapPin, ChartLine, ClipboardText } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, ContractBadge, InvoiceBadge, EmptyState } from '@/components/ui'
import { HelpHint } from '@/components/ui/HelpHint'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getClientById, getContracts, getInvoices, getProposals, getClientActivityLog, getClientStats, getClientPortalToken, getIntakeForms, getClientIntakeResponses } from '@/lib/db/supabase'
import { DeleteClientButton } from '@/components/clients/DeleteClientButton'
import { ClientReminderToggle } from '@/components/clients/ClientReminderToggle'
import { ClientPortalLink } from '@/components/clients/ClientPortalLink'
import { ActivityFeed } from '@/components/clients/ActivityFeed'
import { CopyIntakeLink } from '@/components/intake-forms/CopyIntakeLink'
import { APP_URL } from '@/lib/constants'
import { extractToken } from '@/lib/slug'
import type { ContractStatus, InvoiceStatus } from '@/types'

type Tab = 'overview' | 'contracts' | 'invoices' | 'proposals' | 'forms' | 'activity'

const TABS: Array<{ key: Tab; label: string }> = [
  { key: 'overview', label: 'Overview' },
  { key: 'contracts', label: 'Contracts' },
  { key: 'invoices', label: 'Invoices' },
  { key: 'proposals', label: 'Proposals' },
  { key: 'forms', label: 'Forms' },
  { key: 'activity', label: 'Activity' },
]

export default async function ClientDetailPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { tab?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { notFound(); return null }

  const activeTab: Tab = (TABS.find((t) => t.key === searchParams.tab)?.key as Tab) ?? 'overview'

  // URLs may carry a readable slug prefix (name--uuid) — strip it for lookups
  const clientId = extractToken(params.id)

  const [client, allContracts, allInvoices, allProposals, activityEvents, stats, portalToken, intakeForms, intakeResponses] = await Promise.all([
    getClientById(clientId, user.id),
    getContracts(user.id),
    getInvoices(user.id),
    getProposals(user.id),
    getClientActivityLog(user.id, clientId, 50),
    getClientStats(user.id, clientId),
    getClientPortalToken(clientId, user.id),
    getIntakeForms(user.id),
    getClientIntakeResponses(clientId, user.id),
  ])
  if (!client) notFound()

  const contracts = allContracts.filter((c) => c.clientId === clientId)
  const invoices = allInvoices.filter((i) => i.clientId === clientId)
  const proposals = allProposals.filter((p) => p.clientId === clientId)
  const activeForms = intakeForms.filter((f) => f.isActive)
  const showOverviewLayout = activeTab !== 'activity'

  // Client since: earliest invoice or contract date
  const dates = [
    ...invoices.map((i) => i.invoiceDate),
    ...contracts.map((c) => c.createdAt),
  ].sort()
  const clientSince = dates[0] ? formatDate(dates[0]) : formatDate(client.createdAt)

  return (
    <div>
      <PageHeader
        title={client.name}
        backHref="/clients"
        backLabel="All Clients"
        icon={<Users size={24} />}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/clients/${params.id}/edit`}>
                <PencilSimple className="mr-1 h-3.5 w-3.5" /> Edit
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link href={`/contracts/new?clientId=${clientId}&returnTo=/clients/${params.id}`}>
                <Plus className="mr-1 h-3.5 w-3.5" /> New Contract
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/invoices/new?clientId=${clientId}&returnTo=/clients/${params.id}`}>
                <Plus className="mr-1 h-3.5 w-3.5" /> New Invoice
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/proposals/new?clientId=${clientId}`}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Proposal
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/time-tracking">
                <Plus className="mr-1 h-3.5 w-3.5" /> Time Log
              </Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link href="/expenses">
                <Plus className="mr-1 h-3.5 w-3.5" /> Expense
              </Link>
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b overflow-x-auto">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === 'overview' ? `/clients/${params.id}` : `/clients/${params.id}?tab=${t.key}`}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap transition-colors ${
              activeTab === t.key
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {showOverviewLayout && (
        <div className={activeTab === 'overview' ? 'grid grid-cols-1 gap-5 xl:grid-cols-[260px_1fr]' : ''}>
          {/* Sidebar info — overview only */}
          {activeTab === 'overview' && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-base">Contact</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                {client.company && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Buildings size={14} /> {client.company}
                  </div>
                )}
                {client.email && (
                  <div className="flex items-center gap-2">
                    <Envelope size={14} className="text-muted-foreground shrink-0" />
                    <a href={`mailto:${client.email}`} className="text-primary hover:underline truncate">{client.email}</a>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin size={14} className="shrink-0 mt-0.5" /> <span>{client.address}</span>
                  </div>
                )}
                {client.notes && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{client.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contracts</span>
                  <span className="font-medium">{client.contractCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invoices</span>
                  <span className="font-medium">{client.invoiceCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client since</span>
                  <span className="font-medium">{formatDate(client.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Reminders
                </p>
                <ClientReminderToggle
                  clientId={clientId}
                  remindersPaused={client.remindersPaused}
                />
              </CardContent>
            </Card>

            {portalToken && (
              <Card>
                <CardContent className="p-4">
                  <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Client Portal
                    <HelpHint
                      title="Client Portal"
                      example="Send the portal link once — your client bookmarks it and checks invoice status without emailing you."
                    >
                      A unique link for each client showing all their invoices,
                      contracts, and outstanding balance. Share it once — they
                      can bookmark it.
                    </HelpHint>
                  </p>
                  <ClientPortalLink clientId={clientId} portalToken={portalToken} clientEmail={client.email ?? null} clientName={client.name} />
                </CardContent>
              </Card>
            )}

            {activeForms.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                    Intake Forms
                  </p>
                  <div className="space-y-2">
                    {activeForms.map((form) => (
                      <div key={form.id} className="flex items-center justify-between">
                        <span className="text-sm text-foreground truncate">{form.title}</span>
                        <CopyIntakeLink url={`${APP_URL}/intake/${form.shareToken}`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <DeleteClientButton clientId={clientId} clientName={client.name} />
          </div>
          )}

          {/* Main content */}
          <div className="space-y-5">
            {(activeTab === 'overview' || activeTab === 'contracts') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText size={16} /> Contracts
                </CardTitle>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/contracts/new?clientId=${clientId}&returnTo=/clients/${params.id}`}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> New
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {contracts.length === 0 ? (
                  <EmptyState title="No contracts" description="Create your first contract for this client." />
                ) : (
                  <div className="space-y-2">
                    {contracts.map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                        <div>
                          <Link href={`/contracts/${c.id}`} className="font-medium text-sm text-foreground hover:text-primary transition-colors">
                            {c.title}
                          </Link>
                          <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{formatCurrency(c.amount, c.currency)}</span>
                          <ContractBadge status={c.status as ContractStatus} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            )}

            {(activeTab === 'overview' || activeTab === 'invoices') && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Receipt size={16} /> Invoices
                </CardTitle>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/invoices/new?clientId=${clientId}&returnTo=/clients/${params.id}`}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> New
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-0">
                {invoices.length === 0 ? (
                  <EmptyState title="No invoices" description="Create your first invoice for this client." />
                ) : (
                  <div className="space-y-2">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                        <div>
                          <Link href={`/invoices/${inv.id}`} className="font-medium text-sm text-primary hover:underline">
                            {inv.invoiceNumber}
                          </Link>
                          <p className="text-xs text-muted-foreground">{formatDate(inv.invoiceDate)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm">{formatCurrency(inv.total, inv.currency)}</span>
                          <InvoiceBadge status={inv.status as InvoiceStatus} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            )}

            {(activeTab === 'overview' || activeTab === 'proposals') && (proposals.length > 0 || activeTab === 'proposals') && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText size={16} /> Proposals
                  </CardTitle>
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/proposals/new?clientId=${clientId}`}>
                      <Plus className="mr-1 h-3.5 w-3.5" /> New
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="pt-0">
                  {proposals.length === 0 ? (
                    <EmptyState title="No proposals" description="Send this client a proposal to scope the next project." />
                  ) : (
                    <div className="space-y-2">
                      {proposals.map((p) => (
                        <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                          <div>
                            <Link href={`/proposals/${p.id}`} className="font-medium text-sm text-foreground hover:text-primary transition-colors">
                              {p.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">{formatDate(p.createdAt)}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm">{formatCurrency(p.total, p.currency)}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium border bg-muted text-muted-foreground border-border capitalize">
                              {p.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {(activeTab === 'overview' || activeTab === 'forms') && (intakeResponses.length > 0 || activeTab === 'forms') && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ClipboardText size={16} /> Submitted Forms
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {intakeResponses.length === 0 ? (
                    <EmptyState title="No form submissions" description="Send this client an intake form from the Intake Forms page." />
                  ) : (
                    <div className="space-y-2">
                      {intakeResponses.map((r) => (
                        <Link
                          key={r.id}
                          href={`/intake-forms/${r.formId}/responses`}
                          className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm text-foreground">{r.formTitle || 'Intake form'}</p>
                            <p className="text-xs text-muted-foreground">Submitted {formatDate(r.submittedAt)}</p>
                          </div>
                          <span className="text-sm font-medium text-primary">View →</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="space-y-5">
          {/* Mini stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Client Since</p>
                <p className="font-semibold text-sm">{clientSince}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Lifetime Value</p>
                <p className="font-semibold text-sm text-emerald-600">
                  {formatCurrency(stats.totalPaid, invoices[0]?.currency ?? 'USD')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
                <p className="font-semibold text-sm text-amber-600">
                  {formatCurrency(stats.outstanding, invoices[0]?.currency ?? 'USD')}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-1">Contracts Signed</p>
                <p className="font-semibold text-sm">{stats.signedContracts} / {stats.contractCount}</p>
              </CardContent>
            </Card>
          </div>

          {/* Activity timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ChartLine size={16} /> Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ActivityFeed
                events={activityEvents}
                emptyMessage="No activity recorded for this client yet."
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
