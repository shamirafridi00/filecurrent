import Link from 'next/link'
import { Check } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'
import {
  TRIAL_DAYS,
  PRICE_MONTHLY,
  PRICE_ANNUAL,
  PRICE_ANNUAL_EFFECTIVE,
  PRICE_ANNUAL_SAVING_PCT,
} from '@/lib/constants'

const INCLUDED = [
  'Full access, every feature included',
  'Unlimited contracts, invoices & proposals',
  'Automated reminders with no daily cap',
  'Client portal, intake forms & time tracking',
  `${TRIAL_DAYS}-day free trial, no card to start`,
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#F6F9FC] px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
          One price. No seats. No surprises.
        </h2>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2">
          {/* Monthly */}
          <div className="flex h-full flex-col rounded-2xl border border-[#E6EBF1] bg-white p-7 shadow-sm">
            <p className="text-base font-semibold text-[#0A2540]">Monthly</p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-[#0A2540]">
              ${PRICE_MONTHLY}
              <span className="text-base font-normal text-[#8898AA]">/mo</span>
            </p>
            <p className="mt-1 text-sm text-[#8898AA]">Billed monthly. Cancel anytime.</p>
            <ul className="mt-6 flex-1 space-y-3">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#0A2540]">
                  <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-[#1DB954]" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="outline"
              className="mt-7 w-full border-[#E6EBF1] hover:bg-[#F6F9FC]"
            >
              <Link href="/signup">Start free</Link>
            </Button>
          </div>

          {/* Annual — best value */}
          <div className="relative flex h-full flex-col rounded-2xl border-2 border-[#635BFF] bg-white p-7 shadow-[0_20px_50px_-20px_rgba(99,91,255,0.4)]">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#635BFF] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Best value · save ~{PRICE_ANNUAL_SAVING_PCT}%
            </span>
            <p className="text-base font-semibold text-[#0A2540]">Annual</p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-[#0A2540]">
              ${PRICE_ANNUAL}
              <span className="text-base font-normal text-[#8898AA]">/yr</span>
            </p>
            <p className="mt-1 text-sm text-[#8898AA]">${PRICE_ANNUAL_EFFECTIVE}/mo effective</p>
            <ul className="mt-6 flex-1 space-y-3">
              {INCLUDED.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#0A2540]">
                  <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-[#635BFF]" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-7 w-full bg-[#635BFF] text-white hover:bg-[#5145E5]">
              <Link href="/signup">Start free</Link>
            </Button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-[#8898AA]">
          We don&apos;t upsell you to a &ldquo;real&rdquo; plan later. This is the real plan.
        </p>
      </div>
    </section>
  )
}
