import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, phone, company, address, notes } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const id = await createClient(user.id, { name, email, phone, company, address, notes })
  return NextResponse.json({ id })
}
