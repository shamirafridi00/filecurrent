export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getReminderSettings } from '@/lib/db/supabase'
import { ReminderSettingsForm } from '@/components/reminders/ReminderSettingsForm'

export default async function ReminderSettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const settings = await getReminderSettings(user.id)
  return <ReminderSettingsForm initial={settings} />
}
