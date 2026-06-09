export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClients, getCurrentProfile } from '@/lib/db/supabase'
import { ProposalForm } from '@/components/proposals/ProposalForm'

export default async function NewProposalPage({ searchParams }: { searchParams: { clientId?: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const [clients, profile] = await Promise.all([getClients(user.id), getCurrentProfile(user.id)])
  return <ProposalForm clients={clients} defaultClientId={searchParams.clientId} defaultCurrency="USD" defaultTaxRate={profile.defaultTaxRate} />
}
