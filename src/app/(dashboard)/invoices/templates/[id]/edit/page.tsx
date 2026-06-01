export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getInvoiceTemplate } from '@/lib/db/sqlite'
import { InvoiceTemplateFormPage } from '@/components/invoices/InvoiceTemplateFormPage'

export default function EditInvoiceTemplatePage({ params }: { params: { id: string } }) {
  const template = getInvoiceTemplate(params.id)
  if (!template) notFound()

  return (
    <InvoiceTemplateFormPage
      mode="edit"
      templateId={params.id}
      initial={template}
    />
  )
}
