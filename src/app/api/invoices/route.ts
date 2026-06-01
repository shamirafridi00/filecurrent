import { NextRequest, NextResponse } from 'next/server'
import { createInvoice, updateInvoiceStatus, checkDocLimit } from '@/lib/db/sqlite'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { clientId, templateId, invoiceNumber, invoiceDate, dueDate, currency,
    items, subtotal, taxRate, taxAmount, discountAmount, depositAmount, total,
    notes, paymentTerms, markAsSent } = body

  if (!clientId || !invoiceNumber) {
    return NextResponse.json({ error: 'clientId and invoiceNumber required' }, { status: 400 })
  }
  const limit = checkDocLimit('local-user')
  if (!limit.allowed) {
    return NextResponse.json({ error: 'doc_limit_reached', used: limit.used, limit: limit.limit }, { status: 402 })
  }

  const id = createInvoice('local-user', {
    clientId, templateId: templateId ?? null, invoiceNumber, invoiceDate,
    dueDate, currency, items, subtotal, taxRate, taxAmount,
    discountAmount, depositAmount: depositAmount ?? 0, total, notes, paymentTerms,
  })

  if (markAsSent) {
    updateInvoiceStatus(id, 'local-user', 'sent')
  }

  return NextResponse.json({ id })
}
