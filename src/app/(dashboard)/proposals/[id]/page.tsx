export const dynamic = 'force-dynamic'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { FileText, User, CalendarBlank, CurrencyDollar } from '@phosphor-icons/react/dist/ssr'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getProposal } from '@/lib/db/supabase'
import { ProposalDetailActions } from '@/components/proposals/ProposalDetailActions'

const STATUS_COLORS: Record<string, string> = {
  draft:    'bg-muted text-muted-foreground border-border',
  sent:     'bg-blue-50 text-blue-700 border-blue-200',
  accepted: 'bg-green-50 text-green-700 border-green-200',
  declined: 'bg-red-50 text-red-700 border-red-200',
  expired:  'bg-amber-50 text-amber-700 border-amber-200',
}

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const proposal = await getProposal(params.id, user.id)
  if (!proposal) notFound()

  return (
    <div>
      <PageHeader
        title={proposal.title}
        subtitle={`For ${proposal.clientName}${proposal.clientCompany ? ` · ${proposal.clientCompany}` : ''}`}
        icon={<FileText size={24} weight="duotone" className="text-primary" />}
        backHref="/proposals"
        backLabel="Back to Proposals"
        action={
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className={`border ${STATUS_COLORS[proposal.status] ?? STATUS_COLORS.draft}`}>
              {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
            </Badge>
            {proposal.contractId ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/contracts/${proposal.contractId}`}>View Contract →</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant={proposal.status === 'accepted' ? 'default' : 'outline'}>
                <Link href={`/contracts/new?proposalId=${proposal.id}`}>Create Contract →</Link>
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
        {/* Main content */}
        <div className="space-y-5">
          {/* Actions */}
          <Card>
            <CardContent className="pt-5">
              <ProposalDetailActions
                proposalId={proposal.id}
                shareToken={proposal.shareToken}
                status={proposal.status}
                clientEmail={proposal.clientEmail}
              />
            </CardContent>
          </Card>

          {/* Summary + line items */}
          {proposal.summary && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Project Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{proposal.summary}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Scope of Work</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</th>
                      <th className="text-center px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-16">Qty</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-28">Unit Price</th>
                      <th className="text-right px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground w-28">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {proposal.lineItems.map((item, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-5 py-3 text-sm text-foreground">{item.description}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground text-center">{item.quantity}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground text-right">{formatCurrency(item.unitPrice, proposal.currency)}</td>
                        <td className="px-5 py-3 text-sm font-medium text-foreground text-right">{formatCurrency(item.amount, proposal.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t-2 border-border">
                    {proposal.taxRate > 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-2 text-sm text-right text-muted-foreground">Subtotal</td>
                        <td className="px-5 py-2 text-sm text-right text-foreground">{formatCurrency(proposal.subtotal, proposal.currency)}</td>
                      </tr>
                    )}
                    {proposal.taxRate > 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-2 text-sm text-right text-muted-foreground">Tax ({proposal.taxRate}%)</td>
                        <td className="px-5 py-2 text-sm text-right text-foreground">{formatCurrency(proposal.taxAmount, proposal.currency)}</td>
                      </tr>
                    )}
                    {proposal.discountAmount > 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-2 text-sm text-right text-muted-foreground">Discount</td>
                        <td className="px-5 py-2 text-sm text-right text-green-600">-{formatCurrency(proposal.discountAmount, proposal.currency)}</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={3} className="px-5 py-3 text-base font-bold text-right text-foreground">Total</td>
                      <td className="px-5 py-3 text-xl font-bold text-right text-foreground">{formatCurrency(proposal.total, proposal.currency)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>

          {proposal.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{proposal.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User size={16} />
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <p className="text-sm font-medium text-foreground">{proposal.clientName}</p>
              {proposal.clientCompany && <p className="text-sm text-muted-foreground">{proposal.clientCompany}</p>}
              {proposal.clientEmail && <p className="text-xs text-muted-foreground">{proposal.clientEmail}</p>}
              <Button asChild variant="ghost" size="sm" className="mt-1 px-0">
                <Link href={`/clients/${proposal.clientId}`}>View client →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CurrencyDollar size={16} />
                Financials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold">{formatCurrency(proposal.total, proposal.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Currency</span>
                <span>{proposal.currency}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarBlank size={16} />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created</span>
                <span>{formatDate(proposal.createdAt)}</span>
              </div>
              {proposal.validUntil && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valid until</span>
                  <span>{formatDate(proposal.validUntil)}</span>
                </div>
              )}
              {proposal.viewedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viewed</span>
                  <span>{formatDate(proposal.viewedAt)}</span>
                </div>
              )}
              {proposal.acceptedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accepted</span>
                  <span className="text-green-600">{formatDate(proposal.acceptedAt)}</span>
                </div>
              )}
              {proposal.declinedAt && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Declined</span>
                  <span className="text-destructive">{formatDate(proposal.declinedAt)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              {proposal.contractId ? (
                <>
                  <p className="text-xs text-muted-foreground mb-2">Contract linked to this proposal</p>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/contracts/${proposal.contractId}`}>View Contract →</Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground mb-2">No contract yet — create one from this proposal</p>
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/contracts/new?proposalId=${proposal.id}`}>Create Contract →</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
