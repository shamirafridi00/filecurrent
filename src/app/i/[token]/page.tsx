export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getInvoiceByShareToken } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { invoiceOpenedEmail } from '@/lib/email/templates/invoice-opened'
import { formatCurrency, formatDate } from '@/lib/utils'
import { APP_NAME } from '@/lib/constants'

export default async function PublicInvoicePage({ params }: { params: { token: string } }) {
  const invoice = await getInvoiceByShareToken(params.token)
  if (!invoice) notFound()

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
      .select('user_id, open_count')
      .eq('share_token', params.token)
      .single()

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
  const brandName = invoice.template?.brandName ?? invoice.freelancerName

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Invoice card */}
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 text-white" style={{ backgroundColor: primaryColor }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold tracking-wide">INVOICE</p>
                <p className="opacity-80 text-sm mt-0.5">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{brandName}</p>
                {invoice.template?.brandAddress && (
                  <p className="opacity-75 text-xs">{invoice.template.brandAddress}</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* FROM / BILL TO */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">From</p>
                <p className="font-semibold text-gray-900">{brandName}</p>
                {invoice.template?.phone && <p className="text-sm text-gray-500">{invoice.template.phone}</p>}
                {invoice.template?.website && <p className="text-sm text-gray-500">{invoice.template.website}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Bill To</p>
                <p className="font-semibold text-gray-900">{invoice.clientName}</p>
                {invoice.clientCompany && <p className="text-sm text-gray-500">{invoice.clientCompany}</p>}
                {invoice.clientEmail && <p className="text-sm text-gray-500">{invoice.clientEmail}</p>}
              </div>
            </div>

            {/* Meta */}
            <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Invoice Date</p>
                <p className="font-medium text-sm mt-1">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Due Date</p>
                <p className="font-medium text-sm mt-1">{invoice.dueDate ? formatDate(invoice.dueDate) : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Status</p>
                <p className="font-medium text-sm mt-1 capitalize" style={{ color: invoice.status === 'paid' ? '#16A34A' : primaryColor }}>
                  {invoice.status}
                </p>
              </div>
            </div>

            {/* Items */}
            <table className="w-full mb-6 text-sm">
              <thead>
                <tr className="text-white">
                  <th className="text-left p-2.5 rounded-tl-md" style={{ backgroundColor: primaryColor }}>Description</th>
                  <th className="text-right p-2.5 w-14" style={{ backgroundColor: primaryColor }}>Qty</th>
                  <th className="text-right p-2.5 w-28" style={{ backgroundColor: primaryColor }}>Unit Price</th>
                  <th className="text-right p-2.5 rounded-tr-md w-28" style={{ backgroundColor: primaryColor }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-2.5 text-gray-700">{item.description}</td>
                    <td className="p-2.5 text-right text-gray-500">{item.quantity}</td>
                    <td className="p-2.5 text-right text-gray-500">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                    <td className="p-2.5 text-right font-medium">{formatCurrency(item.amount, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {invoice.taxRate > 0 && (
                  <tr>
                    <td colSpan={3} className="px-2.5 pt-2 text-right text-gray-500">Tax ({invoice.taxRate}%)</td>
                    <td className="px-2.5 pt-2 text-right">{formatCurrency(invoice.taxAmount, invoice.currency)}</td>
                  </tr>
                )}
                {invoice.discountAmount > 0 && (
                  <tr>
                    <td colSpan={3} className="px-2.5 text-right text-gray-500">Discount</td>
                    <td className="px-2.5 text-right text-red-500">−{formatCurrency(invoice.discountAmount, invoice.currency)}</td>
                  </tr>
                )}
                <tr className="border-t">
                  <td colSpan={3} className="p-2.5 text-right font-bold text-gray-900">Total</td>
                  <td className="p-2.5 text-right font-bold text-lg" style={{ color: primaryColor }}>
                    {formatCurrency(invoice.total, invoice.currency)}
                  </td>
                </tr>
                {invoice.paidAmount > 0 && (
                  <tr>
                    <td colSpan={3} className="px-2.5 text-right text-gray-500">Amount Paid</td>
                    <td className="px-2.5 text-right text-green-600">−{formatCurrency(invoice.paidAmount, invoice.currency)}</td>
                  </tr>
                )}
              </tfoot>
            </table>

            {(invoice.notes || invoice.paymentTerms) && (
              <div className="grid grid-cols-2 gap-4">
                {invoice.notes && (
                  <div className="rounded-lg bg-gray-50 border p-3">
                    <p className="text-xs font-semibold text-gray-400 mb-1">Notes</p>
                    <p className="text-sm text-gray-600">{invoice.notes}</p>
                  </div>
                )}
                {invoice.paymentTerms && (
                  <div className="rounded-lg bg-gray-50 border p-3">
                    <p className="text-xs font-semibold text-gray-400 mb-1">Payment Terms</p>
                    <p className="text-sm text-gray-600">{invoice.paymentTerms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Viral footer for free tier */}
        {invoice.hasBrandingFooter && (
          <p className="mt-4 text-center text-xs text-gray-400">
            Created with <a href="https://filecurrent.io" className="text-primary font-medium hover:underline">{APP_NAME}</a> — filecurrent.io
          </p>
        )}
      </div>
    </div>
  )
}
