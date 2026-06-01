export const dynamic = 'force-dynamic'

import { getCurrentProfile, getClients, getContractTemplates } from '@/lib/db/sqlite'
import { ContractForm } from '@/components/contracts/ContractForm'

export default function NewContractPage({
  searchParams,
}: {
  searchParams: { templateId?: string; clientId?: string; returnTo?: string }
}) {
  const profile = getCurrentProfile()
  const clients = getClients(profile.id)
  const templates = getContractTemplates(profile.id, profile.profession)

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
