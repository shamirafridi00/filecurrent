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

  const isPro =
    profile.plan === 'pro_monthly' ||
    profile.plan === 'pro_annual' ||
    profile.plan === 'lifetime'

  const trialExpired =
    profile.plan === 'trial' &&
    profile.trialEndsAt != null &&
    new Date(profile.trialEndsAt) <= new Date()

  const nonProNonTrial =
    !isPro && profile.plan !== 'trial'

  if (trialExpired || nonProNonTrial) {
    redirect('/trial-expired')
  }

  return (
    <DashboardShell
      user={{
        fullName: profile.fullName,
        email: profile.email,
        plan: profile.plan,
        trialEndsAt: profile.trialEndsAt,
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
