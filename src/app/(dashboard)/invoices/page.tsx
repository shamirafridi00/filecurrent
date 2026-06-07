export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus, Receipt } from '@/components/icons'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, EmptyState } from '@/components/ui'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInvoices, markOverdueInvoices, generateRecurringInvoices } from '@/lib/db/supabase'
import { InvoiceList } from '@/components/invoices/InvoiceList'

export default async function InvoicesPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [, , invoices] = await Promise.all([
    markOverdueInvoices(user.id),
    generateRecurringInvoices(user.id),
    getInvoices(user.id),
  ])

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
          <CardContent className="p-5">
            <InvoiceList invoices={invoices} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
