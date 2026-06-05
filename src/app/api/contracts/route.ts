import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createContract, checkDocLimit } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { clientId, templateId, title, projectDescription, amount, currency, paymentTerms, startDate, endDate, additionalTerms, nicheContent } = body

  if (!clientId || !templateId || !title) {
    return NextResponse.json({ error: 'clientId, templateId, title required' }, { status: 400 })
  }

  const limit = await checkDocLimit(user.id)
  if (!limit.allowed) {
    return NextResponse.json({ error: limit.reason ?? 'upgrade_required' }, { status: 402 })
  }

  const id = await createContract(user.id, {
    clientId, templateId, title, projectDescription, amount: Number(amount), currency,
    paymentTerms, startDate, endDate, additionalTerms, nicheContent,
  })
  return NextResponse.json({ id })
}
