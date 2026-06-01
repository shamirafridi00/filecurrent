export const dynamic = 'force-dynamic'

import { DashboardShell } from '@/components/layout/DashboardShell'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import { completeOnboardingAction } from './actions'
import { getCurrentProfile } from '@/lib/db/sqlite'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const profile = getCurrentProfile()

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
