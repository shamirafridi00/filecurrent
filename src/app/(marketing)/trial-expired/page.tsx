'use client'

import { Star, Check } from '@phosphor-icons/react'
import { useCheckout } from '@/hooks/useCheckout'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  TRIAL_DAYS,
  PRICE_MONTHLY,
  PRICE_ANNUAL,
  PRICE_ANNUAL_SAVING_PCT,
  PRICE_ANNUAL_SAVING_USD,
} from '@/lib/constants'

const PRO_FEATURES = [
  'Unlimited contracts, invoices & proposals',
  'No FileCurrent branding',
  'Automated payment reminders',
  'Invoice share links & PDF export',
  'Priority support',
]

export default function TrialExpiredPage() {
  const { startCheckout, loading } = useCheckout()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex flex-col items-center justify-center px-6 pt-36 pb-24">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-[-0.02em] text-[#0A2540] mb-3">
            Your free trial has ended
          </h1>
          <p className="text-[#8898AA] text-lg max-w-md mx-auto">
            You had {TRIAL_DAYS} days of full access. Upgrade to Pro to continue using FileCurrent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Monthly */}
          <div className="bg-white border border-[#E6EBF1] rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <p className="text-2xl font-bold text-[#0A2540]">${PRICE_MONTHLY}</p>
              <p className="text-[#8898AA] text-sm">per month</p>
            </div>
            <p className="font-semibold text-[#0A2540]">Pro Monthly</p>
            <ul className="space-y-2">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#425466]">
                  <Check className="h-4 w-4 text-[#635BFF] shrink-0" weight="bold" /> {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-[#635BFF] hover:bg-[#5145E5] text-white"
              disabled={loading !== null}
              onClick={() => startCheckout('monthly')}
            >
              {loading === 'monthly' ? 'Redirecting…' : 'Upgrade Now'}
            </Button>
          </div>

          {/* Annual */}
          <div className="bg-white border-2 border-[#635BFF] rounded-2xl p-6 shadow-sm space-y-4 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-[#635BFF] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Star size={11} weight="fill" />
                Best Value
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#0A2540]">${PRICE_ANNUAL}</p>
              <p className="text-[#8898AA] text-sm">per year · save {PRICE_ANNUAL_SAVING_PCT}%</p>
            </div>
            <p className="font-semibold text-[#0A2540]">Pro Annual</p>
            <ul className="space-y-2">
              {[...PRO_FEATURES, `Save $${PRICE_ANNUAL_SAVING_USD}/year vs monthly`].map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-[#425466]">
                  <Check className="h-4 w-4 text-[#635BFF] shrink-0" weight="bold" /> {f}
                </li>
              ))}
            </ul>
            <Button
              className="w-full bg-[#635BFF] hover:bg-[#5145E5] text-white"
              disabled={loading !== null}
              onClick={() => startCheckout('annual')}
            >
              {loading === 'annual' ? 'Redirecting…' : 'Get Annual'}
            </Button>
          </div>
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm text-[#8898AA]">
            Questions? Contact us at{' '}
            <a href="mailto:support@filecurrent.com" className="text-[#635BFF] hover:underline">
              support@filecurrent.com
            </a>
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-[#8898AA] hover:text-[#425466] underline"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
