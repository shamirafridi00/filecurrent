import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { getInvoice } from '@/lib/db/supabase'
import { sendEmail } from '@/lib/email'
import { paymentReminderEmail } from '@/lib/email/templates/payment-reminder'

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const invoice = await getInvoice(params.id, user.id)
  if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })

  if (!invoice.clientEmail) {
    return NextResponse.json({ error: 'Client has no email address' }, { status: 422 })
  }
  if (invoice.status === 'paid') {
    return NextResponse.json({ error: 'Invoice is already paid' }, { status: 422 })
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name, business_name')
    .eq('id', user.id)
    .single()

  const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/i/${invoice.shareToken}`
  const dueDate = invoice.dueDate
    ? new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'N/A'
  const balance = invoice.total - invoice.paidAmount

  try {
    await sendEmail({
      to: invoice.clientEmail,
      subject: `Reminder: Invoice ${invoice.invoiceNumber} — ${fmt(balance, invoice.currency)}`,
      html: paymentReminderEmail({
        clientName: invoice.clientName,
        freelancerName: profile?.full_name ?? 'Your service provider',
        businessName: profile?.business_name ?? null,
        invoiceNumber: invoice.invoiceNumber,
        amount: fmt(balance, invoice.currency),
        dueDate,
        daysOverdue: 0,
        invoiceUrl,
        shareToken: invoice.shareToken,
        stage: 'overdue',
      }),
    })

    await adminClient.from('reminder_logs').insert({
      invoice_id: invoice.id,
      user_id: user.id,
      client_id: invoice.clientId ?? null,
      recipient_email: invoice.clientEmail,
      trigger_type: 'manual',
      template_key: 'overdue',
      status: 'sent',
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    await adminClient.from('reminder_logs').insert({
      invoice_id: invoice.id,
      user_id: user.id,
      client_id: invoice.clientId ?? null,
      recipient_email: invoice.clientEmail,
      trigger_type: 'manual',
      template_key: 'overdue',
      status: 'failed',
      sent_at: new Date().toISOString(),
    })

    return NextResponse.json({ error: message }, { status: 500 })
  }
}
