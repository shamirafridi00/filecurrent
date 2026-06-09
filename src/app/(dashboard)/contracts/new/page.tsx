export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile, getClients, getContractTemplates, getProposal } from '@/lib/db/supabase'
import { ContractForm } from '@/components/contracts/ContractForm'

export default async function NewContractPage({
  searchParams,
}: {
  searchParams: {
    templateId?: string
    clientId?: string
    returnTo?: string
    proposalId?: string
  }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getCurrentProfile(user.id)
  const [clients, templates] = await Promise.all([
    getClients(user.id),
    getContractTemplates(user.id, profile.profession),
  ])

  // Load proposal data server-side — never expose in URL
  let proposalDefaults: {
    proposalId: string
    clientId: string
    title: string
    amount: number
    currency: string
    projectDescription: string
    additionalTerms: string
  } | undefined

  if (searchParams.proposalId) {
    const proposal = await getProposal(searchParams.proposalId, user.id)
    if (proposal) {
      proposalDefaults = {
        proposalId: proposal.id,
        clientId: proposal.clientId,
        title: proposal.title,
        amount: proposal.total,
        currency: proposal.currency,
        projectDescription: proposal.summary ?? '',
        additionalTerms: proposal.notes ?? '',
      }
    }
  }

  return (
    <ContractForm
      clients={clients}
      templates={templates}
      defaultTemplateId={searchParams.templateId}
      defaultClientId={searchParams.clientId}
      returnTo={searchParams.returnTo}
      proposalDefaults={proposalDefaults}
      profession={profile.profession}
      profile={{ fullName: profile.fullName, businessName: profile.businessName }}
    />
  )
}
