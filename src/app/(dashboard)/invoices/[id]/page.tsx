export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Receipt, Copy, CheckCircle, ArrowSquareOut, DownloadSimple } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PageHeader, InvoiceBadge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getInvoice, getInvoicePayments } from '@/lib/db/supabase'
import { RecordPaymentModal } from '@/components/invoices/RecordPaymentModal'
import { InvoiceShareLink } from '@/components/invoices/InvoiceShareLink'
import { InvoicePdfButton } from '@/components/invoices/InvoicePdfButton'
import type { InvoiceStatus } from '@/types'

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { notFound(); return null }

  const [profile, invoice, payments] = await Promise.all([
    getCurrentProfile(user.id),
    getInvoice(params.id, user.id),
    getInvoicePayments(params.id),
  ])
  if (!invoice) notFound()

  const template = invoice.template
  const primaryColor = template?.primaryColor ?? '#635BFF'
  const brandName = template?.brandName?.trim() || profile.businessName || profile.fullName
  return (
    <div>
      <PageHeader
        title={invoice.invoiceNumber}
        backHref="/invoices"
        backLabel="All Invoices"
        icon={<Receipt size={24} />}
        action={
          <div className="flex items-center gap-2">
            <InvoiceBadge status={invoice.status as InvoiceStatus} />
            <InvoicePdfButton invoiceId={invoice.id} isPro={profile.plan !== 'free'} />
            {invoice.shareToken && <InvoiceShareLink shareToken={invoice.shareToken} />}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
        {/* Invoice document */}
        <Card className="overflow-hidden">
          {/* Header bar */}
          <div className="px-6 py-5 text-white" style={{ backgroundColor: primaryColor }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xl font-bold tracking-wide">INVOICE</p>
                <p className="opacity-80 text-sm mt-0.5">{invoice.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{brandName}</p>
                {template?.brandAddress && (
                  <p className="opacity-75 text-xs">{template.brandAddress}</p>
                )}
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            {/* FROM / BILL TO */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">From</p>
                <p className="font-semibold">{brandName}</p>
                {template?.phone && <p className="text-sm text-muted-foreground">{template.phone}</p>}
                {template?.website && <p className="text-sm text-muted-foreground">{template.website}</p>}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Bill To</p>
                <p className="font-semibold">{invoice.clientName}</p>
                {invoice.clientCompany && <p className="text-sm text-muted-foreground">{invoice.clientCompany}</p>}
                {invoice.clientEmail && <p className="text-sm text-muted-foreground">{invoice.clientEmail}</p>}
                {invoice.clientAddress && <p className="text-sm text-muted-foreground">{invoice.clientAddress}</p>}
              </div>
            </div>

            {/* Meta row */}
            <div className="grid grid-cols-4 gap-4 mb-6 pb-6 border-b text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Invoice Date</p>
                <p className="font-medium mt-1">{formatDate(invoice.invoiceDate)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Due Date</p>
                <p className="font-medium mt-1">{invoice.dueDate ? formatDate(invoice.dueDate) : '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Currency</p>
                <p className="font-medium mt-1">{invoice.currency}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total</p>
                <p className="font-bold mt-1 text-base" style={{ color: primaryColor }}>
                  {formatCurrency(invoice.total, invoice.currency)}
                </p>
              </div>
            </div>

            {/* Items table */}
            <table className="w-full mb-6 text-sm">
              <thead>
                <tr className="text-white">
                  <th className="text-left p-2.5 rounded-tl-md font-medium" style={{ backgroundColor: primaryColor }}>Description</th>
                  <th className="text-right p-2.5 font-medium w-14" style={{ backgroundColor: primaryColor }}>Qty</th>
                  <th className="text-right p-2.5 font-medium w-28" style={{ backgroundColor: primaryColor }}>Unit Price</th>
                  <th className="text-right p-2.5 rounded-tr-md font-medium w-28" style={{ backgroundColor: primaryColor }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, i) => (
                  <tr key={i} className="border-b border-border">
                    <td className="p-2.5 text-foreground">{item.description}</td>
                    <td className="p-2.5 text-right text-muted-foreground">{item.quantity}</td>
                    <td className="p-2.5 text-right text-muted-foreground">{formatCurrency(item.unitPrice, invoice.currency)}</td>
                    <td className="p-2.5 text-right font-medium">{formatCurrency(item.amount, invoice.currency)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="p-2.5 text-right text-sm text-muted-foreground">Subtotal</td>
                  <td className="p-2.5 text-right">{formatCurrency(invoice.subtotal, invoice.currency)}</td>
                </tr>
                {invoice.taxRate > 0 && (
                  <tr>
                    <td colSpan={3} className="px-2.5 pb-2 text-right text-sm text-muted-foreground">Tax ({invoice.taxRate}%)</td>
                    <td className="px-2.5 pb-2 text-right">{formatCurrency(invoice.taxAmount, invoice.currency)}</td>
                  </tr>
                )}
                {invoice.discountAmount > 0 && (
                  <tr>
                    <td colSpan={3} className="px-2.5 pb-2 text-right text-sm text-muted-foreground">Discount</td>
                    <td className="px-2.5 pb-2 text-right text-destructive">−{formatCurrency(invoice.discountAmount, invoice.currency)}</td>
                  </tr>
                )}
                <tr className="border-t">
                  <td colSpan={3} className="p-2.5 text-right font-bold">Total</td>
                  <td className="p-2.5 text-right font-bold text-base" style={{ color: primaryColor }}>
                    {formatCurrency(invoice.total, invoice.currency)}
                  </td>
                </tr>
                {invoice.paidAmount > 0 && (
                  <>
                    <tr>
                      <td colSpan={3} className="px-2.5 pb-1 text-right text-sm text-muted-foreground">Paid</td>
                      <td className="px-2.5 pb-1 text-right text-[#4F6AE6]">−{formatCurrency(invoice.paidAmount, invoice.currency)}</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-2.5 pb-2 text-right font-bold">Balance Due</td>
                      <td className="px-2.5 pb-2 text-right font-bold text-primary">
                        {formatCurrency(invoice.total - invoice.paidAmount, invoice.currency)}
                      </td>
                    </tr>
                  </>
                )}
              </tfoot>
            </table>

            {(invoice.notes || invoice.paymentTerms) && (
              <div className="grid grid-cols-2 gap-4">
                {invoice.notes && (
                  <div className="rounded-lg bg-muted/40 border p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{invoice.notes}</p>
                  </div>
                )}
                {invoice.paymentTerms && (
                  <div className="rounded-lg bg-muted/40 border p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Payment Terms</p>
                    <p className="text-sm">{invoice.paymentTerms}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Record Payment</CardTitle></CardHeader>
            <CardContent>
              <RecordPaymentModal invoiceId={invoice.id} currency={invoice.currency} balance={invoice.total - invoice.paidAmount} />
            </CardContent>
          </Card>

          {payments.length > 0 && (
            <Card>
              <CardHeader><CardTitle className="text-base">Payment History</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-[#4F6AE6]">{formatCurrency(p.amount, invoice.currency)}</p>
                      <p className="text-xs text-muted-foreground">{p.method} · {formatDate(p.paymentDate)}</p>
                    </div>
                    <CheckCircle className="h-4 w-4 text-[#4F6AE6]" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">Share Link</CardTitle></CardHeader>
            <CardContent>
              {invoice.shareToken && <InvoiceShareLink shareToken={invoice.shareToken} />}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
