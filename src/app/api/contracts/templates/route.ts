import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createContractTemplate } from '@/lib/db/supabase'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { name, description, content, isDefault } = body
  if (!name || !content) return NextResponse.json({ error: 'name and content required' }, { status: 400 })

  const id = await createContractTemplate(user.id, { name, description, content, isDefault })
  return NextResponse.json({ id })
}
