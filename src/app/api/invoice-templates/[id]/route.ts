import { NextRequest, NextResponse } from 'next/server'
import { updateInvoiceTemplate, deleteInvoiceTemplate } from '@/lib/db/sqlite'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const { name, ...rest } = body
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  updateInvoiceTemplate(params.id, 'local-user', { name, ...rest })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  deleteInvoiceTemplate(params.id, 'local-user')
  return NextResponse.json({ ok: true })
}
