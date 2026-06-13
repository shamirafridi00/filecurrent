'use client'

import Link from 'next/link'
import {
  Check,
  X,
  FileText,
  PencilLine,
  Bell,
  CaretDown,
  UserPlus,
  PaperPlaneTilt,
  Receipt,
  CurrencyDollar,
  XLogo,
  ShieldCheck,
  Lightning,
  ArrowRight,
} from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { TRIAL_DAYS } from '@/lib/constants'
import { FaqItem } from '@/components/landing/FaqItem'
import { NavBar } from '@/components/landing/NavBar'
import { AnimatedFeatureCards } from '@/components/landing/AnimatedFeatureCards'
import { ProductMockup } from '@/components/landing/ProductMockup'
import { Reveal, Stagger, Item, motion } from '@/components/landing/motion'
import { LogoFull } from '@/components/logo/LogoMark'

const FEATURES = [
  {
    icon: <FileText className="h-6 w-6 text-primary" weight="duotone" />,
    title: 'Contracts that protect you',
    desc: 'Profession-specific templates with legally binding e-signatures. Clients sign in the browser — no DocuSign account, no printing, no scanning.',
    stat: '7 profession templates · ESIGN compliant',
  },
  {
    icon: <PencilLine className="h-6 w-6 text-primary" weight="duotone" />,
    title: 'Invoices clients actually pay',
    desc: 'Five polished themes, structured payment methods on every invoice, and a public link your client can open and pay from any device.',
    stat: '5 themes · share link included',
  },
  {
    icon: <Bell className="h-6 w-6 text-primary" weight="duotone" />,
    title: 'Reminders with no cap',
    desc: 'Escalating tone, auto-stops the moment an invoice is paid, and no daily sending limit. Set the schedule once and stop chasing clients.',
    stat: 'Get paid up to 11 days faster',
  },
]

const HOW_IT_WORKS = [
  {
    icon: UserPlus,
    title: 'Add your client',
    desc: 'A name and email is all it takes. Import your whole list from a CSV in one click.',
  },
  {
    icon: PaperPlaneTilt,
    title: 'Send a contract',
    desc: 'Pick a template tuned to your profession and send it for e-signature in seconds.',
  },
  {
    icon: Receipt,
    title: 'Issue the invoice',
    desc: 'Turn the signed work into a branded invoice with your payment methods built in.',
  },
  {
    icon: CurrencyDollar,
    title: 'Get paid',
    desc: 'Automated reminders chase the client until they pay — then stop on their own.',
  },
]

const MARQUEE_ITEMS = [
  'web developers', 'photographers', 'consultants',
  'designers', 'copywriters', 'marketers', 'agencies',
]

const COMPARISON = [
  { feature: 'Price', fc: '$9/mo', bonsai: '$21/mo', honeybook: '$36/mo †' },
  { feature: 'Contracts', fc: true, bonsai: true, honeybook: true },
  { feature: 'E-Signatures', fc: true, bonsai: true, honeybook: true },
  { feature: 'Auto Reminders', fc: '✓ no cap', bonsai: '✓', honeybook: '✓' },
  { feature: 'No Daily Email Cap', fc: true, bonsai: true, honeybook: false },
  { feature: 'Profession Templates', fc: true, bonsai: 'Partial', honeybook: false },
  { feature: 'Time Tracking', fc: true, bonsai: true, honeybook: false },
  { feature: 'Instant Setup', fc: '5 minutes', bonsai: 'Hours', honeybook: '15–25 hrs*' },
  { feature: 'Free Tier', fc: '✓ 3/mo', bonsai: false, honeybook: 'Trial only' },
]

const FREE_FEATURES = [
  '3 documents/month',
  'All contract & invoice templates',
  'E-signatures',
  'FileCurrent branding on docs',
]

const PRO_FEATURES = [
  'Unlimited documents',
  'No FileCurrent branding',
  'Automated payment reminders',
  'Invoice share links',
  'Priority support',
]

const ANNUAL_FEATURES = [...PRO_FEATURES, 'Save $29/year vs monthly']

const TESTIMONIALS = [
  {
    before: 'I was chasing clients for 2 weeks after every invoice.',
    after: 'Now reminders run automatically and I get paid in 3 days on average.',
    name: 'Sarah K.',
    role: 'Web Developer',
  },
  {
    before: 'Sending contracts meant exporting PDFs and praying clients printed and scanned them.',
    after: 'Clients sign in the browser in under a minute — signed copy lands in both inboxes.',
    name: 'James T.',
    role: 'Photographer',
  },
  {
    before: 'I paid $21/month for features I never opened.',
    after: "Switched and I'm paying 57% less for the parts I actually use every week.",
    name: 'Maria L.',
    role: 'Copywriter',
  },
]

