export const dynamic = 'force-dynamic'

import { ClientFormPage } from '@/components/clients/ClientFormPage'

export default function NewClientPage({ searchParams }: { searchParams: { returnTo?: string } }) {
  return <ClientFormPage mode="create" returnTo={searchParams.returnTo} />
}
