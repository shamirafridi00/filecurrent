import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createInvoiceTemplate } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, ...rest } = body
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  const id = await createInvoiceTemplate(user.id, { name, ...rest })
  return NextResponse.json({ id })
}
