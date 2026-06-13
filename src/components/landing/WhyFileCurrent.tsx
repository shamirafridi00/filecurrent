'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck, Wallet, MapPin, ArrowsClockwise } from '@phosphor-icons/react'
import { fadeUp, REVEAL_VIEWPORT } from '@/components/landing/_motion'

const SIGNALS = [
  {
    icon: ShieldCheck,
    title: 'Legally sound',
    desc: 'ESIGN Act compliant e-signatures with a full audit trail on every contract.',
  },
  {
    icon: Wallet,
    title: 'You keep 100%',
    desc: 'No payment cut and no added platform fee. Clients pay you directly.',
  },
  {
    icon: MapPin,
    title: 'Built for US freelancers',
    desc: 'Contracts, invoicing, and reminders tuned to how US freelancers actually work.',
  },
  {
    icon: ArrowsClockwise,
    title: 'No lock-in',
    desc: 'Export your data anytime and cancel in one click. No contracts, no games.',
  },
]

export function WhyFileCurrent() {
  const reduce = useReducedMotion()

  return (
    <section className="bg-white px-4 py-24">
      <div className="mx-auto max-w-4xl">
        {/* Founder note */}
        <motion.div
          className="rounded-2xl border border-[#E6EBF1] bg-[#F6F9FC] p-8 md:p-10"
          variants={fadeUp}
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={REVEAL_VIEWPORT}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#635BFF]">
            Why I built FileCurrent
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-3xl">
            Freelancing is hard enough without the paperwork eating your evenings.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-[#425466]">
            <p>
              I kept watching freelancers pay $30 or more a month for bloated suites, just to send a
              contract and an invoice, and then lose a slice of every payment on top. The simple jobs,
              like getting work signed and getting paid on time, were buried under tools that did too
              much and charged for it.
            </p>
            <p>
              FileCurrent does those simple jobs well and stays out of the way of your money. One flat
              price, every feature included, and your income goes straight to you. If something is
              missing or in your way, tell me, because I read every message.
            </p>
          </div>
          <p className="mt-6 text-sm font-semibold text-[#0A2540]">
            The FileCurrent team
          </p>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={REVEAL_VIEWPORT}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {SIGNALS.map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={s.title}
                custom={i}
                variants={fadeUp}
                className="rounded-2xl border border-[#E6EBF1] bg-white p-6"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#F0EFFF]">
                  <Icon size={22} weight="duotone" className="text-[#635BFF]" />
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-[#0A2540]">{s.title}</h3>
                <p className="text-sm leading-relaxed text-[#425466]">{s.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
