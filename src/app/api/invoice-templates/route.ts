import { NextRequest, NextResponse } from 'next/server'
import { createInvoiceTemplate } from '@/lib/db/sqlite'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, ...rest } = body
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  const id = createInvoiceTemplate('local-user', { name, ...rest })
  return NextResponse.json({ id })
}
