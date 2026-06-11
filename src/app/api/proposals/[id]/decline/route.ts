import { NextRequest, NextResponse } from 'next/server'
import { declineProposal, getProposalByShareToken, getNotificationRecipient } from '@/lib/db/supabase'
import { sendEmail, buildSenderName } from '@/lib/email'
import { proposalDeclinedEmail } from '@/lib/email/templates/proposal-declined'
import { APP_URL } from '@/lib/constants'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const success = await declineProposal(params.id)
  if (!success) return NextResponse.json({ error: 'Not found or already responded' }, { status: 404 })

  // Notify freelancer by email — gated on their notification toggle. Non-blocking.
  try {
    const proposal = await getProposalByShareToken(params.id)
    if (proposal) {
      const recipient = await getNotificationRecipient(proposal.userId, 'proposal_declined')
      if (recipient) {
        sendEmail({
          to: recipient.email,
          subject: `${proposal.clientName} declined your proposal: ${proposal.title}`,
          html: proposalDeclinedEmail({
            freelancerName: recipient.fullName,
            clientName: proposal.clientName,
            proposalTitle: proposal.title,
            dashboardUrl: `${APP_URL}/proposals`,
          }),
          fromName: buildSenderName(recipient.businessName, recipient.fullName),
        }).catch(() => {})
      }
    }
  } catch {
    // delivery failure must not break the client's decline action
  }

  return NextResponse.json({ success: true })
}
