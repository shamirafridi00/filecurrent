import { NextRequest, NextResponse } from 'next/server'
import { updateClient, deleteClient } from '@/lib/db/sqlite'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { name, email, phone, company, address, notes } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  updateClient(params.id, 'local-user', { name, email, phone, company, address, notes })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    deleteClient(params.id, 'local-user')
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Cannot delete — client has linked records' }, { status: 409 })
  }
}
