import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail, buildSenderName } from '@/lib/email'
import { clientPortalEmail } from '@/lib/email/templates/client-portal'
import { APP_URL } from '@/lib/constants'
import { withSlug, extractToken } from '@/lib/slug'

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: client, error: clientErr } = await adminClient
    .from('clients')
    .select('id, name, email, portal_token')
    .eq('id', extractToken(params.id))
    .eq('user_id', user.id)
    .single()

  if (clientErr || !client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  if (!client.email) return NextResponse.json({ error: 'Client has no email address' }, { status: 422 })
  if (!client.portal_token) return NextResponse.json({ error: 'Portal token missing' }, { status: 422 })

  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name, business_name, email')
    .eq('id', user.id)
    .single()

  const freelancerName = profile?.full_name ?? 'Your service provider'
  const freelancerBusiness = profile?.business_name ?? null
  const portalUrl = `${APP_URL}/portal/${withSlug(client.name, client.portal_token)}`

  await sendEmail({
    to: client.email,
    subject: `Your client portal from ${freelancerBusiness ?? freelancerName}`,
    html: clientPortalEmail({
      clientName: client.name,
      freelancerName,
      freelancerBusiness,
      portalUrl,
    }),
    replyTo: profile?.email,
    fromName: buildSenderName(freelancerBusiness, freelancerName),
  })

  return NextResponse.json({ success: true })
}
