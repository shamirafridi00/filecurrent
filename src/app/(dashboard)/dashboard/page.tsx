export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Zap,
  FileText,
  DollarSign,
  Clock,
  Users,
  Receipt,
  Hourglass,
  Plus,
  Bell,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StatCard, InvoiceBadge, ContractBadge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getDashboardStats } from '@/lib/db/supabase'
import { UpgradeSuccessToast } from '@/components/upgrade/UpgradeSuccessToast'
import type { InvoiceStatus, ContractStatus } from '@/types'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, stats] = await Promise.all([
    getCurrentProfile(user.id),
    getDashboardStats(user.id),
  ])

  const isFree = profile.plan === 'free'
  const docsUsed = profile.docsUsedThisMonth
  const docLimit = 3
  const progress = Math.min((docsUsed / docLimit) * 100, 100)

  return (
    <div className="flex gap-6">
      <UpgradeSuccessToast />
      <div className="min-w-0 flex-1 space-y-5">
        {isFree && (
          <Card className="border-l-4 border-l-primary">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">
                    You&apos;re on the Free plan — {docsUsed} of {docLimit} documents used this month
                  </p>
                  <Progress value={progress} className="mt-1.5 h-1.5 w-48" />
                </div>
              </div>
              <Button asChild size="sm" className="ml-4 shrink-0">
                <Link href="/pricing">Upgrade to Pro — $9/month →</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-4">
          <StatCard
            label="Total Invoiced"
            value={formatCurrency(stats.totalInvoiced)}
            subValue={`${stats.pendingInvoices} pending`}
            icon={<FileText size={18} />}
          />
          <StatCard
            label="Total Paid"
            value={formatCurrency(stats.totalPaid)}
            subValue={`${formatCurrency(stats.paidLast30Days)} last 30 days`}
            icon={<DollarSign size={18} />}
            valueColor="text-green-600"
          />
          <StatCard
            label="Outstanding"
            value={formatCurrency(stats.outstanding)}
            subValue={`${stats.overdueCount} overdue`}
            icon={<Clock size={18} />}
            valueColor="text-amber-600"
          />
        </div>

        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Active Clients"
            value={String(stats.activeClients)}
            icon={<Users size={18} />}
          />
          <StatCard
            label="Signed Contracts"
            value={String(stats.signedContracts)}
            icon={<FileText size={18} />}
          />
          <StatCard
            label="Pending"
            value={String(stats.pendingInvoices)}
            icon={<Hourglass size={18} />}
          />
          <StatCard
            label="Drafts"
            value={String(stats.draftInvoices)}
            icon={<Receipt size={18} />}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href="/contracts/new">
              <Plus className="mr-1 h-4 w-4" />
              New Contract
            </Link>
          </Button>
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-1 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/clients/new">
              <Plus className="mr-1 h-4 w-4" />
              Add Client
            </Link>
          </Button>
          <div className="ml-auto">
            <Button asChild variant="ghost" size="sm">
              <Link href="/imports">Import Clients</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Receipt size={16} />
                Recent Invoices
              </CardTitle>
              <Link href="/invoices" className="text-sm font-medium text-primary hover:underline">
                View All →
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {stats.recentInvoices.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No invoices yet</p>
              ) : (
                stats.recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Link
                        href={`/invoices/${inv.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        {inv.invoiceNumber}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {inv.clientName} · {formatDate(inv.invoiceDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(inv.total, inv.currency)}</p>
                      <InvoiceBadge status={inv.status as InvoiceStatus} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText size={16} />
                Recent Contracts
              </CardTitle>
              <Link href="/contracts" className="text-sm font-medium text-primary hover:underline">
                View All →
              </Link>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {stats.recentContracts.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">No contracts yet</p>
              ) : (
                stats.recentContracts.map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <Link
                        href={`/contracts/${c.id}`}
                        className="text-sm font-medium text-foreground hover:text-primary"
                      >
                        {c.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {c.clientName} · {formatDate(c.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(c.amount, c.currency)}</p>
                      <ContractBadge status={c.status as ContractStatus} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <aside className="hidden w-72 shrink-0 xl:block">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity yet</p>
            ) : (
              stats.recentActivity.map((event) => (
                <div key={event.id} className="flex gap-2 text-sm">
                  <div className="mt-0.5 shrink-0">
                    {event.type === 'reminder' ? (
                      <Bell className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Calendar className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
