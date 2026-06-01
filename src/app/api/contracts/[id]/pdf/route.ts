export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import React, { type JSXElementConstructor, type ReactElement } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getContract, getCurrentProfile } from '@/lib/db/supabase'
import { adminClient } from '@/lib/supabase/admin'
import { ContractPDF } from '@/lib/pdf/ContractPDF'
import { createHash } from 'crypto'

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

  const content = contract.templateContent ?? `${contract.title}\n\n(Contract content not available)`
  const documentHash = createHash('sha256')
    .update(`${params.id}:${content}:${contract.signedAt ?? ''}`)
    .digest('hex')

  const signedAt = contract.signedAt
    ? new Date(contract.signedAt).toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
      })
    : 'Unknown'

  const amount = new Intl.NumberFormat('en-US', {
    style: 'currency', currency: contract.currency,
  }).format(contract.amount)

  const element = React.createElement(ContractPDF, {
    contractTitle: contract.title,
    contractContent: content,
    contractId: params.id,
    freelancerName: profile.fullName,
    freelancerBusiness: profile.businessName,
    clientName: contract.clientName,
    clientEmail: contract.clientEmail,
    amount,
    currency: contract.currency,
    startDate: contract.startDate,
    endDate: contract.endDate,
    paymentTerms: contract.paymentTerms,
    signerName: auditEvents.find(e => e.eventType === 'signed')?.signerName ?? contract.clientName,
    signedAt,
    auditEvents,
    documentHash,
  }) as ReactElement<DocumentProps, string | JSXElementConstructor<unknown>>

  const buffer = await renderToBuffer(element)

  const safeTitle = contract.title.replace(/[^a-z0-9]/gi, '-').slice(0, 50)

  return new NextResponse(new Uint8Array(buffer as unknown as ArrayBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeTitle}-signed.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
