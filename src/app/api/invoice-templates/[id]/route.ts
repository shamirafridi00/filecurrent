import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateInvoiceTemplate, deleteInvoiceTemplate } from '@/lib/db/supabase'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, ...rest } = body
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  await updateInvoiceTemplate(params.id, user.id, { name, ...rest })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await deleteInvoiceTemplate(params.id, user.id)
  return NextResponse.json({ ok: true })
}
