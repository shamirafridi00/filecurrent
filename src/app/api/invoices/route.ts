import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createInvoice, updateInvoiceStatus, checkDocLimit, getInvoice, getCurrentProfile, logClientActivity } from '@/lib/db/supabase'
import { sendEmail, buildSenderName } from '@/lib/email'
import { invoiceSentEmail } from '@/lib/email/templates/invoice-sent'

export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { clientId, templateId, invoiceNumber, invoiceDate, dueDate, currency,
    items, subtotal, taxRate, taxAmount, discountAmount, depositAmount, total,
    notes, paymentTerms, paymentInstructions, markAsSent } = body

  if (!clientId || !invoiceNumber) {
    return NextResponse.json({ error: 'clientId and invoiceNumber required' }, { status: 400 })
  }

  const limit = await checkDocLimit(user.id)
  if (!limit.allowed) {
    return NextResponse.json({ error: limit.reason ?? 'upgrade_required' }, { status: 402 })
  }

  const id = await createInvoice(user.id, {
    clientId, templateId: templateId ?? null, invoiceNumber, invoiceDate,
    dueDate, currency, items, subtotal, taxRate, taxAmount,
    discountAmount, depositAmount: depositAmount ?? 0, total, notes, paymentTerms, paymentInstructions,
  })

  // Log invoice_created — fetch client name from the invoice
  const createdInvoice = await getInvoice(id, user.id)
  if (createdInvoice) {
    void logClientActivity({
      userId: user.id,
      clientId: createdInvoice.clientId ?? null,
      clientName: createdInvoice.clientName,
      eventType: 'invoice_created',
      entityType: 'invoice',
      entityId: id,
      entityLabel: createdInvoice.invoiceNumber,
      amount: createdInvoice.total,
    })
  }

  if (markAsSent) {
    await updateInvoiceStatus(id, user.id, 'sent')

    if (createdInvoice) {
      void logClientActivity({
        userId: user.id,
        clientId: createdInvoice.clientId ?? null,
        clientName: createdInvoice.clientName,
        eventType: 'invoice_sent',
        entityType: 'invoice',
        entityId: id,
        entityLabel: createdInvoice.invoiceNumber,
        amount: createdInvoice.total,
      })
    }

    // Send invoice email to client — reuse createdInvoice, only fetch profile
    const profile = await getCurrentProfile(user.id)

    if (createdInvoice?.clientEmail) {
      const fmt = (n: number) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: createdInvoice.currency,
      }).format(n)

      const dueDateLabel = createdInvoice.dueDate
        ? new Date(createdInvoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : null

      sendEmail({
        to: createdInvoice.clientEmail,
        subject: `Invoice ${createdInvoice.invoiceNumber} from ${profile.businessName || profile.fullName} — ${fmt(createdInvoice.total)}${dueDateLabel ? ` due ${dueDateLabel}` : ''}`,
        html: invoiceSentEmail({
          clientName: createdInvoice.clientName,
          freelancerName: profile.fullName,
          businessName: profile.businessName,
          invoiceNumber: createdInvoice.invoiceNumber,
          total: fmt(createdInvoice.total),
          dueDate: dueDateLabel,
          items: createdInvoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: fmt(item.unitPrice),
            amount: fmt(item.amount),
          })),
          notes: createdInvoice.notes,
          paymentTerms: createdInvoice.paymentTerms,
          paymentInstructions: createdInvoice.paymentInstructions,
          invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/i/${createdInvoice.shareToken}`,
          hasBrandingFooter: profile.plan === 'free',
        }),
        replyTo: profile.email ?? undefined,
        fromName: buildSenderName(profile.businessName, profile.fullName),
      }).catch((err) => console.error('Invoice sent email failed:', err))
    }
  }

  return NextResponse.json({ id })
}
