import { emailLayout, emailButton } from '../layout'

export function contractSignatureRequestEmail({
  freelancerName,
  businessName,
  clientName,
  contractTitle,
  projectAmount,
  signingUrl,
}: {
  freelancerName: string
  businessName?: string | null
  clientName: string
  contractTitle: string
  projectAmount: string
  signingUrl: string
}): string {
  const sender = businessName?.trim() || freelancerName

  const body = `
    <p style="color:#111827;margin:0 0 16px;font-size:15px;line-height:1.7;">Hi ${clientName},</p>
    <p style="color:#374151;margin:0 0 24px;font-size:15px;line-height:1.7;">
      ${freelancerName}${businessName?.trim() ? ` from ${businessName.trim()}` : ''} has shared a contract for your review and signature.
    </p>
    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Contract</p>
      <p style="margin:0 0 4px;color:#111827;font-size:18px;font-weight:600;">${contractTitle}</p>
      <p style="margin:0;color:#635BFF;font-size:16px;font-weight:500;">${projectAmount}</p>
    </div>
    ${emailButton(signingUrl, 'Review and Sign &rarr;')}
    <p style="color:#6B7280;font-size:13px;line-height:1.6;margin:0 0 24px;">
      This document is legally binding once signed. The signature is ESIGN Act compliant.
    </p>
    <p style="color:#374151;margin:0;font-size:15px;line-height:1.7;">
      ${freelancerName}${businessName?.trim() ? `<br><span style="color:#6B7280;">${businessName.trim()}</span>` : ''}
    </p>`

  return emailLayout({
    previewText: `${sender} sent you a contract to sign`,
    body,
    footerText: 'This contract was sent via FileCurrent. By signing, you agree electronically under the ESIGN Act (15 U.S.C. &sect; 7001).',
  })
}
