import { NextRequest, NextResponse } from 'next/server'
import { createSigningSession } from '@/lib/db/sqlite'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { signerEmail } = await req.json()
  if (!signerEmail) return NextResponse.json({ error: 'signerEmail required' }, { status: 400 })
  const token = createSigningSession(params.id, signerEmail)
  return NextResponse.json({ token })
}
