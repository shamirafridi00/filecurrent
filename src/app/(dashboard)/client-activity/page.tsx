export const dynamic = 'force-dynamic'

import { ChartLine } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClients, getAllClientActivity, getInvoices } from '@/lib/db/supabase'
import { formatCurrency } from '@/lib/utils'
import { ActivityFeed } from '@/components/clients/ActivityFeed'
import Link from 'next/link'

export default async function ClientActivityPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [clients, events, allInvoices] = await Promise.all([
    getClients(user.id),
    getAllClientActivity(user.id, 100),
    getInvoices(user.id),
  ])

  // Stat: total billed this month
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const billedThisMonth = allInvoices
    .filter((i) => i.invoiceDate >= monthStart.split('T')[0])
    .reduce((s, i) => s + i.total, 0)

  // Stat: outstanding balance
  const outstanding = allInvoices
    .filter((i) => i.status !== 'paid')
    .reduce((s, i) => s + i.total, 0)

  const currency = allInvoices[0]?.currency ?? 'USD'

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Activity"
        subtitle="Recent events across all clients"
        icon={<ChartLine size={24} />}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link href="/clients" className="block rounded-xl border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Total Clients</p>
          <p className="text-3xl font-bold">{clients.length}</p>
          <p className="text-xs text-muted-foreground mt-2">View all clients →</p>
        </Link>
        <Link href="/invoices" className="block rounded-xl border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Billed This Month</p>
          <p className="text-3xl font-bold">{formatCurrency(billedThisMonth, currency)}</p>
          <p className="text-xs text-muted-foreground mt-2">View invoices →</p>
        </Link>
        <Link href="/invoices?status=sent" className="block rounded-xl border bg-card p-5 hover:border-amber-400/40 hover:shadow-sm transition-all">
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Outstanding Balance</p>
          <p className="text-3xl font-bold text-amber-600">{formatCurrency(outstanding, currency)}</p>
          <p className="text-xs text-muted-foreground mt-2">View unpaid invoices →</p>
        </Link>
      </div>

      {/* Activity feed */}
      <Card>
        <CardContent className="p-5">
          <ActivityFeed
            events={events}
            emptyMessage="No activity yet. Create invoices and contracts to see events here."
            showReset
          />
        </CardContent>
      </Card>
    </div>
  )
}
