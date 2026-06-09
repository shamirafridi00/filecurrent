import { NextRequest, NextResponse } from 'next/server'
import { declineProposal } from '@/lib/db/supabase'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const success = await declineProposal(params.id)
  if (!success) return NextResponse.json({ error: 'Not found or already responded' }, { status: 404 })
  return NextResponse.json({ success: true })
}
