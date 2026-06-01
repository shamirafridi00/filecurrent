import { NextRequest, NextResponse } from 'next/server'
import { updateContractTemplate, deleteContractTemplate } from '@/lib/db/sqlite'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { name, description, content, isDefault } = body
  if (!name || !content) return NextResponse.json({ error: 'name and content required' }, { status: 400 })
  updateContractTemplate(params.id, 'local-user', { name, description, content, isDefault })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  deleteContractTemplate(params.id, 'local-user')
  return NextResponse.json({ ok: true })
}
