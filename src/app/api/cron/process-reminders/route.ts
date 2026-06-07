import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'
import { sendEmail } from '@/lib/email'
import { paymentReminderEmail } from '@/lib/email/templates/payment-reminder'
import { verifyCronSecret } from '@/lib/cron'

function fmt(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount)
}

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let processed = 0
  let sent = 0
  let skipped = 0
  const errors: string[] = []

  // Fetch all users with reminders enabled
  const { data: settingsRows } = await adminClient
    .from('reminder_settings')
    .select('user_id, enabled, days_before, send_on_due_date, days_after_overdue, auto_stop_on_paid, allow_unsubscribe, skip_below_balance')
    .eq('enabled', true)

  for (const settings of settingsRows ?? []) {
    const userId = settings.user_id as string

    // Get profile for freelancer name/business
    const { data: profile } = await adminClient
      .from('profiles')
      .select('full_name, business_name, plan, email')
      .eq('id', userId)
      .single()

    if (!profile) continue

    // Only send reminders for Pro users (free users don't get automated reminders)
    if (profile.plan === 'free') continue

    // Get all open invoices for this user
    const { data: invoices } = await adminClient
      .from('invoices')
      .select('id, invoice_number, total, paid_amount, currency, status, due_date, share_token, client_id, reminders_paused, clients!inner(name, email, reminders_paused)')
      .eq('user_id', userId)
      .in('status', ['sent', 'partial'])
      .not('due_date', 'is', null)

    for (const invoice of invoices ?? []) {
      processed++

      const client = invoice.clients as unknown as { name: string; email: string | null; reminders_paused: boolean }
      if (!client.email) { skipped++; continue }

      const balance = (invoice.total ?? 0) - (invoice.paid_amount ?? 0)
      const skipThreshold = settings.skip_below_balance ?? 10

      if (balance <= skipThreshold) { skipped++; continue }
      if (invoice.reminders_paused) { skipped++; continue }
      if (client.reminders_paused) { skipped++; continue }

      const dueDate = new Date(invoice.due_date as string)
      dueDate.setHours(0, 0, 0, 0)
      const diffDays = Math.round((dueDate.getTime() - today.getTime()) / 86400000)
      const daysOverdue = diffDays < 0 ? Math.abs(diffDays) : 0

      // Determine trigger type
      let triggerType: string | null = null
      let stage: 'before_due' | 'on_due' | 'overdue' = 'before_due'

      const daysBefore = (Array.isArray(settings.days_before)
        ? settings.days_before
        : JSON.parse((settings.days_before as string) || '[3,1]')) as number[]

      const daysAfterOverdue = (Array.isArray(settings.days_after_overdue)
        ? settings.days_after_overdue
        : JSON.parse((settings.days_after_overdue as string) || '[3,7,14]')) as number[]

      if (diffDays > 0 && daysBefore.includes(diffDays)) {
        triggerType = `before_due_${diffDays}`
        stage = 'before_due'
      } else if (diffDays === 0 && settings.send_on_due_date) {
        triggerType = 'on_due'
        stage = 'on_due'
      } else if (daysOverdue > 0 && daysAfterOverdue.includes(daysOverdue)) {
        triggerType = `overdue_${daysOverdue}`
        stage = 'overdue'
      }

      if (!triggerType) { skipped++; continue }

      // Check if this exact reminder was already sent
      const { data: existing } = await adminClient
        .from('reminder_logs')
        .select('id')
        .eq('invoice_id', invoice.id)
        .eq('trigger_type', triggerType)
        .limit(1)

      if (existing && existing.length > 0) { skipped++; continue }

      // Check unsubscribe list
      if (settings.allow_unsubscribe) {
        const { data: unsub } = await adminClient
          .from('reminder_unsubscribes')
          .select('id')
          .eq('client_email', client.email)
          .limit(1)
        if (unsub && unsub.length > 0) { skipped++; continue }
      }

      const dueDateFormatted = new Date(invoice.due_date as string).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })

      const invoiceUrl = `${process.env.NEXT_PUBLIC_APP_URL}/i/${invoice.share_token}`

      const subject =
        stage === 'overdue'
          ? `Overdue: Invoice ${invoice.invoice_number} — ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} past due`
          : stage === 'on_due'
          ? `Payment due today: Invoice ${invoice.invoice_number}`
          : `Reminder: Invoice ${invoice.invoice_number} due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`

      try {
        await sendEmail({
          to: client.email,
          subject,
          html: paymentReminderEmail({
            clientName: client.name,
            freelancerName: profile.full_name ?? 'Your service provider',
            businessName: profile.business_name,
            invoiceNumber: invoice.invoice_number,
            amount: fmt(balance, invoice.currency),
            dueDate: dueDateFormatted,
            daysOverdue,
            invoiceUrl,
            shareToken: invoice.share_token as string,
            stage,
          }),
          replyTo: profile.email ?? undefined,
        })

        await adminClient.from('reminder_logs').insert({
          invoice_id: invoice.id,
          user_id: userId,
          client_id: invoice.client_id ?? null,
          recipient_email: client.email,
          trigger_type: triggerType,
          template_key: stage,
          status: 'sent',
          sent_at: new Date().toISOString(),
        })

        sent++
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        errors.push(`Invoice ${invoice.invoice_number}: ${message}`)

        await adminClient.from('reminder_logs').insert({
          invoice_id: invoice.id,
          user_id: userId,
          client_id: invoice.client_id ?? null,
          recipient_email: client.email,
          trigger_type: triggerType,
          template_key: stage,
          status: 'failed',
          sent_at: new Date().toISOString(),
        })

        skipped++
      }
    }
  }

  return NextResponse.json({
    processed,
    sent,
    skipped,
    errors: errors.slice(0, 10),
    timestamp: new Date().toISOString(),
  })
}
