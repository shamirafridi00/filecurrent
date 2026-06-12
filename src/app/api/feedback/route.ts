import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

const VALID_TYPES = ['bug', 'feature', 'general', 'other']
const MAX_LENGTH = 2000
const MIN_LENGTH = 10
const DAILY_LIMIT = 3

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const type = VALID_TYPES.includes(body.type) ? body.type : null
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!type) return NextResponse.json({ error: 'Choose a feedback type.' }, { status: 400 })
  if (message.length < MIN_LENGTH) {
    return NextResponse.json({ error: `Message must be at least ${MIN_LENGTH} characters.` }, { status: 400 })
  }
  if (message.length > MAX_LENGTH) {
    return NextResponse.json({ error: `Message must be under ${MAX_LENGTH} characters.` }, { status: 400 })
  }

  // Rate limit: 3 submissions per day per user
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count } = await adminClient
    .from('feedback')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', dayAgo)
  if ((count ?? 0) >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: `You can submit up to ${DAILY_LIMIT} feedback messages per day. Try again tomorrow.` },
      { status: 429 }
    )
  }

  const { error } = await adminClient
    .from('feedback')
    .insert({ user_id: user.id, type, message })
  if (error) {
    console.error('[feedback] insert failed:', error)
    return NextResponse.json({ error: 'Could not save your feedback. Please try again.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
