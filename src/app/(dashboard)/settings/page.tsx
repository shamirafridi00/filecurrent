export const dynamic = 'force-dynamic'

import { getFullProfile } from '@/lib/db/sqlite'
import { SettingsTabs } from '@/components/settings/SettingsTabs'

export default function SettingsPage() {
  const profile = getFullProfile('local-user')
  if (!profile) return null

  const notificationPrefs = JSON.parse(profile.notification_prefs || '{}') as Record<string, boolean>

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
        docsUsedThisMonth: profile.docs_used_this_month ?? 0,
        docsResetAt: profile.docs_reset_at ?? null,
        planExpiresAt: profile.plan_expires_at ?? null,
      }}
      notificationPrefs={notificationPrefs}
    />
  )
}
