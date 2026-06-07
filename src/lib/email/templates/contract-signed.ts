import { emailLayout } from '../layout'

export function contractSignedEmail({
  signerName,
  contractTitle,
  signedAt,
  dashboardUrl,
  toFreelancer,
}: {
  signerName: string
  contractTitle: string
  signedAt: string
  dashboardUrl: string
  toFreelancer: boolean
}): string {
  const heading = toFreelancer
    ? `&#10003; ${signerName} signed your contract`
    : `&#10003; You signed &ldquo;${contractTitle}&rdquo;`

  const bodyText = toFreelancer
    ? `${signerName} has reviewed and signed <strong>${contractTitle}</strong>. The signed contract and audit trail are attached to this email.`
    : `You have successfully signed <strong>${contractTitle}</strong>. A copy of the signed document is attached for your records.`

  const body = `
    <h2 style="margin:0 0 16px;color:#111827;font-size:22px;">${heading}</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:15px;line-height:1.6;">${bodyText}</p>
    <div style="border:1px solid #D1FAE5;background:#F0FDF4;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Signed Document</p>
      <p style="margin:0 0 4px;color:#111827;font-size:16px;font-weight:600;">${contractTitle}</p>
      <p style="margin:0;color:#6B7280;font-size:13px;">Signed by ${signerName} on ${signedAt}</p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="${dashboardUrl}"
         style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        ${toFreelancer ? 'View in FileCurrent &rarr;' : 'View Signed Document &rarr;'}
      </a>
    </div>`

  const previewText = toFreelancer
    ? `${signerName} signed your contract`
    : `Your signed copy of ${contractTitle}`

  return emailLayout({
    previewText,
    body,
    footerText: 'This document was signed electronically via FileCurrent. Compliant with the ESIGN Act (15 U.S.C. &sect; 7001 et seq.).',
  })
}
