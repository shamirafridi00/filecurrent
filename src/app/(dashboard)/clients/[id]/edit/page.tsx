export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getCurrentProfile, getClientById } from '@/lib/db/sqlite'
import { ClientFormPage } from '@/components/clients/ClientFormPage'

export default function EditClientPage({ params }: { params: { id: string } }) {
  const profile = getCurrentProfile()
  const client = getClientById(params.id, profile.id)
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
