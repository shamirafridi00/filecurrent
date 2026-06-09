import { emailLayout } from '../layout'

export function proposalAcceptedEmail({
  freelancerName,
  clientName,
  proposalTitle,
  dashboardUrl,
  contractCreated,
}: {
  freelancerName: string
  clientName: string
  proposalTitle: string
  dashboardUrl: string
  contractCreated: boolean
}): string {
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Proposal Accepted!</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;">
      Great news, ${freelancerName}! <strong>${clientName}</strong> has accepted your proposal.
    </p>
    <div style="background:#F0FBF4;border:1px solid #A3E6C0;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;color:#111827;font-size:15px;font-weight:600;">${proposalTitle}</p>
      <p style="margin:6px 0 0;color:#16A34A;font-size:13px;">Accepted by ${clientName}</p>
    </div>
    ${contractCreated ? `
    <p style="color:#374151;font-size:14px;margin:0 0 20px;">
      A contract draft has been automatically created for you. Review it, customize if needed, then send it for signature.
    </p>` : `
    <p style="color:#374151;font-size:14px;margin:0 0 20px;">
      Head to your dashboard to create a contract and invoice for this project.
    </p>`}
    <div style="text-align:center;margin:28px 0;">
      <a href="${dashboardUrl}" style="display:inline-block;background:#635BFF;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:600;">
        ${contractCreated ? 'View Contract Draft &rarr;' : 'Go to Dashboard &rarr;'}
      </a>
    </div>`
  return emailLayout({ previewText: `${clientName} accepted your proposal!`, body })
}
