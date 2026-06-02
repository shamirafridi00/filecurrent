export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { CheckCircle } from '@/components/icons'
import { getContractForSigning } from '@/lib/db/supabase'
import { formatCurrency, formatDate } from '@/lib/utils'
import { SignaturePanel } from '@/components/sign/SignaturePanel'
import { APP_NAME } from '@/lib/constants'

export default async function SignPage({ params }: { params: { token: string } }) {
  const session = await getContractForSigning(params.token)
  if (!session) notFound()

  if (session.status === 'signed') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-xl border bg-card p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto mb-4 h-14 w-14 text-green-500" />
          <h1 className="text-xl font-bold text-foreground">Document Already Signed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This contract has been signed. Thank you!
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
    project_description: session.projectDescription ?? '',
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="text-sm font-bold text-primary">{APP_NAME}</span>
          <span className="text-sm font-medium text-foreground">{session.contractTitle}</span>
          <span className="text-sm text-muted-foreground">{formatCurrency(session.amount, session.currency)}</span>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-48 pt-8">
        {/* Contract content */}
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="space-y-2 text-sm leading-relaxed text-foreground">
            {resolvedContent.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="mt-4 font-semibold text-base">{line.slice(3)}</h2>
              if (line.startsWith('### ')) return <h3 key={i} className="mt-3 font-medium">{line.slice(4)}</h3>
              if (line === '---') return <hr key={i} className="my-3 border-border" />
              return <p key={i} className="whitespace-pre-wrap">{line}</p>
            })}
          </div>
        </div>

        {/* Footer branding */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Created with {APP_NAME} — filecurrent.io
        </p>
      </main>

      {/* Signature panel — fixed at bottom on desktop */}
      <SignaturePanel token={params.token} signerEmail={session.signerEmail} />
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
