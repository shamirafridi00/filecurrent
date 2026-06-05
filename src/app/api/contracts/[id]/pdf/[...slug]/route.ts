export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getContract, getCurrentProfile } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { ContractPDF } from '@/lib/pdf/ContractPDF'
import { createHash } from 'crypto'
import { slugifyTitle, stripMarkdown } from '@/lib/utils'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [contract, profile] = await Promise.all([
    getContract(params.id, user.id),
    getCurrentProfile(user.id),
  ])

  if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (contract.status !== 'signed') {
    return NextResponse.json({ error: 'Contract is not signed yet' }, { status: 400 })
  }

  const filename = `${slugifyTitle(contract.title)}_signed.pdf`

  // Fast path: proxy the pre-generated PDF
  if (contract.signedPdfUrl) {
    const r2Res = await fetch(contract.signedPdfUrl)
    if (!r2Res.ok) return NextResponse.json({ error: 'PDF not available' }, { status: 502 })
    const buffer = await r2Res.arrayBuffer()
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'private, max-age=300',
      },
    })
  }

  const { data: auditRows } = await adminClient
    .from('audit_events')
    .select('event_type, signer_name, signer_email, ip_address, timestamp')
    .eq('contract_id', params.id)
    .order('timestamp')

  const auditEvents = (auditRows ?? []).map((e) => ({
    eventType: e.event_type,
    signerName: e.signer_name,
    signerEmail: e.signer_email,
    ipAddress: e.ip_address,
    timestamp: new Date(e.timestamp).toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
    }),
  }))

  const rawContent = contract.templateContent ?? `${contract.title}\n\n(Contract content not available)`

  const resolveValues: Record<string, string> = {
    client_name: contract.clientName,
    client_company: contract.clientCompany ?? '',
    client_email: contract.clientEmail ?? '',
    freelancer_name: profile.fullName,
    freelancer_business: profile.businessName ?? '',
    project_description: stripMarkdown(contract.projectDescription ?? ''),
    rate: String(contract.amount),
    currency: contract.currency,
    start_date: contract.startDate ?? '',
    end_date: contract.endDate ?? '',
    payment_terms: contract.paymentTerms ?? '',
  }
  let content = rawContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  for (const [key, value] of Object.entries(resolveValues)) {
    content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
  }

  const documentHash = createHash('sha256')
    .update(`${params.id}:${content}:${contract.signedAt ?? ''}`)
    .digest('hex')

  const signedAt = contract.signedAt
    ? new Date(contract.signedAt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
      })
    : 'Unknown'

  const element = React.createElement(ContractPDF, {
    contractTitle: contract.title,
    contractContent: content,
    contractId: params.id,
    freelancerName: profile.fullName,
    freelancerBusiness: profile.businessName,
    freelancerLogo: profile.businessLogo,
    clientName: contract.clientName,
    clientEmail: contract.clientEmail,
    amount: contract.amount,
    currency: contract.currency,
    startDate: contract.startDate,
    endDate: contract.endDate,
    paymentTerms: contract.paymentTerms,
    signerName: auditEvents.find(e => e.eventType === 'signed')?.signerName ?? contract.clientName,
    signedAt,
    auditEvents,
    documentHash,
  })

  let buffer: Buffer
  try {
    buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>)
  } catch (err) {
    console.error('Contract PDF render error:', err)
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 })
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
