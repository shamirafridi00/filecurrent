import { emailLayout, emailButton } from '../layout'

export function contractSignedEmail({
  signerName,
  contractTitle,
  signedAt,
  signerIp,
  dashboardUrl,
  createInvoiceUrl,
  toFreelancer,
}: {
  signerName: string
  contractTitle: string
  signedAt: string
  /** Captured for the ESIGN audit trail — shown on the freelancer copy. */
  signerIp?: string | null
  dashboardUrl: string
  /** Freelancer copy only: deep link to /invoices/new?contractId=… */
  createInvoiceUrl?: string
  toFreelancer: boolean
}): string {
  const heading = toFreelancer
    ? `&#10003; ${signerName} signed &ldquo;${contractTitle}&rdquo;`
    : `&#10003; You signed &ldquo;${contractTitle}&rdquo;`

  const bodyText = toFreelancer
    ? `Good news &mdash; ${signerName} has signed your contract <strong>${contractTitle}</strong>.`
    : `You have successfully signed <strong>${contractTitle}</strong>. A copy of the signed document is attached for your records.`

  const body = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:22px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">${heading}</h2>
    <p style="color:#374151;margin:0 0 24px;font-size:15px;line-height:1.7;">${bodyText}</p>
    <div style="border:1px solid #D1FAE5;background:#F0FDF4;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Signed Document</p>
      <p style="margin:0 0 4px;color:#111827;font-size:16px;font-weight:600;">${contractTitle}</p>
      <p style="margin:0;color:#6B7280;font-size:13px;">Signed by ${signerName} on ${signedAt}</p>
      ${toFreelancer && signerIp ? `<p style="margin:4px 0 0;color:#6B7280;font-size:13px;">IP address: ${signerIp} — captured from the signer's connection at signing time for the ESIGN audit trail (may reflect a VPN/proxy if one was used)</p>` : ''}
    </div>
    ${emailButton(dashboardUrl, toFreelancer ? 'View Contract &rarr;' : 'View Signed Document &rarr;')}
    ${toFreelancer && createInvoiceUrl ? `
    <div style="border-top:1px solid #E5E7EB;padding-top:20px;margin-top:4px;">
      <p style="color:#374151;margin:0 0 4px;font-size:15px;line-height:1.7;">
        <strong>Your next step:</strong> create an invoice for this engagement.
      </p>
      ${emailButton(createInvoiceUrl, 'Create Invoice &rarr;')}
    </div>` : ''}`

  const previewText = toFreelancer
    ? `${signerName} signed "${contractTitle}"`
    : `Your signed copy of ${contractTitle}`

  return emailLayout({
    previewText,
    body,
    footerText: 'This document was signed electronically via FileCurrent. Compliant with the ESIGN Act (15 U.S.C. &sect; 7001 et seq.).',
  })
}
