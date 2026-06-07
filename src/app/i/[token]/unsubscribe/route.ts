import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function GET(
  _req: NextRequest,
  { params }: { params: { token: string } }
) {
  const html = (msg: string) =>
    new NextResponse(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;padding:40px;max-width:500px;margin:auto;"><p>${msg}</p></body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )

  const { data: invoice } = await adminClient
    .from('invoices')
    .select('id, user_id, clients!inner(email)')
    .eq('share_token', params.token)
    .single()

  if (!invoice) return html('Invalid link.')

  const clientEmail = (invoice.clients as unknown as { email: string | null }).email
  if (!clientEmail) return html('No email address associated with this invoice.')

  // Upsert so it is idempotent — already-unsubscribed returns same success message
  await adminClient
    .from('reminder_unsubscribes')
    .upsert(
      {
        client_email: clientEmail,
        user_id: invoice.user_id,
        invoice_id: invoice.id,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'client_email,invoice_id', ignoreDuplicates: true }
    )

  return html('You have been unsubscribed from payment reminders for this invoice.')
}
