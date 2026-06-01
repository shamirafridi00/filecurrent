import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createCheckoutUrl, type PlanKey } from '@/lib/lemonsqueezy'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json() as { plan: PlanKey }
  if (!plan || !['monthly', 'annual', 'lifetime'].includes(plan)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  try {
    const url = await createCheckoutUrl(plan, user.email!, user.id)
    return NextResponse.json({ url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
