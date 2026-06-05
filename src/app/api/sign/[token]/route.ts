import { NextRequest, NextResponse } from 'next/server'
import { waitUntil } from '@vercel/functions'
import { submitContractSignature, getContractForSigning } from '@/lib/db/supabase'
import { stripMarkdown } from '@/lib/utils'
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

  console.log('[sign] 1 — fetching signing session for token:', params.token)
  let session = null
  try {
    session = await getContractForSigning(params.token)
    console.log('[sign] 2 — session fetched:', session ? `contractId=${session.contractId}` : 'NULL — token not found')
  } catch (err) {
    console.error('[sign] 2 — getContractForSigning CRASHED:', String(err))
  }

  try {
    await submitContractSignature(params.token, signerName.trim(), ip)
    console.log('[sign] 3 — signature submitted')
  } catch (err) {
    console.error('[sign] 3 — submitContractSignature failed:', String(err))
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Signing failed' },
      { status: 400 }
    )
  }

  // Fallback: if pre-fetch failed or returned null, try again now that signing succeeded
  if (!session) {
    try {
      session = await getContractForSigning(params.token)
      console.log('[sign] 3b — fallback session fetch:', session ? `contractId=${session.contractId}` : 'still null')
    } catch (err) {
      console.error('[sign] 3b — fallback getContractForSigning CRASHED:', String(err))
    }
  }

  if (session) {
    const signedAt = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    })
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://filecurrent.com'

    console.log('[sign] 4 — fetching freelancer profile for contractId:', session.contractId)
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
    console.log('[sign] 5 — freelancerEmail:', freelancerEmail ?? 'none')

    // Client confirmation email
    const clientSignUrl = `${appUrl}/sign/${params.token}`
    console.log('[sign] 6 — sending client email to:', session.signerEmail)
    try {
      const result = await sendEmail({
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
      console.log('[sign] 7 — client email sent, messageId:', result?.messageId)
    } catch (err: unknown) {
      console.error('[sign] 7 — CLIENT EMAIL FAILED to:', session.signerEmail,
        '| error:', String(err),
        '| detail:', JSON.stringify(err, Object.getOwnPropertyNames(err instanceof Error ? err : Object(err))))
    }

    // Freelancer notification email
    if (freelancerEmail) {
      const freelancerDashUrl = `${appUrl}/contracts/${session.contractId}`
      console.log('[sign] 8 — sending freelancer email to:', freelancerEmail)
      try {
        const result = await sendEmail({
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
        console.log('[sign] 9 — freelancer email sent, messageId:', result?.messageId)
      } catch (err: unknown) {
        console.error('[sign] 9 — FREELANCER EMAIL FAILED to:', freelancerEmail,
          '| error:', String(err),
          '| detail:', JSON.stringify(err, Object.getOwnPropertyNames(err instanceof Error ? err : Object(err))))
      }
    } else {
      console.warn('[sign] 8 — no freelancer email found for contract:', session.contractId)
    }

    console.log('[sign] 10 — emails done, queuing PDF generation')

    // PDF generation runs after response is sent — waitUntil keeps the function alive
    waitUntil((async () => {
      try {
        const rawContent = session.contractContent ?? session.contractTitle

        const resolveValues: Record<string, string> = {
          client_name: session.clientName,
          client_company: session.clientCompany ?? '',
          client_email: session.clientEmail ?? '',
          freelancer_name: profileRow?.full_name ?? session.freelancerName,
          freelancer_business: profileRow?.business_name ?? session.freelancerBusiness ?? '',
          project_description: stripMarkdown(session.projectDescription ?? ''),
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

        console.log('[sign] PDF uploaded:', url)
      } catch (err) {
        console.error('[sign] PDF generation/upload error:', err)
      }
    })())
  }

  return NextResponse.json({ success: true })
}
