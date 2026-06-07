import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { recordPayment, getInvoice, getCurrentProfile } from '@/lib/db/supabase'
import { sendEmail } from '@/lib/email'
import { paymentReceivedEmail } from '@/lib/email/templates/payment-received'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { amount, paymentDate, method, notes } = await req.json()
  if (!amount || !paymentDate || !method) {
    return NextResponse.json({ error: 'amount, paymentDate, method required' }, { status: 400 })
  }

  const id = await recordPayment(params.id, { amount, paymentDate, method, notes })

  // Send payment-received confirmation to client (non-blocking)
  try {
    const [invoice, profile] = await Promise.all([
      getInvoice(params.id, user.id),
      getCurrentProfile(user.id),
    ])

    if (invoice?.clientEmail) {
      const fmt = (n: number) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: invoice.currency,
      }).format(n)
      const paidNow = parseFloat(amount)
      const remaining = Math.max(0, invoice.total - invoice.paidAmount)

      sendEmail({
        to: invoice.clientEmail,
        subject: `Payment received — Invoice ${invoice.invoiceNumber}`,
        html: paymentReceivedEmail({
          clientName: invoice.clientName,
          freelancerName: profile.businessName || profile.fullName,
          invoiceNumber: invoice.invoiceNumber,
          amountPaid: fmt(paidNow),
          remainingBalance: fmt(remaining),
          currency: invoice.currency,
          invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/i/${invoice.shareToken}`,
        }),
      }).catch(() => {})
    }
  } catch {
    // non-critical — don't block response
  }

  return NextResponse.json({ id })
}
