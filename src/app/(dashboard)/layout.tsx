export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/layout/DashboardShell'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import { completeOnboardingAction } from './actions'
import { createClient } from '@/lib/supabase/server'
import { getCurrentProfile } from '@/lib/db/supabase'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await getCurrentProfile(user.id)

  return (
    <DashboardShell
      user={{
        fullName: profile.fullName,
        plan: profile.plan,
        docsUsedThisMonth: profile.docsUsedThisMonth,
        monthlyDocLimit: 3,
      }}
    >
      {children}
      {!profile.onboardingComplete && (
        <OnboardingModal
          firstName={profile.fullName.split(' ')[0] || 'there'}
          fullName={profile.fullName}
          email={profile.email}
          businessName={profile.businessName}
          phone={profile.phone}
          onComplete={completeOnboardingAction}
        />
      )}
    </DashboardShell>
  )
}
