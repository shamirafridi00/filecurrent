import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createIntakeForm } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.title?.trim()) return NextResponse.json({ error: 'Title required' }, { status: 400 })
  const id = await createIntakeForm(user.id, body)
  return NextResponse.json({ id }, { status: 201 })
}
