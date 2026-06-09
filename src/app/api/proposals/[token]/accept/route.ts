import { NextRequest, NextResponse } from 'next/server'
import { acceptProposal, getProposalByShareToken, createContract } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { proposalAcceptedEmail } from '@/lib/email/templates/proposal-accepted'
import { APP_URL } from '@/lib/constants'

export async function POST(_req: NextRequest, { params }: { params: { token: string } }) {
  const result = await acceptProposal(params.token)
  if (!result) return NextResponse.json({ error: 'Proposal not found or already responded' }, { status: 404 })

  const proposal = await getProposalByShareToken(params.token)
  if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Auto-create contract draft from proposal data
  const { data: templateRow } = await adminClient
    .from('contract_templates')
    .select('id')
    .eq('user_id', proposal.userId)
    .limit(1)
    .single()

  const templateId = templateRow?.id ?? '00000000-0000-0000-0000-000000000000'

  let contractId: string | null = null
  try {
    contractId = await createContract(proposal.userId, {
      clientId: proposal.clientId,
      templateId,
      title: proposal.title,
      projectDescription: proposal.summary ?? proposal.title,
      amount: proposal.total,
      currency: proposal.currency,
      paymentTerms: 'Net 30',
      startDate: new Date().toISOString().slice(0, 10),
    })

    await adminClient
      .from('proposals')
      .update({ contract_id: contractId })
      .eq('share_token', params.token)
  } catch {
    // Contract creation failure is non-fatal — proposal is still accepted
  }

  // Notify freelancer by email
  const { data: profile } = await adminClient
    .from('profiles')
    .select('email, full_name')
    .eq('id', proposal.userId)
    .single()

  if (profile?.email) {
    const dashboardUrl = contractId
      ? `${APP_URL}/contracts/${contractId}`
      : `${APP_URL}/proposals`

    sendEmail({
      to: profile.email,
      subject: `${proposal.clientName} accepted your proposal: ${proposal.title}`,
      html: proposalAcceptedEmail({
        freelancerName: profile.full_name,
        clientName: proposal.clientName,
        proposalTitle: proposal.title,
        dashboardUrl,
        contractCreated: !!contractId,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ success: true, contractId })
}
