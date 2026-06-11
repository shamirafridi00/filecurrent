import { emailLayout, emailButton } from '../layout'

/**
 * Sent to the freelancer when a client declines their proposal, so they can
 * follow up or revise. Kept neutral and non-alarming in tone.
 */
export function proposalDeclinedEmail({
  freelancerName,
  clientName,
  proposalTitle,
  dashboardUrl,
}: {
  freelancerName: string
  clientName: string
  proposalTitle: string
  dashboardUrl: string
}): string {
  const body = `
    <h2 style="margin:0 0 8px;color:#111827;font-size:20px;">Proposal declined</h2>
    <p style="color:#6B7280;margin:0 0 24px;font-size:14px;line-height:1.6;">
      Hi ${freelancerName}, <strong>${clientName}</strong> declined your proposal.
      It might be worth following up to understand what would work better for them.
    </p>

    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0;color:#111827;font-size:15px;font-weight:600;">${proposalTitle}</p>
      <p style="margin:6px 0 0;color:#B91C1C;font-size:13px;">Declined by ${clientName}</p>
    </div>

    ${emailButton(dashboardUrl, 'View Proposals')}`

  return emailLayout({
    previewText: `${clientName} declined your proposal "${proposalTitle}"`,
    body,
    senderName: freelancerName,
  })
}
