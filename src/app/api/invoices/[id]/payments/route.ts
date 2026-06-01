import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { recordPayment } from '@/lib/db/supabase'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { amount, paymentDate, method, notes } = await req.json()
  if (!amount || !paymentDate || !method) {
    return NextResponse.json({ error: 'amount, paymentDate, method required' }, { status: 400 })
  }

  const id = await recordPayment(params.id, { amount, paymentDate, method, notes })
  return NextResponse.json({ id })
}
