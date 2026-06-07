import { emailLayout } from '../layout'

export function invoiceSentEmail({
  clientName,
  freelancerName,
  invoiceNumber,
  total,
  dueDate,
  items,
  notes,
  paymentTerms,
  invoiceUrl,
  hasBrandingFooter,
}: {
  clientName: string
  freelancerName: string
  invoiceNumber: string
  total: string
  dueDate: string | null
  items: { description: string; quantity: number; unitPrice: string; amount: string }[]
  notes: string | null
  paymentTerms: string | null
  invoiceUrl: string
  hasBrandingFooter: boolean
}): string {
  const itemRows = items.map((item) => `
    <tr style="border-bottom:1px solid #F3F4F6;">
      <td style="padding:10px 8px;color:#374151;font-size:14px;">${item.description}</td>
      <td style="padding:10px 8px;color:#6B7280;font-size:14px;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 8px;color:#6B7280;font-size:14px;text-align:right;">${item.unitPrice}</td>
      <td style="padding:10px 8px;color:#111827;font-size:14px;text-align:right;font-weight:600;">${item.amount}</td>
    </tr>`).join('')

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Invoice from ${freelancerName}</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;">
      Hi ${clientName}, please find your invoice details below.
      ${dueDate ? `Payment is due by <strong>${dueDate}</strong>.` : ''}
    </p>

    <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
      <thead>
        <tr style="background:#F9FAFB;">
          <th style="padding:10px 8px;text-align:left;font-size:12px;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Description</th>
          <th style="padding:10px 8px;text-align:center;font-size:12px;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;width:50px;">Qty</th>
          <th style="padding:10px 8px;text-align:right;font-size:12px;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;width:100px;">Price</th>
          <th style="padding:10px 8px;text-align:right;font-size:12px;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;width:100px;">Amount</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:14px 8px;text-align:right;font-weight:700;font-size:16px;color:#111827;border-top:2px solid #E5E7EB;">Total</td>
          <td style="padding:14px 8px;text-align:right;font-weight:700;font-size:18px;color:#635BFF;border-top:2px solid #E5E7EB;">${total}</td>
        </tr>
      </tfoot>
    </table>

    ${notes ? `
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:14px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#1D4ED8;text-transform:uppercase;">Notes</p>
      <p style="margin:0;font-size:14px;color:#374151;">${notes}</p>
    </div>` : ''}

    ${paymentTerms ? `
    <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:6px;padding:14px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#92400E;text-transform:uppercase;">Payment Terms</p>
      <p style="margin:0;font-size:14px;color:#374151;">${paymentTerms}</p>
    </div>` : ''}

    <div style="text-align:center;margin:28px 0;">
      <a href="${invoiceUrl}"
         style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        View Invoice &rarr;
      </a>
    </div>`

  const footerText = hasBrandingFooter
    ? 'Sent via <a href="https://filecurrent.com" style="color:#635BFF;text-decoration:none;">FileCurrent</a> &mdash; filecurrent.com'
    : 'Thank you for your business.'

  return emailLayout({
    previewText: `Invoice ${invoiceNumber} — ${total} due${dueDate ? ` by ${dueDate}` : ''}`,
    body,
    footerText,
  })
}
