export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getInvoiceTemplate } from '@/lib/db/supabase'
import { InvoiceTemplateFormPage } from '@/components/invoices/InvoiceTemplateFormPage'

export default async function EditInvoiceTemplatePage({ params }: { params: { id: string } }) {
  const template = await getInvoiceTemplate(params.id)
  if (!template) notFound()

  return (
    <InvoiceTemplateFormPage
      mode="edit"
      templateId={params.id}
      initial={template}
    />
  )
}
