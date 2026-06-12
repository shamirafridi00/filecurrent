export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  Lightning,
  FileText,
  Plus,
  Bell,
  CalendarBlank,
  Receipt,
  CheckCircle,
  Warning,
  CurrencyDollar,
  Users,
  Timer,
} from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatCard, InvoiceBadge, ContractBadge } from '@/components/ui'
import { cn, formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getDashboardStats, getExpenseSummary, getTimeTrackingSummary, getRecentProposalEvents } from '@/lib/db/supabase'
import { UpgradeSuccessToast } from '@/components/upgrade/UpgradeSuccessToast'
import { GettingStartedCard } from '@/components/onboarding/GettingStartedCard'
import { FeatureTour } from '@/components/ui/FeatureTour'
import type { InvoiceStatus, ContractStatus } from '@/types'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, stats, expenseSummary, timeSummary, proposalEvents] = await Promise.all([
    getCurrentProfile(user.id),
    getDashboardStats(user.id),
    getExpenseSummary(user.id),
    getTimeTrackingSummary(user.id),
    getRecentProposalEvents(user.id),
  ])

  const netProfit = stats.totalPaid - expenseSummary.totalExpenses

  const isTrial = profile.plan === 'trial'
  const daysLeft = isTrial && profile.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(profile.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0
  const isUrgent = isTrial && daysLeft <= 2

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const displayName = profile.businessName || profile.fullName.split(' ')[0] || 'there'

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <UpgradeSuccessToast />
      <div className="min-w-0 flex-1 space-y-5">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{greeting}, {displayName}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Your business at a glance
            </p>
          </div>
          <FeatureTour
            tourId="dashboard"
            steps={[
              { title: 'Welcome to FileCurrent 👋', description: 'A 30-second tour of where everything lives. You can re-run it anytime with the Tour button.' },
              { element: '[data-tour="dashboard-stats"]', title: 'Your money at a glance', description: 'Total invoiced, what’s been paid, what’s outstanding, and your expenses — updated live as you work.' },
              { element: 'a[href="/invoices"]', title: 'Invoices', description: 'Create branded invoices, share a payment link, and let automatic reminders chase late payments for you.' },
              { element: 'a[href="/contracts"]', title: 'Contracts', description: 'Send contracts for e-signature — clients sign from any device, no account needed.' },
              { element: 'a[href="/clients"]', title: 'Clients', description: 'Every client gets a private portal with all their invoices, contracts, and proposals in one link.' },
              { element: 'a[href="/settings"]', title: 'Make it yours', description: 'Add your logo, default tax rate, and payment methods in Settings — they flow onto every document.' },
            ]}
          />
        </div>

        {stats.recentInvoices.length === 0 && stats.recentContracts.length === 0 && (
          <GettingStartedCard
            hasClients={stats.activeClients > 0}
            hasContracts={stats.recentContracts.length > 0}
            hasInvoices={stats.recentInvoices.length > 0}
          />
        )}

        {/* Proposal accept/decline banners (last 7 days) */}
        {proposalEvents.map((ev) => (
          <div
            key={ev.id}
            className={cn(
              'flex items-center justify-between rounded-r-xl border-l-4 p-4',
              ev.eventType === 'proposal_accepted'
                ? 'border-l-[#1DB954] bg-green-50'
                : 'border-l-destructive bg-red-50'
            )}
          >
            <div className="flex items-center gap-3 min-w-0">
              {ev.eventType === 'proposal_accepted'
                ? <CheckCircle className="h-5 w-5 shrink-0 text-[#1DB954]" />
                : <Warning className="h-5 w-5 shrink-0 text-destructive" />}
              <p className="text-sm font-medium text-foreground truncate">
                {ev.clientName} {ev.eventType === 'proposal_accepted' ? 'accepted' : 'declined'} your proposal
                {' '}&ldquo;{ev.proposalTitle}&rdquo; · {formatDate(ev.createdAt)}
              </p>
            </div>
            <Button asChild size="sm" variant={ev.eventType === 'proposal_accepted' ? 'default' : 'outline'} className="ml-4 shrink-0">
              <Link href={ev.proposalId ? `/proposals/${ev.proposalId}` : '/proposals'}>
                {ev.eventType === 'proposal_accepted' ? 'Create Contract →' : 'View →'}
              </Link>
            </Button>
          </div>
        ))}

        {isUrgent && (
          <div className="flex items-center justify-between rounded-r-xl border-l-4 border-l-[#E6A817] bg-[#FFF9ED] p-4">
            <div className="flex items-center gap-3">
              <Lightning className="h-5 w-5 shrink-0 text-[#E6A817]" />
              <p className="font-semibold text-foreground">
                ⚠ Your trial ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''} — upgrade to keep access.
              </p>
            </div>
            <Button asChild size="sm" className="ml-4 shrink-0 bg-[#635BFF] hover:bg-[#5145E5] text-white">
              <Link href="/trial-expired">Upgrade Now →</Link>
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-tour="dashboard-stats">
          <StatCard
            label="Total Invoiced"
            value={formatCurrency(stats.totalInvoiced)}
            subValue={`${stats.pendingInvoices} pending`}
            icon={<Receipt size={18} />}
            accent="border-l-[#635BFF]"
          />
          <StatCard
            label="Total Paid"
            value={formatCurrency(stats.totalPaid)}
            subValue={`${formatCurrency(stats.paidLast30Days)} last 30 days`}
            icon={<CheckCircle size={18} />}
            valueColor="text-[#1DB954]"
            accent="border-l-[#1DB954]"
          />
          <StatCard
            label="Outstanding"
            value={formatCurrency(stats.outstanding)}
            subValue={`${stats.overdueCount} overdue`}
            icon={<Warning size={18} />}
            valueColor="text-[#E6A817]"
            accent="border-l-[#E6A817]"
          />
          <StatCard
            label="Total Expenses (YTD)"
            value={formatCurrency(expenseSummary.totalExpenses)}
            subValue={`Net: ${formatCurrency(netProfit)}`}
            icon={<CurrencyDollar size={18} />}
            valueColor="text-destructive"
            accent="border-l-destructive"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Active Clients"
            value={String(stats.activeClients)}
            icon={<Users size={16} />}
            accent="border-t-[#635BFF]"
            accentPosition="top"
          />
          <StatCard
            label="Signed Contracts"
            value={String(stats.signedContracts)}
            icon={<FileText size={16} />}
            accent="border-t-[#1DB954]"
            accentPosition="top"
          />
          <StatCard
            label="Pending"
            value={String(stats.pendingInvoices)}
            icon={<Bell size={16} />}
            accent="border-t-[#E6A817]"
            accentPosition="top"
          />
          <StatCard
            label="Unbilled Hours"
            value={`${timeSummary.billableHours.toFixed(1)} hrs`}
            subValue={`${formatCurrency(timeSummary.unbilledAmount)} unbilled`}
            icon={<Timer size={16} />}
            accent="border-t-primary"
            accentPosition="top"
          />
        </div>

        {/* One primary action per page — invoices are the money path */}
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contracts/new">
              <Plus className="mr-1.5 h-4 w-4" />
              New Contract
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/clients/new">
              <Plus className="mr-1.5 h-4 w-4" />
              Add Client
            </Link>
          </Button>
          <div className="ml-auto">
            <Button asChild variant="ghost">
              <Link href="/imports">Import Clients</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
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
                  <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                    <div>
                      <Link
                        href={`/contracts/${c.id}`}
                        className="text-sm font-medium text-primary hover:underline"
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
                <div key={event.id} className="flex items-start gap-3 py-1.5">
                  <div className={cn(
                    "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    event.type === 'reminder' ? "bg-amber-50" : "bg-accent"
                  )}>
                    {event.type === 'reminder'
                      ? <Bell className="h-3.5 w-3.5 text-amber-500" />
                      : <CalendarBlank className="h-3.5 w-3.5 text-primary" />
                    }
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-foreground leading-snug">{event.description}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(event.timestamp)}</p>
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
