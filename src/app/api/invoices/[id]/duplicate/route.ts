import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInvoice, createInvoice, getNextInvoiceSequence } from '@/lib/db/supabase'
import { generateInvoiceNumber } from '@/lib/utils'

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const source = await getInvoice(params.id, user.id)
  if (!source) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const seq = await getNextInvoiceSequence(user.id)
  const invoiceNumber = generateInvoiceNumber(seq)
  const today = new Date().toISOString().split('T')[0]

  try {
    const newId = await createInvoice(user.id, {
      clientId: source.clientId,
      templateId: source.templateId ?? null,
      invoiceNumber,
      invoiceDate: today,
      dueDate: undefined,
      currency: source.currency,
      items: source.items,
      subtotal: source.subtotal,
      taxRate: source.taxRate,
      taxAmount: source.taxAmount,
      discountAmount: source.discountAmount,
      depositAmount: 0,
      total: source.total,
      notes: source.notes ?? undefined,
      paymentTerms: source.paymentTerms ?? undefined,
      paymentInstructions: source.paymentInstructions ?? undefined,
    })
    return NextResponse.json({ id: newId })
  } catch (err) {
    console.error('[duplicate] createInvoice failed:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
