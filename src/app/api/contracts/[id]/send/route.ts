import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSigningSession, getContract, getCurrentProfile, logClientActivity } from '@/lib/db/supabase'
import { sendEmail } from '@/lib/email'
import { contractSignatureRequestEmail } from '@/lib/email/templates/contract-signature-request'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { signerEmail } = await req.json()
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

    const signingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${token}`
    const amount = new Intl.NumberFormat('en-US', {
      style: 'currency', currency: contract.currency,
    }).format(contract.amount)

    await sendEmail({
      to: signerEmail,
      subject: `Please sign: ${contract.title}`,
      html: contractSignatureRequestEmail({
        freelancerName: profile.fullName,
        clientName: contract.clientName,
        contractTitle: contract.title,
        projectAmount: amount,
        signingUrl,
      }),
    }).catch((err) => console.error('Contract send email failed:', err))
  }

  return NextResponse.json({ token })
}
