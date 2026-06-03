export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import React from 'react'
import { createClient } from '@/lib/supabase/server'
import { getInvoice, getCurrentProfile } from '@/lib/db/supabase'
import { InvoicePDF } from '@/lib/pdf/InvoicePDF'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [invoice, profile] = await Promise.all([
    getInvoice(params.id, user.id),
    getCurrentProfile(user.id),
  ])

  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const isPro = profile.plan !== 'free'

  const element = React.createElement(InvoicePDF, {
    invoice,
    template: invoice.template,
    freelancerName: profile.businessName || profile.fullName,
    isPro,
  })

  const buffer = await renderToBuffer(element as React.ReactElement<DocumentProps>)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="Invoice-${invoice.invoiceNumber}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
