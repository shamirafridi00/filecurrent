'use client'

import Link from 'next/link'
import { LogoFull } from '@/components/logo/LogoMark'
import { Star } from '@phosphor-icons/react'
import { useCheckout } from '@/hooks/useCheckout'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function TrialExpiredPage() {
  const { startCheckout, loading } = useCheckout()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <LogoFull />
        </div>

        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Your free trial has ended
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto">
            You had 5 days of full access. Upgrade to Pro to continue using FileCurrent.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Monthly */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <p className="text-2xl font-bold text-slate-900">$9</p>
              <p className="text-slate-500 text-sm">per month</p>
            </div>
            <p className="font-semibold text-slate-800">Pro Monthly</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✓ Unlimited invoices &amp; contracts</li>
              <li>✓ No FileCurrent branding</li>
              <li>✓ Automated payment reminders</li>
              <li>✓ Priority support</li>
            </ul>
            <Button
              className="w-full"
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
              <p className="text-2xl font-bold text-slate-900">$79</p>
              <p className="text-slate-500 text-sm">per year · save 27%</p>
            </div>
            <p className="font-semibold text-slate-800">Pro Annual</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>✓ Everything in Monthly</li>
              <li>✓ Save $29/year</li>
              <li>✓ Invoice analytics</li>
              <li>✓ Early access to new features</li>
            </ul>
            <Button
              className="w-full bg-[#635BFF] hover:bg-[#5145E5]"
              disabled={loading !== null}
              onClick={() => startCheckout('annual')}
            >
              {loading === 'annual' ? 'Redirecting…' : 'Get Annual'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-500">
            Questions? Contact us at{' '}
            <a href="mailto:support@filecurrent.com" className="text-[#635BFF] hover:underline">
              support@filecurrent.com
            </a>
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-400 hover:text-slate-600 underline"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  )
}
