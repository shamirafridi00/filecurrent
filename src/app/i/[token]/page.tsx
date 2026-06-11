export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getInvoiceByShareToken, getPaymentClaims, logClientActivity } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { invoiceOpenedEmail } from '@/lib/email/templates/invoice-opened'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PAYMENT_METHODS } from '@/types'
import { APP_NAME } from '@/lib/constants'
import { InvoiceDocument } from '@/components/invoices/InvoiceDocument'
import { ClientPaymentPanel } from '@/components/invoices/ClientPaymentPanel'

export default async function PublicInvoicePage({ params }: { params: { token: string } }) {
  const invoice = await getInvoiceByShareToken(params.token)
  if (!invoice) {
    console.error('Invoice not found for share token:', params.token)
    notFound()
  }

  // Payment history shown to the client: confirmed payments + their own pending claims.
  const claims = await getPaymentClaims(invoice.id)
  const visibleClaims = claims.filter((c) => c.status === 'confirmed' || c.status === 'pending')
  const methodLabel = (v: string) => PAYMENT_METHODS.find((m) => m.value === v)?.label ?? v

  // Notify freelancer that invoice was opened (rate-limited: once per hour per invoice)
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: recentLog } = await adminClient
      .from('reminder_logs')
      .select('id')
      .eq('recipient_email', invoice.freelancerName) // proxy: use invoice id instead
      .gte('sent_at', oneHourAgo)
      .limit(1)

    // Get freelancer email and check notification prefs
    const { data: invoiceRow } = await adminClient
      .from('invoices')
      .select('id, user_id, open_count')
      .eq('share_token', params.token)
      .single()

    // Log invoice_viewed for every view (rate-limit only applies to notification email below)
    if (invoiceRow) {
      void logClientActivity({
        userId: invoiceRow.user_id,
        clientId: null,
        clientName: invoice.clientName,
        eventType: 'invoice_viewed',
        entityType: 'invoice',
        entityId: String(invoiceRow.id),
        entityLabel: invoice.invoiceNumber,
      })
    }

    if (invoiceRow && !recentLog?.length) {
      const { data: profile } = await adminClient
        .from('profiles')
        .select('email, notification_prefs')
        .eq('id', invoiceRow.user_id)
        .single()

      const prefs = (typeof profile?.notification_prefs === 'object'
        ? profile.notification_prefs
        : {}) as Record<string, boolean>

      if (profile?.email && prefs.invoice_opened !== false) {
        const openedAt = new Date().toLocaleString('en-US', {
          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
        })
        const fmt = (n: number) => new Intl.NumberFormat('en-US', {
          style: 'currency', currency: invoice.currency,
        }).format(n)

        sendEmail({
          to: profile.email,
          subject: `${invoice.clientName} opened your invoice ${invoice.invoiceNumber}`,
          html: invoiceOpenedEmail({
            clientName: invoice.clientName,
            invoiceNumber: invoice.invoiceNumber,
            amount: fmt(invoice.total),
            openedAt,
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoiceRow.user_id}`,
          }),
        }).catch(() => {}) // non-critical
      }
    }
  } catch {
    // non-critical — don't block page render
  }

  const primaryColor = invoice.template?.primaryColor ?? '#635BFF'
  const brandName =
    invoice.template?.brandName?.trim() ||
    invoice.businessName ||
    invoice.freelancerName
  const theme = (invoice.template?.theme ?? 'summit') as 'summit' | 'aurora' | 'ledger' | 'slate' | 'ivory'
  const isOverdue = invoice.status !== 'paid' &&
    !!invoice.dueDate &&
    new Date(invoice.dueDate) < new Date()

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {isOverdue && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2 text-sm text-red-700">
            <span>⚠</span>
            <span>This invoice is overdue. Please arrange payment as soon as possible.</span>
          </div>
        )}
        {/* Invoice card */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <InvoiceDocument
            data={{
              invoiceNumber: invoice.invoiceNumber,
              invoiceDate: invoice.invoiceDate,
              dueDate: invoice.dueDate,
              currency: invoice.currency,
              items: invoice.items,
              subtotal: invoice.subtotal,
              taxRate: invoice.taxRate,
              taxAmount: invoice.taxAmount,
              discountAmount: invoice.discountAmount,
              depositAmount: invoice.depositAmount,
              total: invoice.total,
              paidAmount: invoice.paidAmount,
              notes: invoice.notes,
              paymentTerms: invoice.paymentTerms,
              paymentInstructions: invoice.paymentInstructions,
              clientName: invoice.clientName,
              clientEmail: invoice.clientEmail ?? undefined,
              clientCompany: invoice.clientCompany ?? undefined,
              clientAddress: undefined,
              fromName: brandName ?? invoice.freelancerName,
              fromAddress: invoice.template?.brandAddress ?? undefined,
              fromPhone: invoice.template?.phone ?? undefined,
              fromWebsite: invoice.template?.website ?? undefined,
            }}
            theme={{ theme, primaryColor }}
          />
        </div>

        {/* Client payment flow — shown only while a balance remains */}
        {invoice.status !== 'paid' && (
          <ClientPaymentPanel
            shareToken={params.token}
            freelancerName={brandName ?? invoice.freelancerName}
            currency={invoice.currency}
            balance={Math.max(0, invoice.total - invoice.paidAmount)}
            paymentInstructions={invoice.paymentInstructions}
          />
        )}

        {/* Payment history — confirmed payments and pending self-reports */}
        {visibleClaims.length > 0 && (
          <div className="mt-4 rounded-xl border bg-white shadow-sm overflow-hidden">
            <div className="border-b px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Payment history</h3>
            </div>
            <div className="divide-y">
              {visibleClaims.map((c) => (
                <div key={c.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{formatCurrency(c.amount, invoice.currency)}</p>
                    <p className="text-xs text-gray-500">
                      {methodLabel(c.method)}
                      {c.paymentDate ? ` · ${formatDate(c.paymentDate)}` : ''}
                    </p>
                  </div>
                  {c.status === 'confirmed' ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Confirmed
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Awaiting confirmation
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viral footer for free tier */}
        {invoice.hasBrandingFooter && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Created with <a href="https://filecurrent.com" className="text-primary font-medium hover:underline">{APP_NAME}</a> — filecurrent.com
          </p>
        )}
      </div>
    </div>
  )
}
