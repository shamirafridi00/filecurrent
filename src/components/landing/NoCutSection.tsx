'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Bank, PaypalLogo, LinkSimple, Money, Wallet, Check } from '@phosphor-icons/react'
import { fadeUp, REVEAL_VIEWPORT } from '@/components/landing/_motion'

const METHODS = [
  { icon: Bank, label: 'Bank transfer' },
  { icon: PaypalLogo, label: 'PayPal' },
  { icon: LinkSimple, label: 'Stripe link' },
  { icon: Wallet, label: 'Venmo' },
  { icon: Money, label: 'Zelle' },
  { icon: Check, label: 'Check' },
]

export function NoCutSection() {
  const reduce = useReducedMotion()

  return (
    <section className="bg-[#F6F9FC] px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          className="text-center"
          variants={fadeUp}
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={REVEAL_VIEWPORT}
        >
          <h2 className="text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
            We never touch your money.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-[#425466]">
            Some platforms route your client payments through their own processor and add their fees
            and payout delays on top. FileCurrent doesn&apos;t sit between you and your income. Your
            client pays you directly, through the methods you already use, and you keep 100% with no
            added platform fee and no waiting for a payout.
          </p>
        </motion.div>

        {/* Coded comparison visual */}
        <motion.div
          className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2"
          variants={fadeUp}
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={REVEAL_VIEWPORT}
        >
          {/* Other platforms */}
          <div className="rounded-2xl border border-[#FFC4CF] bg-[#FFF0F3] p-7 text-center">
            <p className="text-sm font-medium text-[#DF1B41]">Platforms that add a payment fee</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540]">You keep $4,855</p>
            <p className="mt-1.5 text-sm font-semibold text-[#DF1B41]">−$145 in added fees</p>
            <p className="mt-3 text-xs text-[#8898AA]">On a $5,000 invoice, at a typical 2.9% + 30¢</p>
          </div>

          {/* FileCurrent */}
          <div className="rounded-2xl border border-[#A3E6C0] bg-[#F0FBF4] p-7 text-center">
            <p className="text-sm font-medium text-[#1DB954]">FileCurrent</p>
            <p className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540]">You keep $5,000</p>
            <p className="mt-1.5 text-sm font-semibold text-[#1DB954]">$0 in added fees</p>
            <p className="mt-3 text-xs text-[#8898AA]">We add nothing on top of how you get paid</p>
          </div>
        </motion.div>

        {/* Payment-method strip */}
        <motion.div
          className="mt-10 text-center"
          variants={fadeUp}
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={REVEAL_VIEWPORT}
        >
          <p className="mb-4 text-sm font-medium text-[#425466]">
            Works with how you already get paid:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {METHODS.map((m) => {
              const Icon = m.icon
              return (
                <span
                  key={m.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E6EBF1] bg-white px-3 py-1.5 text-sm font-medium text-[#0A2540]"
                >
                  <Icon size={15} weight="duotone" className="text-[#635BFF]" />
                  {m.label}
                </span>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
