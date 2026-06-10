export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { CheckCircle } from '@/components/icons'
import { getContractForSigning } from '@/lib/db/supabase'
import { formatCurrency, formatDate, stripMarkdown, slugifyTitle } from '@/lib/utils'
import { SignaturePanel } from '@/components/sign/SignaturePanel'
import { APP_NAME } from '@/lib/constants'

function renderInlineParts(text: string) {
  // Strip italic/code markers, render **bold** as <strong>
  const cleaned = text
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/`(.+?)`/g, '$1')
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, j) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={j}>{part.slice(2, -2)}</strong>
      : part
  )
}

function renderInline(text: string, key: string | number) {
  return (
    <p key={key} className="text-sm leading-relaxed text-foreground">
      {renderInlineParts(text)}
    </p>
  )
}

export default async function SignPage({ params }: { params: { token: string } }) {
  const session = await getContractForSigning(params.token)
  if (!session) {
    console.error('Signing session not found for token:', params.token)
    notFound()
  }

  if (session.status === 'signed') {
    const pdfUrl = `/api/contracts/${session.contractId}/pdf/${slugifyTitle(session.contractTitle)}_signed.pdf`
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500" />
          <h1 className="text-xl font-bold text-foreground">Document Already Signed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This contract has been signed. Thank you, {session.signerName ?? ''}!
          </p>
          <p className="mt-6 text-xs text-muted-foreground/60">
            Powered by <a href="https://filecurrent.com" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">filecurrent.com</a>
          </p>
        </div>
      </div>
    )
  }

  const values: Record<string, string> = {
    client_name: session.clientName,
    client_company: session.clientCompany ?? '',
    client_email: session.clientEmail ?? '',
    freelancer_name: session.freelancerName,
    freelancer_business: session.freelancerBusiness ?? '',
    project_description: stripMarkdown(session.projectDescription ?? ''),
    rate: String(session.amount),
    currency: session.currency,
    start_date: session.startDate ? formatDate(session.startDate) : '',
    end_date: session.endDate ? formatDate(session.endDate) : '',
    payment_terms: session.paymentTerms ?? '',
  }

  const resolvedContent = session.contractContent
    ? resolveContent(session.contractContent, values)
    : `**${session.contractTitle}**\n\n(No contract content available)`

  return (
    <div className="signing-page min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {session.freelancerLogo ? (
              <img
                src={session.freelancerLogo}
                alt={session.freelancerBusiness ?? session.freelancerName}
                width={120}
                height={32}
                loading="eager"
                decoding="async"
                className="h-8 w-auto object-contain"
              />
            ) : (
              <span className="text-sm font-bold text-primary">{session.freelancerBusiness ?? session.freelancerName}</span>
            )}
            {session.freelancerLogo && (
              <span className="text-sm font-semibold text-foreground">{session.freelancerBusiness ?? session.freelancerName}</span>
            )}
          </div>
          <span className="text-sm font-medium text-muted-foreground">{session.contractTitle}</span>
          <span className="text-sm text-muted-foreground">{formatCurrency(session.amount, session.currency)}</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-8 pb-12">
        {/* Contract content */}
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="space-y-2 text-sm leading-relaxed text-foreground">
            {resolvedContent.split('\n').map((line, i) => {
              const trimmed = line.trim()
              if (trimmed.startsWith('### ')) return (
                <h3 key={i} className="mt-4 mb-1 text-sm font-semibold text-foreground">
                  {stripMarkdown(trimmed.slice(4))}
                </h3>
              )
              if (trimmed.startsWith('## ')) return (
                <h2 key={i} className="mt-6 mb-1 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  {stripMarkdown(trimmed.slice(3))}
                </h2>
              )
              if (trimmed.startsWith('# ')) return (
                <h1 key={i} className="mb-4 text-lg font-bold text-foreground">
                  {stripMarkdown(trimmed.slice(2))}
                </h1>
              )
              if (trimmed === '---') return <hr key={i} className="my-4 border-border" />
              if (trimmed === '') return <div key={i} className="h-2" />
              if (/^\d+\.\s+\S/.test(trimmed) && trimmed.length < 60) return (
                <p key={i} className="mt-5 mb-1 font-semibold text-foreground text-sm">
                  {trimmed}
                </p>
              )
              if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) return (
                <div key={i} className="flex items-start gap-2 ml-4 text-sm text-foreground">
                  <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
                  <span className="leading-relaxed">{renderInlineParts(trimmed.slice(2))}</span>
                </div>
              )
              return renderInline(trimmed, i)
            })}
          </div>
        </div>

        {session.additionalTerms && (
          <div className="mt-4 rounded-xl border bg-card p-8 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Additional Terms</h3>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {session.additionalTerms}
            </p>
          </div>
        )}

        {/* Signature summary block */}
        <div className="mt-6 rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Signatures</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2 border-b border-border pb-6 sm:border-b-0 sm:pb-0">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Service Provider</p>
              <p className="text-sm font-medium text-foreground">{session.freelancerName}</p>
              {session.freelancerBusiness && <p className="text-xs text-muted-foreground">{session.freelancerBusiness}</p>}
              <div className="mt-3 border-b border-dashed border-muted-foreground/30 pb-1" />
              <p className="text-xs text-muted-foreground">Authorized by creating this contract</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</p>
              <p className="text-sm font-medium text-foreground">{session.clientName}</p>
              {session.clientCompany && <p className="text-xs text-muted-foreground">{session.clientCompany}</p>}
              <div className="mt-3 border-b border-dashed border-muted-foreground/30 pb-1" />
              <p className="text-xs text-muted-foreground">Signing below via electronic signature</p>
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Created with {APP_NAME} — filecurrent.com
        </p>
      </main>

      <SignaturePanel token={params.token} signerEmail={session.signerEmail} />
    </div>
  )
}

function resolveContent(template: string, values: Record<string, string>): string {
  let result = template.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }
  return result
}
