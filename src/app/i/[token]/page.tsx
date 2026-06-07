export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getInvoiceByShareToken, logClientActivity } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { invoiceOpenedEmail } from '@/lib/email/templates/invoice-opened'
import { formatCurrency } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'
import { InvoiceDocument } from '@/components/invoices/InvoiceDocument'

export default async function PublicInvoicePage({ params }: { params: { token: string } }) {
  const invoice = await getInvoiceByShareToken(params.token)
  if (!invoice) {
    console.error('Invoice not found for share token:', params.token)
    notFound()
  }

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
