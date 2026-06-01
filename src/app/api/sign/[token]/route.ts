import { NextRequest, NextResponse } from 'next/server'
import { submitContractSignature } from '@/lib/db/sqlite'

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const { signerName } = await req.json()
  if (!signerName?.trim()) {
    return NextResponse.json({ error: 'signerName is required' }, { status: 400 })
  }

  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  try {
    submitContractSignature(params.token, signerName.trim(), ip)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Signing failed' },
      { status: 400 }
    )
  }
}
