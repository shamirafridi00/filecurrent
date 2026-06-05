export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getContract } from '@/lib/db/supabase'
import { slugifyTitle } from '@/lib/utils'

/**
 * Redirects to the slug-form URL so browsers use the contract title as the
 * filename when the user saves the PDF from the viewer tab.
 * The actual PDF is served by [...slug]/route.ts.
 */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const contract = await getContract(params.id, user.id)
  if (!contract) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const filename = `${slugifyTitle(contract.title)}_signed.pdf`
  return NextResponse.redirect(
    new URL(`/api/contracts/${params.id}/pdf/${filename}`, _req.url),
    { status: 302 }
  )
}
