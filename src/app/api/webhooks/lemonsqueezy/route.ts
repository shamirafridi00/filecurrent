import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-signature') ?? ''
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET ?? ''

  // Verify signature
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex')
  if (signature !== expected) {
    console.warn('Lemon Squeezy webhook: invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody) as {
    meta: { event_name: string; custom_data?: { user_id?: string } }
    data: {
      attributes: {
        customer_id: number
        variant_name?: string
        renews_at?: string
        ends_at?: string
      }
    }
  }

  const eventName = event.meta.event_name
  const userId = event.meta.custom_data?.user_id
  const customerId = String(event.data.attributes.customer_id)

  if (!userId) {
    console.error('Lemon Squeezy webhook: no user_id in custom_data')
    return NextResponse.json({ error: 'No user_id' }, { status: 400 })
  }

  switch (eventName) {
    case 'order_created': {
      // One-time purchase = Lifetime deal
      await adminClient
        .from('profiles')
        .update({
          plan: 'lifetime',
          plan_expires_at: null,
          lemon_squeezy_customer_id: customerId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
      break
    }

    case 'subscription_created':
    case 'subscription_renewed': {
      const variantName = event.data.attributes.variant_name ?? ''
      const plan = variantName.toLowerCase().includes('annual') ? 'pro_annual' : 'pro_monthly'
      const renewsAt = event.data.attributes.renews_at ?? null

      await adminClient
        .from('profiles')
        .update({
          plan,
          plan_expires_at: renewsAt,
          lemon_squeezy_customer_id: customerId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
      break
    }

    case 'subscription_cancelled':
    case 'subscription_expired': {
      await adminClient
        .from('profiles')
        .update({
          plan: 'free',
          plan_expires_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
      break
    }

    default:
      // Ignore unhandled events
      break
  }

  return NextResponse.json({ received: true })
}
