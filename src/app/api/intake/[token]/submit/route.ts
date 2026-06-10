import { NextRequest, NextResponse } from 'next/server'
import { getIntakeFormByToken, submitIntakeResponse } from '@/lib/db/supabase'

// Public endpoint — no auth by design. Token lookup gates all work; inputs
// are trimmed and bounded so a hostile client can't store unbounded data.
const MAX_ANSWER_LENGTH = 10_000
const MAX_ANSWERS = 100
const MAX_NAME_LENGTH = 200
const MAX_EMAIL_LENGTH = 320

function sanitizeAnswers(raw: unknown): Record<string, string | boolean | string[]> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return {}
  const out: Record<string, string | boolean | string[]> = {}
  let count = 0
  for (const [key, value] of Object.entries(raw)) {
    if (count >= MAX_ANSWERS) break
    const safeKey = String(key).slice(0, 200)
    if (typeof value === 'boolean') {
      out[safeKey] = value
    } else if (typeof value === 'string') {
      out[safeKey] = value.trim().slice(0, MAX_ANSWER_LENGTH)
    } else if (Array.isArray(value)) {
      out[safeKey] = value
        .filter((v): v is string => typeof v === 'string')
        .slice(0, 50)
        .map((v) => v.trim().slice(0, MAX_ANSWER_LENGTH))
    }
    count++
  }
  return out
}

export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  // Validate the token before doing any other work.
  const form = await getIntakeFormByToken(params.token)
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const respondentName = typeof body.respondentName === 'string'
    ? body.respondentName.trim().slice(0, MAX_NAME_LENGTH)
    : ''
  if (!respondentName) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  }

  const respondentEmail = typeof body.respondentEmail === 'string'
    ? body.respondentEmail.trim().slice(0, MAX_EMAIL_LENGTH)
    : ''

  const result = await submitIntakeResponse({
    formId: form.id,
    // Always the form owner — never derived from the public request.
    userId: form.userId,
    respondentName,
    respondentEmail,
    answers: sanitizeAnswers(body.answers),
    createClient: body.createClient !== false,
  })
  return NextResponse.json({ responseId: result.responseId }, { status: 201 })
}
