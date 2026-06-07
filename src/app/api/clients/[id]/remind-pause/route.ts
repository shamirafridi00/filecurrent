import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { toggleClientRemindersPaused } from '@/lib/db/supabase'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { paused } = await req.json() as { paused: boolean }
  await toggleClientRemindersPaused(params.id, user.id, paused)
  return NextResponse.json({ ok: true })
}
