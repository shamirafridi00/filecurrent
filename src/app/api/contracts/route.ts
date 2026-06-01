import { NextRequest, NextResponse } from 'next/server'
import { createContract, checkDocLimit } from '@/lib/db/sqlite'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clientId, templateId, title, projectDescription, amount, currency, paymentTerms, startDate, endDate, additionalTerms } = body
  if (!clientId || !templateId || !title) {
    return NextResponse.json({ error: 'clientId, templateId, title required' }, { status: 400 })
  }
  const limit = checkDocLimit('local-user')
  if (!limit.allowed) {
    return NextResponse.json({ error: 'doc_limit_reached', used: limit.used, limit: limit.limit }, { status: 402 })
  }
  const id = createContract('local-user', {
    clientId, templateId, title, projectDescription, amount: Number(amount), currency,
    paymentTerms, startDate, endDate, additionalTerms,
  })
  return NextResponse.json({ id })
}
