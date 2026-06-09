import { NextRequest, NextResponse } from 'next/server'
import { acceptProposal, getProposalByShareToken } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { proposalAcceptedEmail } from '@/lib/email/templates/proposal-accepted'
import { APP_URL } from '@/lib/constants'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const token = params.id
  const result = await acceptProposal(token)
  if (!result) return NextResponse.json({ error: 'Proposal not found or already responded' }, { status: 404 })

  const proposal = await getProposalByShareToken(token)
  if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Notify freelancer by email — link to proposals dashboard so they can create the contract
  const { data: profile } = await adminClient
    .from('profiles')
    .select('email, full_name')
    .eq('id', proposal.userId)
    .single()

  if (profile?.email) {
    sendEmail({
      to: profile.email,
      subject: `${proposal.clientName} accepted your proposal: ${proposal.title}`,
      html: proposalAcceptedEmail({
        freelancerName: profile.full_name,
        clientName: proposal.clientName,
        proposalTitle: proposal.title,
        dashboardUrl: `${APP_URL}/proposals`,
        contractCreated: false,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true })
}
