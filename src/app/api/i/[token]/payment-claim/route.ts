export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createPaymentClaim, logClientActivity, getNotificationRecipient } from '@/lib/db/supabase'
import { uploadToR2 } from '@/lib/r2'
import { sendEmail, buildSenderName } from '@/lib/email'
import { paymentClaimEmail } from '@/lib/email/templates/payment-claim'

const ACCEPTED_RECEIPT_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf']

/**
 * Public endpoint: a client submits a payment notification ("I've paid") from
 * the public invoice page. Creates an unconfirmed payment_claim, optionally
 * uploads a receipt, and emails the freelancer to review. No auth — gated by
 * the unguessable share token.
 */
export async function POST(req: NextRequest, { params }: { params: { token: string } }) {
  const form = await req.formData()

  const amountRaw = form.get('amount')
  const method = (form.get('method') as string) || 'bank_transfer'
  const note = (form.get('note') as string) || undefined
  const paymentDate = (form.get('paymentDate') as string) || undefined
  const receipt = form.get('receipt') as File | null

  const amount = parseFloat(String(amountRaw ?? ''))
  if (!amount || amount <= 0 || Number.isNaN(amount)) {
    return NextResponse.json({ error: 'A valid payment amount is required.' }, { status: 400 })
  }

  // Optional receipt upload
  let receiptUrl: string | undefined
  if (receipt && receipt.size > 0) {
    if (!ACCEPTED_RECEIPT_TYPES.includes(receipt.type)) {
      return NextResponse.json({ error: 'Receipt must be an image or PDF.' }, { status: 400 })
    }
    if (receipt.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Receipt must be under 5MB.' }, { status: 400 })
    }
    try {
      const ext = receipt.name.split('.').pop()?.toLowerCase() ?? 'png'
      const key = `receipts/${params.token}/${Date.now()}.${ext}`
      const bytes = Buffer.from(await receipt.arrayBuffer())
      receiptUrl = await uploadToR2(key, bytes, receipt.type)
    } catch (err) {
      console.error('Receipt upload failed:', err)
      // Non-fatal — still record the claim without the receipt
    }
  }

  let result
  try {
    result = await createPaymentClaim(params.token, { amount, method, paymentDate, note, receiptUrl })
  } catch (err) {
    console.error('createPaymentClaim failed:', err)
    return NextResponse.json({ error: 'Could not record your payment. Please try again.' }, { status: 500 })
  }
  if (!result) {
    return NextResponse.json({ error: 'Invoice not found.' }, { status: 404 })
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: result!.currency }).format(n)

  // Log activity for the freelancer's client-activity feed (non-blocking)
  void logClientActivity({
    userId: result.userId,
    clientId: null,
    clientName: result.clientName,
    eventType: 'payment_claimed',
    entityType: 'invoice',
    entityId: result.invoiceId,
    entityLabel: result.invoiceNumber,
    amount,
  })

  // Notify the freelancer so they can confirm — gated on their notification
  // toggle (payment_received). Non-blocking.
  const recipient = await getNotificationRecipient(result.userId, 'payment_received')
  if (recipient) {
    sendEmail({
      to: recipient.email,
      subject: `${result.clientName} marked invoice ${result.invoiceNumber} as paid`,
      html: paymentClaimEmail({
        freelancerName: recipient.fullName,
        clientName: result.clientName,
        invoiceNumber: result.invoiceNumber,
        amount: fmt(amount),
        method,
        note,
        hasReceipt: Boolean(receiptUrl),
        invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${result.invoiceId}`,
      }),
      fromName: buildSenderName(recipient.businessName, recipient.fullName),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
