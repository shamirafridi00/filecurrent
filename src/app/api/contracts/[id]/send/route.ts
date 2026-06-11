import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSigningSession, getContract, getCurrentProfile, logClientActivity } from '@/lib/db/supabase'
import { sendEmail, buildSenderName } from '@/lib/email'
import { contractSignatureRequestEmail } from '@/lib/email/templates/contract-signature-request'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { signerEmail, sendEmail: shouldSendEmail = true } = await req.json()
  if (!signerEmail) return NextResponse.json({ error: 'signerEmail required' }, { status: 400 })

  const [token, contract, profile] = await Promise.all([
    createSigningSession(params.id, signerEmail),
    getContract(params.id, user.id),
    getCurrentProfile(user.id),
  ])

  if (contract) {
    void logClientActivity({
      userId: user.id,
      clientId: contract.clientId ?? null,
      clientName: contract.clientName,
      eventType: 'contract_sent',
      entityType: 'contract',
      entityId: params.id,
      entityLabel: contract.title,
    })

    if (shouldSendEmail) {
      const signingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${token}`
      const amount = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: contract.currency,
      }).format(contract.amount)

      try {
        await sendEmail({
          to: signerEmail,
          subject: `${profile.businessName || profile.fullName} sent you a contract to sign`,
          html: contractSignatureRequestEmail({
            freelancerName: profile.fullName,
            businessName: profile.businessName,
            clientName: contract.clientName,
            contractTitle: contract.title,
            projectAmount: amount,
            signingUrl,
          }),
          replyTo: profile.email ?? undefined,
          fromName: buildSenderName(profile.businessName, profile.fullName),
        })
        return NextResponse.json({ token, emailFailed: false })
      } catch (err) {
        console.error('[contract/send] Email delivery failed:', err)
        return NextResponse.json({ token, emailFailed: true })
      }
    }
  }

  return NextResponse.json({ token, emailFailed: false })
}
