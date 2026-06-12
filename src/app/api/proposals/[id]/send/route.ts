import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { getProposal, getCurrentProfile } from '@/lib/db/supabase'
import { sendEmail, buildSenderName } from '@/lib/email'
import { proposalEmail } from '@/lib/email/templates/proposal'
import { APP_URL } from '@/lib/constants'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [proposal, profile] = await Promise.all([
    getProposal(params.id, user.id),
    getCurrentProfile(user.id),
  ])
  if (!proposal) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (!proposal.clientEmail) return NextResponse.json({ error: 'Client has no email' }, { status: 422 })

  const proposalUrl = `${APP_URL}/p/${proposal.shareToken}`
  const total = new Intl.NumberFormat('en-US', { style: 'currency', currency: proposal.currency }).format(proposal.total)

  // Email failures must not 500 silently — surface a useful message and keep
  // the share link usable (same fix pattern as contract/invoice sends).
  let emailFailed = false
  try {
    await sendEmail({
      to: proposal.clientEmail,
      subject: `Proposal: ${proposal.title}`,
      html: proposalEmail({
        clientName: proposal.clientName,
        freelancerName: profile.fullName,
        freelancerBusiness: profile.businessName,
        proposalTitle: proposal.title,
        total,
        validUntil: proposal.validUntil,
        proposalUrl,
      }),
      replyTo: profile.email,
      fromName: buildSenderName(profile.businessName, profile.fullName),
    })
  } catch (err) {
    emailFailed = true
    console.error('[proposal send] email delivery failed:', err)
  }

  if (emailFailed) {
    return NextResponse.json(
      { error: 'Email delivery failed. Use "Copy Link" to share the proposal manually, or try again.' },
      { status: 502 }
    )
  }

  await adminClient
    .from('proposals')
    .update({ status: 'sent', updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .eq('user_id', user.id)

  return NextResponse.json({ success: true })
}
