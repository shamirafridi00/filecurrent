import { NextRequest, NextResponse } from 'next/server'
import { updateProfile } from '@/lib/db/sqlite'

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  updateProfile('local-user', body)
  return NextResponse.json({ ok: true })
}
