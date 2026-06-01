import { NextRequest, NextResponse } from 'next/server'
import { updateInvoiceStatus } from '@/lib/db/sqlite'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status } = await req.json()
  if (!status) return NextResponse.json({ error: 'status required' }, { status: 400 })
  updateInvoiceStatus(params.id, 'local-user', status)
  return NextResponse.json({ ok: true })
}
