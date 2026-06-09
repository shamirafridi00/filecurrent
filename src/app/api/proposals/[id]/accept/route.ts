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

  // Auto-create contract draft — template_id is nullable so we pass null if none exists
  const { data: templateRow } = await adminClient
    .from('contract_templates')
    .select('id')
    .eq('user_id', proposal.userId)
    .limit(1)
    .maybeSingle()

  let contractId: string | null = null
  try {
    const { data: contractRow, error: contractError } = await adminClient
      .from('contracts')
      .insert({
        user_id: proposal.userId,
        client_id: proposal.clientId,
        template_id: templateRow?.id ?? null,
        title: proposal.title,
        project_description: proposal.summary ?? proposal.title,
        amount: proposal.total,
        currency: proposal.currency,
        payment_terms: 'Net 30',
        start_date: new Date().toISOString().slice(0, 10),
        status: 'draft',
        has_branding_footer: true,
      })
      .select('id')
      .single()

    if (contractError) throw contractError
    contractId = contractRow.id

    await adminClient
      .from('proposals')
      .update({ contract_id: contractId, updated_at: new Date().toISOString() })
      .eq('share_token', token)
  } catch (err) {
    console.error('[accept-proposal] contract creation failed:', err)
    // Non-fatal — proposal is still accepted
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
