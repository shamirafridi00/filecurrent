export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getClients, getInvoiceTemplates, getLineItemPresets, getNextInvoiceSequence } from '@/lib/db/supabase'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'

export default async function NewInvoicePage({ searchParams }: { searchParams: { templateId?: string; clientId?: string; returnTo?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getCurrentProfile(user.id)
  const [clients, templates, lineItemPresets, nextSequence] = await Promise.all([
    getClients(user.id),
    getInvoiceTemplates(user.id),
    getLineItemPresets(profile.profession),
    getNextInvoiceSequence(user.id),
  ])

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
        defaultTaxRate: profile.defaultTaxRate ?? 0,
      }}
    />
  )
}
