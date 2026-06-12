export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClientById } from '@/lib/db/supabase'
import { ClientFormPage } from '@/components/clients/ClientFormPage'
import { extractToken } from '@/lib/slug'

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { notFound(); return null }

  const clientId = extractToken(params.id)
  const client = await getClientById(clientId, user.id)
  if (!client) notFound()

  return (
    <ClientFormPage
      mode="edit"
      clientId={clientId}
      initial={{
        name: client.name,
        email: client.email ?? '',
        phone: client.phone ?? '',
        company: client.company ?? '',
        address: client.address ?? '',
        notes: client.notes ?? '',
      }}
    />
  )
}
