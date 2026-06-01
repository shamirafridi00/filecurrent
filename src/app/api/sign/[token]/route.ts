import { NextRequest, NextResponse } from 'next/server'
import { submitContractSignature, getContractForSigning } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { contractSignedEmail } from '@/lib/email/templates/contract-signed'

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { signerName } = await req.json()
  if (!signerName?.trim()) {
    return NextResponse.json({ error: 'signerName is required' }, { status: 400 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  // Fetch session before signing (to get emails)
  const session = await getContractForSigning(params.token)

  try {
    await submitContractSignature(params.token, signerName.trim(), ip)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Signing failed' },
      { status: 400 }
    )
  }

  // Send confirmation emails (non-blocking)
  if (session) {
    const signedAt = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    })
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/contracts/${session.contractId}`

    // Get freelancer email from profiles
    const { data: profileRow } = await adminClient
      .from('profiles')
      .select('email')
      .eq('id', (await adminClient
        .from('contracts')
        .select('user_id')
        .eq('id', session.contractId)
        .single()
      ).data?.user_id)
      .single()

    const freelancerEmail = profileRow?.email

    // Email to client (signer)
    sendEmail({
      to: session.signerEmail,
      subject: `Signed: ${session.contractTitle}`,
      html: contractSignedEmail({
        signerName: signerName.trim(),
        contractTitle: session.contractTitle,
        signedAt,
        dashboardUrl,
        toFreelancer: false,
      }),
    }).catch((err) => console.error('Signed email to client failed:', err))

    // Email to freelancer
    if (freelancerEmail) {
      sendEmail({
        to: freelancerEmail,
        subject: `✅ ${signerName.trim()} signed ${session.contractTitle}`,
        html: contractSignedEmail({
          signerName: signerName.trim(),
          contractTitle: session.contractTitle,
          signedAt,
          dashboardUrl,
          toFreelancer: true,
        }),
      }).catch((err) => console.error('Signed email to freelancer failed:', err))
    }
  }

  return NextResponse.json({ success: true })
}
