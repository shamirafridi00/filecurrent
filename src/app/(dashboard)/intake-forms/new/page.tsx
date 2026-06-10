export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { IntakeFormBuilder } from '@/components/intake-forms/IntakeFormBuilder'

export default async function NewIntakeFormPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <IntakeFormBuilder />
}
