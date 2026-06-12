export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { CheckCircle } from '@/components/icons'
import { getContractForSigning, recordContractOpen } from '@/lib/db/supabase'
import { formatCurrency, formatDate, stripMarkdown } from '@/lib/utils'
import { sendEmail, buildSenderName } from '@/lib/email'
import { contractOpenedEmail } from '@/lib/email/templates/contract-opened'
import { SignaturePanel } from '@/components/sign/SignaturePanel'
import { APP_NAME, APP_URL } from '@/lib/constants'

// Strip single-marker emphasis without touching `**` pairs or `____` signature
// lines (content must contain at least one non-marker character).
function cleanInline(text: string): string {
  return text
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
}

function renderInlineParts(text: string) {
  // Handle **bold** FIRST — stripping single-`*` italics before this corrupted
  // "**Client:**" into visible "*Client:*" asterisks.
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, j) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={j}>{cleanInline(part.slice(2, -2))}</strong>
      : cleanInline(part)
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

  // Signed contracts stay viewable: render the full document read-only with a
  // download link instead of the old "Already Signed" dead-end card.
  const isSigned = session.status === 'signed'
  // Public, token-scoped download (the /api/contracts PDF route requires freelancer auth)
  const signedPdfUrl = `/api/sign/${params.token}/pdf`

  // Track the open + notify the freelancer (gated on pref, rate-limited). Fire
  // and forget so it never blocks rendering the contract for the client.
  if (!isSigned) try {
    const open = await recordContractOpen(params.token)
    if (open) {
      const openedAt = new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
      })
      sendEmail({
        to: open.freelancerEmail,
        subject: `${open.clientName} opened your contract "${open.contractTitle}"`,
        html: contractOpenedEmail({
          clientName: open.clientName,
          contractTitle: open.contractTitle,
          openedAt,
          dashboardUrl: `${APP_URL}/contracts/${open.contractId}`,
        }),
        fromName: buildSenderName(open.freelancerBusiness, open.freelancerName),
      }).catch(() => {})
    }
  } catch {
    // non-critical — never block the signing page
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
        {/* Signed banner — read-only view with download */}
        {isSigned && (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 shrink-0 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Signed{session.signerName ? ` by ${session.signerName}` : ''}
                </p>
                <p className="text-xs text-green-700">This is a read-only copy of the executed agreement.</p>
              </div>
            </div>
            <a
              href={signedPdfUrl}
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Download Signed PDF
            </a>
          </div>
        )}

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

      {!isSigned && <SignaturePanel token={params.token} signerEmail={session.signerEmail} />}
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
