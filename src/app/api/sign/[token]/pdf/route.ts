export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { slugifyTitle } from '@/lib/utils'
import { extractToken } from '@/lib/slug'

/**
 * Public download of the signed contract PDF, scoped by the unguessable
 * signing token. Lets the client keep a copy of the executed agreement from
 * the read-only signed view (the dashboard PDF route requires freelancer auth).
 */
export async function GET(_req: NextRequest, { params }: { params: { token: string } }) {
  const { data: session } = await adminClient
    .from('signing_sessions')
    .select('contract_id, status, contracts(title, signed_pdf_url, status)')
    .eq('unique_token', extractToken(params.token))
    .single()

  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const contract = session.contracts as unknown as {
    title: string; signed_pdf_url: string | null; status: string
  } | null
  if (!contract || contract.status !== 'signed') {
    return NextResponse.json({ error: 'Contract is not signed yet' }, { status: 400 })
  }
  if (!contract.signed_pdf_url) {
    return NextResponse.json(
      { error: 'The signed PDF is still being prepared. Try again in a minute.' },
      { status: 503 }
    )
  }

  const r2Res = await fetch(contract.signed_pdf_url)
  if (!r2Res.ok) return NextResponse.json({ error: 'PDF not available' }, { status: 502 })
  const buffer = await r2Res.arrayBuffer()

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${slugifyTitle(contract.title)}_signed.pdf"`,
      'Cache-Control': 'private, max-age=300',
    },
  })
}
