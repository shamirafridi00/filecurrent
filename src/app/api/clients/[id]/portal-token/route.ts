import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getClientPortalToken, regeneratePortalToken } from '@/lib/db/supabase'
import { extractToken } from '@/lib/slug'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = await getClientPortalToken(extractToken(params.id), user.id)
  if (!token) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ token })
}

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const token = await regeneratePortalToken(extractToken(params.id), user.id)
  return NextResponse.json({ token })
}
