import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getExpenses, createExpense } from '@/lib/db/supabase'

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const expenses = await getExpenses(user.id)
  return NextResponse.json(expenses)
}

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { date, description, amount, category, notes } = body

  if (!date || !description || !amount || !category) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (Number(amount) <= 0) {
    return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 })
  }

  const id = await createExpense(user.id, { date, description, amount: Number(amount), category, notes })
  return NextResponse.json({ id }, { status: 201 })
}
