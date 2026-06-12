import { emailLayout, emailButton } from '../layout'

/**
 * Sent to the freelancer when one of their invoices transitions to overdue.
 * Fired from the daily cron (not page loads) so each invoice notifies once.
 */
export function invoiceOverdueEmail({
  freelancerName,
  clientName,
  invoiceNumber,
  balance,
  dueDate,
  invoiceUrl,
}: {
  freelancerName: string
  clientName: string
  invoiceNumber: string
  balance: string
  dueDate: string | null
  invoiceUrl: string
}): string {
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Invoice ${invoiceNumber} is now overdue</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Hi ${freelancerName}, ${clientName}'s invoice${dueDate ? ` was due ${dueDate} and` : ''} hasn't
      been paid in full yet.
    </p>

    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:20px;margin-bottom:20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Invoice</p>
            <p style="margin:0;color:#111827;font-size:15px;font-weight:600;">${invoiceNumber} &middot; ${clientName}</p>
          </td>
          <td style="text-align:right;">
            <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Balance Due</p>
            <p style="margin:0;color:#B91C1C;font-size:18px;font-weight:700;">${balance}</p>
          </td>
        </tr>
      </table>
    </div>

    <p style="color:#6B7280;margin:0 0 4px;font-size:13px;line-height:1.6;">
      Open the invoice to send a reminder or record a payment.
    </p>

    ${emailButton(invoiceUrl, 'View Invoice')}`

  return emailLayout({
    previewText: `Invoice ${invoiceNumber} (${clientName}) is overdue — ${balance} due`,
    body,
    footerText: 'FileCurrent &middot; Overdue notification (manage in Settings &rarr; Notifications)',
  })
}