const FAQS = [
  { q: 'Is FileCurrent free?', a: 'Yes — the Free plan lets you create 3 documents per month (contracts + invoices combined) with no credit card required.' },
  { q: 'Are the e-signatures legally binding?', a: 'Yes. FileCurrent follows the ESIGN Act (15 U.S.C. § 7001) standard. Each signature is logged with IP address, timestamp, and a document hash for tamper detection.' },
  { q: 'What happens if I go over 3 documents on the free plan?', a: "You'll see an upgrade prompt. Your existing documents are never deleted — you just need to upgrade to create new ones that month." },
  { q: 'Can I import clients from HoneyBook or Bonsai?', a: 'Yes — use the Import Clients feature (CSV format) to bring your existing client list into FileCurrent.' },
  { q: 'Do you have profession-specific contract templates?', a: 'Yes. FileCurrent pre-filters templates based on your profession (web developer, photographer, consultant, designer, copywriter, or marketer) so you always see the most relevant ones first.' },
  { q: 'Is there a daily limit on payment reminders?', a: 'No. Unlike some competitors, FileCurrent has no daily email cap. Reminders are sent on your configured schedule until the invoice is paid.' },
]

const STATS = [
  { value: '500+', label: 'Freelancers' },
  { value: '11 days', label: 'Paid faster' },
  { value: '$9/mo', label: 'Flat price' },
  { value: '5 min', label: 'To set up' },
]

function CellValue({ val }: { val: boolean | string }) {
  if (val === true) return <Check className="h-4 w-4 text-[#1DB954]" weight="bold" />
  if (val === false) return <X className="h-4 w-4 text-muted-foreground/50" />
  return <span className="text-sm text-foreground">{val}</span>
}

