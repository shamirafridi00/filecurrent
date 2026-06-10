import { NextRequest, NextResponse } from 'next/server'
import { getIntakeFormByToken, submitIntakeResponse } from '@/lib/db/supabase'

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const form = await getIntakeFormByToken(params.token)
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })
  const body = await req.json()
  if (!body.respondentName?.trim())
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  const result = await submitIntakeResponse({
    formId: form.id,
    userId: form.userId,
    respondentName: body.respondentName,
    respondentEmail: body.respondentEmail ?? '',
    answers: body.answers ?? {},
    createClient: body.createClient ?? true,
  })
  return NextResponse.json(result, { status: 201 })
}
