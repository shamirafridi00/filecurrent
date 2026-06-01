export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus, Receipt } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, InvoiceBadge, EmptyState } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInvoices } from '@/lib/db/supabase'
import type { InvoiceStatus } from '@/types'

export default async function InvoicesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const invoices = await getInvoices(user.id)

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Manage and track all your invoices"
        icon={<Receipt size={24} />}
        action={
          <Button asChild>
            <Link href="/invoices/new">
              <Plus className="mr-1 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        }
      />

      {invoices.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<Receipt size={40} />}
              title="No invoices yet"
              description="Create your first invoice to start getting paid."
              action={
                <Button asChild>
                  <Link href="/invoices/new">
                    <Plus className="mr-1 h-4 w-4" />
                    New Invoice
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0">
                    <Link
                      href={`/invoices/${inv.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {inv.invoiceNumber}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {inv.clientName} · {formatDate(inv.invoiceDate)}
                      {inv.dueDate && ` · Due ${formatDate(inv.dueDate)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-medium">{formatCurrency(inv.total, inv.currency)}</span>
                    <InvoiceBadge status={inv.status as InvoiceStatus} />
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/invoices/${inv.id}`}>View →</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
