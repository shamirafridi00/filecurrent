import { emailLayout } from '../layout'

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
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Your Client Portal is Ready</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;">
      Hi ${clientName}, ${senderDisplay} has shared your client portal with you.
      Use the link below to view your invoices, contracts, and payment history anytime.
    </p>

    <div style="background:#F0EFFF;border:1px solid #C7C4FF;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#635BFF;text-transform:uppercase;letter-spacing:0.05em;">Your Portal Link</p>
      <p style="margin:0;font-size:13px;color:#374151;word-break:break-all;">
        <a href="${portalUrl}" style="color:#635BFF;text-decoration:none;">${portalUrl}</a>
      </p>
    </div>

    <p style="color:#6B7280;margin:0 0 24px;font-size:13px;">
      You can bookmark this link to check your invoices and contracts at any time — no login required.
    </p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${portalUrl}"
         style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        Open My Portal &rarr;
      </a>
    </div>`

  return emailLayout({
    previewText: `${senderDisplay} shared your client portal — view invoices & contracts`,
    body,
    footerText: `Sent via <a href="https://filecurrent.com" style="color:#635BFF;text-decoration:none;">FileCurrent</a> on behalf of ${senderDisplay}`,
  })
}
