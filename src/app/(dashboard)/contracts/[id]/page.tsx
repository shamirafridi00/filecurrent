export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FileText, DownloadSimple } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, ContractBadge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getContract } from '@/lib/db/supabase'
import { SendForSignatureButton } from '@/components/contracts/SendForSignatureButton'
import { PrintButton } from '@/components/contracts/PrintButton'

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
            <PrintButton />
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

      {/* Document header — mirrors the signing page */}
      <div className="mb-4 flex items-center justify-between rounded-xl border bg-card px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          {profile.businessLogo ? (
            <img src={profile.businessLogo} alt="Logo" className="h-10 w-auto max-w-[120px] object-contain" />
          ) : null}
          <div>
            <p className="font-semibold text-foreground">{profile.businessName || profile.fullName}</p>
            <p className="text-xs text-muted-foreground">Service Provider</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{contract.title}</p>
          <p className="text-sm text-muted-foreground">{formatCurrency(contract.amount, contract.currency)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
        <Card>
          <CardHeader><CardTitle className="text-base">Contract Document</CardTitle></CardHeader>
          <CardContent>
            {resolvedContent ? (
              <div className="space-y-2 text-sm leading-relaxed">
                {resolvedContent.split('\n').map((line, i) => {
                  const trimmed = line.trim()
                  if (!trimmed) return <div key={i} className="h-2" />
                  if (trimmed === '---') return <hr key={i} className="my-4 border-border" />
                  if (trimmed.startsWith('## ')) return (
                    <h2 key={i} className="mt-6 mb-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      {trimmed.slice(3).replace(/\*\*/g, '')}
                    </h2>
                  )
                  if (trimmed.startsWith('### ')) return (
                    <h3 key={i} className="mt-4 mb-0.5 text-sm font-semibold text-foreground">
                      {trimmed.slice(4).replace(/\*\*/g, '')}
                    </h3>
                  )
                  if (/^\d+\.\s+\S/.test(trimmed) && trimmed.length < 60) return (
                    <p key={i} className="mt-5 mb-1 text-sm font-semibold text-foreground">{trimmed}</p>
                  )
                  if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) return (
                    <div key={i} className="flex items-start gap-2 ml-4 text-sm text-foreground">
                      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                      <span className="leading-relaxed">{renderInlineParts(trimmed.slice(2))}</span>
                    </div>
                  )
                  return (
                    <p key={i} className="text-sm leading-relaxed text-foreground">
                      {renderInlineParts(trimmed)}
                    </p>
                  )
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

          {contract.additionalTerms && (
            <Card>
              <CardHeader><CardTitle className="text-base">Additional Terms</CardTitle></CardHeader>
              <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">{contract.additionalTerms}</CardContent>
            </Card>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          header, nav, aside, [data-sidebar], .fixed { display: none !important; }
          .xl\\:grid-cols-\\[1fr_300px\\] { grid-template-columns: 1fr !important; }
        }
      `}</style>
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

function renderInlineParts(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, j) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={j}>{part.slice(2, -2)}</strong>
      : part
  )
}

function resolveContent(template: string, values: Record<string, string>): string {
  let result = template.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }
  return result
}
