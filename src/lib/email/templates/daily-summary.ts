import { emailLayout, emailButton } from '../layout'

export interface DailySummaryInvoice {
  invoiceNumber: string
  clientName: string
  amount: string
  dueLabel: string
}

/**
 * Daily digest emailed to the freelancer: overdue invoices and reminders
 * scheduled to go out today. Only sent when there's something to report.
 */
export function dailySummaryEmail({
  freelancerName,
  overdue,
  remindersDueToday,
  totalOutstanding,
  dashboardUrl,
}: {
  freelancerName: string
  overdue: DailySummaryInvoice[]
  remindersDueToday: number
  totalOutstanding: string
  dashboardUrl: string
}): string {
  const overdueRows = overdue.length
    ? overdue.map((i) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #F3F4F6;">
            <p style="margin:0;color:#111827;font-size:14px;font-weight:600;">${i.invoiceNumber}</p>
            <p style="margin:2px 0 0;color:#6B7280;font-size:12px;">${i.clientName} &middot; ${i.dueLabel}</p>
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #F3F4F6;text-align:right;color:#B91C1C;font-size:14px;font-weight:600;">${i.amount}</td>
        </tr>`).join('')
    : `<tr><td style="padding:8px 0;color:#6B7280;font-size:13px;">No overdue invoices. Nicely done.</td></tr>`

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Your daily summary</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Good morning, ${freelancerName}. Here's where things stand today.
    </p>

    <div style="display:flex;gap:12px;margin-bottom:24px;">
      <div style="flex:1;background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:14px;">
        <p style="margin:0;color:#92400E;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Outstanding</p>
        <p style="margin:4px 0 0;color:#92400E;font-size:18px;font-weight:700;">${totalOutstanding}</p>
      </div>
    </div>

    <p style="margin:0 0 8px;color:#111827;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Overdue Invoices${overdue.length ? ` (${overdue.length})` : ''}</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      ${overdueRows}
    </table>

    ${remindersDueToday > 0 ? `
    <p style="color:#374151;font-size:13px;margin:0 0 20px;">
      <strong>${remindersDueToday}</strong> payment reminder${remindersDueToday === 1 ? '' : 's'} are scheduled to go out today.
    </p>` : ''}

    ${emailButton(dashboardUrl, 'Open Dashboard')}`

  return emailLayout({
    previewText: `Daily summary: ${overdue.length} overdue, ${totalOutstanding} outstanding`,
    body,
    footerText: 'FileCurrent &middot; Daily summary (manage in Settings &rarr; Notifications)',
  })
}
