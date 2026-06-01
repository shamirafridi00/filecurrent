export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClientById } from '@/lib/db/supabase'
import { ClientFormPage } from '@/components/clients/ClientFormPage'

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { notFound(); return null }

  const client = await getClientById(params.id, user.id)
  if (!client) notFound()

  return (
    <ClientFormPage
      mode="edit"
      clientId={params.id}
      initial={{
        name: client.name,
        email: client.email ?? '',
        phone: '',
        company: client.company ?? '',
        address: client.address ?? '',
        notes: client.notes ?? '',
      }}
    />
  )
}
