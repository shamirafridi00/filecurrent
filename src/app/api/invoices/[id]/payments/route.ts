import { NextRequest, NextResponse } from 'next/server'
import { recordPayment } from '@/lib/db/sqlite'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { amount, paymentDate, method, notes } = await req.json()
  if (!amount || !paymentDate || !method) {
    return NextResponse.json({ error: 'amount, paymentDate, method required' }, { status: 400 })
  }
  const id = recordPayment(params.id, { amount, paymentDate, method, notes })
  return NextResponse.json({ id })
}
