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
      Your portal is a single link where you can:
    </p>
    <ul style="color:#374151;margin:0 0 24px;padding-left:20px;font-size:15px;line-height:1.9;">
      <li>View all your invoices and their status</li>
      <li>Access your signed contracts</li>
      <li>See your outstanding balance</li>
    </ul>
    ${emailButton(portalUrl, 'View Your Portal &rarr;')}
    <p style="color:#6B7280;margin:0 0 24px;font-size:13px;line-height:1.6;">
      Bookmark this link &mdash; it always shows your latest documents. No login required.
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
