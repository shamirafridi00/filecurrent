'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { completeOnboarding, type OnboardingInput } from '@/lib/db/supabase'

export async function completeOnboardingAction(input: OnboardingInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await completeOnboarding(user.id, input)
  revalidatePath('/dashboard')

  return {
    checkoutUrl:
      input.plan === 'pro_monthly'
        ? process.env.LEMONSQUEEZY_PRO_CHECKOUT_URL || '/pricing'
        : null,
  }
}
