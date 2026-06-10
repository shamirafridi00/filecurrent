import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUnbilledTimeEntries } from '@/lib/db/supabase'

export async function GET(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const clientId = req.nextUrl.searchParams.get('clientId') ?? undefined
  const entries = await getUnbilledTimeEntries(user.id, clientId)
  return NextResponse.json(entries)
}
