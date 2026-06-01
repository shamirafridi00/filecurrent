export const dynamic = 'force-dynamic'

import { Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/ui'
import { getCurrentProfile, getContracts, getInvoices, getClients } from '@/lib/db/sqlite'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ContractBadge, InvoiceBadge } from '@/components/ui'
import type { ContractStatus, InvoiceStatus } from '@/types'

export default function ClientActivityPage() {
  const profile = getCurrentProfile()
  const clients = getClients(profile.id)
  const allContracts = getContracts(profile.id)
  const allInvoices = getInvoices(profile.id)

  const clientActivity = clients.map((client) => ({
    client,
    latestContract: allContracts.find((c) => c.clientId === client.id),
    latestInvoice: allInvoices.find((i) => i.clientId === client.id),
  })).filter((a) => a.latestContract || a.latestInvoice)

  return (
    <div>
      <PageHeader
        title="Client Activity"
        subtitle="Overview of all client interactions"
        icon={<Activity size={24} />}
      />

      {clientActivity.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground text-sm">
            No client activity yet. Add clients and create contracts or invoices to see activity here.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {clientActivity.map(({ client, latestContract, latestInvoice }) => (
            <Card key={client.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={`/clients/${client.id}`} className="font-semibold hover:text-primary">
                      {client.name}
                    </Link>
                    {client.company && <p className="text-sm text-muted-foreground">{client.company}</p>}
                  </div>
                  <div className="flex gap-6 text-sm">
                    {latestContract && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Latest Contract</p>
                        <div className="flex items-center gap-2">
                          <Link href={`/contracts/${latestContract.id}`} className="hover:text-primary truncate max-w-32">
                            {latestContract.title}
                          </Link>
                          <ContractBadge status={latestContract.status as ContractStatus} />
                        </div>
                        <p className="text-xs text-muted-foreground">{formatDate(latestContract.createdAt)}</p>
                      </div>
                    )}
                    {latestInvoice && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Latest Invoice</p>
                        <div className="flex items-center gap-2">
                          <Link href={`/invoices/${latestInvoice.id}`} className="text-primary hover:underline">
                            {latestInvoice.invoiceNumber}
                          </Link>
                          <InvoiceBadge status={latestInvoice.status as InvoiceStatus} />
                        </div>
                        <p className="text-xs text-muted-foreground">{formatCurrency(latestInvoice.total, latestInvoice.currency)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
