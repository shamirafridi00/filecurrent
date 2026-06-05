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
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://filecurrent.com'}/contracts/${session.contractId}`

    // Get freelancer email + profile
    const { data: contractRow } = await adminClient
      .from('contracts')
      .select('user_id')
      .eq('id', session.contractId)
      .single()

    const { data: profileRow } = await adminClient
      .from('profiles')
      .select('email, full_name, business_name, business_logo')
      .eq('id', contractRow?.user_id ?? '')
      .single()

    const freelancerEmail = profileRow?.email

    // Email to client (signer) — link back to the sign page (shows "Already Signed")
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://filecurrent.com'
    const clientSignUrl = `${appUrl}/sign/${params.token}`
    console.log('[sign] signerEmail:', session.signerEmail, '| contractTitle:', session.contractTitle)
    if (session.signerEmail) {
      try {
        await sendEmail({
          to: session.signerEmail,
          subject: `Signed: ${session.contractTitle}`,
          html: contractSignedEmail({
            signerName: signerName.trim(),
            contractTitle: session.contractTitle,
            signedAt,
            dashboardUrl: clientSignUrl,
            toFreelancer: false,
          }),
        })
        console.log('[sign] Client email sent to:', session.signerEmail)
      } catch (err) {
        console.error('[sign] Client email failed:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
      }
    } else {
      console.error('[sign] signerEmail is empty — client confirmation skipped')
    }

    // Email to freelancer
    if (freelancerEmail) {
      const freelancerDashUrl = `${appUrl}/contracts/${session.contractId}`
      try {
        await sendEmail({
          to: freelancerEmail,
          subject: `✅ ${signerName.trim()} signed ${session.contractTitle}`,
          html: contractSignedEmail({
            signerName: signerName.trim(),
            contractTitle: session.contractTitle,
            signedAt,
            dashboardUrl: freelancerDashUrl,
            toFreelancer: true,
          }),
        })
        console.log('[sign] Freelancer email sent to:', freelancerEmail)
      } catch (err) {
        console.error('[sign] Freelancer email failed:', JSON.stringify(err, Object.getOwnPropertyNames(err)))
      }
    } else {
      console.warn('[sign] No freelancer email found for contract:', session.contractId)
    }

    // Generate signed PDF and upload to R2 (non-blocking)
    ;(async () => {
      try {
        const rawContent = session.contractContent ?? session.contractTitle

        // Resolve template variables before passing to PDF
        const resolveValues: Record<string, string> = {
          client_name: session.clientName,
          client_company: session.clientCompany ?? '',
          client_email: session.clientEmail ?? '',
          freelancer_name: profileRow?.full_name ?? session.freelancerName,
          freelancer_business: profileRow?.business_name ?? session.freelancerBusiness ?? '',
          project_description: session.projectDescription ?? '',
          rate: String(session.amount),
          currency: session.currency,
          start_date: session.startDate ?? '',
          end_date: session.endDate ?? '',
          payment_terms: session.paymentTerms ?? '',
        }
        let content = rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        for (const [key, value] of Object.entries(resolveValues)) {
          content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
        }

        const documentHash = createHash('sha256')
          .update(`${session.contractId}:${content}:${signedAt}`)
          .digest('hex')

        const element = React.createElement(ContractPDF, {
          contractTitle: session.contractTitle,
          contractContent: content,
          contractId: session.contractId,
          freelancerName: profileRow?.full_name ?? session.freelancerName,
          freelancerBusiness: profileRow?.business_name ?? session.freelancerBusiness ?? null,
          freelancerLogo: profileRow?.business_logo ?? null,
          clientName: session.clientName,
          clientEmail: session.clientEmail ?? null,
          amount: session.amount,
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
