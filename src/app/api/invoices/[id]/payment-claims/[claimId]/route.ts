import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { confirmPaymentClaim, rejectPaymentClaim } from '@/lib/db/supabase'

/**
 * Freelancer reviews a client-submitted payment claim.
 * Body: { action: 'confirm' | 'reject' }
 * Confirm → creates a real payment + recomputes invoice totals.
 * Reject  → marks the claim rejected (payment never arrived, etc.).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; claimId: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action } = await req.json().catch(() => ({ action: undefined }))

  if (action === 'confirm') {
    const result = await confirmPaymentClaim(params.claimId, user.id)
    if (!result) {
      return NextResponse.json({ error: 'Claim not found or already reviewed.' }, { status: 404 })
    }
    return NextResponse.json({ ok: true, paymentId: result.paymentId })
  }

  if (action === 'reject') {
    const ok = await rejectPaymentClaim(params.claimId, user.id)
    if (!ok) {
      return NextResponse.json({ error: 'Claim not found or already reviewed.' }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: 'action must be "confirm" or "reject".' }, { status: 400 })
}
