import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateClient, deleteClient } from '@/lib/db/supabase'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name, email, phone, company, address, notes } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })

  await updateClient(params.id, user.id, { name, email, phone, company, address, notes })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await deleteClient(params.id, user.id)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Cannot delete — client has linked records' }, { status: 409 })
  }
}
