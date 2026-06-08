export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Users, Plus, FileText, Receipt, PencilSimple, Envelope, Buildings, Phone, MapPin, ChartLine } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, ContractBadge, InvoiceBadge, EmptyState } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getClientById, getContracts, getInvoices, getClientActivityLog, getClientStats } from '@/lib/db/supabase'
import { DeleteClientButton } from '@/components/clients/DeleteClientButton'
import { ClientReminderToggle } from '@/components/clients/ClientReminderToggle'
import { ActivityFeed } from '@/components/clients/ActivityFeed'
import type { ContractStatus, InvoiceStatus } from '@/types'

type Tab = 'overview' | 'activity'

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

  const activeTab: Tab = searchParams.tab === 'activity' ? 'activity' : 'overview'

  const [client, allContracts, allInvoices, activityEvents, stats] = await Promise.all([
    getClientById(params.id, user.id),
    getContracts(user.id),
    getInvoices(user.id),
    getClientActivityLog(user.id, params.id, 50),
    getClientStats(user.id, params.id),
  ])
  if (!client) notFound()

  const contracts = allContracts.filter((c) => c.clientId === params.id)
  const invoices = allInvoices.filter((i) => i.clientId === params.id)

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
              <Link href={`/contracts/new?clientId=${params.id}&returnTo=/clients/${params.id}`}>
                <Plus className="mr-1 h-3.5 w-3.5" /> New Contract
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href={`/invoices/new?clientId=${params.id}&returnTo=/clients/${params.id}`}>
                <Plus className="mr-1 h-3.5 w-3.5" /> New Invoice
              </Link>
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b">
        <Link
          href={`/clients/${params.id}`}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Overview
        </Link>
        <Link
          href={`/clients/${params.id}?tab=activity`}
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            activeTab === 'activity'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Activity
        </Link>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_1fr]">
          {/* Sidebar info */}
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
                  clientId={params.id}
                  remindersPaused={client.remindersPaused}
                />
              </CardContent>
            </Card>

            <DeleteClientButton clientId={params.id} clientName={client.name} />
          </div>

          {/* Main content */}
          <div className="space-y-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText size={16} /> Contracts
                </CardTitle>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/contracts/new?clientId=${params.id}&returnTo=/clients/${params.id}`}>
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
                      <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <Link href={`/contracts/${c.id}`} className="font-medium text-sm hover:text-primary">
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Receipt size={16} /> Invoices
                </CardTitle>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/invoices/new?clientId=${params.id}&returnTo=/clients/${params.id}`}>
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
                      <div key={inv.id} className="flex items-center justify-between rounded-lg border p-3">
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
