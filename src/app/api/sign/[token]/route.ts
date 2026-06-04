import { NextRequest, NextResponse } from 'next/server'
import { submitContractSignature, getContractForSigning } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { contractSignedEmail } from '@/lib/email/templates/contract-signed'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import React from 'react'
import { ContractPDF } from '@/lib/pdf/ContractPDF'
import { uploadToR2 } from '@/lib/r2'
import { createHash } from 'crypto'

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { signerName } = await req.json()
  if (!signerName?.trim()) {
    return NextResponse.json({ error: 'signerName is required' }, { status: 400 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  // Fetch session before signing (to get emails and contract data)
  const session = await getContractForSigning(params.token)

  try {
    await submitContractSignature(params.token, signerName.trim(), ip)
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Signing failed' },
      { status: 400 }
    )
  }

  if (session) {
    const signedAt = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    })
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/contracts/${session.contractId}`

    // Get freelancer email + profile
    const { data: contractRow } = await adminClient
      .from('contracts')
      .select('user_id')
      .eq('id', session.contractId)
      .single()

    const { data: profileRow } = await adminClient
      .from('profiles')
      .select('email, full_name, business_name')
      .eq('id', contractRow?.user_id ?? '')
      .single()

    const freelancerEmail = profileRow?.email

    // Email to client (signer) — link back to the sign page (shows "Already Signed")
    const clientSignUrl = `${process.env.NEXT_PUBLIC_APP_URL}/sign/${params.token}`
    sendEmail({
      to: session.signerEmail,
      subject: `Signed: ${session.contractTitle}`,
      html: contractSignedEmail({
        signerName: signerName.trim(),
        contractTitle: session.contractTitle,
        signedAt,
        dashboardUrl: clientSignUrl,
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

    // Generate signed PDF and upload to R2 (non-blocking)
    ;(async () => {
      try {
        const content = session.contractContent ?? session.contractTitle
        const documentHash = createHash('sha256')
          .update(`${session.contractId}:${content}:${signedAt}`)
          .digest('hex')

        const element = React.createElement(ContractPDF, {
          contractTitle: session.contractTitle,
          contractContent: content,
          contractId: session.contractId,
          freelancerName: profileRow?.full_name ?? session.freelancerName,
          freelancerBusiness: profileRow?.business_name ?? session.freelancerBusiness ?? null,
          clientName: session.clientName,
          clientEmail: session.clientEmail ?? null,
          amount: new Intl.NumberFormat('en-US', {
            style: 'currency', currency: session.currency,
          }).format(session.amount),
          currency: session.currency,
          startDate: session.startDate ?? null,
          endDate: session.endDate ?? null,
          paymentTerms: session.paymentTerms ?? null,
          signerName: signerName.trim(),
          signedAt,
          auditEvents: [{
            eventType: 'signed',
            signerName: signerName.trim(),
            signerEmail: session.signerEmail,
            ipAddress: ip,
            timestamp: signedAt,
          }],
          documentHash,
        })

        const buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>)
        const key = `contracts/${session.contractId}/signed.pdf`
        const url = await uploadToR2(key, Buffer.from(buffer), 'application/pdf')

        await adminClient
          .from('contracts')
          .update({ signed_pdf_url: url })
          .eq('id', session.contractId)
      } catch (err) {
        console.error('Signed PDF generation/upload error:', err)
      }
    })()
  }

  return NextResponse.json({ success: true })
}
