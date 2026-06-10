import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTimeEntries, createTimeEntry } from '@/lib/db/supabase'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const entries = await getTimeEntries(user.id)
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.description || !body.date || !body.durationMinutes || body.durationMinutes <= 0)
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  const id = await createTimeEntry(user.id, body)
  return NextResponse.json({ id }, { status: 201 })
}
