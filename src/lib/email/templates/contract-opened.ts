import { emailLayout, emailButton } from '../layout'

/**
 * Sent to the freelancer when a client opens their contract for signing
 * (rate-limited to once per hour per contract). Mirrors invoice-opened.
 */
export function contractOpenedEmail({
  clientName,
  contractTitle,
  openedAt,
  dashboardUrl,
}: {
  clientName: string
  contractTitle: string
  openedAt: string
  dashboardUrl: string
}): string {
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:18px;">&#128064; ${clientName} opened your contract</h2>
    <p style="color:#6B7280;margin:0 0 20px;font-size:14px;line-height:1.6;">
      ${clientName} just viewed the contract you sent for signature. They haven't
      signed yet &mdash; you'll get another email the moment they do.
    </p>
    <div style="border:1px solid #E5E7EB;border-radius:6px;padding:16px;margin-bottom:20px;">
      <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Contract</p>
      <p style="margin:0 0 8px;color:#111827;font-size:15px;font-weight:600;">${contractTitle}</p>
      <p style="margin:0;color:#6B7280;font-size:13px;">Opened at ${openedAt}</p>
    </div>
    ${emailButton(dashboardUrl, 'View Contract')}`

  return emailLayout({
    previewText: `${clientName} just opened your contract`,
    body,
    footerText: 'FileCurrent &middot; Contract activity notification',
  })
}
