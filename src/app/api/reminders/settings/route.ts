import { NextRequest, NextResponse } from 'next/server'
import { saveReminderSettings } from '@/lib/db/sqlite'

export async function POST(req: NextRequest) {
  const body = await req.json()
  saveReminderSettings('local-user', body)
  return NextResponse.json({ ok: true })
}
