'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { completeOnboarding, type OnboardingInput } from '@/lib/db/supabase'
import { seedDefaultInvoiceTemplates } from '@/lib/db/seedUserDefaults'

export async function completeOnboardingAction(input: OnboardingInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  await completeOnboarding(user.id, input)

  // Seed default invoice templates (best-effort)
  try { await seedDefaultInvoiceTemplates(user.id) } catch {}

  revalidatePath('/dashboard')

  return { checkoutUrl: null }
}
