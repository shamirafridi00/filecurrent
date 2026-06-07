import { emailLayout } from '../layout'

export function invoiceOpenedEmail({
  clientName,
  invoiceNumber,
  amount,
  openedAt,
  dashboardUrl,
}: {
  clientName: string
  invoiceNumber: string
  amount: string
  openedAt: string
  dashboardUrl: string
}): string {
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:18px;">&#128064; ${clientName} opened your invoice</h2>
    <p style="color:#6B7280;margin:0 0 20px;font-size:14px;line-height:1.6;">
      Good news &mdash; ${clientName} just viewed your invoice for <strong>${amount}</strong>.
    </p>
    <div style="border:1px solid #E5E7EB;border-radius:6px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Invoice</p>
      <p style="margin:0 0 8px;color:#111827;font-size:15px;font-weight:600;">${invoiceNumber} &middot; ${amount}</p>
      <p style="margin:0;color:#6B7280;font-size:13px;">Opened at ${openedAt}</p>
    </div>
    <div style="text-align:center;">
      <a href="${dashboardUrl}"
         style="display:inline-block;background:#635BFF;color:#ffffff;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
        View Invoice &rarr;
      </a>
    </div>`

  return emailLayout({
    previewText: `${clientName} just viewed your invoice`,
    body,
    footerText: 'FileCurrent &middot; Invoice activity notification',
  })
}
