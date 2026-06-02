export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FileText, PaperPlaneTilt, DownloadSimple } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, ContractBadge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getContract } from '@/lib/db/supabase'
import { SendForSignatureButton } from '@/components/contracts/SendForSignatureButton'

export default async function ContractDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { notFound(); return null }

  const [profile, contract] = await Promise.all([
    getCurrentProfile(user.id),
    getContract(params.id, user.id),
  ])
  if (!contract) notFound()

  const resolvedContent = contract.templateContent
    ? resolveContent(contract.templateContent, {
        client_name: contract.clientName,
        client_company: contract.clientCompany ?? '',
        client_email: contract.clientEmail ?? '',
        freelancer_name: profile.fullName,
        freelancer_business: profile.businessName ?? '',
        project_description: contract.projectDescription ?? '',
        rate: String(contract.amount),
        currency: contract.currency,
        start_date: contract.startDate ? formatDate(contract.startDate) : '',
        end_date: contract.endDate ? formatDate(contract.endDate) : '',
        payment_terms: contract.paymentTerms ?? '',
      })
    : null

  return (
    <div>
      <PageHeader
        title={contract.title}
        backHref="/contracts"
        backLabel="All Contracts"
        icon={<FileText size={24} />}
        action={
          <div className="flex items-center gap-2">
            <ContractBadge status={contract.status as 'draft' | 'sent' | 'opened' | 'signed'} />
            {(contract.status === 'draft' || contract.status === 'sent') && (
              <SendForSignatureButton
                contractId={contract.id}
                clientEmail={contract.clientEmail ?? ''}
                clientName={contract.clientName}
              />
            )}
            {contract.status === 'signed' && (
              <Button asChild variant="outline" size="sm">
                <a href={`/api/contracts/${contract.id}/pdf`} target="_blank" rel="noreferrer">
                  <DownloadSimple className="mr-1.5 h-3.5 w-3.5" />
                  Download Signed PDF
                </a>
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader><CardTitle className="text-base">Contract Document</CardTitle></CardHeader>
          <CardContent>
            {resolvedContent ? (
              <div className="space-y-2 text-sm leading-relaxed">
                {resolvedContent.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="mt-4 font-semibold text-base">{line.slice(3)}</h2>
                  if (line.startsWith('### ')) return <h3 key={i} className="mt-3 font-medium">{line.slice(4)}</h3>
                  if (line === '---') return <hr key={i} className="my-3 border-border" />
                  return <p key={i} className="whitespace-pre-wrap">{line}</p>
                })}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No contract template content available.</p>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Details</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Client" value={contract.clientName} />
              <Row label="Amount" value={formatCurrency(contract.amount, contract.currency)} />
              <Row label="Status" value={<ContractBadge status={contract.status as 'draft' | 'sent' | 'opened' | 'signed'} />} />
              {contract.startDate && <Row label="Start Date" value={formatDate(contract.startDate)} />}
              {contract.endDate && <Row label="End Date" value={formatDate(contract.endDate)} />}
              {contract.signedAt && <Row label="Signed" value={formatDate(contract.signedAt)} />}
              <Row label="Created" value={formatDate(contract.createdAt)} />
            </CardContent>
          </Card>

          {contract.paymentTerms && (
            <Card>
              <CardHeader><CardTitle className="text-base">Payment Terms</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground">{contract.paymentTerms}</CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  )
}

function resolveContent(template: string, values: Record<string, string>): string {
  let result = template
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }
  return result
}
