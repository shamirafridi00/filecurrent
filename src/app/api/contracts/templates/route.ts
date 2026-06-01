import { NextRequest, NextResponse } from 'next/server'
import { createContractTemplate } from '@/lib/db/sqlite'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, description, content, isDefault } = body
  if (!name || !content) return NextResponse.json({ error: 'name and content required' }, { status: 400 })
  const id = createContractTemplate('local-user', { name, description, content, isDefault })
  return NextResponse.json({ id })
}
