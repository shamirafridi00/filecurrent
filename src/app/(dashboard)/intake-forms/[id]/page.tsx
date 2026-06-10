export const dynamic = 'force-dynamic'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getIntakeFormById } from '@/lib/db/supabase'
import { IntakeFormBuilder } from '@/components/intake-forms/IntakeFormBuilder'

export default async function EditIntakeFormPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const form = await getIntakeFormById(params.id, user.id)
  if (!form) notFound()
  return <IntakeFormBuilder existingForm={form} />
}
