import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { getIntakeFormById } from '@/lib/db/supabase'
import { sendEmail, buildSenderName } from '@/lib/email'
import { intakeFormEmail } from '@/lib/email/templates/intake-form'
import { APP_URL } from '@/lib/constants'

/**
 * Send an intake form to a client by email.
 * Body: { clientId?: string, email?: string, name?: string }
 * If clientId is given, the recipient name/email are pulled from that client.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await getIntakeFormById(params.id, user.id)
  if (!form) return NextResponse.json({ error: 'Form not found' }, { status: 404 })

  const body = await req.json().catch(() => ({}))
  let toEmail: string | null = typeof body.email === 'string' ? body.email.trim() : null
  let toName = typeof body.name === 'string' ? body.name.trim() : ''

  // Prefer a saved client — pull their email/name server-side.
  if (body.clientId) {
    const { data: client } = await adminClient
      .from('clients')
      .select('name, email')
      .eq('id', body.clientId)
      .eq('user_id', user.id)
      .single()
    if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    toEmail = client.email
    toName = client.name
  }

  if (!toEmail) {
    return NextResponse.json({ error: 'This client has no email address. Add one first.' }, { status: 422 })
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name, business_name, email')
    .eq('id', user.id)
    .single()

  const freelancerName = profile?.full_name ?? 'Your service provider'
  const freelancerBusiness = profile?.business_name ?? null

  try {
    await sendEmail({
      to: toEmail,
      subject: `${freelancerBusiness ?? freelancerName} sent you a form: ${form.title}`,
      html: intakeFormEmail({
        clientName: toName || 'there',
        freelancerName,
        freelancerBusiness,
        formTitle: form.title,
        formDescription: form.description,
        formUrl: `${APP_URL}/intake/${form.shareToken}`,
      }),
      replyTo: profile?.email,
      fromName: buildSenderName(freelancerBusiness, freelancerName),
    })
  } catch (err) {
    console.error('Intake form send failed:', err)
    return NextResponse.json({ error: 'Could not send the form. Please try again.' }, { status: 502 })
  }

  return NextResponse.json({ success: true })
}
