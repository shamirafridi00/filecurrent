export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getClients, getContractTemplates } from '@/lib/db/supabase'
import { ContractForm } from '@/components/contracts/ContractForm'

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: { templateId?: string; clientId?: string; returnTo?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getCurrentProfile(user.id)
  const [clients, templates] = await Promise.all([
    getClients(user.id),
    getContractTemplates(user.id, profile.profession),
  ])

  return (
    <ContractForm
      clients={clients}
      templates={templates}
      defaultTemplateId={searchParams.templateId}
      defaultClientId={searchParams.clientId}
      returnTo={searchParams.returnTo}
      profile={{ fullName: profile.fullName, businessName: profile.businessName }}
    />
  )
}
