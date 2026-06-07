import { emailLayout } from '../layout'

export function contractSignatureRequestEmail({
  freelancerName,
  clientName,
  contractTitle,
  projectAmount,
  signingUrl,
}: {
  freelancerName: string
  clientName: string
  contractTitle: string
  projectAmount: string
  signingUrl: string
}): string {
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:22px;">You have a contract to sign</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:15px;">
      ${freelancerName} has sent you a contract for your review and signature.
    </p>
    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Contract</p>
      <p style="margin:0 0 4px;color:#111827;font-size:18px;font-weight:600;">${contractTitle}</p>
      <p style="margin:0;color:#635BFF;font-size:16px;font-weight:500;">${projectAmount}</p>
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="${signingUrl}"
         style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        Review &amp; Sign Contract
      </a>
    </div>
    <p style="color:#9CA3AF;font-size:13px;text-align:center;">
      Or copy this link: <a href="${signingUrl}" style="color:#635BFF;">${signingUrl}</a>
    </p>`

  return emailLayout({
    previewText: `${freelancerName} sent you a contract to sign`,
    body,
    footerText: 'This contract was sent via FileCurrent. By signing, you agree electronically under the ESIGN Act (15 U.S.C. &sect; 7001).',
  })
}
