export const dynamic = 'force-dynamic'

import { getCurrentProfile, getClients, getInvoiceTemplates, getLineItemPresets, getNextInvoiceSequence } from '@/lib/db/sqlite'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'

export default function NewInvoicePage({ searchParams }: { searchParams: { templateId?: string; clientId?: string; returnTo?: string } }) {
  const profile = getCurrentProfile()
  const clients = getClients(profile.id)
  const templates = getInvoiceTemplates(profile.id)
  const lineItemPresets = getLineItemPresets(profile.profession)
  const nextSequence = getNextInvoiceSequence(profile.id)

  return (
    <InvoiceForm
      clients={clients}
      templates={templates}
      lineItemPresets={lineItemPresets}
      nextSequence={nextSequence}
      defaultTemplateId={searchParams.templateId}
      defaultClientId={searchParams.clientId}
      returnTo={searchParams.returnTo}
      profile={{
        fullName: profile.fullName,
        businessName: profile.businessName,
        defaultTaxRate: 0,
      }}
    />
  )
}
