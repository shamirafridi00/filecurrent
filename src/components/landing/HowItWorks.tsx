'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PaperPlaneTilt, Signature, Receipt } from '@phosphor-icons/react'
import { fadeUp, REVEAL_VIEWPORT } from '@/components/landing/_motion'

const STEPS = [
  {
    icon: PaperPlaneTilt,
    title: 'Send a proposal',
    desc: 'Your client accepts in one click, and a draft contract creates itself.',
  },
  {
    icon: Signature,
    title: 'Get it signed',
    desc: 'Legally binding e-signature, right in the browser. No DocuSign, no printing.',
  },
  {
    icon: Receipt,
    title: 'Send the invoice',
    desc: 'Then let FileCurrent chase it for you until it’s paid.',
  },
]

export function HowItWorks() {
  const reduce = useReducedMotion()

  return (
    <section id="how" className="bg-white px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-16 text-center text-3xl font-bold tracking-[-0.02em] text-[#0A2540] md:text-4xl">
          One trail, from &ldquo;interested&rdquo; to &ldquo;paid in full.&rdquo;
        </h2>

        <div className="relative">
          {/* Connecting line: horizontal on desktop, vertical on mobile */}
          <div
            aria-hidden
            className="absolute left-1/2 top-8 hidden h-px w-[calc(100%-12rem)] -translate-x-1/2 bg-[#E6EBF1] md:block"
          />
          <div
            aria-hidden
            className="absolute left-1/2 top-12 bottom-12 w-px -translate-x-1/2 bg-[#E6EBF1] md:hidden"
          />

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.title}
                  className="flex flex-col items-center text-center"
                  custom={i}
                  variants={fadeUp}
                  initial={reduce ? 'show' : 'hidden'}
                  whileInView="show"
                  viewport={REVEAL_VIEWPORT}
                >
                  <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#635BFF]/20 bg-[#F0EFFF]">
                    <Icon size={28} weight="duotone" className="text-[#635BFF]" />
                    <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#635BFF] text-xs font-bold text-white shadow-sm">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-1.5 text-lg font-semibold text-[#0A2540]">{step.title}</h3>
                  <p className="max-w-xs text-sm leading-relaxed text-[#425466]">{step.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