export function LandingContent() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <NavBar />

      {/* ───────── Hero ───────── */}
      <section className="hero-grid-bg relative overflow-hidden px-4 pt-32 pb-20">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-accent px-4 py-1.5 text-xs font-medium text-primary"
          >
            <Lightning size={13} weight="fill" />
            Built for US freelancers · $9/month
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 text-5xl font-bold leading-[1.05] tracking-[-0.03em] text-foreground md:text-6xl"
          >
            Get paid faster.<br />
            <span className="gradient-text">Look professional doing it.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-9 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Contracts, e-signatures, invoices, and reminders that chase your clients
            so you don&apos;t have to. Everything a freelancer needs to get paid —
            nothing you don&apos;t.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Button asChild className="h-auto rounded-lg bg-primary px-7 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#5145E5]">
              <Link href="/signup">Start free — no card needed</Link>
            </Button>
            <Button asChild variant="outline" className="h-auto rounded-lg border-border bg-white px-7 py-3 text-base font-medium text-foreground hover:bg-muted">
              <a href="#how">See how it works</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
          >
            <span>Trusted by 500+ freelancers</span>
            <span aria-hidden className="text-border">·</span>
            <span className="text-[#E6A817]">★★★★★</span>
            <span aria-hidden className="text-border">·</span>
            <span className="inline-flex items-center gap-1"><ShieldCheck size={14} className="text-[#1DB954]" weight="fill" /> ESIGN compliant</span>
          </motion.div>
        </div>

        {/* Animated product window */}
        <div className="mt-16 px-2">
          <ProductMockup />
        </div>
      </section>

      {/* ───────── Social proof marquee ───────── */}
      <section className="border-y border-border bg-white py-5">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          The document tool freelancers in every field rely on
        </p>
        <div className="marquee mx-auto max-w-6xl">
          <div className="marquee-track gap-10 text-sm font-medium text-muted-foreground">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i} className="flex items-center gap-10 whitespace-nowrap capitalize">
                {item} <span className="text-border">◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── How it works ───────── */}
      <section id="how" className="dot-grid-bg px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">How it works</p>
            <h2 className="mb-3 text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              From handshake to paid, in four steps
            </h2>
            <p className="text-base text-muted-foreground">
              The whole flow lives in one tool. No copy-pasting between apps, no spreadsheets, no chasing.
            </p>
          </Reveal>

          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-5">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <Item key={step.title} className="relative">
                  <div className="card-elevated-hover h-full rounded-2xl border border-border bg-card p-6">
                    {i < HOW_IT_WORKS.length - 1 && (
                      <div
                        className="absolute -right-3 top-12 hidden h-px w-6 bg-border md:block"
                        aria-hidden
                      />
                    )}
                    <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                      <Icon className="h-5 w-5 text-primary" weight="duotone" />
                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white shadow-sm">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mb-1.5 font-semibold text-foreground">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                  </div>
                </Item>
              )
            })}
          </Stagger>

          <Reveal delay={0.1} className="mt-10 text-center">
            <Button asChild className="bg-primary text-white hover:bg-[#5145E5]">
              <Link href="/signup">
                Try it free <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* ───────── Features ───────── */}
      <section id="features" className="bg-white px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">Features</p>
            <h2 className="mb-3 text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              Everything a freelancer needs. Nothing you don&apos;t.
            </h2>
            <p className="text-base text-muted-foreground">
              Built for web developers, photographers, consultants, designers, copywriters, and marketers.
            </p>
          </Reveal>
          <AnimatedFeatureCards features={FEATURES} />

          {/* Stat band */}
          <Stagger className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {STATS.map((s) => (
              <Item key={s.label}>
                <div className="rounded-2xl border border-border bg-[#F6F9FC] p-6 text-center">
                  <p className="text-3xl font-bold tracking-tight text-primary">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────── Comparison ───────── */}
      <section className="dot-grid-bg px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">Comparison</p>
            <h2 className="mb-3 text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              Why freelancers choose FileCurrent
            </h2>
            <p className="text-base text-muted-foreground">See how we stack up against the leading alternatives.</p>
          </Reveal>
          <Reveal>
            <div className="card-elevated overflow-hidden rounded-2xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-[#F6F9FC]">
                    <th className="p-4 text-left font-semibold text-muted-foreground">Feature</th>
                    <th className="bg-accent p-4 text-center font-bold text-primary">FileCurrent</th>
                    <th className="p-4 text-center font-medium text-muted-foreground">Bonsai</th>
                    <th className="p-4 text-center font-medium text-muted-foreground">HoneyBook</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 1 ? 'bg-[#FBFCFE]' : 'bg-card'}>
                      <td className="p-4 font-medium text-foreground">{row.feature}</td>
                      <td className="bg-accent/60 p-4 text-center font-semibold">
                        <span className="flex justify-center"><CellValue val={row.fc} /></span>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        <span className="flex justify-center"><CellValue val={row.bonsai} /></span>
                      </td>
                      <td className="p-4 text-center text-muted-foreground">
                        <span className="flex justify-center"><CellValue val={row.honeybook} /></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            † HoneyBook Starter was $19/mo, raised to $36/mo in 2024 — an 89% price increase.
            &nbsp;* Based on reported Dubsado/HoneyBook setup times from user reviews.
          </p>
        </div>
      </section>

      {/* ───────── Pricing ───────── */}
      <section id="pricing" className="bg-white px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">Pricing</p>
            <h2 className="mb-3 text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              Simple, honest pricing
            </h2>
            <p className="text-base text-muted-foreground">No hidden fees. No feature locks. Cancel anytime.</p>
          </Reveal>

          <Stagger className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-3" gap={0.12}>
            {/* Free */}
            <Item className="h-full">
              <div className="card-elevated-hover flex h-full flex-col rounded-2xl border border-border bg-card p-7">
                <p className="text-base font-semibold text-foreground">Free</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                  $0<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Forever</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {FREE_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1DB954]" weight="bold" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-7 w-full border-border hover:bg-muted">
                  <Link href="/signup">Get started free</Link>
                </Button>
              </div>
            </Item>

            {/* Pro Monthly — featured */}
            <Item className="h-full">
              <div className="relative flex h-full flex-col rounded-2xl border-2 border-primary bg-card p-7 shadow-[0_20px_50px_-20px_rgba(99,91,255,0.4)]">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  Most popular
                </span>
                <p className="text-base font-semibold text-foreground">Pro</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                  $9<span className="text-base font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Billed monthly</p>
                <ul className="mt-6 flex-1 space-y-3">
                  {PRO_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" weight="bold" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-7 w-full bg-primary text-white hover:bg-[#5145E5]">
                  <Link href="/signup">Start Pro trial</Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {TRIAL_DAYS}-day free trial · No credit card required
                </p>
              </div>
            </Item>

            {/* Annual */}
            <Item className="h-full">
              <div className="card-elevated-hover flex h-full flex-col rounded-2xl border border-border bg-card p-7">
                <p className="mb-1 inline-flex w-fit items-center gap-1 rounded-full bg-[#FFF9ED] px-2 py-0.5 text-xs font-semibold text-[#E6A817]">
                  ★ Best value
                </p>
                <p className="text-base font-semibold text-foreground">Pro Annual</p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                  $79<span className="text-base font-normal text-muted-foreground">/yr</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  $6.58/mo · <span className="font-medium text-[#1DB954]">save 27%</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {ANNUAL_FEATURES.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#1DB954]" weight="bold" /> {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-7 w-full border-border hover:bg-muted">
                  <Link href="/signup">Get annual</Link>
                </Button>
              </div>
            </Item>
          </Stagger>
        </div>
      </section>

      {/* ───────── Testimonials ───────── */}
      <section className="dot-grid-bg px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-14 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">Testimonials</p>
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              Before and after FileCurrent
            </h2>
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Item key={t.name} className="h-full">
                <div className="card-elevated-hover flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Before</p>
                    <p className="text-sm leading-relaxed text-muted-foreground line-through decoration-muted-foreground/40">
                      {t.before}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-primary">After</p>
                    <p className="text-sm font-medium leading-relaxed text-foreground">{t.after}</p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-primary">
                      {t.name.charAt(0)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section id="faq" className="bg-white px-4 py-24">
        <div className="mx-auto max-w-2xl">
          <Reveal className="mb-12 text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-primary">FAQ</p>
            <h2 className="text-3xl font-bold tracking-[-0.02em] text-foreground md:text-4xl">
              Frequently asked questions
            </h2>
          </Reveal>
          <Stagger className="space-y-3" gap={0.06}>
            {FAQS.map((faq) => (
              <Item key={faq.q}>
                <FaqItem question={faq.q} answer={faq.a} />
              </Item>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ───────── Final CTA (the one bold navy band) ───────── */}
      <section className="px-4 py-20">
        <Reveal className="mx-auto max-w-4xl">
          <div className="cta-navy-bg relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-16">
            <h2 className="mx-auto mb-4 max-w-xl text-3xl font-bold tracking-[-0.02em] text-white md:text-4xl">
              Stop chasing invoices. Start getting paid.
            </h2>
            <p className="mx-auto mb-8 max-w-md text-base text-white/70">
              Set up your first contract and invoice in five minutes — free, no credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="h-auto rounded-lg bg-white px-7 py-3 text-base font-semibold text-[#0A2540] hover:bg-white/90">
                <Link href="/signup">Start free today</Link>
              </Button>
              <Button asChild variant="outline" className="h-auto rounded-lg border-white/25 bg-transparent px-7 py-3 text-base font-medium text-white hover:bg-white/10 hover:text-white">
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-white text-muted-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <LogoFull size={30} className="mb-4" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Helping freelancers get paid since 2024.
            </p>
            <a
              href="https://x.com/filecurrent"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="FileCurrent on X"
              className="mt-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <XLogo size={16} />
            </a>
          </div>
          {[
            {
              heading: 'Product',
              links: [
                { label: 'Features', href: '/#features' },
                { label: 'How it works', href: '/#how' },
                { label: 'Pricing', href: '/#pricing' },
                { label: 'Blog', href: '/blog' },
              ],
            },
            {
              heading: 'Resources',
              links: [
                { label: 'Help & FAQ', href: '/help' },
                { label: 'US Small Business Admin ↗', href: 'https://www.sba.gov/', external: true },
                { label: 'IRS Tax Guidelines ↗', href: 'https://www.irs.gov/', external: true },
              ],
            },
            {
              heading: 'Legal',
              links: [
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Refund Policy', href: '/refund' },
              ],
            },
            {
              heading: 'Company',
              links: [
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ],
            },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="mb-4 text-sm font-semibold text-foreground">{col.heading}</h4>
              <ul className="space-y-3 text-sm">
                {col.links.map((l) =>
                  'external' in l && l.external ? (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary">
                        {l.label}
                      </a>
                    </li>
                  ) : l.href.startsWith('/#') ? (
                    <li key={l.label}>
                      <a href={l.href} className="transition-colors hover:text-primary">{l.label}</a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link href={l.href} className="transition-colors hover:text-primary">{l.label}</Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} FileCurrent. All rights reserved.</span>
          <span>Made for freelancers worldwide.</span>
        </div>
      </div>
    </footer>
  )
}
