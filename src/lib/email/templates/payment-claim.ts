import { emailLayout, emailButton } from '../layout'
import { PAYMENT_METHODS } from '@/types'

function methodLabel(value: string): string {
  return PAYMENT_METHODS.find((m) => m.value === value)?.label ?? value
}

/**
 * Sent to the freelancer when a client marks an invoice as paid from the public
 * invoice page. It is a *claim* awaiting their confirmation — the CTA opens the
 * invoice where they can confirm (records the payment) or dismiss it.
 */
export function paymentClaimEmail({
  freelancerName,
  clientName,
  invoiceNumber,
  amount,
  method,
  note,
  hasReceipt,
  invoiceUrl,
}: {
  freelancerName: string
  clientName: string
  invoiceNumber: string
  amount: string
  method: string
  note?: string
  hasReceipt: boolean
  invoiceUrl: string
}): string {
  const detailRow = (k: string, v: string) => `
    <tr>
      <td style="padding:6px 0;color:#6B7280;font-size:13px;">${k}</td>
      <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;text-align:right;">${v}</td>
    </tr>`

  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">${clientName} marked an invoice as paid</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Hi ${freelancerName}, ${clientName} let you know they've paid invoice
      <strong>${invoiceNumber}</strong>. Review the details below and confirm to
      record the payment, or dismiss it if the funds haven't arrived.
    </p>

    <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:20px;margin-bottom:20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRow('Invoice', invoiceNumber)}
        ${detailRow('Amount reported', amount)}
        ${detailRow('Method', methodLabel(method))}
        ${note ? detailRow('Client note', note) : ''}
        ${detailRow('Receipt attached', hasReceipt ? 'Yes' : 'No')}
      </table>
    </div>

    <p style="color:#6B7280;margin:0 0 4px;font-size:13px;line-height:1.6;">
      This payment isn't recorded yet. Open the invoice to confirm it.
    </p>

    ${emailButton(invoiceUrl, 'Review &amp; Confirm Payment')}`

  return emailLayout({
    previewText: `${clientName} marked invoice ${invoiceNumber} as paid (${amount})`,
    body,
    senderName: freelancerName,
  })
}
