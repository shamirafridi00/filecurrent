import { emailLayout } from '../layout'

export function paymentReceivedEmail({
  clientName,
  freelancerName,
  invoiceNumber,
  amountPaid,
  remainingBalance,
  currency,
  invoiceUrl,
}: {
  clientName: string
  freelancerName: string
  invoiceNumber: string
  amountPaid: string
  remainingBalance: string
  currency: string
  invoiceUrl: string
}): string {
  const isPaidInFull = remainingBalance === '$0.00' ||
    remainingBalance === '£0.00' ||
    remainingBalance === '€0.00' ||
    parseFloat(remainingBalance.replace(/[^0-9.]/g, '')) === 0

  const remainingBox = isPaidInFull
    ? `<div style="background:#F0FDF4;border:1px solid #D1FAE5;border-radius:8px;padding:16px;margin-bottom:24px;text-align:center;">
        <p style="margin:0;color:#065F46;font-size:15px;font-weight:700;">&#10003; Paid in Full</p>
      </div>`
    : `<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="margin:0 0 4px;color:#92400E;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">Remaining Balance</p>
        <p style="margin:0;color:#92400E;font-size:18px;font-weight:700;">${remainingBalance}</p>
      </div>`

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Payment received &mdash; Invoice ${invoiceNumber}</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Hi ${clientName}, we've recorded your payment of <strong>${amountPaid}</strong> for invoice ${invoiceNumber}.
    </p>

    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin-bottom:20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Invoice</p>
            <p style="margin:0;color:#111827;font-size:15px;font-weight:600;">${invoiceNumber}</p>
          </td>
          <td style="text-align:right;">
            <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Amount Paid</p>
            <p style="margin:0;color:#065F46;font-size:18px;font-weight:700;">${amountPaid}</p>
          </td>
        </tr>
      </table>
    </div>

    ${remainingBox}

    <div style="text-align:center;margin:28px 0;">
      <a href="${invoiceUrl}"
         style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        View Invoice &rarr;
      </a>
    </div>`

  return emailLayout({
    previewText: `Payment of ${amountPaid} recorded for invoice ${invoiceNumber}`,
    body,
    footerText: `Sent by ${freelancerName} via FileCurrent.`,
  })
}
