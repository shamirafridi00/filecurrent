import { emailLayout, emailButton } from '../layout'

export function clientPortalEmail({
  clientName,
  freelancerName,
  freelancerBusiness,
  portalUrl,
}: {
  clientName: string
  freelancerName: string
  freelancerBusiness: string | null
  portalUrl: string
}): string {
  const senderDisplay = freelancerBusiness ?? freelancerName

  const body = `
    <p style="color:#111827;margin:0 0 16px;font-size:15px;line-height:1.7;">Hi ${clientName},</p>
    <p style="color:#374151;margin:0 0 20px;font-size:15px;line-height:1.7;">
      ${freelancerName}${freelancerBusiness ? ` from ${freelancerBusiness}` : ''} has set up a document portal for you.
    </p>
    <p style="color:#374151;margin:0 0 8px;font-size:15px;line-height:1.7;">
      Your portal is a single private link where you can:
    </p>
    <ul style="color:#374151;margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.9;">
      <li><strong>Invoices</strong> &mdash; every invoice sent to you, its amount, due date, and payment status. Open any unpaid invoice to see payment instructions and let ${senderDisplay} know once you've paid.</li>
      <li><strong>Contracts</strong> &mdash; agreements shared with you, including signed copies you can refer back to anytime.</li>
      <li><strong>Proposals</strong> &mdash; project proposals awaiting your review, with one-click accept or decline.</li>
      <li><strong>Balance</strong> &mdash; a running summary of what's outstanding and what you've already paid.</li>
    </ul>
    ${emailButton(portalUrl, 'View Your Portal &rarr;')}
    <p style="color:#6B7280;margin:0 0 12px;font-size:13px;line-height:1.6;">
      Bookmark this link &mdash; it always shows your latest documents. No account or login required.
    </p>
    <p style="color:#6B7280;margin:0 0 24px;font-size:13px;line-height:1.6;">
      If you lose this link, you can request a new one from your service provider at any time.
    </p>
    <p style="color:#374151;margin:0;font-size:15px;line-height:1.7;">
      ${freelancerName}
    </p>`

  return emailLayout({
    previewText: `Your document portal from ${senderDisplay}`,
    body,
    senderName: senderDisplay,
  })
}
