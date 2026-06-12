import { NextRequest, NextResponse } from 'next/server'
import { acceptProposal, getProposalByShareToken, getNotificationRecipient, logClientActivity } from '@/lib/db/supabase'
import { sendEmail, buildSenderName } from '@/lib/email'
import { proposalAcceptedEmail } from '@/lib/email/templates/proposal-accepted'
import { APP_URL } from '@/lib/constants'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const token = params.id
  const result = await acceptProposal(token)
  if (!result) return NextResponse.json({ error: 'Proposal not found or already responded' }, { status: 404 })

  const proposal = await getProposalByShareToken(token)
  if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Surface the acceptance in the activity feed (client tab + dashboard banner)
  void logClientActivity({
    userId: result.userId,
    clientId: result.clientId ?? null,
    clientName: proposal.clientName,
    eventType: 'proposal_accepted',
    entityType: 'note',
    entityId: result.proposalId,
    entityLabel: proposal.title,
    amount: proposal.total,
  })

  // Notify freelancer by email — gated on their notification toggle.
  const recipient = await getNotificationRecipient(proposal.userId, 'proposal_accepted')
  if (recipient) {
    sendEmail({
      to: recipient.email,
      subject: `${proposal.clientName} accepted your proposal: ${proposal.title}`,
      html: proposalAcceptedEmail({
        freelancerName: recipient.fullName,
        clientName: proposal.clientName,
        proposalTitle: proposal.title,
        dashboardUrl: `${APP_URL}/proposals`,
        contractCreated: false,
      }),
      fromName: buildSenderName(recipient.businessName, recipient.fullName),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
