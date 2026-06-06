import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { setInvoiceRecurring } from '@/lib/db/supabase'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { isRecurring, interval, nextDate, endDate } = body

  await setInvoiceRecurring(params.id, user.id, {
    isRecurring: Boolean(isRecurring),
    interval: interval ?? null,
    nextDate: nextDate ?? null,
    endDate: endDate ?? null,
  })
  return NextResponse.json({ ok: true })
}
