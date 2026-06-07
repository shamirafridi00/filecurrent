export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { Receipt, CheckCircle } from '@/components/icons'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader, InvoiceBadge } from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import {
  getCurrentProfile,
  getInvoice,
  getInvoicePayments,
  getInvoiceReminderLogs,
  markOverdueInvoices,
} from '@/lib/db/supabase'
import { InvoiceDocument } from '@/components/invoices/InvoiceDocument'
import { RecordPaymentModal } from '@/components/invoices/RecordPaymentModal'
import { RecurringSettings } from '@/components/invoices/RecurringSettings'
import { InvoiceShareLink } from '@/components/invoices/InvoiceShareLink'
import { InvoicePdfButton } from '@/components/invoices/InvoicePdfButton'
import { DuplicateInvoiceButton } from '@/components/invoices/DuplicateInvoiceButton'
import { ReminderControls } from '@/components/invoices/ReminderControls'
import type { InvoiceStatus } from '@/types'

function triggerTypeLabel(triggerType: string): string {
  if (triggerType === 'manual') return 'Manual'
  if (triggerType === 'on_due') return 'Due date'
  const beforeMatch = triggerType.match(/^before_due_(\d+)$/)
  if (beforeMatch) return `${beforeMatch[1]} days before due`
  const overdueMatch = triggerType.match(/^overdue_(\d+)$/)
  if (overdueMatch) return `${overdueMatch[1]} days overdue`
  return triggerType
}

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { notFound(); return null }

  const [, profile, invoice, payments, reminderLogs] = await Promise.all([
    markOverdueInvoices(user.id),
    getCurrentProfile(user.id),
    getInvoice(params.id, user.id),
    getInvoicePayments(params.id),
    getInvoiceReminderLogs(params.id),
  ])
  if (!invoice) notFound()

  const template = invoice.template
  const primaryColor = template?.primaryColor ?? '#635BFF'
  const brandName = template?.brandName?.trim() || profile.businessName || profile.fullName
  const theme = (template?.theme ?? 'summit') as 'summit' | 'aurora' | 'ledger' | 'slate' | 'ivory'
  const remindersPaused = invoice.remindersPaused

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
            <DuplicateInvoiceButton invoiceId={invoice.id} />
            <InvoicePdfButton invoiceId={invoice.id} isPro={profile.plan !== 'free'} />
            {invoice.shareToken && <InvoiceShareLink shareToken={invoice.shareToken} compact />}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_300px]">
        {/* Invoice document */}
        <Card className="overflow-hidden">
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
              clientEmail: invoice.clientEmail,
              clientCompany: invoice.clientCompany,
              clientAddress: invoice.clientAddress,
              fromName: brandName ?? profile.fullName,
              fromAddress: template?.brandAddress,
              fromPhone: template?.phone,
              fromWebsite: template?.website,
            }}
            theme={{ theme, primaryColor }}
          />
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
            <CardHeader><CardTitle className="text-base">Reminders</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ReminderControls
                invoiceId={invoice.id}
                isPaid={invoice.status === 'paid'}
                remindersPaused={remindersPaused}
              />

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">History</p>
                {reminderLogs.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No reminders sent yet.</p>
                ) : (
                  <div className="space-y-2">
                    {reminderLogs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between text-xs">
                        <div>
                          <p className="font-medium">{triggerTypeLabel(log.triggerType)}</p>
                          <p className="text-muted-foreground">
                            {new Date(log.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={log.status === 'sent'
                            ? 'border-green-500 text-green-600 bg-green-50'
                            : 'border-red-400 text-red-600 bg-red-50'}
                        >
                          {log.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <RecurringSettings
            invoiceId={invoice.id}
            isRecurring={invoice.isRecurring}
            recurrenceInterval={invoice.recurrenceInterval}
            recurrenceNextDate={invoice.recurrenceNextDate}
            recurrenceEndDate={invoice.recurrenceEndDate}
          />
        </div>
      </div>
    </div>
  )
}
