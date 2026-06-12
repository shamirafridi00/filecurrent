import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { markOverdueInvoices, getNotificationRecipient } from '@/lib/db/supabase'
import { sendEmail, buildSenderName } from '@/lib/email'
import { invoiceOverdueEmail } from '@/lib/email/templates/invoice-overdue'
import { dailySummaryEmail, type DailySummaryInvoice } from '@/lib/email/templates/daily-summary'
import { formatDate } from '@/lib/utils'
import { verifyCronSecret } from '@/lib/cron'
import { APP_URL } from '@/lib/constants'

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

/**
 * Daily cron (runs before process-reminders):
 * 1. Marks sent/partial invoices past due as overdue — and emails the
 *    freelancer once per transition (gated on invoice_overdue toggle).
 * 2. Sends the daily summary digest (gated on daily_summary toggle) when
 *    there is something to report.
 */
export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date().toISOString().split('T')[0]
  let overdueEmails = 0
  let summaryEmails = 0
  const errors: string[] = []

  const { data: users } = await adminClient
    .from('profiles')
    .select('id')
    .not('email', 'is', null)

  for (const user of users ?? []) {
    const userId = user.id as string
    try {
      // 1. Transition overdue invoices + notify per transition
      const transitions = await markOverdueInvoices(userId)
      if (transitions.length > 0) {
        const overdueRecipient = await getNotificationRecipient(userId, 'invoice_overdue')
        if (overdueRecipient) {
          for (const inv of transitions) {
            await sendEmail({
              to: overdueRecipient.email,
              subject: `Invoice ${inv.invoiceNumber} is now overdue`,
              html: invoiceOverdueEmail({
                freelancerName: overdueRecipient.fullName,
                clientName: inv.clientName,
                invoiceNumber: inv.invoiceNumber,
                balance: fmt(inv.total - inv.paidAmount, inv.currency),
                dueDate: inv.dueDate ? formatDate(inv.dueDate) : null,
                invoiceUrl: `${APP_URL}/invoices/${inv.id}`,
              }),
              fromName: buildSenderName(overdueRecipient.businessName, overdueRecipient.fullName),
            }).catch(() => {})
            overdueEmails++
          }
        }
      }

      // 2. Daily summary digest
      const summaryRecipient = await getNotificationRecipient(userId, 'daily_summary')
      if (!summaryRecipient) continue

      const [{ data: overdueRows }, { data: dueTodayRows }] = await Promise.all([
        adminClient
          .from('invoices')
          .select('id, invoice_number, total, paid_amount, currency, due_date, clients(name)')
          .eq('user_id', userId)
          .eq('status', 'overdue')
          .order('due_date', { ascending: true })
          .limit(10),
        adminClient
          .from('invoices')
          .select('id', { count: 'exact', head: false })
          .eq('user_id', userId)
          .in('status', ['sent', 'partial'])
          .eq('due_date', today),
      ])

      const overdue: DailySummaryInvoice[] = (overdueRows ?? []).map((inv) => {
        const client = inv.clients as unknown as { name: string } | null
        return {
          invoiceNumber: inv.invoice_number,
          clientName: client?.name ?? 'Client',
          amount: fmt(Number(inv.total) - Number(inv.paid_amount ?? 0), inv.currency),
          dueLabel: inv.due_date ? `due ${formatDate(inv.due_date)}` : 'no due date',
        }
      })

      const remindersDueToday = dueTodayRows?.length ?? 0

      // Only email when there's something worth reporting.
      if (overdue.length === 0 && remindersDueToday === 0) continue

      const totalOutstanding = (overdueRows ?? []).reduce(
        (sum, inv) => sum + (Number(inv.total) - Number(inv.paid_amount ?? 0)), 0)
      const currency = (overdueRows?.[0]?.currency as string) ?? 'USD'

      await sendEmail({
        to: summaryRecipient.email,
        subject: `Daily summary — ${overdue.length} overdue invoice${overdue.length === 1 ? '' : 's'}`,
        html: dailySummaryEmail({
          freelancerName: summaryRecipient.fullName,
          overdue,
          remindersDueToday,
          totalOutstanding: fmt(totalOutstanding, currency),
          dashboardUrl: `${APP_URL}/dashboard`,
        }),
      }).catch(() => {})
      summaryEmails++
    } catch (err) {
      errors.push(`${userId}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return NextResponse.json({ overdueEmails, summaryEmails, errors })
}
