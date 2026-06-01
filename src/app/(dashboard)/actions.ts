'use server'

import { revalidatePath } from 'next/cache'
import { completeOnboarding, type OnboardingInput } from '@/lib/db/sqlite'

export async function completeOnboardingAction(input: OnboardingInput) {
  completeOnboarding(input)
  revalidatePath('/dashboard')

  return {
    checkoutUrl:
      input.plan === 'pro_monthly'
        ? process.env.LEMONSQUEEZY_PRO_CHECKOUT_URL || '/pricing'
        : null,
  }
}
