export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Must be an image file' }, { status: 400 })
  }
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json({ error: 'Image must be under 2MB' }, { status: 400 })
  }

  const ext = file.name.split('.').pop() ?? 'png'
  const path = `logos/${user.id}.${ext}`
  const bytes = await file.arrayBuffer()

  const { error } = await adminClient.storage
    .from('business-assets')
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = adminClient.storage
    .from('business-assets')
    .getPublicUrl(path)

  await adminClient.from('profiles')
    .update({ business_logo: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  return NextResponse.json({ url: publicUrl })
}
