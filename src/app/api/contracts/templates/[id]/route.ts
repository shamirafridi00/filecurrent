import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateContractTemplate, deleteContractTemplate } from '@/lib/db/supabase'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, content, isDefault } = body
  if (!name || !content) return NextResponse.json({ error: 'name and content required' }, { status: 400 })

  await updateContractTemplate(params.id, user.id, { name, description, content, isDefault })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await deleteContractTemplate(params.id, user.id)
  return NextResponse.json({ ok: true })
}
