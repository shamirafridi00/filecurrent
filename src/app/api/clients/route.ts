import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/db/sqlite'

export async function POST(req: NextRequest) {
  const { name, email, phone, company, address, notes } = await req.json()
  if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
  const id = createClient('local-user', { name, email, phone, company, address, notes })
  return NextResponse.json({ id })
}
