import { emailLayout, emailButton } from '../layout'

export function invoiceSentEmail({
  clientName,
  freelancerName,
  businessName,
  invoiceNumber,
  total,
  dueDate,
  items,
  notes,
  paymentTerms,
  paymentInstructions,
  invoiceUrl,
  hasBrandingFooter,
}: {
  clientName: string
  freelancerName: string
  businessName?: string | null
  invoiceNumber: string
  total: string
  dueDate: string | null
  items: { description: string; quantity: number; unitPrice: string; amount: string }[]
  notes: string | null
  paymentTerms: string | null
  paymentInstructions?: string | null
  invoiceUrl: string
  hasBrandingFooter: boolean
}): string {
  const sender = businessName?.trim() || freelancerName

  const itemRows = items.map((item) => `
    <tr style="border-bottom:1px solid #F3F4F6;">
      <td style="padding:10px 8px;color:#374151;font-size:14px;">${item.description}</td>
      <td style="padding:10px 8px;color:#6B7280;font-size:14px;text-align:center;">${item.quantity}</td>
      <td style="padding:10px 8px;color:#6B7280;font-size:14px;text-align:right;">${item.unitPrice}</td>
      <td style="padding:10px 8px;color:#111827;font-size:14px;text-align:right;font-weight:600;">${item.amount}</td>
    </tr>`).join('')

  const body = `
    <p style="color:#111827;margin:0 0 16px;font-size:15px;line-height:1.7;">Hi ${clientName},</p>
    <p style="color:#374151;margin:0 0 24px;font-size:15px;line-height:1.7;">
      Here is Invoice ${invoiceNumber} for <strong>${total}</strong>${dueDate ? `, due on <strong>${dueDate}</strong>` : ''}.
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

    ${emailButton(invoiceUrl, 'View Invoice &rarr;')}

    ${paymentInstructions ? `
    <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:14px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">To pay</p>
      <p style="margin:0;font-size:14px;color:#374151;white-space:pre-line;">${paymentInstructions}</p>
    </div>` : ''}

    ${paymentTerms ? `
    <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:6px;padding:14px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#92400E;text-transform:uppercase;letter-spacing:0.05em;">Payment Terms</p>
      <p style="margin:0;font-size:14px;color:#374151;">${paymentTerms}</p>
    </div>` : ''}

    ${notes ? `
    <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:14px;margin-bottom:16px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.05em;">Notes</p>
      <p style="margin:0;font-size:14px;color:#374151;">${notes}</p>
    </div>` : ''}

    <p style="color:#374151;margin:24px 0 0;font-size:15px;line-height:1.7;">
      If you have any questions, just reply to this email.
    </p>
    <p style="color:#374151;margin:16px 0 0;font-size:15px;line-height:1.7;">
      Thank you,<br>
      ${freelancerName}${businessName?.trim() ? `<br><span style="color:#6B7280;">${businessName.trim()}</span>` : ''}
    </p>`

  return emailLayout({
    previewText: `Invoice ${invoiceNumber} from ${sender} — ${total} due${dueDate ? ` ${dueDate}` : ''}`,
    body,
    senderName: sender,
    footerText: hasBrandingFooter
      ? 'Sent via <a href="https://filecurrent.com" style="color:#635BFF;text-decoration:none;">FileCurrent</a> &mdash; filecurrent.com'
      : undefined,
  })
}
