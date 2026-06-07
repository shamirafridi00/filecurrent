import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createInvoice, updateInvoiceStatus, checkDocLimit, getInvoice, getCurrentProfile, logClientActivity } from '@/lib/db/supabase'
import { sendEmail } from '@/lib/email'
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
    logClientActivity({
      userId: user.id,
      clientId: createdInvoice.clientId ?? null,
      clientName: createdInvoice.clientName,
      eventType: 'invoice_created',
      entityType: 'invoice',
      entityId: id,
      entityLabel: createdInvoice.invoiceNumber,
      amount: createdInvoice.total,
    }).catch(() => {})
  }

  if (markAsSent) {
    await updateInvoiceStatus(id, user.id, 'sent')

    if (createdInvoice) {
      logClientActivity({
        userId: user.id,
        clientId: createdInvoice.clientId ?? null,
        clientName: createdInvoice.clientName,
        eventType: 'invoice_sent',
        entityType: 'invoice',
        entityId: id,
        entityLabel: createdInvoice.invoiceNumber,
        amount: createdInvoice.total,
      }).catch(() => {})
    }

    // Send invoice email to client
    const [invoice, profile] = await Promise.all([
      getInvoice(id, user.id),
      getCurrentProfile(user.id),
    ])

    if (invoice?.clientEmail) {
      const fmt = (n: number) => new Intl.NumberFormat('en-US', {
        style: 'currency', currency: invoice.currency,
      }).format(n)

      sendEmail({
        to: invoice.clientEmail,
        subject: `Invoice ${invoice.invoiceNumber} from ${profile.businessName || profile.fullName}`,
        html: invoiceSentEmail({
          clientName: invoice.clientName,
          freelancerName: profile.businessName || profile.fullName,
          invoiceNumber: invoice.invoiceNumber,
          total: fmt(invoice.total),
          dueDate: invoice.dueDate ?? null,
          items: invoice.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: fmt(item.unitPrice),
            amount: fmt(item.amount),
          })),
          notes: invoice.notes,
          paymentTerms: invoice.paymentTerms,
          invoiceUrl: `${process.env.NEXT_PUBLIC_APP_URL}/i/${invoice.shareToken}`,
          hasBrandingFooter: profile.plan === 'free',
        }),
      }).catch((err) => console.error('Invoice sent email failed:', err))
    }
  }

  return NextResponse.json({ id })
}
