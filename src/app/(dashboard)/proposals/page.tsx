export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, FileText } from '@phosphor-icons/react/dist/ssr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader, EmptyState } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getProposals } from '@/lib/db/supabase'

const STATUS_COLORS: Record<string, string> = {
  draft:    'bg-muted text-muted-foreground border-border',
  sent:     'bg-blue-50 text-blue-700 border-blue-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
  expired:  'bg-amber-50 text-amber-700 border-amber-200',
}

export default async function ProposalsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const proposals = await getProposals(user.id)

  return (
    <div>
      <PageHeader
        title="Proposals"
        subtitle="Send project proposals to clients"
        icon={<FileText size={24} weight="duotone" className="text-primary" />}
        action={
          <Button asChild>
            <Link href="/proposals/new">
              <Plus className="mr-1.5 h-4 w-4" /> New Proposal
            </Link>
          </Button>
        }
      />

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="p-8">
            <EmptyState
              icon={<FileText size={40} weight="duotone" className="text-muted-foreground" />}
              title="No proposals yet"
              description="Create your first proposal to send to a client."
              action={
                <Button asChild>
                  <Link href="/proposals/new">
                    <Plus className="mr-1.5 h-4 w-4" /> New Proposal
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {proposals.length} proposal{proposals.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {proposals.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/40 transition-colors">
                  <div className="min-w-0">
                    <Link href={`/proposals/${p.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
                      {p.title}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {p.clientName} · {formatDate(p.createdAt)}
                      {p.validUntil ? ` · Valid until ${formatDate(p.validUntil)}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                    <span className="text-sm font-medium">{formatCurrency(p.total, p.currency)}</span>
                    <Badge variant="secondary" className={`text-xs border ${STATUS_COLORS[p.status] ?? STATUS_COLORS.draft}`}>
                      {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                    </Badge>
                    {p.contractId ? (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/contracts/${p.contractId}`}>View Contract →</Link>
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        variant={p.status === 'accepted' ? 'default' : 'outline'}
                      >
                        <Link href={`/contracts/new?proposalId=${p.id}`}>
                          Create Contract →
                        </Link>
                      </Button>
                    )}
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/proposals/${p.id}`}>View →</Link>
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
