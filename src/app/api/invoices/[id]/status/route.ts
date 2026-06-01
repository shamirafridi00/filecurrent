import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateInvoiceStatus } from '@/lib/db/supabase'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()
  if (!status) return NextResponse.json({ error: 'status required' }, { status: 400 })

  await updateInvoiceStatus(params.id, user.id, status)
  return NextResponse.json({ ok: true })
}
