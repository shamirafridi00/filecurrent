export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader, ContractBadge, EmptyState } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getCurrentProfile, getContracts } from '@/lib/db/sqlite'

export default function ContractsPage() {
  const profile = getCurrentProfile()
  const contracts = getContracts(profile.id)

  return (
    <div>
      <PageHeader
        title="Contracts"
        subtitle="Manage your client contracts and agreements"
        icon={<FileText size={24} />}
        action={
          <Button asChild>
            <Link href="/contracts/new">
              <Plus className="mr-1 h-4 w-4" />
              New Contract
            </Link>
          </Button>
        }
      />

      {contracts.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<FileText size={40} />}
              title="No contracts yet"
              description="Create your first contract from a template to get started."
              action={
                <Button asChild>
                  <Link href="/contracts/new">
                    <Plus className="mr-1 h-4 w-4" />
                    New Contract
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{contracts.length} contract{contracts.length !== 1 ? 's' : ''}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {contracts.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0">
                    <Link
                      href={`/contracts/${c.id}`}
                      className="font-medium text-foreground hover:text-primary transition-colors"
                    >
                      {c.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {c.clientName} · {formatDate(c.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-sm font-medium">{formatCurrency(c.amount, c.currency)}</span>
                    <ContractBadge status={c.status as 'draft' | 'sent' | 'opened' | 'signed'} />
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/contracts/${c.id}`}>View →</Link>
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
