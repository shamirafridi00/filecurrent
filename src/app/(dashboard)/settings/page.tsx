export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getFullProfile } from '@/lib/db/supabase'
import { SettingsTabs } from '@/components/settings/SettingsTabs'

export default async function SettingsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getFullProfile(user.id)
  if (!profile) return null

  const rawPrefs = profile.notification_prefs
  const notificationPrefs = (
    typeof rawPrefs === 'string'
      ? JSON.parse(rawPrefs || '{}')
      : rawPrefs ?? {}
  ) as Record<string, boolean>

  return (
    <SettingsTabs
      profile={{
        fullName: profile.full_name ?? '',
        email: profile.email,
        phone: profile.phone ?? '',
        businessName: profile.business_name ?? '',
        address: profile.address ?? '',
        city: profile.city ?? '',
        state: profile.state ?? '',
        postalCode: profile.postal_code ?? '',
        country: profile.country ?? '',
        taxId: profile.tax_id ?? '',
        defaultCurrency: profile.default_currency ?? 'USD',
        defaultTaxRate: profile.default_tax_rate ?? 0,
        timezone: profile.timezone ?? 'UTC',
        profession: profile.profession ?? null,
        plan: profile.plan,
        trialEndsAt: profile.trial_ends_at ?? null,
        planExpiresAt: profile.plan_expires_at ?? null,
      }}
      notificationPrefs={notificationPrefs}
    />
  )
}
