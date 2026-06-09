import { emailLayout } from '../layout'

export function proposalEmail({
  clientName,
  freelancerName,
  freelancerBusiness,
  proposalTitle,
  total,
  validUntil,
  proposalUrl,
}: {
  clientName: string
  freelancerName: string
  freelancerBusiness: string | null
  proposalTitle: string
  total: string
  validUntil: string | null
  proposalUrl: string
}): string {
  const sender = freelancerBusiness ?? freelancerName
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">You have a proposal to review</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;">
      Hi ${clientName}, ${sender} has sent you a project proposal for your review.
    </p>
    <div style="border:1px solid #E5E7EB;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 4px;color:#6B7280;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">Proposal</p>
      <p style="margin:0 0 8px;color:#111827;font-size:18px;font-weight:600;">${proposalTitle}</p>
      <p style="margin:0 0 4px;color:#635BFF;font-size:22px;font-weight:700;">${total}</p>
      ${validUntil ? `<p style="margin:8px 0 0;color:#9CA3AF;font-size:13px;">Valid until ${validUntil}</p>` : ''}
    </div>
    <div style="text-align:center;margin:28px 0;">
      <a href="${proposalUrl}" style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        Review Proposal &rarr;
      </a>
    </div>
    <p style="color:#9CA3AF;font-size:13px;text-align:center;">
      Or copy this link: <a href="${proposalUrl}" style="color:#635BFF;">${proposalUrl}</a>
    </p>`
  return emailLayout({
    previewText: `${sender} sent you a proposal — ${total}`,
    body,
    footerText: `Sent via FileCurrent on behalf of ${sender}`,
  })
}
