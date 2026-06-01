import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifyCronSecret } from '@/lib/cron'

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const now = new Date()
  // Only reset profiles whose docs_reset_at is from a previous month
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const { error, count } = await adminClient
    .from('profiles')
    .update({
      docs_used_this_month: 0,
      docs_reset_at: now.toISOString(),
    })
    .lt('docs_reset_at', startOfThisMonth)

  if (error) {
    console.error('Monthly doc reset failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    reset: true,
    profilesReset: count ?? 0,
    timestamp: now.toISOString(),
  })
}
