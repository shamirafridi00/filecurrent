export const dynamic = 'force-dynamic'

import { getCurrentProfile, getReminderSettings } from '@/lib/db/sqlite'
import { ReminderSettingsForm } from '@/components/reminders/ReminderSettingsForm'

export default function ReminderSettingsPage() {
  const profile = getCurrentProfile()
  const settings = getReminderSettings(profile.id)
  return <ReminderSettingsForm initial={settings} />
}
